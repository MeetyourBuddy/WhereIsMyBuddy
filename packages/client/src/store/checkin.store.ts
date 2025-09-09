import { create } from "zustand";
import {
  CheckInService,
  CheckInResponse,
  CheckInStats,
  CreateCheckInRequest,
} from "@/services/api/checkin/checkin-service";
import { BadgeService } from "@/services/api/badge/badge-service";
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
  hasCheckedInToday: (activityId: string, userId?: string) => boolean;
  refreshActivityData: (activityId: string) => Promise<void>;
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

      // Refresh stats to get updated streak and progress data
      const { fetchCheckInStats } = get();
      await fetchCheckInStats(data.activityId);

      // Note: Badge checking is handled by the backend automatically
      // The frontend will refresh badges when the component re-renders

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
      console.log("🔄 Fetching check-ins for activity:", activityId);
      const checkIns = await CheckInService.getCheckInsByActivity(activityId);
      console.log("✅ Check-ins fetched:", checkIns.length, "items");
      set({ checkIns, isLoading: false });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch check-ins";
      console.error("❌ Failed to fetch check-ins:", errorMessage);
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
      console.log("🔄 Fetching check-in stats for activity:", activityId);
      const stats = await CheckInService.getCheckInStats(activityId);
      console.log("✅ Check-in stats fetched:", stats);
      set({ stats, isLoading: false });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch check-in stats";
      console.error("❌ Failed to fetch check-in stats:", errorMessage);
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

  // Helper function to check if user has checked in today
  hasCheckedInToday: (activityId: string, userId?: string): boolean => {
    const state = get();
    if (!userId) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return state.checkIns.some((checkIn) => {
      const checkInDate = new Date(checkIn.checkInDate);
      return (
        checkIn.activity === activityId &&
        checkIn.user._id === userId &&
        checkInDate >= today &&
        checkInDate < tomorrow
      );
    });
  },

  // Refresh all data for an activity (check-ins and stats)
  refreshActivityData: async (activityId: string) => {
    console.log("🔄 Refreshing all data for activity:", activityId);
    const { fetchCheckInsByActivity, fetchCheckInStats } = get();

    // Fetch both check-ins and stats in parallel
    await Promise.all([
      fetchCheckInsByActivity(activityId),
      fetchCheckInStats(activityId),
    ]);

    console.log("✅ Activity data refreshed successfully");
  },
}));
