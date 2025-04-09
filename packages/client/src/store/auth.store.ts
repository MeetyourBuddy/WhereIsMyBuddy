import { create } from "zustand";
import { authService } from "@/services/api/auth/auth-service";
import { SignInCredentials, SignUpData, User } from "@/types/auth-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;

  // Local state actions
  setUser: (user: User | null) => void;
  setIsAuthenticated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,

  setUser: (user) => set({ user }),
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
}));

// React Query hooks for auth operations
export const useAuth = () => {
  const queryClient = useQueryClient();
  const { setUser, setIsAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: (credentials: SignInCredentials) =>
      authService.login(credentials),
    onSuccess: (response) => {
      setUser(response.data);
      setIsAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Successfully logged in!");
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to login. Please try again.");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: SignUpData) => authService.register(userData),
    onSuccess: (response) => {
      setUser(response.data);
      setIsAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Registration successful!");
      navigate("/onboarding");
    },
    onError: (error) => {
      toast.error(error.message || "Registration failed. Please try again.");
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: (credential: string) => authService.googleLogin(credential),
    onSuccess: (response) => {
      setUser(response.data);
      setIsAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Successfully logged in with Google!");
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Google login failed. Please try again.");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      setUser(null);
      setIsAuthenticated(false);
      queryClient.clear();
      toast.success("Successfully logged out!");
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message || "Logout failed. Please try again.");
    },
  });

  return {
    // Mutations
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    googleLogin: googleLoginMutation.mutate,
    logout: logoutMutation.mutate,

    // Mutation states
    isLoading:
      loginMutation.isPending ||
      registerMutation.isPending ||
      googleLoginMutation.isPending ||
      logoutMutation.isPending,
    error:
      loginMutation.error ||
      registerMutation.error ||
      googleLoginMutation.error ||
      logoutMutation.error,

    // Store state
    user: useAuthStore((state) => state.user),
    isAuthenticated: useAuthStore((state) => state.isAuthenticated),
  };
};
