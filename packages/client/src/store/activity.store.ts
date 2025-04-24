import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { IActivity, IActivityResult, IActivityResponse } from '@/types/activity-types';
import { activityService } from '@/services/api/activity/activity-service';
import { useAuthStore } from './auth.store';
import axiosInstance from '@/services/axios-instance';
import axios from 'axios';

type ApiError = Error & {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
};

interface ActivityState {
  activities: IActivityResult[];
  currentActivity: IActivityResult | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  createActivity: (activityData: Partial<IActivity>) => Promise<{
    success: boolean;
    message: string;
    data: {
      activity: IActivityResult;
    };
  }>;
  fetchActivities: () => Promise<void>;
  fetchActivityById: (id: string) => Promise<void>;
  updateActivity: (id: string, activityData: Partial<IActivity>) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
  clearError: () => void;

  // Local state actions
  setActivities: (activities: IActivityResult[]) => void;
  setCurrentActivity: (activity: IActivityResult | null) => void;
  setError: (error: string | null) => void;
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
          const response = await activityService.createActivity(activityData as IActivity);
          console.log('Activity creation response:', response);
          if (response.success && response.data?.activity) {
            const newActivity = response.data.activity;
            set((state) => ({
              activities: [...state.activities, newActivity],
              currentActivity: newActivity,
            }));
            return response;
          }
          throw new Error('Invalid response format');
        } catch (error: unknown) {
          const apiError = error as ApiError;
          console.error('Activity creation error:', apiError);
          set({ error: apiError.message });
          throw apiError;
        } finally {
          set({ isLoading: false });
        }
      },

      fetchActivities: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await activityService.getActivities();
          set({ activities: response.data.activities });
        } catch (error: unknown) {
          const apiError = error as ApiError;
          set({ error: apiError.message || 'Failed to fetch activities' });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchActivityById: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          const response = await activityService.getActivityById(id);
          set({ currentActivity: response.data.activity });
        } catch (error: unknown) {
          const apiError = error as ApiError;
          set({ error: apiError.message || 'Failed to fetch activity' });
        } finally {
          set({ isLoading: false });
        }
      },

      updateActivity: async (id: string, activityData) => {
        try {
          set({ isLoading: true, error: null });
          const response = await activityService.updateActivity(id, activityData);
          set((state) => ({
            activities: state.activities.map((activity) =>
              activity.id === id ? response.data.data.activity : activity
            ),
            currentActivity: response.data.data.activity,
          }));
        } catch (error: unknown) {
          const apiError = error as ApiError;
          set({ error: apiError.message || 'Failed to update activity' });
        } finally {
          set({ isLoading: false });
        }
      },

      deleteActivity: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          await activityService.deleteActivity(id);
          set((state) => ({
            activities: state.activities.filter((activity) => activity.id !== id),
            currentActivity: null,
          }));
        } catch (error: unknown) {
          const apiError = error as ApiError;
          set({ error: apiError.message || 'Failed to delete activity' });
        } finally {
          set({ isLoading: false });
        }
      },

      clearError: () => set({ error: null }),

      setActivities: (activities) => set({ activities }),
      setCurrentActivity: (activity) => set({ currentActivity: activity }),
      setError: (error) => set({ error }),
    }),
    { name: 'activity-store' }
  )
); 