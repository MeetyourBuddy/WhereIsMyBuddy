import axiosInstance from "../../axios-instance";
import { ApiResponse } from "@/types";

export interface UserSettings {
  userId: string;
  dashboardLayout: string;
  activityDisplay: string;
  buddyRadius: number;
  autoAcceptBuddies: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  buddyRequestNotifications: boolean;
  activityReminderNotifications: boolean;
  milestoneNotifications: boolean;
  newsletterNotifications: boolean;
  quietHours: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  publicProfile: boolean;
  showActivity: boolean;
  showLocation: boolean;
  showInterests: boolean;
  profileVisibility: string;
  locationSharing: string;
  twoFactorAuth: boolean;
  loginNotifications: boolean;
  sessionTimeout: number;
  dataRetention: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileWithSettings {
  profile: any; // User profile data
  settings: UserSettings;
}

export interface UpdateProfileData {
  name?: string;
  bio?: string;
  phoneNumber?: string;
  avatar?: string;
  country?: string;
  city?: string;
  interestsCategories?: string[];
  interestsCommodities?: string[];
}

export interface UpdatePreferencesData {
  dashboardLayout?: string;
  activityDisplay?: string;
  buddyRadius?: number;
  autoAcceptBuddies?: boolean;
}

export interface UpdateNotificationsData {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  buddyRequestNotifications?: boolean;
  activityReminderNotifications?: boolean;
  milestoneNotifications?: boolean;
  newsletterNotifications?: boolean;
  quietHours?: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
}

export interface UpdatePrivacyData {
  publicProfile?: boolean;
  showActivity?: boolean;
  showLocation?: boolean;
  showInterests?: boolean;
  profileVisibility?: string;
  locationSharing?: string;
}

export interface UpdateAccountData {
  twoFactorAuth?: boolean;
  loginNotifications?: boolean;
  sessionTimeout?: number;
  dataRetention?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

class SettingsService {
  // Get user profile and settings
  async getProfileWithSettings(): Promise<ApiResponse<ProfileWithSettings>> {
    const response =
      await axiosInstance.get<ApiResponse<ProfileWithSettings>>(
        "/settings/profile"
      );
    return response.data;
  }

  // Update profile information
  async updateProfile(data: UpdateProfileData): Promise<ApiResponse<any>> {
    const response = await axiosInstance.put<ApiResponse<any>>(
      "/settings/profile",
      data
    );
    return response.data;
  }

  // Update preferences
  async updatePreferences(
    data: UpdatePreferencesData
  ): Promise<ApiResponse<UserSettings>> {
    const response = await axiosInstance.put<ApiResponse<UserSettings>>(
      "/settings/preferences",
      data
    );
    return response.data;
  }

  // Update notification settings
  async updateNotifications(
    data: UpdateNotificationsData
  ): Promise<ApiResponse<UserSettings>> {
    const response = await axiosInstance.put<ApiResponse<UserSettings>>(
      "/settings/notifications",
      data
    );
    return response.data;
  }

  // Update privacy settings
  async updatePrivacy(
    data: UpdatePrivacyData
  ): Promise<ApiResponse<UserSettings>> {
    const response = await axiosInstance.put<ApiResponse<UserSettings>>(
      "/settings/privacy",
      data
    );
    return response.data;
  }

  // Update account settings
  async updateAccount(
    data: UpdateAccountData
  ): Promise<ApiResponse<UserSettings>> {
    const response = await axiosInstance.put<ApiResponse<UserSettings>>(
      "/settings/account",
      data
    );
    return response.data;
  }

  // Change password
  async changePassword(
    data: ChangePasswordData
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await axiosInstance.post<ApiResponse<{ message: string }>>(
      "/settings/change-password",
      data
    );
    return response.data;
  }

  // Export user data
  async exportData(): Promise<ApiResponse<any>> {
    const response = await axiosInstance.get<ApiResponse<any>>(
      "/settings/export-data"
    );
    return response.data;
  }

  // Delete account
  async deleteAccount(): Promise<ApiResponse<{ message: string }>> {
    const response =
      await axiosInstance.delete<ApiResponse<{ message: string }>>(
        "/settings/account"
      );
    return response.data;
  }
}

export const settingsService = new SettingsService();
