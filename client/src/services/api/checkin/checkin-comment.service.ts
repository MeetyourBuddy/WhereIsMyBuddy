import { apiMethods } from "@/services/api-methods";

export interface CheckInComment {
  _id: string;
  checkIn: string;
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  content: string;
  parentComment?: string;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  replies?: CheckInComment[];
}

export interface CreateCheckInCommentRequest {
  checkInId: string;
  content: string;
  parentCommentId?: string;
}

export interface UpdateCheckInCommentRequest {
  content: string;
}

export interface CheckInCommentResponse {
  success: boolean;
  message: string;
  data: CheckInComment;
}

export interface CheckInCommentsResponse {
  success: boolean;
  message: string;
  data: CheckInComment[];
}

export interface CheckInCommentCountResponse {
  success: boolean;
  message: string;
  data: { count: number };
}

export const CheckInCommentService = {
  // Create a new comment
  createComment: async (
    data: CreateCheckInCommentRequest
  ): Promise<CheckInCommentResponse> => {
    const response = await apiMethods.post<CheckInCommentResponse>(
      "/checkin-comments",
      data
    );
    return response.data;
  },

  // Get comments for a specific check-in
  getCommentsByCheckIn: async (
    checkInId: string
  ): Promise<CheckInCommentsResponse> => {
    const response = await apiMethods.get<CheckInCommentsResponse>(
      `/checkin-comments/checkin/${checkInId}`
    );
    return response.data;
  },

  // Update a comment
  updateComment: async (
    commentId: string,
    data: UpdateCheckInCommentRequest
  ): Promise<CheckInCommentResponse> => {
    const response = await apiMethods.put<CheckInCommentResponse>(
      `/checkin-comments/${commentId}`,
      data
    );
    return response.data;
  },

  // Delete a comment
  deleteComment: async (commentId: string): Promise<{ message: string }> => {
    const response = await apiMethods.delete<{ message: string }>(
      `/checkin-comments/${commentId}`
    );
    return response.data;
  },

  // Get comment count for a check-in
  getCommentCount: async (
    checkInId: string
  ): Promise<CheckInCommentCountResponse> => {
    const response = await apiMethods.get<CheckInCommentCountResponse>(
      `/checkin-comments/checkin/${checkInId}/count`
    );
    return response.data;
  },
};
