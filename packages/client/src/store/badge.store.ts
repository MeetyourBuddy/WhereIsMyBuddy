import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  Badge,
  UserBadge,
  BadgeService,
} from "@/services/api/badge/badge-service";
import { ApiError } from "@/types";

interface BadgeState {
  badges: Badge[];
  userBadges: UserBadge[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchBadges: () => Promise<void>;
  fetchUserBadges: (activityId?: string) => Promise<void>;
  seedDefaultBadges: () => Promise<void>;
  clearError: () => void;

  // Local state actions
  setBadges: (badges: Badge[]) => void;
  setUserBadges: (userBadges: UserBadge[]) => void;
  setError: (error: string | null) => void;
}

export const useBadgeStore = create<BadgeState>()(
  devtools(
    (set, get) => ({
      badges: [],
      userBadges: [],
      isLoading: false,
      error: null,

      fetchBadges: async () => {
        try {
          set({ isLoading: true, error: null });
          const badges = await BadgeService.getAllBadges();
          set({ badges, isLoading: false });
        } catch (error: unknown) {
          const apiError = error as ApiError;
          set({
            error: apiError.message || "Failed to fetch badges",
            isLoading: false,
          });
        }
      },

      fetchUserBadges: async (activityId?: string) => {
        try {
          set({ isLoading: true, error: null });
          const userBadges = await BadgeService.getUserBadges(activityId);
          set({ userBadges, isLoading: false });
        } catch (error: unknown) {
          const apiError = error as ApiError;
          set({
            error: apiError.message || "Failed to fetch user badges",
            isLoading: false,
          });
        }
      },

      seedDefaultBadges: async () => {
        try {
          set({ isLoading: true, error: null });
          await BadgeService.seedDefaultBadges();
          // Refresh badges after seeding
          await get().fetchBadges();
          set({ isLoading: false });
        } catch (error: unknown) {
          const apiError = error as ApiError;
          set({
            error: apiError.message || "Failed to seed badges",
            isLoading: false,
          });
        }
      },

      clearError: () => set({ error: null }),

      // Local state actions
      setBadges: (badges: Badge[]) => set({ badges }),
      setUserBadges: (userBadges: UserBadge[]) => set({ userBadges }),
      setError: (error: string | null) => set({ error }),
    }),
    {
      name: "badge-store",
    }
  )
);
