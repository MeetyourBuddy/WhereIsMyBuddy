import axiosInstance from '../../axios-instance';
import { IServiceResponse } from '@/types/index';
import { IOnboarding } from '@/types/onboarding-types';
import { IUserData } from '@/types/user-types';

class OnboardingService {
  async completeOnboarding(
    userId: string,
    data: IOnboarding
  ): Promise<IServiceResponse<IUserData>> {
    const { data: responseData } = await axiosInstance.put<IUserData>(
      `/users/${userId}/onboarding`,
      data
    );
    return {
      success: true,
      data: responseData,
      message: 'Onboarding completed successfully'
    };
  }
}

export const onboardingService = new OnboardingService();
