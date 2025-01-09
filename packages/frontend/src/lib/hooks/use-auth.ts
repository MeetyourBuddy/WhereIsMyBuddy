import { useMutation, useQueryClient } from 'react-query';
import { useAuthContext } from '@/providers/contexts/auth-context';
import { authService } from '@/services/api/auth/auth-service';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/lib/hooks/use-toast';
import { tokenService } from '@/services/token/token-service';
import { useProfileStore } from '@/providers/store';
import { IUserData } from '@/types/user-types';

export function useAuth() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthContext();
  const navigate = useNavigate();

  // Get profile store actions
  const { setProfile, clearProfile, setLoading, setError } = useProfileStore();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (userData) => {
      const user = userData?.data?.user;

      // Update both auth context and profile store
      setUser(user);
      setProfile(user as IUserData);

      toast({
        title: 'Authentication!',
        description: 'Login successful!'
      });

      queryClient.invalidateQueries('user');
      const user = userData.data.data.data.user;
      if (user.hasCompletedOnboarding) {
        navigate('/');
      } else {
        navigate('/onboarding');
      }
    },
    onError: (error: any) => {
      console.error(error);
      setError(error?.message || 'Login failed');
      toast({
        title: 'Authentication!',
        description: 'Login failed'
      });
    },
    onMutate: () => {
      setLoading(true);
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (userData) => {
      const user = userData?.data?.user;

      // Update both auth context and profile store
      setUser(user);
      setProfile(user as IUserData);

      toast({
        title: 'Authentication!',
        description: 'User registration successful!'
      });

      queryClient.invalidateQueries('user');
      navigate('/onboarding');
    },
    onError: (error: any) => {
      console.error(error);
      setError(error?.message || 'Registration failed');
      toast({
        title: 'Authentication!',
        description: 'User registration failed'
      });
    },
    onMutate: () => {
      setLoading(true);
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  // Updated Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear all auth-related state
      setUser(null);
      clearProfile();
      queryClient.clear();
      tokenService.clearTokens();

      toast({
        title: 'Authentication',
        description: 'Logged out successfully!'
      });

      navigate('/signin');
    },
    onError: (error) => {
      console.error('Logout error:', error);

      // Force logout even if API fails
      setUser(null);
      clearProfile();
      queryClient.clear();
      tokenService.clearTokens();

      toast({
        title: 'Authentication Error',
        description: 'Logout failed, but you have been logged out locally.',
        variant: 'destructive'
      });

      navigate('/signin');
    },
    onMutate: () => {
      setLoading(true);
    },
    onSettled: () => {
      setLoading(false);
    }
  });

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoading: loginMutation.isLoading || registerMutation.isLoading || logoutMutation.isLoading
  };
}
