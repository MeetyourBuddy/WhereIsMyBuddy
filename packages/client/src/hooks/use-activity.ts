import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { activityService } from '@/services/api/activity/activity-service';
import { IActivity, IActivityResponse, IActivityListResponse, ApiResponse, IActivityResult } from '@/types/activity-types';
import { toast } from 'sonner';
import { useActivityStore } from '@/store/activity.store';
import { useNavigate } from 'react-router-dom';

export const activityKeys = {
  all: ['activities'] as const,
  lists: () => [...activityKeys.all, 'list'] as const,
  list: (filters: string) => [...activityKeys.lists(), { filters }] as const,
  details: () => [...activityKeys.all, 'detail'] as const,
  detail: (id: string) => [...activityKeys.details(), id] as const,
};

export const useActivity = () => {
  const queryClient = useQueryClient();
  const { setActivities, setCurrentActivity, setError } = useActivityStore();
  const navigate = useNavigate();

  const createActivity = useMutation({
    mutationFn: async (activityData: IActivity) => {
      try {
        const response = await activityService.createActivity(activityData);
        return response;
      } catch (error: any) {
        if (error.response?.status === 401) {
          // Redirect to login
          window.location.href = '/signin';
          throw new Error('Session expired. Please sign in again.');
        }
        throw error;
      }
    },
    onSuccess: (response) => {
      // Check if the response contains the activity data
      if (response.success && response.data?.activity) {
        const activity = response.data.activity;
        
        interface MongoDocument {
          _id?: string;
          id?: string;
        }
        
        const activityId = (activity as MongoDocument)._id || activity.id;
        
        if (!activityId) {
          console.error('Activity created but no ID found in response:', activity);
          toast.error('Activity created but ID is missing');
          return;
        }
        
        // Set the ID properly - MongoDB uses _id
        const activityWithId = {
          ...activity,
          id: activityId
        };
        
        // Set the current activity in the store
        setCurrentActivity(activityWithId);
        
        // Invalidate queries to refresh the activities list
        queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
        
        // Add navigation to view the created activity
        navigate(`/activities/${activityId}`);
        
        toast.success('Activity created successfully');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create activity');
    }
  });

  const activitiesQuery = useQuery<IActivityListResponse>({
    queryKey: activityKeys.lists(),
    queryFn: async () => {
      const response = await activityService.getActivities();
      if (response.success && response.data?.activities) {
        setActivities(response.data.activities);
      }
      return response;
    }
  });

  const useActivityQuery = (id: string) => 
    useQuery<IActivityResponse>({
      queryKey: activityKeys.detail(id),
      queryFn: async () => {
        if (!id) {
          console.error('Attempted to fetch activity with undefined ID');
          throw new Error('Activity ID is required');
        }
        
        try {
          const response = await activityService.getActivityById(id);
          console.log('Full activity response:', JSON.stringify(response, null, 2)); // Detailed logging
          
          if (!response.success || !response.data?.activity) {
            throw new Error('Invalid activity response format');
          }
          
          // Log the activity object
          console.log('Activity data:', JSON.stringify(response.data.activity, null, 2));
          
          // Ensure all required fields are present
          const activity = response.data.activity;
          
          // Transform MongoDB _id to id first
          const activityWithId = {
            ...activity,
            id: activity._id // Use MongoDB's _id as our id
          };
          
          if (!activityWithId.title) {
            console.error('Missing title in activity:', activity);
            throw new Error('Activity data is missing title');
          }
          
          setCurrentActivity(activityWithId);
          return {
            ...response,
            data: {
              activity: activityWithId
            }
          };
        } catch (error) {
          console.error('Error fetching activity:', error);
          throw error;
        }
      },
      enabled: !!id,
    });

  const updateActivityMutation = useMutation<
    ApiResponse<IActivityResponse>,
    Error,
    { id: string; data: Partial<IActivity> }
  >({
    mutationFn: ({ id, data }) => activityService.updateActivity(id, data),
    onSuccess: (response, variables) => {
      if (response.success && response.data?.data?.activity) {
        setCurrentActivity(response.data.data.activity);
        queryClient.invalidateQueries({ queryKey: activityKeys.detail(variables.id) });
        queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
        toast.success('Activity updated successfully');
      }
    },
    onError: (error) => {
      setError(error.message);
      toast.error(error.message || 'Failed to update activity');
    },
  });

  const deleteActivityMutation = useMutation({
    mutationFn: (id: string) => activityService.deleteActivity(id),
    onSuccess: (response) => {
      if (response.success) {
        setCurrentActivity(null);
        queryClient.invalidateQueries({ queryKey: activityKeys.lists() });
        toast.success('Activity deleted successfully');
      }
    },
    onError: (error: Error) => {
      setError(error.message);
      toast.error(error.message || 'Failed to delete activity');
    },
  });

  return {
    // Mutations
    createActivity: createActivity.mutate,
    updateActivity: updateActivityMutation.mutate,
    deleteActivity: deleteActivityMutation.mutate,

    // Queries
    getActivity: useActivityQuery,
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