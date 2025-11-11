import api from './client';

// API Response wrapper types
export interface GamificationAPIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Types
export interface UserProfile {
  id: string;
  userId: string;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  totalPoints: number;
  badges: Badge[];
  achievements: Achievement[];
  rank: number;
  createdAt: string;
  updatedAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  isCompleted: boolean;
  reward: {
    points: number;
    badge?: string;
  };
}

export interface Leaderboard {
  period: 'daily' | 'weekly' | 'monthly' | 'all-time';
  users: {
    rank: number;
    userId: string;
    username: string;
    avatar?: string;
    points: number;
    level: number;
  }[];
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'special';
  requirement: string;
  reward: {
    points: number;
    experience: number;
    badge?: string;
  };
  progress: number;
  target: number;
  expiresAt: string;
  isCompleted: boolean;
}

// Gamification API
export const gamificationAPI = {
  // Get user profile
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get<GamificationAPIResponse<UserProfile>>('/gamification/profile');
    return response.data.data;
  },

  // Get leaderboard
  getLeaderboard: async (period: 'daily' | 'weekly' | 'monthly' | 'all-time' = 'all-time'): Promise<Leaderboard> => {
    const response = await api.get<GamificationAPIResponse<Leaderboard>>('/gamification/leaderboard', { params: { period } });
    return response.data.data;
  },

  // Get achievements
  getAchievements: async (): Promise<Achievement[]> => {
    const response = await api.get<GamificationAPIResponse<Achievement[]>>('/gamification/achievements');
    return response.data.data;
  },

  // Get badges
  getBadges: async (): Promise<Badge[]> => {
    const response = await api.get<GamificationAPIResponse<Badge[]>>('/gamification/badges');
    return response.data.data;
  },

  // Get challenges
  getChallenges: async (): Promise<Challenge[]> => {
    const response = await api.get<GamificationAPIResponse<Challenge[]>>('/gamification/challenges');
    return response.data.data;
  },

  // Claim reward
  claimReward: async (achievementId: string): Promise<{
    points: number;
    experience: number;
    newLevel?: number;
  }> => {
    const response = await api.post<GamificationAPIResponse<{
      points: number;
      experience: number;
      newLevel?: number;
    }>>(`/gamification/achievements/${achievementId}/claim`);
    return response.data.data;
  },
};

export default gamificationAPI;
