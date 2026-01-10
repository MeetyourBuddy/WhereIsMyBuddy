import { apiMethods } from "@/services/api-methods";

export interface Partner {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  status: "active" | "inactive";
  joinedAt: string;
  invitedBy: string;
  streak: number;
  progress: number;
  lastCheckIn: string;
  activities: number;
  totalCheckIns: number;
}

export interface PartnerInvitation {
  id: string;
  fromUser: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  toUser?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  toEmail?: string;
  message?: string;
  status: "pending" | "accepted" | "declined" | "expired";
  createdAt: string;
  expiresAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  isPartner: boolean;
  isPending: boolean;
}

export interface CreatePartnerInvitationDto {
  toUserId?: string;
  toEmail?: string;
  message?: string;
  isLinkInvitation?: string;
}

export interface RespondToInvitationDto {
  action: "accept" | "decline";
}

export interface SearchUsersDto {
  query: string;
}

export interface PartnerInvitationDetails {
  id: string;
  activity: {
    id: string;
    title: string;
    description: string;
  };
  fromUser: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  message?: string;
  expiresAt: string;
}

class PartnerService {
  private baseUrl = "/activities";

  // Search users for partner invitations
  async searchUsers(activityId: string, query: string): Promise<User[]> {
    const response = await apiMethods.get<User[]>(
      `${this.baseUrl}/${activityId}/partners/search-users?q=${encodeURIComponent(query)}`
    );
    return response.data;
  }

  // Get all partners for an activity
  async getPartners(activityId: string): Promise<Partner[]> {
    const response = await apiMethods.get<Partner[]>(
      `${this.baseUrl}/${activityId}/partners`
    );
    return response.data;
  }

  // Get pending invitations for an activity
  async getPendingInvitations(
    activityId: string
  ): Promise<PartnerInvitation[]> {
    const response = await apiMethods.get<PartnerInvitation[]>(
      `${this.baseUrl}/${activityId}/partners/invitations`
    );
    return response.data;
  }

  // Create partner invitation
  async createInvitation(
    activityId: string,
    data: CreatePartnerInvitationDto
  ): Promise<PartnerInvitation> {
    const response = await apiMethods.post<PartnerInvitation>(
      `${this.baseUrl}/${activityId}/partners/invite`,
      data
    );
    return response.data;
  }

  // Respond to invitation
  async respondToInvitation(
    activityId: string,
    invitationId: string,
    data: RespondToInvitationDto
  ): Promise<PartnerInvitation> {
    const response = await apiMethods.put<PartnerInvitation>(
      `${this.baseUrl}/${activityId}/partners/invitations/${invitationId}/respond`,
      data
    );
    return response.data;
  }

  // Remove partner
  async removePartner(
    activityId: string,
    partnerId: string
  ): Promise<{ message: string }> {
    const response = await apiMethods.delete<{ message: string }>(
      `${this.baseUrl}/${activityId}/partners/${partnerId}`
    );
    return response.data;
  }

  // Get invitation details by token (no auth required)
  async getInvitationByToken(token: string): Promise<PartnerInvitationDetails> {
    const response = await apiMethods.get<PartnerInvitationDetails>(
      `/invite/partner/${token}`
    );
    return response.data;
  }

  // Accept invitation by token
  async acceptInvitationByToken(token: string): Promise<Partner> {
    const response = await apiMethods.post<Partner>(
      `/invite/partner/${token}/accept`
    );
    return response.data;
  }
}

export const partnerService = new PartnerService();
