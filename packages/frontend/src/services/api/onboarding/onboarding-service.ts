import axiosInstance from '../axios-instance';
import { IServiceResponse } from '@/types/index';
import { IUser } from '@/types/auth-types';
import { IOnboarding } from '@/types/onboarding-types';

class OnboardingService {
  async completeOnboarding(userId: string, data: IOnboarding): Promise<IServiceResponse<IUser>> {
    const { data: responseData } = await axiosInstance.put<IUser>(`/${userId}/onboarding`, data);
    return {
      success: true,
      data: responseData,
      message: 'Onboarding completed successfully'
    };
  }
}

export const onboardingService = new OnboardingService();
