import { apiMethods } from "../api-methods";

export interface NotificationData {
  type: "milestone" | "streak" | "goal" | "reminder" | "achievement";
  title: string;
  message: string;
  priority: "low" | "medium" | "high";
  userId: string;
  activityId?: string;
  data?: any;
}

export const NotificationService = {
  checkProgressNotifications: (activityId?: string) =>
    apiMethods.get<{ success: boolean; notifications: NotificationData[] }>(
      `/notifications/check/${activityId || ""}`
    ),
};
