import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { activityService } from "@/services/api/activity/activity-service";
import {
  IActivity,
  IActivityResponse,
  IActivityListResponse,
  ApiResponse,
  IActivityResult,
} from "@/types/activity-types";
import { toast } from "sonner";
import { useActivityStore } from "@/store/activity.store";
import { useNavigate } from "react-router-dom";

// Add this interface with your other type definitions at the top
interface MongoDocument {
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
  const { setActivities, setCurrentActivity, setError } = useActivityStore();
  const navigate = useNavigate();

  const createActivity = useMutation({
    mutationFn: async (activityData: IActivity) => {
      try {
        return await activityService.createActivity(activityData);
      } catch (error: unknown) {
        if (error instanceof Error && error.message.includes("jwt expired")) {
          navigate("/signin");
          throw new Error("Session expired. Please sign in again.");
        }
        throw error;
      }
    },
    onSuccess: (response) => {
      if (!response.success || !response.data?.activity) {
        toast.error("Failed to create activity: Invalid response");
        return;
      }

      const activity = response.data.activity;
      const activityId = (activity as MongoDocument)._id || activity.id;

      if (!activityId) {
        console.error(
          "Activity created but no ID found in response:",
          activity
        );
        toast.error("Activity created but ID is missing");
        return;
      }

      // Normalize the activity object with consistent ID
      const normalizedActivity = {
        ...activity,
        id: activityId,
      };

      // Update application state
      setCurrentActivity(normalizedActivity);
      queryClient.invalidateQueries({ queryKey: activityKeys.lists() });

      // Redirect to the activity detail page
      navigate(`/activities/${activityId}`);
      toast.success("Activity created successfully");
    },
    onError: (error: Error) => {
      setError(error.message);
      toast.error(error.message || "Failed to create activity");
    },
  });

  const activitiesQuery = useQuery<IActivityListResponse>({
    queryKey: activityKeys.lists(),
    queryFn: async () => {
      const response = await activityService.getActivities();
      if (response.success && response.data?.activities) {
        setActivities(response.data.activities);
      }
      return response;
    },
  });

  const getActivityQuery = (id: string) =>
    useQuery<IActivityResponse>({
      queryKey: activityKeys.detail(id),
      queryFn: async () => {
        // Add validation to prevent undefined ID
        if (!id) {
          console.error("Attempted to fetch activity with undefined ID");
          throw new Error("Activity ID is required");
        }

        const response = await activityService.getActivityById(id);
        console.log('Full activity response:', response);
        return response;
      },
      enabled: !!id
    });
  };

  const updateActivityMutation = useMutation<
    ApiResponse<IActivityResponse>,
    Error,
    { id: string; data: Partial<IActivity> }
  >({
    mutationFn: ({ id, data }) => activityService.updateActivity(id, data),
    onSuccess: (response, variables) => {
      if (response.success && response.data?.data?.activity) {
        setCurrentActivity(response.data.data.activity);
        queryClient.invalidateQueries({
          queryKey: activityKeys.detail(variables.id),
        });
        queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
        toast.success("Activity updated successfully");
      }
    },
    onError: (error) => {
      setError(error.message);
      toast.error(error.message || "Failed to update activity");
    },
  });

  const deleteActivityMutation = useMutation({
    mutationFn: (id: string) => activityService.deleteActivity(id),
    onSuccess: (response) => {
      if (response.success) {
        setCurrentActivity(null);
        queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
        toast.success("Activity deleted successfully");
      }
    },
    onError: (error: Error) => {
      setError(error.message);
      toast.error(error.message || "Failed to delete activity");
    },
  });

  return {
    // Mutations
    createActivity: createActivity.mutate,
    updateActivity: updateActivityMutation.mutate,
    deleteActivity: deleteActivityMutation.mutate,

    // Queries
    getActivity,
    activities: activitiesQuery.data?.data?.activities || [],

    // Loading states
    isLoading:
      createActivity.isPending ||
      activitiesQuery.isLoading ||
      updateActivityMutation.isPending ||
      deleteActivityMutation.isPending,

    // Store state
    currentActivity: useActivityStore((state) => state.currentActivity),
    error: useActivityStore((state) => state.error),
    clearError: useActivityStore((state) => state.clearError),
  };
};
