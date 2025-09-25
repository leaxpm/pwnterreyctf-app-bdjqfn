
import { useState, useEffect } from 'react';
import { Event } from '../types/Event';
import { EventService } from '../services/eventService';
import { UserService } from '../services/userService';
import { mockEvents } from '../data/mockEvents';
import { supabase } from '../config/supabase';

export const useEvents = (selectedEdition?: number) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [favoriteEvents, setFavoriteEvents] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
    
    // Listen for auth changes to reload events with proper favorites
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          console.log('Auth state changed, reloading events');
          await loadEvents();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [selectedEdition]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading events for edition:', selectedEdition);
      
      // Try to load from Supabase first
      const supabaseEvents = await EventService.getAllEvents(selectedEdition);
      
      if (supabaseEvents.length > 0) {
        console.log('Using Supabase events');
        setEvents(supabaseEvents);
        
        // Load user favorites
        const currentUser = await UserService.getCurrentUser();
        if (currentUser) {
          const favorites = await UserService.getUserFavorites(currentUser.id);
          setFavoriteEvents(favorites);
          
          // Update events with favorite status
          setEvents(prevEvents => 
            prevEvents.map(event => ({
              ...event,
              isFavorite: favorites.includes(event.id)
            }))
          );
        }
      } else {
        console.log('Using mock events as fallback');
        // Filter mock events by edition if specified
        const filteredMockEvents = selectedEdition 
          ? mockEvents.filter(event => event.edition === selectedEdition)
          : mockEvents;
        setEvents(filteredMockEvents);
      }
    } catch (err) {
      console.error('Error loading events:', err);
      setError('Error loading events');
      // Fallback to mock data
      const filteredMockEvents = selectedEdition 
        ? mockEvents.filter(event => event.edition === selectedEdition)
        : mockEvents;
      setEvents(filteredMockEvents);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (eventId: string) => {
    try {
      console.log('Toggling favorite for event:', eventId);
      
      const currentUser = await UserService.getCurrentUser();
      if (!currentUser) {
        console.log('No user logged in, using local state');
        // Fallback to local state management
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
        return;
      }

      const success = await UserService.toggleFavorite(currentUser.id, eventId);
      
      if (success) {
        // Update local state
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
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setError('Error updating favorite');
    }
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

  const refreshEvents = () => {
    loadEvents();
  };

  return {
    events,
    favoriteEvents,
    loading,
    error,
    toggleFavorite,
    getEventsByType,
    getFavoriteEvents,
    getAllEvents,
    refreshEvents,
  };
};
