import { apiMethods } from "@/services/api-methods";
import { ApiResponse } from "@/types";

export interface CreateCheckInRequest {
  activityId: string;
  type: "text" | "image";
  content: string;
  imageUrl?: string;
  fileId?: string;
  scheduledDate: string;
}

export interface CheckInResponse {
  _id: string;
  activity: string;
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    profileImage?: string;
  };
  type: "text" | "image";
  content: string;
  imageUrl?: string;
  fileId?: string;
  scheduledDate: string;
  checkInDate: string;
  isOnTime: boolean;
  likes: number;
  likedBy: string[];
  hasUserLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CheckInStats {
  totalCheckIns: number;
  currentStreak: number;
  longestStreak: number;
  onTimePercentage: number;
  lastCheckInDate?: string;
  nextScheduledDate?: string;
}

export const CheckInService = {
  // Create a new check-in
  createCheckIn: async (
    data: CreateCheckInRequest
  ): Promise<CheckInResponse> => {
    const response = await apiMethods.post<CheckInResponse>("/checkins", data);
    return response.data;
  },

  // Get check-ins for a specific activity
  getCheckInsByActivity: async (
    activityId: string
  ): Promise<CheckInResponse[]> => {
    const response = await apiMethods.get<CheckInResponse[]>(
      `/checkins/activity/${activityId}`
    );
    return response.data;
  },

  // Get check-ins for the current user
  getCheckInsByUser: async (
    activityId?: string
  ): Promise<CheckInResponse[]> => {
    const params = activityId ? `?activityId=${activityId}` : "";
    const response = await apiMethods.get<CheckInResponse[]>(
      `/checkins/user${params}`
    );
    return response.data;
  },

  // Get a specific check-in by ID
  getCheckInById: async (checkInId: string): Promise<CheckInResponse> => {
    const response = await apiMethods.get<CheckInResponse>(
      `/checkins/${checkInId}`
    );
    return response.data;
  },

  // Toggle like on a check-in
  toggleLike: async (checkInId: string): Promise<CheckInResponse> => {
    const response = await apiMethods.post<CheckInResponse>(
      `/checkins/${checkInId}/like`
    );
    return response.data;
  },

  // Delete a check-in
  deleteCheckIn: async (checkInId: string): Promise<{ message: string }> => {
    const response = await apiMethods.delete<{ message: string }>(
      `/checkins/${checkInId}`
    );
    return response.data;
  },

  // Get check-in statistics for a user in an activity
  getCheckInStats: async (activityId: string): Promise<CheckInStats> => {
    const response = await apiMethods.get<CheckInStats>(
      `/checkins/stats/${activityId}`
    );
    return response.data;
  },
};
