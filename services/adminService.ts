
import { supabase } from '../config/supabase';
import { Event, Speaker, EventAttendance, EventSpeaker } from '../types/Event';

export class AdminService {
  // Event Management
  static async createEvent(eventData: Omit<Event, 'id' | 'isFavorite'>): Promise<boolean> {
    try {
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
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  static async updateEvent(eventId: string, eventData: Partial<Omit<Event, 'id' | 'isFavorite'>>): Promise<boolean> {
    try {
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
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  static async deleteEvent(eventId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  // Speaker Management
  static async getSpeakers(): Promise<Speaker[]> {
    try {
      const { data, error } = await supabase
        .from('speakers')
        .select('*')
        .order('name');

      if (error) {
        return [];
      }

      return data || [];
    } catch (error) {
      return [];
    }
  }

  static async createSpeaker(speakerData: Omit<Speaker, 'id'>): Promise<boolean> {
    try {
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
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  static async updateSpeaker(speakerId: string, speakerData: Partial<Omit<Speaker, 'id'>>): Promise<boolean> {
    try {
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
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  static async deleteSpeaker(speakerId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('speakers')
        .delete()
        .eq('id', speakerId);

      if (error) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  // Attendance Management
  static async getAttendance(edition: number): Promise<EventAttendance[]> {
    try {
      const { data, error } = await supabase
        .from('event_attendance')
        .select(`
          *,
          events!inner(edition)
        `)
        .eq('events.edition', edition);

      if (error) {
        return [];
      }

      return data?.map(item => ({
        id: item.id,
        event_id: item.event_id,
        user_id: item.user_id,
        attended: item.attended,
        checked_in_at: item.checked_in_at,
      })) || [];
    } catch (error) {
      return [];
    }
  }

  static async updateAttendance(eventId: string, userId: string, attended: boolean): Promise<boolean> {
    try {
      const { data: existing, error: checkError } = await supabase
        .from('event_attendance')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
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
          return false;
        }
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  static async bulkUpdateAttendance(attendanceUpdates: Array<{eventId: string, userId: string, attended: boolean}>): Promise<boolean> {
    try {
      const promises = attendanceUpdates.map(update => 
        this.updateAttendance(update.eventId, update.userId, update.attended)
      );
      
      const results = await Promise.all(promises);
      const success = results.every(result => result);
      
      return success;
    } catch (error) {
      return false;
    }
  }

  // Event Speaker Management
  static async getEventSpeakers(edition: number): Promise<EventSpeaker[]> {
    try {
      const { data, error } = await supabase
        .from('event_speakers')
        .select(`
          *,
          speakers(*),
          events!inner(edition)
        `)
        .eq('events.edition', edition);

      if (error) {
        return [];
      }

      return data?.map(item => ({
        id: item.id,
        event_id: item.event_id,
        speaker_id: item.speaker_id,
        attended: item.attended,
        role: item.role,
        speaker: item.speakers,
      })) || [];
    } catch (error) {
      return [];
    }
  }

  static async updateSpeakerAttendance(eventId: string, speakerId: string, attended: boolean): Promise<boolean> {
    try {
      const { data: existing, error: checkError } = await supabase
        .from('event_speakers')
        .select('id')
        .eq('event_id', eventId)
        .eq('speaker_id', speakerId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
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
          return false;
        }
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  static async assignSpeakerToEvent(eventId: string, speakerId: string, role: 'speaker' | 'moderator' | 'organizer' = 'speaker'): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('event_speakers')
        .insert({
          event_id: eventId,
          speaker_id: speakerId,
          role,
          attended: false,
        });

      if (error) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  static async removeSpeakerFromEvent(eventId: string, speakerId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('event_speakers')
        .delete()
        .eq('event_id', eventId)
        .eq('speaker_id', speakerId);

      if (error) {
        return false;
      }

      return true;
    } catch (error) {
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

      return stats;
    } catch (error) {
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

      return stats;
    } catch (error) {
      return {
        totalEvents: 0,
        totalAttendees: 0,
        totalSpeakers: 0,
        averageAttendanceRate: 0,
      };
    }
  }
}
