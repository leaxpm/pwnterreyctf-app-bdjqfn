
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || "https://hncaxxeetuwccxnohmcj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuY2F4eGVldHV3Y2N4bm9obWNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MzIxMzQsImV4cCI6MjA3NDMwODEzNH0.Xx_MPMyFYmmbywr7FUottzwWebhPfQNUAGH3QyXDgd4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

console.log('Supabase client initialized with URL:', SUPABASE_URL);
