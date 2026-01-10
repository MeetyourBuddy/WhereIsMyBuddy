import { apiMethods } from "@/services/api-methods";
import { ApiResponse } from "@/types";

export interface BadgeCriteria {
  type: "checkins" | "streak" | "progress" | "onTime" | "activity_completion";
  value: number;
  activityId?: string;
  description: string;
}

export interface Badge {
  _id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  criteria: BadgeCriteria;
  isActive: boolean;
  rarity: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserBadge {
  _id: string;
  user: string;
  badge: Badge;
  earnedAt: string;
  activity?: string;
  isDisplayed: boolean;
  isShared: boolean;
  createdAt: string;
  updatedAt: string;
}

export const BadgeService = {
  // Get all available badges
  getAllBadges: async (): Promise<Badge[]> => {
    const response = await apiMethods.get<Badge[]>("/badges");
    return response.data;
  },

  // Get user's badges
  getUserBadges: async (activityId?: string): Promise<UserBadge[]> => {
    const params = activityId ? `?activityId=${activityId}` : "";
    const response = await apiMethods.get<UserBadge[]>(`/badges/user${params}`);
    return response.data;
  },

  // Seed default badges (admin only)
  seedDefaultBadges: async (): Promise<{ message: string }> => {
    const response = await apiMethods.post<{ message: string }>("/badges/seed");
    return response.data;
  },
};
