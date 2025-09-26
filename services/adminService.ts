
import { supabase } from '../config/supabase';
import { Event, Speaker, EventAttendance, EventSpeaker } from '../types/Event';

export class AdminService {
  // Event Management
  static async createEvent(eventData: Omit<Event, 'id' | 'isFavorite'>): Promise<boolean> {
    try {
      console.log('AdminService - Creating event:', eventData.title);
      
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
          registration_url: eventData.registrationUrl || null,
        });

      if (error) {
        console.error('AdminService - Error creating event:', error);
        return false;
      }

      console.log('AdminService - Event created successfully');
      return true;
    } catch (error) {
      console.error('AdminService - Error in createEvent:', error);
      return false;
    }
  }

  static async updateEvent(eventId: string, eventData: Partial<Omit<Event, 'id' | 'isFavorite'>>): Promise<boolean> {
    try {
      console.log('AdminService - Updating event:', eventId);
      
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
      if (eventData.registrationUrl !== undefined) updateData.registration_url = eventData.registrationUrl || null;
      
      updateData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', eventId);

      if (error) {
        console.error('AdminService - Error updating event:', error);
        return false;
      }

      console.log('AdminService - Event updated successfully');
      return true;
    } catch (error) {
      console.error('AdminService - Error in updateEvent:', error);
      return false;
    }
  }

  static async deleteEvent(eventId: string): Promise<boolean> {
    try {
      console.log('AdminService - Deleting event:', eventId);
      
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) {
        console.error('AdminService - Error deleting event:', error);
        return false;
      }

      console.log('AdminService - Event deleted successfully');
      return true;
    } catch (error) {
      console.error('AdminService - Error in deleteEvent:', error);
      return false;
    }
  }

  // Speaker Management
  static async getSpeakers(): Promise<Speaker[]> {
    try {
      console.log('AdminService - Fetching speakers');
      
      const { data, error } = await supabase
        .from('speakers')
        .select('*')
        .order('name');

      if (error) {
        console.error('AdminService - Error fetching speakers:', error);
        return [];
      }

      console.log('AdminService - Speakers fetched successfully:', data?.length);
      return data || [];
    } catch (error) {
      console.error('AdminService - Error in getSpeakers:', error);
      return [];
    }
  }

  static async createSpeaker(speakerData: Omit<Speaker, 'id'>): Promise<boolean> {
    try {
      console.log('AdminService - Creating speaker:', speakerData.name);
      
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
        console.error('AdminService - Error creating speaker:', error);
        return false;
      }

      console.log('AdminService - Speaker created successfully');
      return true;
    } catch (error) {
      console.error('AdminService - Error in createSpeaker:', error);
      return false;
    }
  }

  static async updateSpeaker(speakerId: string, speakerData: Partial<Omit<Speaker, 'id'>>): Promise<boolean> {
    try {
      console.log('AdminService - Updating speaker:', speakerId);
      
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
        console.error('AdminService - Error updating speaker:', error);
        return false;
      }

      console.log('AdminService - Speaker updated successfully');
      return true;
    } catch (error) {
      console.error('AdminService - Error in updateSpeaker:', error);
      return false;
    }
  }

  static async deleteSpeaker(speakerId: string): Promise<boolean> {
    try {
      console.log('AdminService - Deleting speaker:', speakerId);
      
      const { error } = await supabase
        .from('speakers')
        .delete()
        .eq('id', speakerId);

      if (error) {
        console.error('AdminService - Error deleting speaker:', error);
        return false;
      }

      console.log('AdminService - Speaker deleted successfully');
      return true;
    } catch (error) {
      console.error('AdminService - Error in deleteSpeaker:', error);
      return false;
    }
  }

  // Attendance Management
  static async getAttendance(edition: number): Promise<EventAttendance[]> {
    try {
      console.log('AdminService - Fetching attendance for edition:', edition);
      
      const { data, error } = await supabase
        .from('event_attendance')
        .select(`
          *,
          events!inner(edition)
        `)
        .eq('events.edition', edition);

      if (error) {
        console.error('AdminService - Error fetching attendance:', error);
        return [];
      }

      console.log('AdminService - Attendance fetched successfully:', data?.length);
      return data?.map(item => ({
        id: item.id,
        event_id: item.event_id,
        user_id: item.user_id,
        attended: item.attended,
        checked_in_at: item.checked_in_at,
      })) || [];
    } catch (error) {
      console.error('AdminService - Error in getAttendance:', error);
      return [];
    }
  }

  static async updateAttendance(eventId: string, userId: string, attended: boolean): Promise<boolean> {
    try {
      console.log('AdminService - Updating attendance:', { eventId, userId, attended });
      
      const { data: existing, error: checkError } = await supabase
        .from('event_attendance')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('AdminService - Error checking existing attendance:', checkError);
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
          console.error('AdminService - Error updating attendance:', error);
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
          console.error('AdminService - Error creating attendance:', error);
          return false;
        }
      }

      console.log('AdminService - Attendance updated successfully');
      return true;
    } catch (error) {
      console.error('AdminService - Error in updateAttendance:', error);
      return false;
    }
  }

  static async bulkUpdateAttendance(attendanceUpdates: Array<{eventId: string, userId: string, attended: boolean}>): Promise<boolean> {
    try {
      console.log('AdminService - Bulk updating attendance:', attendanceUpdates.length, 'records');
      
      const promises = attendanceUpdates.map(update => 
        this.updateAttendance(update.eventId, update.userId, update.attended)
      );
      
      const results = await Promise.all(promises);
      const success = results.every(result => result);
      
      console.log('AdminService - Bulk attendance update result:', success);
      return success;
    } catch (error) {
      console.error('AdminService - Error in bulkUpdateAttendance:', error);
      return false;
    }
  }

  // Event Speaker Management
  static async getEventSpeakers(edition: number): Promise<EventSpeaker[]> {
    try {
      console.log('AdminService - Fetching event speakers for edition:', edition);
      
      const { data, error } = await supabase
        .from('event_speakers')
        .select(`
          *,
          speakers(*),
          events!inner(edition)
        `)
        .eq('events.edition', edition);

      if (error) {
        console.error('AdminService - Error fetching event speakers:', error);
        return [];
      }

      console.log('AdminService - Event speakers fetched successfully:', data?.length);
      return data?.map(item => ({
        id: item.id,
        event_id: item.event_id,
        speaker_id: item.speaker_id,
        attended: item.attended,
        role: item.role,
        speaker: item.speakers,
      })) || [];
    } catch (error) {
      console.error('AdminService - Error in getEventSpeakers:', error);
      return [];
    }
  }

  static async updateSpeakerAttendance(eventId: string, speakerId: string, attended: boolean): Promise<boolean> {
    try {
      console.log('AdminService - Updating speaker attendance:', { eventId, speakerId, attended });
      
      const { data: existing, error: checkError } = await supabase
        .from('event_speakers')
        .select('id')
        .eq('event_id', eventId)
        .eq('speaker_id', speakerId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('AdminService - Error checking existing speaker attendance:', checkError);
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
          console.error('AdminService - Error updating speaker attendance:', error);
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
          console.error('AdminService - Error creating speaker attendance:', error);
          return false;
        }
      }

      console.log('AdminService - Speaker attendance updated successfully');
      return true;
    } catch (error) {
      console.error('AdminService - Error in updateSpeakerAttendance:', error);
      return false;
    }
  }

  static async assignSpeakerToEvent(eventId: string, speakerId: string, role: 'speaker' | 'moderator' | 'organizer' = 'speaker'): Promise<boolean> {
    try {
      console.log('AdminService - Assigning speaker to event:', { eventId, speakerId, role });
      
      const { error } = await supabase
        .from('event_speakers')
        .insert({
          event_id: eventId,
          speaker_id: speakerId,
          role,
          attended: false,
        });

      if (error) {
        console.error('AdminService - Error assigning speaker to event:', error);
        return false;
      }

      console.log('AdminService - Speaker assigned to event successfully');
      return true;
    } catch (error) {
      console.error('AdminService - Error in assignSpeakerToEvent:', error);
      return false;
    }
  }

  static async removeSpeakerFromEvent(eventId: string, speakerId: string): Promise<boolean> {
    try {
      console.log('AdminService - Removing speaker from event:', { eventId, speakerId });
      
      const { error } = await supabase
        .from('event_speakers')
        .delete()
        .eq('event_id', eventId)
        .eq('speaker_id', speakerId);

      if (error) {
        console.error('AdminService - Error removing speaker from event:', error);
        return false;
      }

      console.log('AdminService - Speaker removed from event successfully');
      return true;
    } catch (error) {
      console.error('AdminService - Error in removeSpeakerFromEvent:', error);
      return false;
    }
  }

  // QR Code Generation Helpers
  static generateAttendanceQR(eventId: string, userId: string): string {
    return `${eventId}:${userId}`;
  }

  static generateSpeakerAttendanceQR(eventId: string, speakerId: string): string {
    return `${eventId}:${speakerId}:speaker`;
  }

  // Statistics and Reports
  static async getEventStatistics(eventId: string): Promise<{
    totalRegistered: number;
    totalAttended: number;
    attendanceRate: number;
    speakersCount: number;
    speakersAttended: number;
  }> {
    try {
      console.log('AdminService - Getting event statistics for:', eventId);
      
      const [attendanceData, speakersData] = await Promise.all([
        supabase
          .from('event_attendance')
          .select('attended')
          .eq('event_id', eventId),
        supabase
          .from('event_speakers')
          .select('attended')
          .eq('event_id', eventId)
      ]);

      const attendance = attendanceData.data || [];
      const speakers = speakersData.data || [];

      const totalRegistered = attendance.length;
      const totalAttended = attendance.filter(a => a.attended).length;
      const attendanceRate = totalRegistered > 0 ? (totalAttended / totalRegistered) * 100 : 0;
      const speakersCount = speakers.length;
      const speakersAttended = speakers.filter(s => s.attended).length;

      const stats = {
        totalRegistered,
        totalAttended,
        attendanceRate,
        speakersCount,
        speakersAttended,
      };

      console.log('AdminService - Event statistics:', stats);
      return stats;
    } catch (error) {
      console.error('AdminService - Error in getEventStatistics:', error);
      return {
        totalRegistered: 0,
        totalAttended: 0,
        attendanceRate: 0,
        speakersCount: 0,
        speakersAttended: 0,
      };
    }
  }

  static async getEditionStatistics(edition: number): Promise<{
    totalEvents: number;
    totalAttendees: number;
    totalSpeakers: number;
    averageAttendanceRate: number;
  }> {
    try {
      console.log('AdminService - Getting edition statistics for:', edition);
      
      const [eventsData, attendanceData, speakersData] = await Promise.all([
        supabase
          .from('events')
          .select('id')
          .eq('edition', edition),
        supabase
          .from('event_attendance')
          .select('attended, events!inner(edition)')
          .eq('events.edition', edition),
        supabase
          .from('event_speakers')
          .select('id, events!inner(edition)')
          .eq('events.edition', edition)
      ]);

      const events = eventsData.data || [];
      const attendance = attendanceData.data || [];
      const speakers = speakersData.data || [];

      const totalEvents = events.length;
      const totalAttendees = attendance.length;
      const totalSpeakers = speakers.length;
      const attendedCount = attendance.filter(a => a.attended).length;
      const averageAttendanceRate = totalAttendees > 0 ? (attendedCount / totalAttendees) * 100 : 0;

      const stats = {
        totalEvents,
        totalAttendees,
        totalSpeakers,
        averageAttendanceRate,
      };

      console.log('AdminService - Edition statistics:', stats);
      return stats;
    } catch (error) {
      console.error('AdminService - Error in getEditionStatistics:', error);
      return {
        totalEvents: 0,
        totalAttendees: 0,
        totalSpeakers: 0,
        averageAttendanceRate: 0,
      };
    }
  }
}
