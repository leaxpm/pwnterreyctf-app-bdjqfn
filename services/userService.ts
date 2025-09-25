
import { supabase } from '../config/supabase';
import { User } from '../types/Event';
import { UserStats } from '../types/Badge';

export class UserService {
  static async getCurrentUser(): Promise<User | null> {
    try {
      console.log('UserService - Getting current user...');
      
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('UserService - Auth error:', error);
        return null;
      }
      
      if (!user) {
        console.log('UserService - No authenticated user found');
        return null;
      }

      console.log('UserService - Auth user found:', user.id, user.email);

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError) {
        console.error('UserService - Error fetching user data:', userError);
        return null;
      }

      console.log('UserService - User data fetched successfully:', userData);
      
      const favoriteEvents = await this.getUserFavorites(user.id);
      
      return {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar,
        role: userData.role || 'user',
        favoriteEvents,
      };
    } catch (error) {
      console.error('UserService - Error in getCurrentUser:', error);
      return null;
    }
  }

  static async createOrUpdateUser(userData: Omit<User, 'id' | 'favoriteEvents'>, authUserId: string): Promise<User | null> {
    try {
      console.log('Creating or updating user profile for:', userData.email, 'with ID:', authUserId);
      
      // First, check if user profile already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUserId)
        .single();

      if (existingUser) {
        console.log('User profile already exists, updating with provided data');
        
        // Update existing user with new data
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({
            name: userData.name,
            email: userData.email,
            avatar: userData.avatar || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', authUserId)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating existing user:', updateError);
          throw updateError;
        }

        const favoriteEvents = await this.getUserFavorites(authUserId);
        
        return {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          avatar: updatedUser.avatar,
          role: updatedUser.role || 'user',
          favoriteEvents,
        };
      }

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing user:', checkError);
        throw checkError;
      }

      // Create new user profile (this might not be needed if trigger is working)
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: authUserId,
          name: userData.name,
          email: userData.email,
          avatar: userData.avatar || null,
          stats: {
            eventsAttended: 0,
            ctfsCompleted: 0,
            workshopsTaken: 0,
            pointsEarned: 0,
            profileComplete: false,
          },
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile:', error);
        throw error;
      }

      console.log('User profile created successfully:', data.id);
      
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        role: data.role || 'user',
        favoriteEvents: [],
      };
    } catch (error) {
      console.error('Error in createOrUpdateUser:', error);
      throw error;
    }
  }

  static async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    try {
      console.log('Updating user:', userId);
      
      const { data, error } = await supabase
        .from('users')
        .update({
          ...(updates.name && { name: updates.name }),
          ...(updates.email && { email: updates.email }),
          ...(updates.avatar !== undefined && { avatar: updates.avatar }),
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating user:', error);
        throw error;
      }

      console.log('User updated successfully');
      
      const favoriteEvents = await this.getUserFavorites(userId);
      
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        role: data.role || 'user',
        favoriteEvents,
      };
    } catch (error) {
      console.error('Error in updateUser:', error);
      return null;
    }
  }

  static async getUserStats(userId: string): Promise<UserStats> {
    try {
      console.log('Getting user stats for:', userId);
      
      const { data, error } = await supabase
        .from('users')
        .select('stats')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user stats:', error);
        return {
          eventsAttended: 0,
          ctfsCompleted: 0,
          workshopsTaken: 0,
          pointsEarned: 0,
          profileComplete: false,
        };
      }

      console.log('User stats fetched successfully');
      
      return data.stats || {
        eventsAttended: 0,
        ctfsCompleted: 0,
        workshopsTaken: 0,
        pointsEarned: 0,
        profileComplete: false,
      };
    } catch (error) {
      console.error('Error in getUserStats:', error);
      return {
        eventsAttended: 0,
        ctfsCompleted: 0,
        workshopsTaken: 0,
        pointsEarned: 0,
        profileComplete: false,
      };
    }
  }

  static async updateUserStats(userId: string, stats: UserStats): Promise<boolean> {
    try {
      console.log('Updating user stats for:', userId);
      
      const { error } = await supabase
        .from('users')
        .update({
          stats,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user stats:', error);
        return false;
      }

      console.log('User stats updated successfully');
      return true;
    } catch (error) {
      console.error('Error in updateUserStats:', error);
      return false;
    }
  }

  static async getUserFavorites(userId: string): Promise<string[]> {
    try {
      console.log('Getting user favorites for:', userId);
      
      const { data, error } = await supabase
        .from('user_favorites')
        .select('event_id')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user favorites:', error);
        return [];
      }

      console.log('User favorites fetched:', data?.length);
      
      return data?.map(fav => fav.event_id) || [];
    } catch (error) {
      console.error('Error in getUserFavorites:', error);
      return [];
    }
  }

  static async toggleFavorite(userId: string, eventId: string): Promise<boolean> {
    try {
      console.log('Toggling favorite for user:', userId, 'event:', eventId);
      
      // Check if already favorited
      const { data: existing, error: checkError } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('event_id', eventId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking favorite:', checkError);
        return false;
      }

      if (existing) {
        // Remove favorite
        const { error: deleteError } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', userId)
          .eq('event_id', eventId);

        if (deleteError) {
          console.error('Error removing favorite:', deleteError);
          return false;
        }

        console.log('Favorite removed successfully');
      } else {
        // Add favorite
        const { error: insertError } = await supabase
          .from('user_favorites')
          .insert({
            user_id: userId,
            event_id: eventId,
          });

        if (insertError) {
          console.error('Error adding favorite:', insertError);
          return false;
        }

        console.log('Favorite added successfully');
      }

      return true;
    } catch (error) {
      console.error('Error in toggleFavorite:', error);
      return false;
    }
  }
}
