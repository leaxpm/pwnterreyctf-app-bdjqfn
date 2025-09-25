
import { supabase } from '../config/supabase';
import { Event, Speaker, EventAttendance, EventSpeaker } from '../types/Event';

export class AdminService {
  // Event Management
  static async createEvent(eventData: Omit<Event, 'id' | 'isFavorite'>): Promise<boolean> {
    try {
      console.log('Creating event:', eventData);
      
      const { error } = await supabase
        .from('events')
        .insert({
          title: eventData.title,
          organizer: eventData.organizer,
          type: eventData.type,
          start_time: eventData.startTime,
          end_time: eventData.endTime,
          location: eventData.location,
          description: eventData.description,
          date: eventData.date,
          edition: eventData.edition,
        });

      if (error) {
        console.error('Error creating event:', error);
        return false;
      }

      console.log('Event created successfully');
      return true;
    } catch (error) {
      console.error('Error in createEvent:', error);
      return false;
    }
  }

  static async updateEvent(eventId: string, eventData: Partial<Omit<Event, 'id' | 'isFavorite'>>): Promise<boolean> {
    try {
      console.log('Updating event:', eventId, eventData);
      
      const updateData: any = {};
      if (eventData.title) updateData.title = eventData.title;
      if (eventData.organizer) updateData.organizer = eventData.organizer;
      if (eventData.type) updateData.type = eventData.type;
      if (eventData.startTime) updateData.start_time = eventData.startTime;
      if (eventData.endTime) updateData.end_time = eventData.endTime;
      if (eventData.location) updateData.location = eventData.location;
      if (eventData.description) updateData.description = eventData.description;
      if (eventData.date) updateData.date = eventData.date;
      if (eventData.edition) updateData.edition = eventData.edition;
      
      updateData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', eventId);

      if (error) {
        console.error('Error updating event:', error);
        return false;
      }

      console.log('Event updated successfully');
      return true;
    } catch (error) {
      console.error('Error in updateEvent:', error);
      return false;
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
        return false;
      }

      console.log('Event deleted successfully');
      return true;
    } catch (error) {
      console.error('Error in deleteEvent:', error);
      return false;
    }
  }

  // Speaker Management
  static async getSpeakers(): Promise<Speaker[]> {
    try {
      console.log('Getting speakers...');
      
      const { data, error } = await supabase
        .from('speakers')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error getting speakers:', error);
        return [];
      }

      console.log('Speakers fetched:', data?.length);
      return data || [];
    } catch (error) {
      console.error('Error in getSpeakers:', error);
      return [];
    }
  }

  static async createSpeaker(speakerData: Omit<Speaker, 'id'>): Promise<boolean> {
    try {
      console.log('Creating speaker:', speakerData);
      
      const { error } = await supabase
        .from('speakers')
        .insert({
          name: speakerData.name,
          bio: speakerData.bio || null,
          avatar_url: speakerData.avatar_url || null,
          email: speakerData.email || null,
          company: speakerData.company || null,
          social_links: speakerData.social_links || {},
        });

      if (error) {
        console.error('Error creating speaker:', error);
        return false;
      }

      console.log('Speaker created successfully');
      return true;
    } catch (error) {
      console.error('Error in createSpeaker:', error);
      return false;
    }
  }

  static async updateSpeaker(speakerId: string, speakerData: Partial<Omit<Speaker, 'id'>>): Promise<boolean> {
    try {
      console.log('Updating speaker:', speakerId, speakerData);
      
      const updateData: any = { updated_at: new Date().toISOString() };
      if (speakerData.name) updateData.name = speakerData.name;
      if (speakerData.bio !== undefined) updateData.bio = speakerData.bio || null;
      if (speakerData.avatar_url !== undefined) updateData.avatar_url = speakerData.avatar_url || null;
      if (speakerData.email !== undefined) updateData.email = speakerData.email || null;
      if (speakerData.company !== undefined) updateData.company = speakerData.company || null;
      if (speakerData.social_links) updateData.social_links = speakerData.social_links;

      const { error } = await supabase
        .from('speakers')
        .update(updateData)
        .eq('id', speakerId);

      if (error) {
        console.error('Error updating speaker:', error);
        return false;
      }

      console.log('Speaker updated successfully');
      return true;
    } catch (error) {
      console.error('Error in updateSpeaker:', error);
      return false;
    }
  }

  // Attendance Management
  static async getAttendance(edition: number): Promise<EventAttendance[]> {
    try {
      console.log('Getting attendance for edition:', edition);
      
      const { data, error } = await supabase
        .from('event_attendance')
        .select(`
          *,
          events!inner(edition)
        `)
        .eq('events.edition', edition);

      if (error) {
        console.error('Error getting attendance:', error);
        return [];
      }

      console.log('Attendance fetched:', data?.length);
      return data?.map(item => ({
        id: item.id,
        event_id: item.event_id,
        user_id: item.user_id,
        attended: item.attended,
        checked_in_at: item.checked_in_at,
      })) || [];
    } catch (error) {
      console.error('Error in getAttendance:', error);
      return [];
    }
  }

  static async updateAttendance(eventId: string, userId: string, attended: boolean): Promise<boolean> {
    try {
      console.log('Updating attendance:', eventId, userId, attended);
      
      const { data: existing, error: checkError } = await supabase
        .from('event_attendance')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking attendance:', checkError);
        return false;
      }

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from('event_attendance')
          .update({
            attended,
            checked_in_at: attended ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);

        if (error) {
          console.error('Error updating attendance:', error);
          return false;
        }
      } else {
        // Create new record
        const { error } = await supabase
          .from('event_attendance')
          .insert({
            event_id: eventId,
            user_id: userId,
            attended,
            checked_in_at: attended ? new Date().toISOString() : null,
          });

        if (error) {
          console.error('Error creating attendance:', error);
          return false;
        }
      }

      console.log('Attendance updated successfully');
      return true;
    } catch (error) {
      console.error('Error in updateAttendance:', error);
      return false;
    }
  }

  // Event Speaker Management
  static async getEventSpeakers(edition: number): Promise<EventSpeaker[]> {
    try {
      console.log('Getting event speakers for edition:', edition);
      
      const { data, error } = await supabase
        .from('event_speakers')
        .select(`
          *,
          speakers(*),
          events!inner(edition)
        `)
        .eq('events.edition', edition);

      if (error) {
        console.error('Error getting event speakers:', error);
        return [];
      }

      console.log('Event speakers fetched:', data?.length);
      return data?.map(item => ({
        id: item.id,
        event_id: item.event_id,
        speaker_id: item.speaker_id,
        attended: item.attended,
        role: item.role,
        speaker: item.speakers,
      })) || [];
    } catch (error) {
      console.error('Error in getEventSpeakers:', error);
      return [];
    }
  }

  static async updateSpeakerAttendance(eventId: string, speakerId: string, attended: boolean): Promise<boolean> {
    try {
      console.log('Updating speaker attendance:', eventId, speakerId, attended);
      
      const { data: existing, error: checkError } = await supabase
        .from('event_speakers')
        .select('id')
        .eq('event_id', eventId)
        .eq('speaker_id', speakerId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking speaker attendance:', checkError);
        return false;
      }

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from('event_speakers')
          .update({
            attended,
          })
          .eq('id', existing.id);

        if (error) {
          console.error('Error updating speaker attendance:', error);
          return false;
        }
      } else {
        // Create new record
        const { error } = await supabase
          .from('event_speakers')
          .insert({
            event_id: eventId,
            speaker_id: speakerId,
            attended,
            role: 'speaker',
          });

        if (error) {
          console.error('Error creating speaker attendance:', error);
          return false;
        }
      }

      console.log('Speaker attendance updated successfully');
      return true;
    } catch (error) {
      console.error('Error in updateSpeakerAttendance:', error);
      return false;
    }
  }

  static async assignSpeakerToEvent(eventId: string, speakerId: string, role: 'speaker' | 'moderator' | 'organizer' = 'speaker'): Promise<boolean> {
    try {
      console.log('Assigning speaker to event:', eventId, speakerId, role);
      
      const { error } = await supabase
        .from('event_speakers')
        .insert({
          event_id: eventId,
          speaker_id: speakerId,
          role,
          attended: false,
        });

      if (error) {
        console.error('Error assigning speaker to event:', error);
        return false;
      }

      console.log('Speaker assigned to event successfully');
      return true;
    } catch (error) {
      console.error('Error in assignSpeakerToEvent:', error);
      return false;
    }
  }

  static async removeSpeakerFromEvent(eventId: string, speakerId: string): Promise<boolean> {
    try {
      console.log('Removing speaker from event:', eventId, speakerId);
      
      const { error } = await supabase
        .from('event_speakers')
        .delete()
        .eq('event_id', eventId)
        .eq('speaker_id', speakerId);

      if (error) {
        console.error('Error removing speaker from event:', error);
        return false;
      }

      console.log('Speaker removed from event successfully');
      return true;
    } catch (error) {
      console.error('Error in removeSpeakerFromEvent:', error);
      return false;
    }
  }
}
