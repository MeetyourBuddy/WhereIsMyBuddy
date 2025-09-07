import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "@/services/api/auth/auth-service";
import { SignInCredentials, SignUpData, User } from "@/types/auth-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { tokenService } from "@/services/token/token-service";
import { userService } from "@/services/api/user/user-service";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isInitialized: boolean;

  // Local state actions
  setUser: (user: User | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  setInitialized: (value: boolean) => void;
  initializeAuth: () => Promise<void>;
  clearAuthState: () => void;
  forceReinitialize: () => Promise<void>;
  verifyUserWithBackend: () => Promise<void>;
}

// Create persisted store
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      isInitialized: false,
      setUser: (user) => set({ user }),
      setIsAuthenticated: (value) => set({ isAuthenticated: value }),
      setInitialized: (value) => set({ isInitialized: value }),
      initializeAuth: async () => {
        try {
          // Wait a bit for Zustand persist to restore state
          await new Promise((resolve) => setTimeout(resolve, 100));

          // Check if we have a user in localStorage
          const currentState = get();
          const accessToken = tokenService.getAccessToken();

          // Check what's actually in localStorage
          const storedAuth = localStorage.getItem("auth-storage");

          // If Zustand persist didn't restore the user, try manual restoration
          if (!currentState.user && storedAuth) {
            try {
              const parsedAuth = JSON.parse(storedAuth);

              if (parsedAuth.state?.user && parsedAuth.state?.isAuthenticated) {
                set({
                  user: parsedAuth.state.user,
                  isAuthenticated: parsedAuth.state.isAuthenticated,
                  isInitialized: true,
                });

                return;
              }
            } catch (error) {
              console.error("❌ Failed to parse localStorage data:", error);
            }
          }

          // Check for both _id and id fields (some APIs use different field names)
          const userId = currentState.user?._id || currentState.user?.id;

          if (
            currentState.user &&
            userId &&
            currentState.isAuthenticated &&
            accessToken
          ) {
            // Token exists and user is in localStorage - mark as authenticated
            set({ isInitialized: true });
          } else {
            // Clear auth state if no valid token or user
            set({
              user: null,
              isAuthenticated: false,
              isInitialized: true,
            });
          }
        } catch (error) {
          console.error("❌ Auth initialization failed:", error);
          set({
            user: null,
            isAuthenticated: false,
            isInitialized: true,
          });
        }
      },
      clearAuthState: () => {
        localStorage.removeItem("auth-storage");
        set({
          user: null,
          isAuthenticated: false,
          isInitialized: false,
        });
      },
      forceReinitialize: async () => {
        set({ isInitialized: false });
        await new Promise((resolve) => setTimeout(resolve, 100));
        get().initializeAuth();
      },
      verifyUserWithBackend: async () => {
        try {
          const response = await userService.getMe();

          if (response.success && response.data) {
            set({
              user: response.data,
              isAuthenticated: true,
              isInitialized: true,
            });
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isInitialized: true,
            });
          }
        } catch (error) {
          console.error("❌ Backend verification error:", error);
          set({
            user: null,
            isAuthenticated: false,
            isInitialized: true,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {},
    }
  )
);

// React Query hooks for auth operations
export const useAuth = () => {
  const queryClient = useQueryClient();
  const { setUser, setIsAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: (credentials: SignInCredentials) =>
      authService.login(credentials),
    onSuccess: (response) => {
      setUser(response.data.user);
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
      setUser(response.data.user);
      setIsAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Registration successful!");
      navigate("/onboarding");
    },
    onError: (error) => {
      toast.error(error.message || "Registration failed. Please try again.");
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
    logout: logoutMutation.mutate,

    // Mutation states
    isLoading:
      loginMutation.isPending ||
      registerMutation.isPending ||
      logoutMutation.isPending,
    error:
      loginMutation.error || registerMutation.error || logoutMutation.error,

    // Store state
    user: useAuthStore((state) => state.user),
    isAuthenticated: useAuthStore((state) => state.isAuthenticated),
    isInitialized: useAuthStore((state) => state.isInitialized),
    setUser: useAuthStore((state) => state.setUser),
    setIsAuthenticated: useAuthStore((state) => state.setIsAuthenticated),
    setInitialized: useAuthStore((state) => state.setInitialized),
    initializeAuth: useAuthStore((state) => state.initializeAuth),
    clearAuthState: useAuthStore((state) => state.clearAuthState),
    forceReinitialize: useAuthStore((state) => state.forceReinitialize),
    verifyUserWithBackend: useAuthStore((state) => state.verifyUserWithBackend),
  };
};
