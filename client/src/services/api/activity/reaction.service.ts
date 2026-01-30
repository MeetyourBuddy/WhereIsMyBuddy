import { apiMethods } from "@/services/api-methods";

export interface ReactionStats {
  like: number;
  love: number;
  fire: number;
  celebrate: number;
  star: number;
  rocket: number;
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
  | "celebrate"
  | "star"
  | "rocket";

export interface ReactionWithUser {
  type: string;
  user: { _id: string; name: string; avatar?: string };
}

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

  getReactionsForCheckIn: (checkInId: string) =>
    apiMethods.get<ReactionWithUser[]>(
      `/reactions/checkin/${checkInId}/list`
    ),
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

  getUserProgressForActivities: (activityIds: string[]) =>
    apiMethods.post<
      Record<
        string,
        {
          progress: number;
          completedCheckIns: number;
          totalAvailableCheckIns: number;
          currentStreak?: number;
          longestStreak?: number;
          lastCheckInDate?: string;
        }
      >
    >(`/checkins/user-progress/batch`, { activityIds }),

  getActivityStatistics: (activityId: string) =>
    apiMethods.get<{
      longestStreak: number;
      longestStreakParticipantId?: string | null;
      longestStreakParticipantName?: string | null;
      highestCheckIns: number;
      averageProgress: number;
      totalParticipants: number;
      totalCheckIns: number;
    }>(`/activities/${activityId}/statistics`),

  getActivityLeaderboard: (activityId: string) =>
    apiMethods.get<{
      participants: Array<{
        id: string;
        name: string;
        email: string;
        avatar?: string;
        checkIns: number;
        streak: number;
        points: number;
        role: string;
        joinDate: string;
        lastCheckIn?: string;
      }>;
    }>(`/activities/${activityId}/leaderboard`),

  getWeeklyActivity: (activityId: string) =>
    apiMethods.get<{
      weeklyData: Array<{
        name: string;
        checkins: number;
        date: string;
      }>;
    }>(`/activities/${activityId}/weekly-activity`),

  getParticipantHistory: (activityId: string) =>
    apiMethods.get<{
      participants: Array<{
        id: string;
        name: string;
        avatar?: string;
        checkIns: number;
        streak: number;
        last7Days: Array<{
          date: string;
          checkedIn: boolean;
        }>;
      }>;
    }>(`/activities/${activityId}/participant-history`),
};
