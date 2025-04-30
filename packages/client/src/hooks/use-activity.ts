import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ActivityService } from "@/services/api/activity/activity-service";
import { IActivity, IActivityResult } from "@/types/activity-types";
import { toast } from "sonner";
import { useActivityStore } from "@/store/activity.store";
import { useNavigate } from "react-router-dom";
import { ApiResponse } from "@/types";
// Add this interface with your other type definitions at the top
export interface MongoDocument {
  _id?: string;
  id?: string;
}

export const activityKeys = {
  all: ["activities"] as const,
  lists: () => [...activityKeys.all, "list"] as const,
  list: (filters: string) => [...activityKeys.lists(), { filters }] as const,
  details: () => [...activityKeys.all, "detail"] as const,
  detail: (id: string) => [...activityKeys.details(), id] as const,
};

export const useActivity = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Use only UI state from store
  const {
    isUILoading,
    activeTab,
    currentActivityId,
    setUILoading,
    setActiveTab,
    setCurrentActivityId,
  } = useActivityStore();

  // Create activity mutation
  const createActivity = useMutation({
    mutationFn: async (activityData: IActivity) => {
      try {
        setUILoading(true);
        return await ActivityService.createActivity(activityData);
      } catch (error: unknown) {
        if (error instanceof Error && error.message.includes("jwt expired")) {
          navigate("/signin");
          throw new Error("Session expired. Please sign in again.");
        }
        throw error;
      } finally {
        setUILoading(false);
      }
    },
    onSuccess: (response) => {
      if (!response.success || !response.data) {
        toast.error("Failed to create activity: Invalid response");
        return;
      }

      const activity = response.data;
      const activityId = (activity as MongoDocument)._id || activity.id;

      if (!activityId) {
        console.error(
          "Activity created but no ID found in response:",
          activity
        );
        toast.error("Activity created but ID is missing");
        return;
      }

      // Store just the ID in Zustand (minimal state)
      setCurrentActivityId(activityId);

      // Update React Query cache
      queryClient.invalidateQueries({ queryKey: activityKeys.lists() });

      // Redirect to the activity detail page
      navigate(`/activities/${activityId}`);
      toast.success("Activity created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create activity");
    },
  });

  // Fetch all activities
  const activitiesQuery = useQuery<ApiResponse<IActivityResult[]>>({
    queryKey: activityKeys.lists(),
    queryFn: ActivityService.getActivities,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch single activity by ID
  const useActivityQuery = (id: string) =>
    useQuery<ApiResponse<IActivityResult>>({
      queryKey: activityKeys.detail(id),
      queryFn: () => ActivityService.getActivityById(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
      select: (response) => {
        if (response.success && response.data) {
          setCurrentActivityId(response.data.id);
        }
        return response;
      },
    });

  // Update activity mutation
  const updateActivity = useMutation<
    ApiResponse<IActivityResult>,
    Error,
    { id: string; data: Partial<IActivity> }
  >({
    mutationFn: ({ id, data }) => {
      setUILoading(true);
      return ActivityService.updateActivity(id, data);
    },
    onSuccess: (response, variables) => {
      setUILoading(false);
      if (response.success && response.data) {
        // Update React Query cache
        queryClient.invalidateQueries({
          queryKey: activityKeys.detail(variables.id),
        });
        queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
        toast.success("Activity updated successfully");
      }
    },
    onError: (error) => {
      setUILoading(false);
      toast.error(error.message || "Failed to update activity");
    },
  });

  // Delete activity mutation
  const deleteActivity = useMutation({
    mutationFn: (id: string) => {
      setUILoading(true);
      return ActivityService.deleteActivity(id);
    },
    onSuccess: (response, id) => {
      setUILoading(false);
      if (response.success) {
        // Clear current activity ID if it matches the deleted one
        if (currentActivityId === id) {
          setCurrentActivityId(null);
        }

        // Update React Query cache
        queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
        toast.success("Activity deleted successfully");

        // Navigate away from deleted activity if needed
        navigate("/activities");
      }
    },
    onError: (error: Error) => {
      setUILoading(false);
      toast.error(error.message || "Failed to delete activity");
    },
  });

  return {
    // Mutations
    createActivity: createActivity.mutate,
    updateActivity: updateActivity.mutate,
    deleteActivity: deleteActivity.mutate,

    // Queries
    getActivity: useActivityQuery,
    activities: activitiesQuery.data?.data || [],

    // Loading states from React Query
    isLoading:
      isUILoading ||
      createActivity.isPending ||
      activitiesQuery.isLoading ||
      updateActivity.isPending ||
      deleteActivity.isPending,

    // UI state from Zustand
    isUILoading,
    activeTab,
    currentActivityId,

    // UI actions
    setUILoading,
    setActiveTab,

    // Additional helpers
    refetchActivities: () =>
      queryClient.invalidateQueries({ queryKey: activityKeys.lists() }),
    clearCurrentActivity: () => setCurrentActivityId(null),

    // Exposed hook
    useActivityQuery,
  };
};
