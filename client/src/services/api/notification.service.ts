import { apiMethods } from "../api-methods";

export interface NotificationData {
  id: string;
  type:
    | "buddy_request"
    | "buddy_accepted"
    | "buddy_declined"
    | "activity_invite"
    | "activity_invitation"
    | "activity_comment"
    | "checkin_comment"
    | "milestone_achieved"
    | "streak_milestone"
    | "activity_reminder"
    | "goal_reminder"
    | "system_welcome"
    | "activity_created";
  title: string;
  message: string;
  priority: "low" | "medium" | "high";
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
  activity?: {
    id: string;
    title: string;
  };
  metadata?: Record<string, unknown>;
}

export interface NotificationResponse {
  notifications: NotificationData[];
  total: number;
  hasMore: boolean;
}

export interface UnreadCountResponse {
  unreadCount: number;
}

export const NotificationService = {
  // Get user notifications with pagination and filtering
  getNotifications: (params?: {
    page?: number;
    limit?: number;
    type?: string;
    unreadOnly?: boolean;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.type) queryParams.append("type", params.type);
    if (params?.unreadOnly)
      queryParams.append("unreadOnly", params.unreadOnly.toString());

    return apiMethods.get<NotificationResponse>(
      `/notifications?${queryParams.toString()}`
    );
  },

  // Get unread notification count
  getUnreadCount: () =>
    apiMethods.get<UnreadCountResponse>("/notifications/unread-count"),

  // Mark notification as read
  markAsRead: (notificationId: string) =>
    apiMethods.put<NotificationData>(
      `/notifications/${notificationId}/read`,
      {}
    ),

  // Mark all notifications as read
  markAllAsRead: () =>
    apiMethods.put<{ updatedCount: number }>(
      "/notifications/mark-all-read",
      {}
    ),

  // Delete notification
  deleteNotification: (notificationId: string) =>
    apiMethods.delete<{ success: boolean; message: string }>(
      `/notifications/${notificationId}`
    ),

  // Create progress-based notification
  createProgressNotification: (
    activityId: string,
    progressData: {
      progress: number;
      completedCheckIns: number;
      totalAvailableCheckIns: number;
      currentStreak?: number;
      lastCheckInDate?: string;
    }
  ) =>
    apiMethods.post<NotificationData>("/notifications/progress", {
      activityId,
      progressData,
    }),

  // Create streak-based notification
  createStreakNotification: (
    activityId: string,
    streakData: {
      currentStreak: number;
      progress: number;
      completedCheckIns: number;
    }
  ) =>
    apiMethods.post<NotificationData>("/notifications/streak", {
      activityId,
      streakData,
    }),

  // Legacy method for progress notifications (keeping for backward compatibility)
  checkProgressNotifications: (activityId?: string) =>
    apiMethods.get<{ success: boolean; notifications: NotificationData[] }>(
      `/notifications/check/${activityId || ""}`
    ),
};
