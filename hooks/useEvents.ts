
import { useState, useEffect, useCallback } from 'react';
import { Event } from '../types/Event';
import { EventService } from '../services/eventService';

export const useEvents = (selectedEdition?: number) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('useEvents - Loading events for edition:', selectedEdition);
      
      const data = await EventService.getEvents(selectedEdition);
      console.log('useEvents - Events loaded:', data.length);
      console.log('useEvents - First event:', data[0]);
      setEvents(data);
    } catch (err) {
      console.error('useEvents - Error loading events:', err);
      setError('Error cargando eventos');
    } finally {
      setLoading(false);
    }
  }, [selectedEdition]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const toggleFavorite = async (eventId: string) => {
    try {
      console.log('Toggling favorite for event:', eventId);
      const success = await EventService.toggleFavorite(eventId);
      
      if (success) {
        setEvents(prevEvents => 
          prevEvents.map(event => 
            event.id === eventId 
              ? { ...event, isFavorite: !event.isFavorite }
              : event
          )
        );
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const refreshEvents = useCallback(async () => {
    await loadEvents();
  }, [loadEvents]);

  const getEventsByType = useCallback((type: Event['type']) => {
    return events.filter(event => event.type === type);
  }, [events]);

  const getFavoriteEvents = useCallback(() => {
    return events.filter(event => event.isFavorite);
  }, [events]);

  return {
    events,
    loading,
    error,
    toggleFavorite,
    refreshEvents,
    getEventsByType,
    getFavoriteEvents,
  };
};
