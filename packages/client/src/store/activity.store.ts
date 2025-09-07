import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { IActivity, IActivityResult } from "@/types/activity-types";
import { ActivityService } from "@/services/api/activity/activity-service";
import { ApiError, ApiResponse } from "@/types";

interface ActivityState {
  activities: IActivityResult[];
  currentActivity: IActivityResult | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  createActivity: (
    activityData: Partial<IActivity>
  ) => Promise<ApiResponse<IActivityResult>>;
  fetchActivities: () => Promise<void>;
  fetchActivityById: (id: string) => Promise<void>;
  updateActivity: (
    id: string,
    activityData: Partial<IActivity>
  ) => Promise<ApiResponse<IActivityResult>>;
  deleteActivity: (id: string) => Promise<void>;
  joinActivity: (activityId: string) => Promise<ApiResponse<IActivityResult>>;
  quitActivity: (activityId: string) => Promise<ApiResponse<IActivityResult>>;
  clearError: () => void;

  // Local state actions
  setActivities: (activities: IActivityResult[]) => void;
  setCurrentActivity: (activity: IActivityResult | null) => void;
  setError: (error: string | null) => void;

  // Utility functions
  isUserParticipant: (activity: IActivityResult, userId: string) => boolean;
}

export const useActivityStore = create<ActivityState>()(
  devtools(
    (set, get) => ({
      activities: [],
      currentActivity: null,
      isLoading: false,
      error: null,

      createActivity: async (activityData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await ActivityService.createActivity(
            activityData as IActivity
          );
          console.log("Activity creation response:", response);
          if (response.success && response.data) {
            const newActivity = response.data;

            console.log("New activity:", newActivity);

            set((state) => ({
              activities: [...state.activities, newActivity],
              currentActivity: newActivity,
            }));
            return response;
          }
          throw new Error("Invalid response format");
        } catch (error: unknown) {
          const apiError = error as ApiError;
          console.error("Activity creation error:", apiError);
          set({ error: apiError.message });
          throw apiError;
        } finally {
          set({ isLoading: false });
        }
      },

      fetchActivities: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await ActivityService.getActivities();

          console.log("Activities:", response.data);

          set({ activities: response.data });
        } catch (error: unknown) {
          const apiError = error as ApiError;
          set({ error: apiError.message || "Failed to fetch activities" });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchActivityById: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await ActivityService.getActivityById(id);

          console.log("Activity by id:", response.data);

          set({ currentActivity: response.data });
        } catch (error: unknown) {
          const apiError = error as ApiError;
          set({ error: apiError.message || "Failed to fetch activity" });
        } finally {
          set({ isLoading: false });
        }
      },

      updateActivity: async (id: string, activityData) => {
        try {
          set({ isLoading: true, error: null });
          const response = await ActivityService.updateActivity(
            id,
            activityData
          );
          set((state) => ({
            activities: state.activities.map((activity) =>
              activity.id === id ? response.data : activity
            ),
            currentActivity: response.data,
          }));
        } catch (error: unknown) {
          const apiError = error as ApiError;
          set({ error: apiError.message || "Failed to update activity" });
        } finally {
          set({ isLoading: false });
        }
      },

      deleteActivity: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          await ActivityService.deleteActivity(id);
          set((state) => ({
            activities: state.activities.filter(
              (activity) => activity.id !== id
            ),
            currentActivity: null,
          }));
        } catch (error: unknown) {
          const apiError = error as ApiError;
          set({ error: apiError.message || "Failed to delete activity" });
        } finally {
          set({ isLoading: false });
        }
      },

      joinActivity: async (activityId: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await ActivityService.joinActivity(activityId);

          if (response.data) {
            // Update the current activity with the new participant
            set((state) => ({
              currentActivity: response.data,
              activities: state.activities.map((activity) =>
                activity.id === activityId ? response.data : activity
              ),
            }));
            return response;
          }
          throw new Error("Invalid response format");
        } catch (error: unknown) {
          const apiError = error as ApiError;
          console.error("Join activity error:", apiError);
          set({ error: apiError.message });
          throw apiError;
        } finally {
          set({ isLoading: false });
        }
      },

      quitActivity: async (activityId: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await ActivityService.quitActivity(activityId);

          if (response.data) {
            // Update the current activity with the removed participant
            set((state) => ({
              currentActivity: response.data,
              activities: state.activities.map((activity) =>
                activity.id === activityId ? response.data : activity
              ),
            }));
            return response;
          }
          throw new Error("Invalid response format");
        } catch (error: unknown) {
          const apiError = error as ApiError;
          console.error("Quit activity error:", apiError);
          set({ error: apiError.message });
          throw apiError;
        } finally {
          set({ isLoading: false });
        }
      },

      clearError: () => set({ error: null }),

      setActivities: (activities) => set({ activities }),
      setCurrentActivity: (activity) => set({ currentActivity: activity }),
      setError: (error) => set({ error }),

      isUserParticipant: (activity, userId) => {
        return (
          activity.participants?.some(
            (participant) => participant._id === userId
          ) || false
        );
      },
    }),
    { name: "activity-store" }
  )
);
