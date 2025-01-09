import { useMutation, useQueryClient } from 'react-query';
import { useAuthContext } from '@/providers/contexts/auth-context';
import { authService } from '@/services/api/auth/auth-service';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/lib/hooks/use-toast';
import { tokenService } from '@/services/token/token-service';

export function useAuth() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthContext();
  const navigate = useNavigate();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (userData) => {
      console.log('userData here', userData);
      setUser(userData.data.data.data.user);
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
      console.log(error);
      toast({
        title: 'Authentication!',
        description: 'Login failed'
      });
    }
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (userData) => {
      setUser(userData?.data?.data?.data?.user);
      toast({
        title: 'Authentication!',
        description: 'User registration successful!'
      });
      queryClient.invalidateQueries('user');
      navigate('/onboarding');
    },
    onError: (error: any) => {
      console.log(error);
      toast({
        title: 'Authentication!',
        description: 'User registration failed'
      });
    }
  });

  // Updated Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear all auth-related state
      setUser(null);
      queryClient.clear(); // Clear all queries
      tokenService.clearTokens();

      toast({
        title: 'Authentication',
        description: 'Logged out successfully!'
      });

      // Use React Router navigation
      navigate('/signin');
    },
    onError: (error) => {
      console.error('Logout error:', error);

      // Force logout even if API fails
      setUser(null);
      queryClient.clear();
      tokenService.clearTokens();

      toast({
        title: 'Authentication Error',
        description: 'Logout failed, but you have been logged out locally.',
        variant: 'destructive'
      });

      navigate('/signin');
    }
  });

  const logout = () => {
    logoutMutation.mutate();
  };

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoading: loginMutation.isLoading || logoutMutation.isLoading
  };
}
