import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActivityStore } from "@/store/activity.store";
import { useCheckInStore } from "@/store/checkin.store";
import { ActivityService } from "@/services/api/activity/activity-service";
import { CheckInService } from "@/services/api/activity/reaction.service";
import { IActivityResult, IActivity } from "@/types/activity-types";
import { useAuth } from "@/store/auth.store";
import { useToast } from "@/hooks/use-toast";

// Query keys for consistent caching
export const activityQueryKeys = {
  all: ["activities"] as const,
  lists: () => [...activityQueryKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...activityQueryKeys.lists(), { filters }] as const,
  details: () => [...activityQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...activityQueryKeys.details(), id] as const,
  stats: (id: string) => [...activityQueryKeys.detail(id), "stats"] as const,
  progress: (id: string) =>
    [...activityQueryKeys.detail(id), "progress"] as const,
  weekly: (id: string) => [...activityQueryKeys.detail(id), "weekly"] as const,
  participants: (id: string) =>
    [...activityQueryKeys.detail(id), "participants"] as const,
};

/**
 * Unified hook for managing activity data across the application
 * Provides consistent data fetching, caching, and updates
 */
export const useActivityData = (activityId?: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();

  // Get activity store methods for local state management
  const { activities, currentActivity, setCurrentActivity, setActivities } =
    useActivityStore();

  // Get check-in store methods
  const { refreshActivityData } = useCheckInStore();

  // Query for all activities
  const activitiesQuery = useQuery({
    queryKey: activityQueryKeys.lists(),
    queryFn: async () => {
      const response = await ActivityService.getActivities();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Query for specific activity details
  const activityQuery = useQuery({
    queryKey: activityQueryKeys.detail(activityId!),
    queryFn: async () => {
      if (!activityId) throw new Error("Activity ID is required");
      const response = await ActivityService.getActivityById(activityId);
      return response.data;
    },
    enabled: !!activityId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query for activity statistics
  const statsQuery = useQuery({
    queryKey: activityQueryKeys.stats(activityId!),
    queryFn: async () => {
      if (!activityId) throw new Error("Activity ID is required");
      const response = await CheckInService.getActivityStatistics(activityId);
      return response.data;
    },
    enabled: !!activityId,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 3 * 60 * 1000, // 3 minutes
  });

  // Query for user progress in activity
  const progressQuery = useQuery({
    queryKey: activityQueryKeys.progress(activityId!),
    queryFn: async () => {
      if (!activityId || !user?._id)
        throw new Error("Activity ID and user ID are required");
      const response = await CheckInService.getUserProgressForActivities([
        activityId,
      ]);
      return response.data[activityId] || null;
    },
    enabled: !!activityId && !!user?._id,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
  });

  // Query for weekly activity data
  const weeklyQuery = useQuery({
    queryKey: activityQueryKeys.weekly(activityId!),
    queryFn: async () => {
      if (!activityId) throw new Error("Activity ID is required");
      const response = await CheckInService.getWeeklyActivity(activityId);
      return response.data;
    },
    enabled: !!activityId,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 3 * 60 * 1000, // 3 minutes
  });

  // Query for participant history
  const participantsQuery = useQuery({
    queryKey: activityQueryKeys.participants(activityId!),
    queryFn: async () => {
      if (!activityId) throw new Error("Activity ID is required");
      const response = await CheckInService.getParticipantHistory(activityId);
      return response.data;
    },
    enabled: !!activityId,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 3 * 60 * 1000, // 3 minutes
  });

  // Mutations for activity operations
  const createActivityMutation = useMutation({
    mutationFn: (activityData: IActivity) =>
      ActivityService.createActivity(activityData),
    onSuccess: (response) => {
      // Invalidate and refetch activities list
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.lists() });

      // Update local store
      if (response.data) {
        setCurrentActivity(response.data);
        setActivities([...activities, response.data]);
      }

      toast({
        title: "Activity Created! 🎉",
        description: "Your activity has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create activity",
        variant: "destructive",
      });
    },
  });

  const updateActivityMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IActivity> }) =>
      ActivityService.updateActivity(id, data),
    onSuccess: (response, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: activityQueryKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.lists() });

      // Update local store
      if (response.data) {
        setCurrentActivity(response.data);
        setActivities(
          activities.map((activity) =>
            activity._id === variables.id || activity.id === variables.id
              ? response.data
              : activity
          )
        );
      }

      toast({
        title: "Activity Updated! ✏️",
        description: "Your activity has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update activity",
        variant: "destructive",
      });
    },
  });

  const joinActivityMutation = useMutation({
    mutationFn: (activityId: string) =>
      ActivityService.joinActivity(activityId),
    onSuccess: (response, activityId) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: activityQueryKeys.detail(activityId),
      });
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: activityQueryKeys.participants(activityId),
      });

      // Update local store
      if (response.data) {
        setCurrentActivity(response.data);
        setActivities(
          activities.map((activity) =>
            activity._id === activityId || activity.id === activityId
              ? response.data
              : activity
          )
        );
      }

      toast({
        title: "Joined Activity! 🎉",
        description: "You have successfully joined the activity.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Join Failed",
        description: error.message || "Failed to join activity",
        variant: "destructive",
      });
    },
  });

  const quitActivityMutation = useMutation({
    mutationFn: (activityId: string) =>
      ActivityService.quitActivity(activityId),
    onSuccess: (response, activityId) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: activityQueryKeys.detail(activityId),
      });
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: activityQueryKeys.participants(activityId),
      });

      // Update local store
      if (response.data) {
        setCurrentActivity(response.data);
        setActivities(
          activities.map((activity) =>
            activity._id === activityId || activity.id === activityId
              ? response.data
              : activity
          )
        );
      }

      toast({
        title: "Left Activity",
        description: "You have successfully left the activity.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Leave Failed",
        description: error.message || "Failed to leave activity",
        variant: "destructive",
      });
    },
  });

  // Utility function to refresh all data for an activity
  const refreshActivity = async (id: string) => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.detail(id) }),
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.stats(id) }),
      queryClient.invalidateQueries({
        queryKey: activityQueryKeys.progress(id),
      }),
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.weekly(id) }),
      queryClient.invalidateQueries({
        queryKey: activityQueryKeys.participants(id),
      }),
      refreshActivityData(id), // Also refresh check-in store data
    ]);
  };

  // Utility function to get unified activity data
  const getUnifiedActivityData = (id: string) => {
    const activity = activityQuery.data;
    const stats = statsQuery.data;
    const progress = progressQuery.data;
    const weekly = weeklyQuery.data;
    const participants = participantsQuery.data;

    return {
      activity,
      stats,
      progress,
      weekly,
      participants,
      isLoading:
        activityQuery.isLoading ||
        statsQuery.isLoading ||
        progressQuery.isLoading,
      error: activityQuery.error || statsQuery.error || progressQuery.error,
    };
  };

  return {
    // Queries
    activitiesQuery,
    activityQuery,
    statsQuery,
    progressQuery,
    weeklyQuery,
    participantsQuery,

    // Mutations
    createActivityMutation,
    updateActivityMutation,
    joinActivityMutation,
    quitActivityMutation,

    // Utility functions
    refreshActivity,
    getUnifiedActivityData,

    // Computed values
    activities: activitiesQuery.data || activities,
    currentActivity: activityQuery.data || currentActivity,
    isLoading: activitiesQuery.isLoading,
    error: activitiesQuery.error,
  };
};

/**
 * Hook for managing user progress across multiple activities
 */
export const useUserProgress = (activityIds: string[]) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const progressQuery = useQuery({
    queryKey: ["user-progress", user?._id, activityIds],
    queryFn: async () => {
      if (!user?._id || activityIds.length === 0) return {};
      const response =
        await CheckInService.getUserProgressForActivities(activityIds);
      return response.data;
    },
    enabled: !!user?._id && activityIds.length > 0,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
  });

  const refreshProgress = () => {
    queryClient.invalidateQueries({
      queryKey: ["user-progress", user?._id, activityIds],
    });
  };

  return {
    progressData: progressQuery.data || {},
    isLoading: progressQuery.isLoading,
    error: progressQuery.error,
    refreshProgress,
  };
};
