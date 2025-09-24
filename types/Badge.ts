
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  requirements: BadgeRequirement[];
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface BadgeRequirement {
  type: 'events_attended' | 'ctfs_completed' | 'workshops_taken' | 'points_earned' | 'profile_complete';
  value: number;
  description: string;
}

export interface UserStats {
  eventsAttended: number;
  ctfsCompleted: number;
  workshopsTaken: number;
  pointsEarned: number;
  profileComplete: boolean;
}
