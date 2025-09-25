
import { supabase } from '../config/supabase';
import { Event } from '../types/Event';

export class EventService {
  static async getAllEvents(edition?: number): Promise<Event[]> {
    try {
      console.log('Fetching events from Supabase for edition:', edition);
      
      let query = supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (edition) {
        query = query.eq('edition', edition);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }

      console.log('Events fetched successfully:', data?.length);
      
      return data?.map(this.mapSupabaseEventToEvent) || [];
    } catch (error) {
      console.error('Error in getAllEvents:', error);
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
      
      return data?.map(this.mapSupabaseEventToEvent) || [];
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
      
      return this.mapSupabaseEventToEvent(data);
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
      
      return this.mapSupabaseEventToEvent(data);
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

  private static mapSupabaseEventToEvent(supabaseEvent: any): Event {
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
      isFavorite: false, // This will be set by the user service
    };
  }
}
