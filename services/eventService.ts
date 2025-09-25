
import { supabase } from '../config/supabase';
import { Event } from '../types/Event';

export class EventService {
  static async getEvents(edition?: number): Promise<Event[]> {
    try {
      console.log('EventService - Fetching events from Supabase for edition:', edition);
      
      let query = supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (edition) {
        query = query.eq('edition', edition);
      }

      const { data, error } = await query;

      if (error) {
        console.error('EventService - Error fetching events:', error);
        throw error;
      }

      console.log('EventService - Events fetched successfully:', data?.length);
      
      if (!data) {
        console.log('EventService - No data returned');
        return [];
      }

      // Get current user to check favorites
      const { data: { user } } = await supabase.auth.getUser();
      let userFavorites: string[] = [];

      if (user) {
        console.log('EventService - Getting favorites for user:', user.id);
        const { data: favoritesData } = await supabase
          .from('user_favorites')
          .select('event_id')
          .eq('user_id', user.id);
        
        userFavorites = favoritesData?.map(fav => fav.event_id) || [];
        console.log('EventService - User favorites:', userFavorites.length);
      } else {
        console.log('EventService - No user authenticated, no favorites');
      }

      const mappedEvents = data.map(event => this.mapSupabaseEventToEvent(event, userFavorites));
      console.log('EventService - Mapped events:', mappedEvents.length);
      
      return mappedEvents;
    } catch (error) {
      console.error('EventService - Error in getEvents:', error);
      return [];
    }
  }

  static async getEventsByType(type: Event['type']): Promise<Event[]> {
    try {
      console.log(`Fetching events of type: ${type}`);
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('type', type)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching events by type:', error);
        throw error;
      }

      console.log(`Events of type ${type} fetched:`, data?.length);
      
      return data?.map(event => this.mapSupabaseEventToEvent(event, [])) || [];
    } catch (error) {
      console.error('Error in getEventsByType:', error);
      return [];
    }
  }

  static async createEvent(event: Omit<Event, 'id' | 'isFavorite'>): Promise<Event | null> {
    try {
      console.log('Creating new event:', event.title);
      
      const { data, error } = await supabase
        .from('events')
        .insert({
          title: event.title,
          organizer: event.organizer,
          type: event.type,
          start_time: event.startTime,
          end_time: event.endTime,
          location: event.location,
          description: event.description,
          date: event.date,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating event:', error);
        throw error;
      }

      console.log('Event created successfully:', data.id);
      
      return this.mapSupabaseEventToEvent(data, []);
    } catch (error) {
      console.error('Error in createEvent:', error);
      return null;
    }
  }

  static async updateEvent(eventId: string, updates: Partial<Event>): Promise<Event | null> {
    try {
      console.log('Updating event:', eventId);
      
      const { data, error } = await supabase
        .from('events')
        .update({
          ...(updates.title && { title: updates.title }),
          ...(updates.organizer && { organizer: updates.organizer }),
          ...(updates.type && { type: updates.type }),
          ...(updates.startTime && { start_time: updates.startTime }),
          ...(updates.endTime && { end_time: updates.endTime }),
          ...(updates.location && { location: updates.location }),
          ...(updates.description && { description: updates.description }),
          ...(updates.date && { date: updates.date }),
          updated_at: new Date().toISOString(),
        })
        .eq('id', eventId)
        .select()
        .single();

      if (error) {
        console.error('Error updating event:', error);
        throw error;
      }

      console.log('Event updated successfully');
      
      return this.mapSupabaseEventToEvent(data, []);
    } catch (error) {
      console.error('Error in updateEvent:', error);
      return null;
    }
  }

  static async deleteEvent(eventId: string): Promise<boolean> {
    try {
      console.log('Deleting event:', eventId);
      
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) {
        console.error('Error deleting event:', error);
        throw error;
      }

      console.log('Event deleted successfully');
      return true;
    } catch (error) {
      console.error('Error in deleteEvent:', error);
      return false;
    }
  }

  static async toggleFavorite(eventId: string): Promise<boolean> {
    try {
      console.log('Toggling favorite for event:', eventId);
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('No authenticated user found');
        return false;
      }

      // Check if already favorited
      const { data: existing, error: checkError } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('event_id', eventId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking favorite:', checkError);
        return false;
      }

      if (existing) {
        // Remove favorite
        const { error: deleteError } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('event_id', eventId);

        if (deleteError) {
          console.error('Error removing favorite:', deleteError);
          return false;
        }

        console.log('Favorite removed successfully');
      } else {
        // Add favorite
        const { error: insertError } = await supabase
          .from('user_favorites')
          .insert({
            user_id: user.id,
            event_id: eventId,
          });

        if (insertError) {
          console.error('Error adding favorite:', insertError);
          return false;
        }

        console.log('Favorite added successfully');
      }

      return true;
    } catch (error) {
      console.error('Error in toggleFavorite:', error);
      return false;
    }
  }

  private static mapSupabaseEventToEvent(supabaseEvent: any, userFavorites: string[] = []): Event {
    return {
      id: supabaseEvent.id,
      title: supabaseEvent.title,
      organizer: supabaseEvent.organizer,
      type: supabaseEvent.type,
      startTime: supabaseEvent.start_time,
      endTime: supabaseEvent.end_time,
      location: supabaseEvent.location,
      description: supabaseEvent.description,
      date: supabaseEvent.date,
      edition: supabaseEvent.edition || 2025,
      isFavorite: userFavorites.includes(supabaseEvent.id),
    };
  }
}
