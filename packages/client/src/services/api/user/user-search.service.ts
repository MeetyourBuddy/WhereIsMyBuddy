import { apiMethods } from "@/services/api-methods";
import { User } from "@/types/auth-types";

export interface UserSearchParams {
  search?: string;
  interests?: string[];
  country?: string;
  city?: string;
  limit?: number;
  offset?: number;
}

export interface UserSearchResponse {
  success: boolean;
  message: string;
  data: User[];
  metadata: {
    total: number;
    offset: number;
    limit: number;
    hasMore: boolean;
  };
  timestamp: string;
  path: string;
}

export const UserSearchService = {
  searchUsers: (params: UserSearchParams) =>
    apiMethods.get<UserSearchResponse>("/users", { params }),
};
