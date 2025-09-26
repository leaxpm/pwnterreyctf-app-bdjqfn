
export interface Event {
  id: string;
  title: string;
  organizer: string;
  type: 'CTF' | 'Taller' | 'Charla';
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  date: string;
  edition: number;
  isFavorite: boolean;
  registrationUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  favoriteEvents: string[];
}

export interface Speaker {
  id: string;
  name: string;
  bio?: string;
  avatar_url?: string;
  email?: string;
  company?: string;
  social_links?: Record<string, string>;
}

export interface EventAttendance {
  id: string;
  event_id: string;
  user_id: string;
  attended: boolean;
  checked_in_at?: string;
}

export interface EventSpeaker {
  id: string;
  event_id: string;
  speaker_id: string;
  attended: boolean;
  role: 'speaker' | 'moderator' | 'organizer';
  speaker?: Speaker;
}
