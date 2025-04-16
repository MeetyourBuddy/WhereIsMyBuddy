import { create } from "zustand";
import { onboarding } from "@/types/onboarding-types";
import { User } from "@/types/auth-types";
import { onboardingService } from "@/services/api/onboarding/onboarding-service";
import { useAuthStore } from "./auth.store";

interface OnboardingState {
  isLoading: boolean;
  error: string | null;
  user: User | null;
  completeOnboarding: (data: onboarding) => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  isLoading: false,
  error: null,
  user: null,

  completeOnboarding: async (data: onboarding) => {
    try {
      set({ isLoading: true, error: null });

      console.log("data to complete onboarding", data);

      const response = await onboardingService.completeOnboarding(data);

      if (response.success) {
        set({
          user: response.data,
          isLoading: false,
        });

        useAuthStore.getState().setUser(response.data);
      } else {
        set({
          error: response.message,
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to complete onboarding",
        isLoading: false,
      });
    }
  },
}));
