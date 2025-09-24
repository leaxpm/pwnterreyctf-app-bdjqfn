
import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { User } from '../types/Event';
import { UserStats } from '../types/Badge';
import { UserService } from '../services/userService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    eventsAttended: 0,
    ctfsCompleted: 0,
    workshopsTaken: 0,
    pointsEarned: 0,
    profileComplete: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check initial session
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserData(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setUserStats({
            eventsAttended: 0,
            ctfsCompleted: 0,
            workshopsTaken: 0,
            pointsEarned: 0,
            profileComplete: false,
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const currentUser = await UserService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        const stats = await UserService.getUserStats(currentUser.id);
        setUserStats(stats);
      }
    } catch (err) {
      console.error('Error checking user:', err);
      setError('Error loading user data');
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (userId: string) => {
    try {
      // Add a small delay to ensure the trigger has time to create the profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = await UserService.getCurrentUser();
      if (userData) {
        setUser(userData);
        const stats = await UserService.getUserStats(userId);
        setUserStats(stats);
      }
    } catch (err) {
      console.error('Error loading user data:', err);
      setError('Error loading user data');
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      console.log('Signing up user:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'https://natively.dev/email-confirmed',
          data: {
            name: name
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        setError(error.message);
        return { success: false, message: error.message };
      }

      if (data.user) {
        console.log('Auth user created successfully');
        
        // For email verification flow, we don't need to wait for profile creation
        // The user will be created when they verify their email
        return { 
          success: true, 
          message: 'Cuenta creada exitosamente. Por favor verifica tu email antes de iniciar sesión.',
          needsVerification: !data.user.email_confirmed_at
        };
      }

      return { success: false, message: 'Error creating user account' };
    } catch (err) {
      console.error('Error in signUp:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error creating account';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      console.log('Signing in user:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        setError(error.message);
        return { success: false, message: error.message };
      }

      if (data.user) {
        await loadUserData(data.user.id);
        console.log('User signed in successfully');
        return { success: true, message: 'Sesión iniciada exitosamente' };
      }

      return { success: false, message: 'Error signing in' };
    } catch (err) {
      console.error('Error in signIn:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error signing in';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      console.log('Signing out user');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        setError(error.message);
        return false;
      }

      setUser(null);
      setUserStats({
        eventsAttended: 0,
        ctfsCompleted: 0,
        workshopsTaken: 0,
        pointsEarned: 0,
        profileComplete: false,
      });
      
      console.log('User signed out successfully');
      return true;
    } catch (err) {
      console.error('Error in signOut:', err);
      setError('Error signing out');
      return false;
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      setError(null);
      
      if (!user) {
        setError('No user logged in');
        return false;
      }

      console.log('Updating user profile');
      
      const updatedUser = await UserService.updateUser(user.id, updates);
      
      if (updatedUser) {
        setUser(updatedUser);
        console.log('Profile updated successfully');
        return true;
      }

      return false;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Error updating profile');
      return false;
    }
  };

  const updateStats = async (newStats: UserStats) => {
    try {
      setError(null);
      
      if (!user) {
        console.log('No user logged in, updating stats locally');
        setUserStats(newStats);
        return true;
      }

      console.log('Updating user stats');
      
      const success = await UserService.updateUserStats(user.id, newStats);
      
      if (success) {
        setUserStats(newStats);
        console.log('Stats updated successfully');
        return true;
      }

      return false;
    } catch (err) {
      console.error('Error updating stats:', err);
      setError('Error updating stats');
      return false;
    }
  };

  return {
    user,
    userStats,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    updateProfile,
    updateStats,
    refreshUser: checkUser,
  };
};
