import { apiMethods } from "@/services/api-methods";

export interface ActivityMessage {
  _id: string;
  activityId: string;
  userId: {
    _id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  likes: number;
  likedBy: string[];
  isPinned: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateActivityMessageDto {
  content: string;
  tags?: string[];
}

export interface UpdateActivityMessageDto {
  content?: string;
  tags?: string[];
  isPinned?: boolean;
}

export interface MessageStats {
  totalMessages: number;
  pinnedMessages: number;
  totalLikes: number;
  mostActiveUsers: Array<{
    userId: string;
    name: string;
    avatar?: string;
    messageCount: number;
  }>;
}

export interface GetMessagesResponse {
  messages: ActivityMessage[];
  total: number;
  page: number;
  totalPages: number;
}

export interface GetMessagesOptions {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
  pinnedOnly?: boolean;
}

class ActivityMessageService {
  private baseUrl = "/activities";

  // Create a new message
  async createMessage(
    activityId: string,
    data: CreateActivityMessageDto
  ): Promise<ActivityMessage> {
    const response = await apiMethods.post<ActivityMessage>(
      `${this.baseUrl}/${activityId}/messages`,
      data
    );
    return response.data;
  }

  // Get messages for an activity
  async getMessages(
    activityId: string,
    options: GetMessagesOptions = {}
  ): Promise<GetMessagesResponse> {
    const params = new URLSearchParams();

    if (options.page) params.append("page", options.page.toString());
    if (options.limit) params.append("limit", options.limit.toString());
    if (options.search) params.append("search", options.search);
    if (options.tag) params.append("tag", options.tag);
    if (options.pinnedOnly) params.append("pinnedOnly", "true");

    const response = await apiMethods.get<GetMessagesResponse>(
      `${this.baseUrl}/${activityId}/messages?${params.toString()}`
    );
    return response.data;
  }

  // Toggle like on a message
  async toggleLike(
    activityId: string,
    messageId: string
  ): Promise<ActivityMessage> {
    const response = await apiMethods.post<ActivityMessage>(
      `${this.baseUrl}/${activityId}/messages/${messageId}/like`
    );
    return response.data;
  }

  // Toggle pin on a message
  async togglePin(
    activityId: string,
    messageId: string
  ): Promise<ActivityMessage> {
    const response = await apiMethods.post<ActivityMessage>(
      `${this.baseUrl}/${activityId}/messages/${messageId}/pin`
    );
    return response.data;
  }

  // Update a message
  async updateMessage(
    activityId: string,
    messageId: string,
    data: UpdateActivityMessageDto
  ): Promise<ActivityMessage> {
    const response = await apiMethods.put<ActivityMessage>(
      `${this.baseUrl}/${activityId}/messages/${messageId}`,
      data
    );
    return response.data;
  }

  // Delete a message
  async deleteMessage(
    activityId: string,
    messageId: string
  ): Promise<{ message: string }> {
    const response = await apiMethods.delete<{ message: string }>(
      `${this.baseUrl}/${activityId}/messages/${messageId}`
    );
    return response.data;
  }

  // Get message statistics
  async getMessageStats(activityId: string): Promise<MessageStats> {
    const response = await apiMethods.get<MessageStats>(
      `${this.baseUrl}/${activityId}/messages/stats`
    );
    return response.data;
  }
}

export const activityMessageService = new ActivityMessageService();
