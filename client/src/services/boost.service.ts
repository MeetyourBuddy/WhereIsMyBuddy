import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

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
  private getAuthHeaders() {
    const token = localStorage.getItem("accessToken");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  async sendBoost(data: SendBoostRequest): Promise<BoostMessage> {
    const response = await axios.post(`${API_BASE_URL}/boost/send`, data, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getReceivedBoosts(
    page: number = 1,
    limit: number = 10
  ): Promise<BoostResponse> {
    const response = await axios.get(
      `${API_BASE_URL}/boost/received?page=${page}&limit=${limit}`,
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  async getSentBoosts(
    page: number = 1,
    limit: number = 10
  ): Promise<BoostResponse> {
    const response = await axios.get(
      `${API_BASE_URL}/boost/sent?page=${page}&limit=${limit}`,
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  async getBoostStats(): Promise<BoostStats> {
    const response = await axios.get(`${API_BASE_URL}/boost/stats`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getBoostBadges(): Promise<BoostBadge[]> {
    const response = await axios.get(`${API_BASE_URL}/boost/badges`, {
      headers: this.getAuthHeaders(),
    });
    return response.data;
  }

  async getBoostLeaderboard(limit: number = 10): Promise<BoostLeaderboard> {
    const response = await axios.get(
      `${API_BASE_URL}/boost/leaderboard?limit=${limit}`,
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  async markBoostAsRead(boostId: string): Promise<void> {
    await axios.post(
      `${API_BASE_URL}/boost/mark-read/${boostId}`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }
}

export const boostService = new BoostService();
