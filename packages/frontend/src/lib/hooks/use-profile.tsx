import { useProfileStore } from '@/providers/store';
import { userService } from '@/services/api/user/user-service';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from '@/lib/hooks/use-toast';
import { IUserData } from '@/types/user-types';

export function useProfile() {
  const queryClient = useQueryClient();
  const { profile, setProfile, setLoading, setError } = useProfileStore();

  const { isLoading: isProfileLoading } = useQuery(
    'profile',
    async () => {
      const response = await userService.getMe();

      if (response.success) {
        const userData = response?.data?.data as IUserData;
        setProfile(userData);
        return userData;
      }
      throw new Error('Failed to fetch profile');
    },
    {
      onError: (error: any) => {
        setError(error?.message || 'Failed to fetch profile');
      }
    }
  );

  const updateProfileMutation = useMutation<
    IUserData,
    Error,
    { id: string; updates: Partial<IUserData> }
  >(
    async ({ id, updates }) => {
      const response = await userService.updateUser(id, updates);
      if (!response.success) {
        throw new Error(response.message);
      }
      return response?.data?.data as IUserData;
    },
    {
      onSuccess: (data) => {
        setProfile(data);
        queryClient.invalidateQueries('profile');
      },
      onError: (error) => {
        setError(error.message);
        toast({
          title: 'Error',
          description: error.message || 'Failed to update profile',
          variant: 'destructive'
        });
      },
      onMutate: () => {
        setLoading(true);
      },
      onSettled: () => {
        setLoading(false);
      }
    }
  );

  return {
    profile,
    isLoading: isProfileLoading || updateProfileMutation.isLoading,
    updateProfile: updateProfileMutation.mutate,
    refetchProfile: () => queryClient.invalidateQueries('profile')
  };
}
