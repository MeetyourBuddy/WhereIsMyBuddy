import { apiMethods } from "@/services/api-methods";

const baseUrl = "/activities";

export interface CreateActivityInvitationDto {
  toUserId?: string;
  toEmail?: string;
  message?: string;
  emails?: string[];
}

export interface ActivityInvitation {
  _id: string;
  activityId: string;
  fromUserId: string;
  toUserId?: string;
  toEmail?: string;
  message?: string;
  status: "pending" | "accepted" | "declined" | "expired";
  invitationToken?: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  activity?: {
    _id: string;
    title: string;
    description: string;
    bannerImage?: string;
    category: string;
    type: string;
  };
  fromUser?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  toUser?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface ActivityInvitationResponse {
  success: boolean;
  data: ActivityInvitation | ActivityInvitation[];
  message: string;
}

export const activityInvitationService = {
  // Create invitation(s)
  createInvitation: (
    activityId: string,
    data: CreateActivityInvitationDto
  ): Promise<ActivityInvitationResponse> =>
    apiMethods.post(
      `${baseUrl}/${activityId}/invitations`,
      data
    ),

  // Get all invitations for an activity (admin only)
  getInvitations: (
    activityId: string
  ): Promise<ActivityInvitationResponse> =>
    apiMethods.get(`${baseUrl}/${activityId}/invitations`),

  // Get user's invitations
  getUserInvitations: (): Promise<ActivityInvitationResponse> =>
    apiMethods.get(`${baseUrl}/invitations/my`),

  // Accept invitation
  acceptInvitation: (
    invitationId: string
  ): Promise<ActivityInvitationResponse> =>
    apiMethods.post(`${baseUrl}/invitations/${invitationId}/accept`),

  // Decline invitation
  declineInvitation: (
    invitationId: string
  ): Promise<ActivityInvitationResponse> =>
    apiMethods.post(`${baseUrl}/invitations/${invitationId}/decline`),

  // Get invitation by token (public)
  getInvitationByToken: (
    token: string
  ): Promise<ActivityInvitationResponse> =>
    apiMethods.get(`/invite/activity/${token}`),

  // Accept invitation by token
  acceptInvitationByToken: (
    token: string
  ): Promise<ActivityInvitationResponse> =>
    apiMethods.post(`/invite/activity/${token}/accept`),

  // Delete invitation (admin only)
  deleteInvitation: (
    activityId: string,
    invitationId: string
  ): Promise<{ success: boolean; message: string }> =>
    apiMethods.delete(`${baseUrl}/${activityId}/invitations/${invitationId}`),
};

