import axiosInstance from '../axios-instance';
import { AxiosResponse } from 'axios';
import { IUser } from '@/types/auth-types';
import { IOnboarding } from '@/types/onboarding-types';

class OnboardingService {
  async completeOnboarding(data: IOnboarding): Promise<AxiosResponse<IUser>> {
    const response = await axiosInstance.put<IUser>('/onboarding', data);
    return response;
  }
}

export const onboardingService = new OnboardingService();
