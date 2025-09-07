import { create } from "zustand";
import {
  CheckInService,
  CheckInResponse,
  CheckInStats,
  CreateCheckInRequest,
} from "@/services/api/checkin/checkin-service";
import { toast } from "@/hooks/use-toast";

interface CheckInState {
  // State
  checkIns: CheckInResponse[];
  stats: CheckInStats | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  createCheckIn: (
    data: CreateCheckInRequest
  ) => Promise<CheckInResponse | null>;
  fetchCheckInsByActivity: (activityId: string) => Promise<void>;
  fetchCheckInsByUser: (activityId?: string) => Promise<void>;
  fetchCheckInStats: (activityId: string) => Promise<void>;
  toggleLike: (checkInId: string) => Promise<void>;
  deleteCheckIn: (checkInId: string) => Promise<void>;
  clearCheckIns: () => void;
  setError: (error: string | null) => void;
}

export const useCheckInStore = create<CheckInState>((set, get) => ({
  // Initial state
  checkIns: [],
  stats: null,
  isLoading: false,
  error: null,

  // Create a new check-in
  createCheckIn: async (data: CreateCheckInRequest) => {
    set({ isLoading: true, error: null });

    try {
      const newCheckIn = await CheckInService.createCheckIn(data);

      // Add to the beginning of the list
      set((state) => ({
        checkIns: [newCheckIn, ...state.checkIns],
        isLoading: false,
      }));

      toast({
        title: "Check-in Complete! 🎉",
        description: "Your progress has been shared with your buddy community!",
        variant: "default",
      });

      return newCheckIn;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create check-in";
      set({ error: errorMessage, isLoading: false });

      toast({
        title: "Check-in Failed",
        description: errorMessage,
        variant: "destructive",
      });

      return null;
    }
  },

  // Fetch check-ins for a specific activity
  fetchCheckInsByActivity: async (activityId: string) => {
    set({ isLoading: true, error: null });

    try {
      const checkIns = await CheckInService.getCheckInsByActivity(activityId);
      set({ checkIns, isLoading: false });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch check-ins";
      set({ error: errorMessage, isLoading: false });
    }
  },

  // Fetch check-ins for the current user
  fetchCheckInsByUser: async (activityId?: string) => {
    set({ isLoading: true, error: null });

    try {
      const checkIns = await CheckInService.getCheckInsByUser(activityId);
      set({ checkIns, isLoading: false });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch user check-ins";
      set({ error: errorMessage, isLoading: false });
    }
  },

  // Fetch check-in statistics
  fetchCheckInStats: async (activityId: string) => {
    set({ isLoading: true, error: null });

    try {
      const stats = await CheckInService.getCheckInStats(activityId);
      set({ stats, isLoading: false });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch check-in stats";
      set({ error: errorMessage, isLoading: false });
    }
  },

  // Toggle like on a check-in
  toggleLike: async (checkInId: string) => {
    try {
      const updatedCheckIn = await CheckInService.toggleLike(checkInId);

      // Update the check-in in the list
      set((state) => ({
        checkIns: state.checkIns.map((checkIn) =>
          checkIn._id === checkInId ? updatedCheckIn : checkIn
        ),
      }));

      const action = updatedCheckIn.hasUserLiked ? "liked" : "unliked";
      toast({
        title: `Check-in ${action}!`,
        description: updatedCheckIn.hasUserLiked
          ? "You liked this check-in!"
          : "You unliked this check-in.",
        variant: "default",
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to toggle like";
      set({ error: errorMessage });

      toast({
        title: "Action Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  },

  // Delete a check-in
  deleteCheckIn: async (checkInId: string) => {
    try {
      await CheckInService.deleteCheckIn(checkInId);

      // Remove from the list
      set((state) => ({
        checkIns: state.checkIns.filter((checkIn) => checkIn._id !== checkInId),
      }));

      toast({
        title: "Check-in Deleted",
        description: "Your check-in has been removed.",
        variant: "default",
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete check-in";
      set({ error: errorMessage });

      toast({
        title: "Delete Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  },

  // Clear check-ins
  clearCheckIns: () => {
    set({ checkIns: [], stats: null, error: null });
  },

  // Set error
  setError: (error: string | null) => {
    set({ error });
  },
}));
