import { apiMethods } from "@/services/api-methods";

const baseUrl = "/activities";

export interface CreateActivityJoinRequestDto {
  message?: string;
}

export interface ActivityJoinRequest {
  _id: string;
  activityId: string;
  userId: string | { _id: string; name: string; email?: string; avatar?: string };
  message?: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
  updatedAt: string;
  user?: {
    _id: string;
    name: string;
    email?: string;
    avatar?: string;
  };
}

export interface ActivityJoinRequestResponse {
  success: boolean;
  data: ActivityJoinRequest | ActivityJoinRequest[] | null;
  message: string;
}

export const activityJoinRequestService = {
  createRequest: (
    activityId: string,
    data: CreateActivityJoinRequestDto
  ): Promise<ActivityJoinRequestResponse> =>
    apiMethods.post(`${baseUrl}/${activityId}/requests`, data),

  getMyRequest: (activityId: string): Promise<ActivityJoinRequestResponse> =>
    apiMethods.get(`${baseUrl}/${activityId}/requests/my`),

  getRequests: (activityId: string): Promise<ActivityJoinRequestResponse> =>
    apiMethods.get(`${baseUrl}/${activityId}/requests`),

  acceptRequest: (
    activityId: string,
    requestId: string
  ): Promise<ActivityJoinRequestResponse> =>
    apiMethods.post(`${baseUrl}/${activityId}/requests/${requestId}/accept`),

  declineRequest: (
    activityId: string,
    requestId: string
  ): Promise<ActivityJoinRequestResponse> =>
    apiMethods.post(`${baseUrl}/${activityId}/requests/${requestId}/decline`),
};
