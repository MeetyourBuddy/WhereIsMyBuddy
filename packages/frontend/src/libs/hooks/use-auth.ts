import { useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { useAuthContext } from '@/providers/contexts/auth-context';
import { authService } from '@/services/api/auth/auth-service';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthContext();
  const navigate = useNavigate();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (userData) => {
      setUser(userData.data.user);
      toast.success('Login successful!');
      queryClient.invalidateQueries('user');
      navigate('/onboarding');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Login failed');
    }
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (userData) => {
      setUser(userData?.data?.user);
      toast.success('User registration successful!');
      queryClient.invalidateQueries('user');
      navigate('/onboarding');
    },
    onError: (error: any) => {
      toast.error(error.message || 'User registration failed');
    }
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      setUser(null);
      toast.success('Logged out successfully');
      queryClient.invalidateQueries('user');
      navigate('/signin');
    },
    onError: () => {
      toast.error('Logout failed');
    }
  });

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoading: loginMutation.isLoading || logoutMutation.isLoading
  };
}
