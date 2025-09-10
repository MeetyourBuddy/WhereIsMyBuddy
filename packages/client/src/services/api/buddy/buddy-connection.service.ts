import { apiMethods } from "@/services/api-methods";
import { ApiResponse } from "@/types";

export interface CreateBuddyRequestDto {
  recipientId: string;
  message?: string;
}

export interface UpdateBuddyRequestDto {
  status: "pending" | "accepted" | "declined" | "blocked";
}

export interface BuddyConnectionResponseDto {
  id: string;
  requester: {
    id: string;
    name: string;
    avatar?: string;
    profileLink: string;
  };
  recipient: {
    id: string;
    name: string;
    avatar?: string;
    profileLink: string;
  };
  status: "pending" | "accepted" | "declined" | "blocked";
  message?: string;
  acceptedAt?: string;
  declinedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BuddyStatsDto {
  totalConnections: number;
  pendingRequests: number;
  receivedRequests: number;
  mutualConnections?: number;
}

export interface MutualConnectionDto {
  id: string;
  name: string;
  avatar?: string;
  profileLink: string;
  connectedAt: string;
}

export interface ConnectionStatusResponse {
  status: "pending" | "accepted" | "declined" | "blocked" | null;
  connectionId?: string;
}

export const BuddyConnectionService = {
  // Send a buddy request
  sendBuddyRequest: async (
    data: CreateBuddyRequestDto
  ): Promise<BuddyConnectionResponseDto> => {
    const response = await apiMethods.post<BuddyConnectionResponseDto>(
      "/buddy-connections/request",
      data
    );
    return response.data;
  },

  // Respond to a buddy request
  respondToBuddyRequest: async (
    requestId: string,
    data: UpdateBuddyRequestDto
  ): Promise<BuddyConnectionResponseDto> => {
    const response = await apiMethods.put<BuddyConnectionResponseDto>(
      `/buddy-connections/request/${requestId}/respond`,
      data
    );
    return response.data;
  },

  // Get all buddy connections
  getBuddyConnections: async (
    status?: "pending" | "accepted" | "declined" | "blocked"
  ): Promise<BuddyConnectionResponseDto[]> => {
    const params = status ? `?status=${status}` : "";
    const response = await apiMethods.get<BuddyConnectionResponseDto[]>(
      `/buddy-connections${params}`
    );
    return response.data;
  },

  // Get pending requests sent by user
  getPendingRequests: async (): Promise<BuddyConnectionResponseDto[]> => {
    const response = await apiMethods.get<BuddyConnectionResponseDto[]>(
      "/buddy-connections/pending"
    );
    return response.data;
  },

  // Get received requests
  getReceivedRequests: async (): Promise<BuddyConnectionResponseDto[]> => {
    const response = await apiMethods.get<BuddyConnectionResponseDto[]>(
      "/buddy-connections/received"
    );
    return response.data;
  },

  // Get buddy statistics
  getBuddyStats: async (): Promise<BuddyStatsDto> => {
    const response = await apiMethods.get<BuddyStatsDto>(
      "/buddy-connections/stats"
    );
    return response.data;
  },

  // Get mutual connections with another user
  getMutualConnections: async (
    otherUserId: string
  ): Promise<MutualConnectionDto[]> => {
    const response = await apiMethods.get<MutualConnectionDto[]>(
      `/buddy-connections/mutual/${otherUserId}`
    );
    return response.data;
  },

  // Check connection status with another user
  checkConnectionStatus: async (
    otherUserId: string
  ): Promise<ConnectionStatusResponse> => {
    const response = await apiMethods.get<ConnectionStatusResponse>(
      `/buddy-connections/status/${otherUserId}`
    );
    return response.data;
  },

  // Remove a buddy connection
  removeBuddyConnection: async (
    connectionId: string
  ): Promise<{ message: string }> => {
    const response = await apiMethods.delete<{ message: string }>(
      `/buddy-connections/${connectionId}`
    );
    return response.data;
  },
};
