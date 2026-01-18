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
  skipOnboarding: () => Promise<void>;
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

  skipOnboarding: async () => {
    try {
      set({ isLoading: true, error: null });

      // Collect whatever partial data exists in localStorage
      const userBasicInfo = localStorage.getItem("userBasicInfo");
      const userInterests = localStorage.getItem("userInterests");
      const userCategories = localStorage.getItem("userCategories");

      // Build partial onboarding data with defaults for missing fields
      const partialData: Partial<onboarding> = {};

      // Add basic info if available
      if (userBasicInfo) {
        try {
          const basicInfo = JSON.parse(userBasicInfo);
          if (basicInfo.country) partialData.country = basicInfo.country;
          if (basicInfo.city) partialData.city = basicInfo.city;
          if (basicInfo.dateOfBirth) {
            // Convert dateOfBirth to ISO string
            let dateOfBirthString: string;
            if (basicInfo.dateOfBirth instanceof Date) {
              dateOfBirthString = basicInfo.dateOfBirth.toISOString();
            } else if (typeof basicInfo.dateOfBirth === 'string') {
              const date = new Date(basicInfo.dateOfBirth);
              if (!isNaN(date.getTime())) {
                dateOfBirthString = date.toISOString();
              } else {
                dateOfBirthString = basicInfo.dateOfBirth;
              }
            } else {
              dateOfBirthString = new Date(basicInfo.dateOfBirth).toISOString();
            }
            partialData.dateOfBirth = dateOfBirthString;
          }
        } catch (e) {
          console.error("Error parsing userBasicInfo:", e);
        }
      }

      // Add interests if available
      if (userInterests) {
        try {
          partialData.interestsCommodities = JSON.parse(userInterests);
        } catch (e) {
          console.error("Error parsing userInterests:", e);
        }
      }

      if (userCategories) {
        try {
          partialData.interestsCategories = JSON.parse(userCategories);
        } catch (e) {
          console.error("Error parsing userCategories:", e);
        }
      }

      // Set defaults for required fields that might be missing
      const skipData: onboarding = {
        interestsCategories: partialData.interestsCategories || [],
        interestsCommodities: partialData.interestsCommodities || [],
        country: partialData.country || "",
        city: partialData.city || "",
        dateOfBirth: partialData.dateOfBirth || new Date().toISOString(), // Default to today if not provided
        avatar: partialData.avatar || "", // Empty string if not provided
        bio: partialData.bio || "",
      };

      // Send to backend - this will set hasCompletedOnboarding to true
      const response = await onboardingService.completeOnboarding(skipData);

      if (response.success) {
        set({
          user: response.data,
          isLoading: false,
        });

        useAuthStore.getState().setUser(response.data);

        // Clear localStorage onboarding data
        localStorage.removeItem("userBasicInfo");
        localStorage.removeItem("userInterests");
        localStorage.removeItem("userCategories");
        localStorage.removeItem("userTimezone");
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
            : "Failed to skip onboarding",
        isLoading: false,
      });
    }
  },
}));
