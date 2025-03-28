import { useState } from 'react';
import { activityService } from '@/services/api/activity/activity-service';
import { CheckInType, CheckInContent } from '@/types/checkin-types';
import { toast } from '@/components/common/ui/use-toast';

export const useCheckIn = (activityId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitCheckIn = async (type: CheckInType, content: CheckInContent) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await activityService.createCheckIn(activityId, {
        type,
        content
      });

      if (response.success) {
        toast({
          title: 'Success',
          description: 'Check-in submitted successfully'
        });
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      const message = err.message || 'Failed to submit check-in';
      setError(message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCheckIns = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await activityService.getActivityCheckIns(activityId);
      return response.data;
    } catch (err) {
      const message = err.message || 'Failed to fetch check-ins';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitCheckIn,
    getCheckIns,
    isLoading,
    error
  };
};
