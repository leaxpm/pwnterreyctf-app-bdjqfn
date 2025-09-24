
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
  isFavorite: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  favoriteEvents: string[];
}
