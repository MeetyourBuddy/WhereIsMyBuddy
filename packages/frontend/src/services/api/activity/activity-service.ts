import axiosInstance from '../../axios-instance';
import { IActivity, IActivityResponse } from '@/types/activity-types';
import { IServiceResponse } from '@/types';

class ActivityService {
  async createActivity(data: IActivity): Promise<IServiceResponse<IActivityResponse>> {
    const { data: responseData } = await axiosInstance.post<IActivityResponse>(
      '/activities/create',
      data
    );
    return {
      success: true,
      data: responseData,
      message: 'Activity created successfully'
    };
  }

  async getActivity(id: string): Promise<IServiceResponse<IActivityResponse>> {
    const { data: responseData } = await axiosInstance.get<IActivityResponse>(`/activities/${id}`);
    return {
      success: true,
      data: responseData,
      message: 'Activity fetched successfully'
    };
  }

  async updateActivity(id: string, data: IActivity): Promise<IServiceResponse<IActivityResponse>> {
    const { data: responseData } = await axiosInstance.put<IActivityResponse>(
      `/activities/${id}/update`,
      data
    );
    return {
      success: true,
      data: responseData,
      message: 'Activity updated successfully'
    };
  }

  async addParticipant(
    id: string,
    participantId: string
  ): Promise<IServiceResponse<IActivityResponse>> {
    const { data: responseData } = await axiosInstance.post<IActivityResponse>(
      `/activities/${id}/participants`,
      { participantId }
    );
    return {
      success: true,
      data: responseData,
      message: 'Participant added successfully'
    };
  }

  async removeParticipant(
    id: string,
    participantId: string
  ): Promise<IServiceResponse<IActivityResponse>> {
    const { data: responseData } = await axiosInstance.delete<IActivityResponse>(
      `/activities/${id}/participants/${participantId}`
    );
    return {
      success: true,
      data: responseData,
      message: 'Participant removed successfully'
    };
  }

  async deleteActivity(id: string): Promise<IServiceResponse<IActivityResponse>> {
    const { data: responseData } = await axiosInstance.delete<IActivityResponse>(
      `/activities/${id}`
    );
    return {
      success: true,
      data: responseData,
      message: 'Activity deleted successfully'
    };
  }

  async createCheckIn(activityId: string, checkInData: any): Promise<IServiceResponse<any>> {
    const { data: responseData } = await axiosInstance.post(
      `/activities/${activityId}/checkin`,
      checkInData
    );
    return {
      success: true,
      data: responseData,
      message: 'Check-in created successfully'
    };
  }

  async getActivityCheckIns(activityId: string): Promise<IServiceResponse<any>> {
    const { data: responseData } = await axiosInstance.get(`/activities/${activityId}/checkins`);
    return {
      success: true,
      data: responseData,
      message: 'Check-ins fetched successfully'
    };
  }
}

export const activityService = new ActivityService();
