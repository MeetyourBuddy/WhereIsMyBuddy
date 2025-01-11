import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IUserData } from '@/types/user-types';

interface ProfileState {
  profile: IUserData | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (profile: Partial<IUserData>) => void;
  setProfile: (profile: IUserData) => void;
  clearProfile: () => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,
      isLoading: false,
      error: null,
      updateProfile: (updates) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : null
        })),
      setProfile: (profile) => set({ profile }),
      clearProfile: () => set({ profile: null }),
      setError: (error) => set({ error }),
      setLoading: (isLoading) => set({ isLoading })
    }),
    {
      name: 'profile-storage'
    }
  )
);
