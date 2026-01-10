import { apiMethods } from "../api-methods";

export interface ActivityReportData {
  activity: {
    id: string;
    title: string;
    description: string;
    category: string;
    startDate: string;
    endDate: string;
    proposedDuration: number;
    checkinFrequency: number;
    checkinFrequencyUnit: string;
    goals: string[];
    tags: string[];
    admin: any;
    participants: any[];
  };
  userStats: {
    currentStreak: number;
    longestStreak: number;
    completionRate: number;
    onTimeRate: number;
    totalCheckIns: number;
  };
  checkIns: Array<{
    id: string;
    checkInDate: string;
    scheduledDate: string;
    isOnTime: boolean;
    message: string;
    imageUrl: string;
    type: string;
  }>;
  milestones: Array<{
    id: string;
    name: string;
    description: string;
    tier: string;
    reward: string;
    points: number;
    achievedAt: string;
    isClaimed: boolean;
  }>;
  summary: {
    totalCheckIns: number;
    currentStreak: number;
    longestStreak: number;
    completionRate: number;
    milestonesAchieved: number;
    totalPoints: number;
    activityDuration: number;
    participationRate: number;
  };
}

export interface UserProgressReportData {
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    createdAt: string;
  };
  activities: Array<{
    id: string;
    title: string;
    category: string;
    startDate: string;
    endDate: string;
    isAdmin: boolean;
    stats: any;
    checkIns: number;
    milestones: number;
  }>;
  overallStats: {
    totalActivities: number;
    totalCheckIns: number;
    totalMilestones: number;
    totalPoints: number;
    averageCompletionRate: number;
    longestStreak: number;
    currentStreak: number;
  };
  milestones: Array<{
    id: string;
    name: string;
    description: string;
    tier: string;
    reward: string;
    points: number;
    achievedAt: string;
    isClaimed: boolean;
    activityTitle: string;
  }>;
}

export const ExportService = {
  exportActivityReport: (activityId: string) =>
    apiMethods.get<{ success: boolean; data: ActivityReportData }>(
      `/export/activity/${activityId}`
    ),

  exportUserProgressReport: () =>
    apiMethods.get<{ success: boolean; data: UserProgressReportData }>(
      "/export/user-progress"
    ),
};
