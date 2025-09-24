
import { useState, useEffect } from 'react';
import { Badge, UserStats } from '../types/Badge';
import { BadgeService } from '../services/badgeService';
import { UserService } from '../services/userService';
import { mockBadges } from '../data/mockBadges';

export const useBadges = (userStats: UserStats) => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBadges();
  }, []);

  useEffect(() => {
    if (badges.length > 0) {
      checkAndUnlockBadges();
    }
  }, [userStats, badges.length]);

  const loadBadges = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading badges...');
      
      // Try to load from Supabase first
      const supabaseBadges = await BadgeService.getAllBadges();
      
      if (supabaseBadges.length > 0) {
        console.log('Using Supabase badges');
        
        // Get current user and their unlocked badges
        const currentUser = await UserService.getCurrentUser();
        if (currentUser) {
          const userBadges = await BadgeService.getUserBadges(currentUser.id);
          const unlockedBadgeIds = userBadges.map(badge => badge.id);
          
          // Merge badge data with unlock status
          const badgesWithStatus = supabaseBadges.map(badge => ({
            ...badge,
            isUnlocked: unlockedBadgeIds.includes(badge.id),
            unlockedAt: userBadges.find(ub => ub.id === badge.id)?.unlockedAt,
          }));
          
          setBadges(badgesWithStatus);
        } else {
          setBadges(supabaseBadges);
        }
      } else {
        console.log('Using mock badges as fallback');
        setBadges(mockBadges);
      }
    } catch (err) {
      console.error('Error loading badges:', err);
      setError('Error loading badges');
      // Fallback to mock data
      setBadges(mockBadges);
    } finally {
      setLoading(false);
    }
  };

  const checkAndUnlockBadges = async () => {
    try {
      const currentUser = await UserService.getCurrentUser();
      if (!currentUser) {
        console.log('No user logged in, using local badge checking');
        // Fallback to local badge checking
        updateBadgesLocally();
        return;
      }

      console.log('Checking badges for unlock...');
      const newlyUnlocked = await BadgeService.checkAndUnlockBadges(currentUser.id, userStats);
      
      if (newlyUnlocked.length > 0) {
        console.log('New badges unlocked:', newlyUnlocked.length);
        // Refresh badges to get updated status
        await loadBadges();
      }
    } catch (err) {
      console.error('Error checking badges:', err);
      // Fallback to local checking
      updateBadgesLocally();
    }
  };

  const updateBadgesLocally = () => {
    console.log('Updating badges locally with stats:', userStats);
    
    setBadges(prevBadges => 
      prevBadges.map(badge => {
        const shouldUnlock = BadgeService.checkBadgeRequirements(badge, userStats);
        
        if (shouldUnlock && !badge.isUnlocked) {
          console.log(`Unlocking badge locally: ${badge.name}`);
          return {
            ...badge,
            isUnlocked: true,
            unlockedAt: new Date().toISOString()
          };
        }
        
        return badge;
      })
    );
  };

  const getUnlockedBadges = () => {
    return badges.filter(badge => badge.isUnlocked);
  };

  const getLockedBadges = () => {
    return badges.filter(badge => !badge.isUnlocked);
  };

  const getBadgeProgress = (badge: Badge): number => {
    return BadgeService.getBadgeProgress(badge, userStats);
  };

  const refreshBadges = () => {
    loadBadges();
  };

  return {
    badges,
    loading,
    error,
    getUnlockedBadges,
    getLockedBadges,
    getBadgeProgress,
    refreshBadges,
    updateBadges: checkAndUnlockBadges,
  };
};
