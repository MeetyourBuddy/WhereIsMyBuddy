import axiosInstance from "../../axios-instance";
import { onboarding } from "@/types/onboarding-types";
import { User } from "@/types/auth-types";
import { ApiResponse } from "@/types";

class OnboardingService {
  // complete onboarding
  async completeOnboarding(data: onboarding): Promise<ApiResponse<User>> {
    const response = await axiosInstance.put<ApiResponse<User>>(
      `/users/onboarding`,
      data
    );

    return response.data;
  }
}

export const onboardingService = new OnboardingService();
