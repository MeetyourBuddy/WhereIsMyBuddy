import axiosInstance from "../../axios-instance";
import { onboarding } from "@/types/onboarding-types";
import { UserData } from "@/types/user-types";
import { ApiResponse } from "@/types";

class OnboardingService {
  // complete onboarding
  async completeOnboarding(
    userId: string,
    data: onboarding
  ): Promise<ApiResponse<UserData>> {
    const response = await axiosInstance.put<ApiResponse<UserData>>(
      `/users/${userId}/onboarding`,
      data
    );

    return response.data;
  }
}

export const onboardingService = new OnboardingService();
