import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { IActivity, IActivityResponse } from '@/types/activity-types';
import { IServiceResponse } from '@/types';
import { activityService } from '@/services/api/activity/activity-service';

interface ActivityState {
  activities: IActivity[];
  isLoading: boolean;
  error: string | null;
  createActivity: (activity: Omit<IActivity, 'id'>) => Promise<IServiceResponse<IActivityResponse>>;
  updateActivity: (id: string, updates: Partial<IActivity>) => void;
  deleteActivity: (id: string) => void;
  closeActivity: (id: string) => void;
  // addParticipant: (activityId: string, participantId: string) => void;
  // removeParticipant: (activityId: string, participantId: string) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useActivityStore = create<ActivityState>()(
  persist(
    (set) => ({
      activities: [],
      isLoading: false,
      error: null,
      createActivity: async (activity) => {
        const response = await activityService.createActivity(activity);
        if (response.success && response.data) {
          const activityData: IActivity = {
            id: response.data?.id,
            title: response.data?.title,
            description: response.data?.description,
            proposedDuration: response.data?.proposedDuration,
            durationUnit: response.data?.durationUnit,
            type: response.data?.type,
            maxSize: response.data?.maxSize,
            rules: response.data?.rules?.map((r) => r.rule)
          };
          set((state) => ({ activities: [...state.activities, activityData] }));
        }
        return response;
      },
      updateActivity: (id, updates) =>
        set((state) => ({
          activities: state.activities.map((activity) =>
            activity.id === id ? { ...activity, ...updates } : activity
          )
        })),
      deleteActivity: (id) =>
        set((state) => ({
          activities: state.activities.filter((activity) => activity.id !== id)
        })),
      closeActivity: (id) =>
        set((state) => ({
          activities: state.activities.map((activity) =>
            activity.id === id ? { ...activity, isOpen: false } : activity
          )
        })),
      // addParticipant: (activityId, participantId) =>
      //   set((state) => ({
      //     activities: state.activities.map((activity) =>
      //       activity.id === activityId
      //         ? {
      //             ...activity,
      //             participants: [...new Set([...activity.participants, participantId])]
      //           }
      //         : activity
      //     )
      //   })),
      // removeParticipant: (activityId, participantId) =>
      //   set((state) => ({
      //     activities: state.activities.map((activity) =>
      //       activity.id === activityId
      //         ? {
      //             ...activity,
      //             participants: activity.participants.filter((id) => id !== participantId)
      //           }
      //         : activity
      //     )
      //   })),
      setError: (error) => set({ error }),
      setLoading: (isLoading) => set({ isLoading })
    }),
    {
      name: 'activity-storage'
    }
  )
);
