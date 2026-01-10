import { create } from "zustand";
import {
  CheckInService,
  CheckInResponse,
  CheckInStats,
  CreateCheckInRequest,
} from "@/services/api/checkin/checkin-service";
import {
  CheckInCommentService,
  CheckInComment,
  CreateCheckInCommentRequest,
  UpdateCheckInCommentRequest,
} from "@/services/api/checkin/checkin-comment.service";
import { BadgeService } from "@/services/api/badge/badge-service";
import { toast } from "@/hooks/use-toast";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface CheckInState {
  // State
  checkIns: CheckInResponse[];
  stats: CheckInStats | null;
  isLoading: boolean;
  error: string | null;
  comments: Record<string, CheckInComment[]>; // checkInId -> comments

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

  // Comment actions
  createComment: (
    data: CreateCheckInCommentRequest
  ) => Promise<CheckInComment | null>;
  fetchComments: (checkInId: string) => Promise<void>;
  updateComment: (
    commentId: string,
    data: UpdateCheckInCommentRequest
  ) => Promise<CheckInComment | null>;
  deleteComment: (commentId: string) => Promise<void>;
  getComments: (checkInId: string) => CheckInComment[];
}

export const useCheckInStore = create<CheckInState>((set, get) => ({
  // Initial state
  checkIns: [],
  stats: null,
  isLoading: false,
  error: null,
  comments: {},

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
    } catch (error: unknown) {
      const errorMessage =
        (error as ApiError).response?.data?.message ||
        "Failed to create check-in";
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
    } catch (error: unknown) {
      const errorMessage =
        (error as ApiError).response?.data?.message ||
        "Failed to fetch check-ins";
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
    } catch (error: unknown) {
      const errorMessage =
        (error as ApiError).response?.data?.message ||
        "Failed to fetch user check-ins";
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
    } catch (error: unknown) {
      const errorMessage =
        (error as ApiError).response?.data?.message ||
        "Failed to fetch check-in stats";
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
    } catch (error: unknown) {
      const errorMessage =
        (error as ApiError).response?.data?.message || "Failed to toggle like";
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
    } catch (error: unknown) {
      const errorMessage =
        (error as ApiError).response?.data?.message ||
        "Failed to delete check-in";
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

  // Comment actions
  createComment: async (data: CreateCheckInCommentRequest) => {
    try {
      const response = await CheckInCommentService.createComment(data);
      if (response.success) {
        // Add comment to the store
        set((state) => ({
          comments: {
            ...state.comments,
            [data.checkInId]: [
              ...(state.comments[data.checkInId] || []),
              response.data,
            ],
          },
        }));

        toast({
          title: "Comment added! 💬",
          description: "Your comment has been posted successfully.",
          variant: "default",
        });

        return response.data;
      }
      return null;
    } catch (error: unknown) {
      const errorMessage =
        (error as ApiError).response?.data?.message ||
        "Failed to create comment";
      set({ error: errorMessage });

      toast({
        title: "Comment Failed",
        description: errorMessage,
        variant: "destructive",
      });

      return null;
    }
  },

  fetchComments: async (checkInId: string) => {
    try {
      const response =
        await CheckInCommentService.getCommentsByCheckIn(checkInId);
      if (response.success) {
        set((state) => ({
          comments: {
            ...state.comments,
            [checkInId]: response.data,
          },
        }));
      }
    } catch (error: unknown) {
      console.error("Error fetching comments:", error);
      set({
        error:
          (error as ApiError).response?.data?.message ||
          "Failed to fetch comments",
      });
    }
  },

  updateComment: async (
    commentId: string,
    data: UpdateCheckInCommentRequest
  ) => {
    try {
      const response = await CheckInCommentService.updateComment(
        commentId,
        data
      );
      if (response.success) {
        // Update comment in the store
        set((state) => {
          const newComments = { ...state.comments };
          Object.keys(newComments).forEach((checkInId) => {
            newComments[checkInId] = newComments[checkInId].map((comment) =>
              comment._id === commentId ? response.data : comment
            );
          });
          return { comments: newComments };
        });

        toast({
          title: "Comment updated! ✏️",
          description: "Your comment has been updated successfully.",
          variant: "default",
        });

        return response.data;
      }
      return null;
    } catch (error: unknown) {
      const errorMessage =
        (error as ApiError).response?.data?.message ||
        "Failed to update comment";
      set({ error: errorMessage });

      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      });

      return null;
    }
  },

  deleteComment: async (commentId: string) => {
    try {
      await CheckInCommentService.deleteComment(commentId);

      // Remove comment from the store
      set((state) => {
        const newComments = { ...state.comments };
        Object.keys(newComments).forEach((checkInId) => {
          newComments[checkInId] = newComments[checkInId].filter(
            (comment) => comment._id !== commentId
          );
        });
        return { comments: newComments };
      });

      toast({
        title: "Comment deleted! 🗑️",
        description: "Your comment has been deleted successfully.",
        variant: "default",
      });
    } catch (error: unknown) {
      const errorMessage =
        (error as ApiError).response?.data?.message ||
        "Failed to delete comment";
      set({ error: errorMessage });

      toast({
        title: "Delete Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  },

  getComments: (checkInId: string) => {
    const { comments } = get();
    return comments[checkInId] || [];
  },
}));
