
import { supabase } from '../config/supabase';
import { Badge, BadgeRequirement, UserStats } from '../types/Badge';

export class BadgeService {
  static async getAllBadges(): Promise<Badge[]> {
    try {
      console.log('Fetching all badges from Supabase...');
      
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching badges:', error);
        throw error;
      }

      console.log('Badges fetched successfully:', data?.length);
      
      return data?.map(this.mapSupabaseBadgeToBadge) || [];
    } catch (error) {
      console.error('Error in getAllBadges:', error);
      return [];
    }
  }

  static async getUserBadges(userId: string): Promise<Badge[]> {
    try {
      console.log('Fetching user badges for:', userId);
      
      const { data, error } = await supabase
        .from('user_badges')
        .select(`
          badge_id,
          unlocked_at,
          badges (*)
        `)
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user badges:', error);
        throw error;
      }

      console.log('User badges fetched:', data?.length);
      
      return data?.map(userBadge => ({
        ...this.mapSupabaseBadgeToBadge(userBadge.badges),
        isUnlocked: true,
        unlockedAt: userBadge.unlocked_at,
      })) || [];
    } catch (error) {
      console.error('Error in getUserBadges:', error);
      return [];
    }
  }

  static async createBadge(badge: Omit<Badge, 'id' | 'isUnlocked' | 'unlockedAt'>): Promise<Badge | null> {
    try {
      console.log('Creating new badge:', badge.name);
      
      const { data, error } = await supabase
        .from('badges')
        .insert({
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
          color: badge.color,
          requirements: badge.requirements,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating badge:', error);
        throw error;
      }

      console.log('Badge created successfully:', data.id);
      
      return this.mapSupabaseBadgeToBadge(data);
    } catch (error) {
      console.error('Error in createBadge:', error);
      return null;
    }
  }

  static async unlockBadge(userId: string, badgeId: string): Promise<boolean> {
    try {
      console.log('Unlocking badge for user:', userId, 'badge:', badgeId);
      
      // Check if already unlocked
      const { data: existing, error: checkError } = await supabase
        .from('user_badges')
        .select('id')
        .eq('user_id', userId)
        .eq('badge_id', badgeId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking badge unlock:', checkError);
        return false;
      }

      if (existing) {
        console.log('Badge already unlocked');
        return true;
      }

      const { error } = await supabase
        .from('user_badges')
        .insert({
          user_id: userId,
          badge_id: badgeId,
          unlocked_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error unlocking badge:', error);
        return false;
      }

      console.log('Badge unlocked successfully');
      return true;
    } catch (error) {
      console.error('Error in unlockBadge:', error);
      return false;
    }
  }

  static async checkAndUnlockBadges(userId: string, userStats: UserStats): Promise<Badge[]> {
    try {
      console.log('Checking badges for user:', userId);
      
      // Get all badges
      const allBadges = await this.getAllBadges();
      
      // Get user's current badges
      const userBadges = await this.getUserBadges(userId);
      const unlockedBadgeIds = userBadges.map(badge => badge.id);
      
      const newlyUnlocked: Badge[] = [];
      
      for (const badge of allBadges) {
        if (!unlockedBadgeIds.includes(badge.id)) {
          const shouldUnlock = this.checkBadgeRequirements(badge, userStats);
          
          if (shouldUnlock) {
            const unlocked = await this.unlockBadge(userId, badge.id);
            if (unlocked) {
              newlyUnlocked.push({
                ...badge,
                isUnlocked: true,
                unlockedAt: new Date().toISOString(),
              });
            }
          }
        }
      }
      
      console.log('Newly unlocked badges:', newlyUnlocked.length);
      return newlyUnlocked;
    } catch (error) {
      console.error('Error in checkAndUnlockBadges:', error);
      return [];
    }
  }

  static checkBadgeRequirements(badge: Badge, stats: UserStats): boolean {
    console.log(`Checking requirements for badge: ${badge.name}`);
    
    return badge.requirements.every(requirement => {
      switch (requirement.type) {
        case 'events_attended':
          return stats.eventsAttended >= requirement.value;
        case 'ctfs_completed':
          return stats.ctfsCompleted >= requirement.value;
        case 'workshops_taken':
          return stats.workshopsTaken >= requirement.value;
        case 'points_earned':
          return stats.pointsEarned >= requirement.value;
        case 'profile_complete':
          return stats.profileComplete;
        default:
          return false;
      }
    });
  }

  static getBadgeProgress(badge: Badge, userStats: UserStats): number {
    if (badge.isUnlocked) return 100;
    
    const requirement = badge.requirements[0]; // For simplicity, using first requirement
    let currentValue = 0;
    
    switch (requirement.type) {
      case 'events_attended':
        currentValue = userStats.eventsAttended;
        break;
      case 'ctfs_completed':
        currentValue = userStats.ctfsCompleted;
        break;
      case 'workshops_taken':
        currentValue = userStats.workshopsTaken;
        break;
      case 'points_earned':
        currentValue = userStats.pointsEarned;
        break;
      case 'profile_complete':
        currentValue = userStats.profileComplete ? 1 : 0;
        break;
    }
    
    return Math.min((currentValue / requirement.value) * 100, 100);
  }

  private static mapSupabaseBadgeToBadge(supabaseBadge: any): Badge {
    return {
      id: supabaseBadge.id,
      name: supabaseBadge.name,
      description: supabaseBadge.description,
      icon: supabaseBadge.icon,
      color: supabaseBadge.color,
      requirements: supabaseBadge.requirements,
      isUnlocked: false, // This will be set by the user badge service
    };
  }
}
