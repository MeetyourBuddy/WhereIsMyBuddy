import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Profile } from '@/lib/validation/profile-validation';

interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (profile: Partial<Profile>) => void;
  setProfile: (profile: Profile) => void;
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
