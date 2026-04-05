import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "@/services/api/auth/auth-service";
import { SignInCredentials, SignUpData, User } from "@/types/auth-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
          console.log("🚀 Starting auth initialization...");

          // Wait a bit for Zustand persist to restore state
          await new Promise((resolve) => setTimeout(resolve, 100));

          const currentState = get();
          const accessToken = tokenService.getAccessToken();
          const storedAuth = localStorage.getItem("auth-storage");

          console.log("🔍 Auth initialization state:", {
            hasAccessToken: !!accessToken,
            hasStoredAuth: !!storedAuth,
            currentUser: currentState.user,
            isAuthenticated: currentState.isAuthenticated,
          });

          // If we have a token but no user, try to fetch user from backend
          if (accessToken && !currentState.user) {
            console.log(
              "🔧 Token found but no user - fetching from backend..."
            );
            try {
              const response = await userService.getMe();
              if (response.success && response.data) {
                console.log("✅ User fetched from backend:", response.data);

                // Fix field name mismatch: backend returns 'id', frontend expects '_id'
                const userData = response.data;
                if (userData.id && !userData._id) {
                  userData._id = userData.id;
                  console.log(
                    "🔧 Fixed user ID field in backend fetch:",
                    userData._id
                  );
                }

                set({
                  user: userData,
                  isAuthenticated: true,
                  isInitialized: true,
                });
                return;
              }
            } catch (error) {
              console.error("❌ Failed to fetch user from backend:", error);
            }
          }

          // If Zustand persist didn't restore the user, try manual restoration
          if (!currentState.user && storedAuth) {
            try {
              const parsedAuth = JSON.parse(storedAuth);
              console.log("🔍 Parsed auth data:", parsedAuth);

              if (parsedAuth.state?.user && parsedAuth.state?.isAuthenticated) {
                console.log("✅ Restoring user from localStorage");
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
            console.log("✅ Valid auth state found - marking as initialized");
            set({ isInitialized: true });
          } else {
            console.log("❌ No valid auth state - clearing");
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
            // Fix field name mismatch: backend returns 'id', frontend expects '_id'
            const userData = response.data;
            if (userData.id && !userData._id) {
              userData._id = userData.id;
              console.log(
                "🔧 Fixed user ID field in verification:",
                userData._id
              );
            }

            set({
              user: userData,
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
      console.log("🔐 Login successful:", response);
      console.log("🔐 User data:", response.data.user);
      console.log("🔐 Tokens:", response.data.tokens);

      // Fix field name mismatch: backend returns 'id', frontend expects '_id'
      const userData = response.data.user;
      if (userData.id && !userData._id) {
        userData._id = userData.id;
        console.log("🔧 Fixed user ID field:", userData._id);
      }

      // Set user and auth state
      setUser(userData);
      setIsAuthenticated(true);

      // Verify tokens were set
      const accessToken = tokenService.getAccessToken();
      console.log(
        "🔐 Access token after login:",
        accessToken ? "Found" : "Not found"
      );

      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Successfully logged in!");
      // Post-auth redirect support (e.g., join activity after login)
      const returnTo = localStorage.getItem("returnToAfterAuth");
      if (returnTo) {
        localStorage.removeItem("returnToAfterAuth");
        navigate(returnTo);
        return;
      }

      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("❌ Login failed:", error);
      toast.error(error.message || "Failed to login. Please try again.");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: SignUpData) => authService.register(userData),
    onSuccess: (response) => {
      // Fix field name mismatch: backend returns 'id', frontend expects '_id'
      const userData = response.data.user;
      if (userData.id && !userData._id) {
        userData._id = userData.id;
      }

      setUser(userData);
      setIsAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Registration successful!");
      // Keep returnToAfterAuth set; onboarding will resolve post-auth intents after completion.
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
