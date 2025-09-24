
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase para el proyecto Pwnterrey-CTF
const supabaseUrl = 'https://hncaxxeetuwccxnohmcj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuY2F4eGVldHV3Y2N4bm9obWNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MzIxMzQsImV4cCI6MjA3NDMwODEzNH0.Xx_MPMyFYmmbywr7FUottzwWebhPfQNUAGH3QyXDgd4';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Tipos para las tablas de Supabase
export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          title: string;
          organizer: string;
          type: 'CTF' | 'Taller' | 'Charla';
          start_time: string;
          end_time: string;
          location: string;
          description: string;
          date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          organizer: string;
          type: 'CTF' | 'Taller' | 'Charla';
          start_time: string;
          end_time: string;
          location: string;
          description: string;
          date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          organizer?: string;
          type?: 'CTF' | 'Taller' | 'Charla';
          start_time?: string;
          end_time?: string;
          location?: string;
          description?: string;
          date?: string;
          updated_at?: string;
        };
      };
      badges: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          color: string;
          requirements: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          icon: string;
          color: string;
          requirements: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          icon?: string;
          color?: string;
          requirements?: any;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          avatar?: string;
          stats: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          avatar?: string;
          stats?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          avatar?: string;
          stats?: any;
          updated_at?: string;
        };
      };
      user_favorites: {
        Row: {
          id: string;
          user_id: string;
          event_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          event_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          event_id?: string;
        };
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          unlocked_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_id: string;
          unlocked_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          badge_id?: string;
          unlocked_at?: string;
        };
      };
    };
  };
}
