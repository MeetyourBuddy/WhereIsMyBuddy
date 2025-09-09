import { apiMethods } from "@/services/api-methods";

export interface ReactionStats {
  like: number;
  love: number;
  fire: number;
  rock: number;
  celebrate: number;
  support: number;
  total: number;
}

export interface UserReaction {
  type: string;
  hasReacted: boolean;
}

export type ReactionType =
  | "like"
  | "love"
  | "fire"
  | "rock"
  | "celebrate"
  | "support";

export const ReactionService = {
  addReaction: (checkInId: string, reactionType: ReactionType) =>
    apiMethods.post<ReactionStats>(`/reactions/checkin/${checkInId}`, {
      type: reactionType,
    }),

  removeReaction: (checkInId: string) =>
    apiMethods.delete<ReactionStats>(`/reactions/checkin/${checkInId}`),

  getReactionStats: (checkInId: string) =>
    apiMethods.get<ReactionStats>(`/reactions/checkin/${checkInId}/stats`),

  getUserReaction: (checkInId: string) =>
    apiMethods.get<UserReaction | null>(`/reactions/checkin/${checkInId}/user`),
};

export const CheckInService = {
  getCurrentPeriodStatus: (activityId: string) =>
    apiMethods.get<{ hasCheckedIn: boolean }>(
      `/checkins/activity/${activityId}/current-period-status`
    ),

  getUserProgress: (activityId: string) =>
    apiMethods.get<{
      progress: number;
      completedCheckIns: number;
      totalAvailableCheckIns: number;
    }>(`/checkins/activity/${activityId}/user-progress`),
};
