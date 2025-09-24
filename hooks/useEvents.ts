
import { useState, useEffect } from 'react';
import { Event } from '../types/Event';
import { mockEvents } from '../data/mockEvents';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [favoriteEvents, setFavoriteEvents] = useState<string[]>([]);

  const toggleFavorite = (eventId: string) => {
    console.log('Toggling favorite for event:', eventId);
    
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId 
          ? { ...event, isFavorite: !event.isFavorite }
          : event
      )
    );

    setFavoriteEvents(prev => {
      if (prev.includes(eventId)) {
        return prev.filter(id => id !== eventId);
      } else {
        return [...prev, eventId];
      }
    });
  };

  const getEventsByType = (type: Event['type']) => {
    return events.filter(event => event.type === type);
  };

  const getFavoriteEvents = () => {
    return events.filter(event => event.isFavorite);
  };

  const getAllEvents = () => {
    return events;
  };

  return {
    events,
    favoriteEvents,
    toggleFavorite,
    getEventsByType,
    getFavoriteEvents,
    getAllEvents,
  };
};
