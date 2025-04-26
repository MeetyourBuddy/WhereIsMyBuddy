import axiosInstance from '@/services/axios-instance';
import { IActivity, IActivityResponse, IActivityListResponse } from '@/types/activity-types';
import { ApiResponse } from '@/types';
import { authService } from '../auth/auth-service';
import axios from 'axios';

class ActivityService {
  async createActivity(activityData: IActivity): Promise<IActivityResponse> {
    // try {
      // // First ensure we have valid tokens
      // await authService.refreshTokenIfNeeded();
      console.log('Creating activity with data:', activityData);
      const response = await axiosInstance.post<IActivityResponse>(
        '/activities',
        activityData
      );
      
      // Log the response to see what we're getting back
      console.log('Activity creation response:', response.data);
      
      return response.data;
    // } catch (error) {
    //   if (error.message.includes('jwt expired')) {
    //     window.location.href = '/signin';
    //   }
    //   throw error;
    // }
  }

  async getActivities(): Promise<IActivityListResponse> {
    const response = await axiosInstance.get<IActivityListResponse>('/activities');
    return response.data;
  }

  async getActivityById(id: string): Promise<IActivityResponse> {
    if (!id) {
      console.error('Attempted to fetch activity with undefined ID');
      throw new Error('Activity ID is required');
    }
    
    try {
      const response = await axiosInstance.get<IActivityResponse>(`/activities/${id}`);
      console.log('Raw activity response:', response.data);
      
      if (!response.data.success || !response.data.data?.activity) {
        throw new Error('Invalid activity response format');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching activity:', error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error('Activity not found');
      }
      throw new Error('Failed to fetch activity');
    }
  }

  async updateActivity(id: string, activityData: Partial<IActivity>): Promise<ApiResponse<IActivityResponse>> {
    const response = await axiosInstance.put<ApiResponse<IActivityResponse>>(
      `/activities/${id}`,
      activityData
    );
    return response.data;
  }

  async deleteActivity(id: string): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/activities/${id}`);
    return response.data;
  }
}

export const activityService = new ActivityService();
