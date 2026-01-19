import axiosInstance from "./axios-instance";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export interface BoostMessage {
  _id: string;
  senderId: {
    _id: string;
    name: string;
    avatar?: string;
  };
  recipientId: string;
  messageId: string;
  activityId?: string;
  timestamp: string;
  read: boolean;
}

export interface BoostStats {
  _id: string;
  userId: string;
  totalSent: number;
  totalReceived: number;
  currentStreak: number;
  longestStreak: number;
  dailyLimit: number;
  dailyUsed: number;
  lastResetDate: string;
}

export interface BoostBadge {
  _id: string;
  userId: string;
  badgeId: string;
  badgeName: string;
  earnedDate: string;
  isVisible: boolean;
}

export interface SendBoostRequest {
  recipientId: string;
  messageId: string;
  activityId?: string;
}

export interface BoostResponse {
  boosts: BoostMessage[];
  total: number;
  page: number;
  totalPages: number;
}

export interface BoostLeaderboard {
  topSenders: Array<{
    userId: string;
    totalSent: number;
    name: string;
    avatar?: string;
  }>;
  topReceivers: Array<{
    userId: string;
    totalReceived: number;
    name: string;
    avatar?: string;
  }>;
}

class BoostService {
  async sendBoost(data: SendBoostRequest): Promise<BoostMessage> {
    const response = await axiosInstance.post(`${API_BASE_URL}/boost/send`, data);
    return response.data.data || response.data;
  }

  async sendBoostBatch(
    data: SendBoostRequest[]
  ): Promise<{
    successful: number;
    failed: number;
    boosts: BoostMessage[];
    errors: Array<{ messageId: string; error: string }>;
  }> {
    const response = await axiosInstance.post(`${API_BASE_URL}/boost/send-batch`, { boosts: data });
    return response.data.data || response.data;
  }

  async getReceivedBoosts(
    page: number = 1,
    limit: number = 10
  ): Promise<BoostResponse> {
    const response = await axiosInstance.get(
      `${API_BASE_URL}/boost/received?page=${page}&limit=${limit}`
    );
    // Handle wrapped response from TransformInterceptor
    const data = response.data?.data || response.data;
    return {
      boosts: data?.boosts || [],
      total: data?.total || 0,
      page: data?.page || page,
      totalPages: data?.totalPages || 0,
    };
  }

  async getSentBoosts(
    page: number = 1,
    limit: number = 10
  ): Promise<BoostResponse> {
    const response = await axiosInstance.get(
      `${API_BASE_URL}/boost/sent?page=${page}&limit=${limit}`
    );
    // Handle wrapped response from TransformInterceptor
    const data = response.data?.data || response.data;
    return {
      boosts: data?.boosts || [],
      total: data?.total || 0,
      page: data?.page || page,
      totalPages: data?.totalPages || 0,
    };
  }

  async getBoostStats(): Promise<BoostStats> {
    const response = await axiosInstance.get(`${API_BASE_URL}/boost/stats`);
    // Handle both wrapped and direct responses
    const data = response.data?.data || response.data;
    
    // Ensure numeric values are properly converted (handle NaN cases)
    const dailyLimit = Number(data?.dailyLimit);
    const dailyUsed = Number(data?.dailyUsed);
    const totalSent = Number(data?.totalSent);
    const totalReceived = Number(data?.totalReceived);
    const currentStreak = Number(data?.currentStreak);
    const longestStreak = Number(data?.longestStreak);
    
    return {
      _id: data?._id || '',
      userId: data?.userId || '',
      dailyLimit: isNaN(dailyLimit) ? 3 : dailyLimit,
      dailyUsed: isNaN(dailyUsed) ? 0 : dailyUsed,
      totalSent: isNaN(totalSent) ? 0 : totalSent,
      totalReceived: isNaN(totalReceived) ? 0 : totalReceived,
      currentStreak: isNaN(currentStreak) ? 0 : currentStreak,
      longestStreak: isNaN(longestStreak) ? 0 : longestStreak,
      lastResetDate: data?.lastResetDate || new Date().toISOString(),
    };
  }

  async getBoostBadges(): Promise<BoostBadge[]> {
    const response = await axiosInstance.get(`${API_BASE_URL}/boost/badges`);
    return response.data;
  }

  async getBoostLeaderboard(limit: number = 10): Promise<BoostLeaderboard> {
    const response = await axiosInstance.get(
      `${API_BASE_URL}/boost/leaderboard?limit=${limit}`
    );
    return response.data;
  }

  async markBoostAsRead(boostId: string): Promise<void> {
    await axiosInstance.post(
      `${API_BASE_URL}/boost/mark-read/${boostId}`,
      {}
    );
  }
}

export const boostService = new BoostService();
