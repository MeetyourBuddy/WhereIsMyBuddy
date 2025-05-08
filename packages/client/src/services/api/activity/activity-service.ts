import { IActivity, IActivityResult } from "@/types/activity-types";
import { apiMethods } from "@/services/api-methods";

export const ActivityService = {
  createActivity: (activityData: IActivity) =>
    apiMethods.post<IActivityResult>("/activities", activityData),

  getActivities: () => apiMethods.get<IActivityResult[]>(`/activities`),

  getActivityById: (id: string) =>
    apiMethods.get<IActivityResult>(`/activities/${id}`),

  updateActivity: (id: string, activityData: Partial<IActivity>) =>
    apiMethods.patch<IActivityResult>(`/activities/${id}`, activityData),

  deleteActivity: (id: string) => apiMethods.delete<void>(`/activities/${id}`),
};
