import { apiMethods } from "../api-methods";

export interface Milestone {
  _id: string;
  name: string;
  description: string;
  type: "streak" | "checkins" | "completion" | "time_based";
  tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
  targetValue: number;
  reward: string;
  badgeIcon?: string;
  badgeColor?: string;
  isActive: boolean;
  points: number;
  unlockMessage?: string;
  celebrationMessage?: string;
}

export interface UserMilestone {
  id: string;
  milestone: Milestone;
  achievedAt: string;
  isNotified: boolean;
  isClaimed: boolean;
  claimedAt?: string;
  progress: number;
  currentValue: number;
}

export interface MilestoneProgress {
  milestone: Milestone;
  currentValue: number;
  progress: number;
  isAchieved: boolean;
  achievedAt?: string;
  isNotified: boolean;
  isClaimed: boolean;
}

export const MilestoneService = {
  initializeDefaultMilestones: () =>
    apiMethods.post<{ message: string }>("/milestones/initialize"),

  getUserMilestones: (activityId?: string) =>
    apiMethods.get<{ milestones: UserMilestone[] }>(
      `/milestones/user/${activityId || ""}`
    ),

  getUserMilestoneProgress: (activityId?: string) =>
    apiMethods.get<{ progress: MilestoneProgress[] }>(
      `/milestones/progress/${activityId || ""}`
    ),

  checkAndAwardMilestones: (activityId?: string) =>
    apiMethods.post<{ newMilestones: UserMilestone[] }>(
      `/milestones/check/${activityId || ""}`
    ),

  claimMilestone: (milestoneId: string) =>
    apiMethods.post<{ message: string }>(`/milestones/claim/${milestoneId}`),
};
