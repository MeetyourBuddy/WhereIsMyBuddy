import { useMutation, useQueryClient } from 'react-query';
import { useAuthContext } from '@/providers/contexts/auth-context';
import { authService } from '@/services/api/auth/auth-service';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/lib/hooks/use-toast';

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
      navigate('/onboarding');
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

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      setUser(null);
      toast({
        title: 'Authentication!',
        description: 'Logged out successfully!'
      });
      queryClient.invalidateQueries('user');
      navigate('/signin');
    },
    onError: () => {
      toast({
        title: 'Authentication!',
        description: 'Logout failed'
      });
    }
  });

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoading: loginMutation.isLoading || logoutMutation.isLoading
  };
}
