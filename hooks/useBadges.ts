
import { useState, useEffect } from 'react';
import { Badge, UserStats } from '../types/Badge';
import { mockBadges } from '../data/mockBadges';

export const useBadges = (userStats: UserStats) => {
  const [badges, setBadges] = useState<Badge[]>(mockBadges);

  const checkBadgeRequirements = (badge: Badge, stats: UserStats): boolean => {
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
  };

  const updateBadges = () => {
    console.log('Updating badges with stats:', userStats);
    
    setBadges(prevBadges => 
      prevBadges.map(badge => {
        const shouldUnlock = checkBadgeRequirements(badge, userStats);
        
        if (shouldUnlock && !badge.isUnlocked) {
          console.log(`Unlocking badge: ${badge.name}`);
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

  useEffect(() => {
    updateBadges();
  }, [userStats]);

  const getUnlockedBadges = () => {
    return badges.filter(badge => badge.isUnlocked);
  };

  const getLockedBadges = () => {
    return badges.filter(badge => !badge.isUnlocked);
  };

  const getBadgeProgress = (badge: Badge): number => {
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
  };

  return {
    badges,
    getUnlockedBadges,
    getLockedBadges,
    getBadgeProgress,
    updateBadges
  };
};
