import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Activity } from '@/lib/validation/activity-validation';

interface ActivityState {
  activities: Activity[];
  isLoading: boolean;
  error: string | null;
  createActivity: (activity: Omit<Activity, 'id'>) => void;
  updateActivity: (id: string, updates: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  closeActivity: (id: string) => void;
  addMember: (activityId: string, memberId: string) => void;
  removeMember: (activityId: string, memberId: string) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useActivityStore = create<ActivityState>()(
  persist(
    (set) => ({
      activities: [],
      isLoading: false,
      error: null,
      createActivity: (activity) =>
        set((state) => ({
          activities: [...state.activities, { ...activity, id: crypto.randomUUID() }]
        })),
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
      addMember: (activityId, memberId) =>
        set((state) => ({
          activities: state.activities.map((activity) =>
            activity.id === activityId
              ? {
                  ...activity,
                  members: [...new Set([...activity.members, memberId])]
                }
              : activity
          )
        })),
      removeMember: (activityId, memberId) =>
        set((state) => ({
          activities: state.activities.map((activity) =>
            activity.id === activityId
              ? {
                  ...activity,
                  members: activity.members.filter((id) => id !== memberId)
                }
              : activity
          )
        })),
      setError: (error) => set({ error }),
      setLoading: (isLoading) => set({ isLoading })
    }),
    {
      name: 'activity-storage'
    }
  )
);
