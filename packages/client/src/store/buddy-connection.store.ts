import { create } from "zustand";
import { BuddyConnectionService } from "@/services/api/buddy/buddy-connection.service";
import {
  UserSearchService,
  UserSearchParams,
} from "@/services/api/user/user-search.service";
import { User } from "@/types/auth-types";
import {
  BuddyConnectionResponseDto,
  BuddyStatsDto,
  MutualConnectionDto,
  ConnectionStatusResponse,
  CreateBuddyRequestDto,
  UpdateBuddyRequestDto,
} from "@/services/api/buddy/buddy-connection.service";

interface BuddyConnectionState {
  // Data
  connections: BuddyConnectionResponseDto[];
  pendingRequests: BuddyConnectionResponseDto[];
  receivedRequests: BuddyConnectionResponseDto[];
  stats: BuddyStatsDto | null;
  mutualConnections: Record<string, MutualConnectionDto[]>;
  connectionStatuses: Record<string, ConnectionStatusResponse>;

  // Search state
  searchResults: User[];
  searchQuery: string;
  searchFilters: UserSearchParams;
  searchMetadata: {
    total: number;
    hasMore: boolean;
  } | null;

  // Loading states
  isLoading: boolean;
  isLoadingPending: boolean;
  isLoadingReceived: boolean;
  isLoadingStats: boolean;
  isLoadingSearch: boolean;

  // Error state
  error: string | null;

  // Actions
  sendBuddyRequest: (data: CreateBuddyRequestDto) => Promise<void>;
  respondToBuddyRequest: (
    requestId: string,
    data: UpdateBuddyRequestDto
  ) => Promise<void>;
  fetchConnections: (status?: string) => Promise<void>;
  fetchPendingRequests: () => Promise<void>;
  fetchReceivedRequests: () => Promise<void>;
  fetchBuddyStats: () => Promise<void>;
  fetchMutualConnections: (otherUserId: string) => Promise<void>;
  checkConnectionStatus: (otherUserId: string) => Promise<void>;
  removeBuddyConnection: (connectionId: string) => Promise<void>;
  clearError: () => void;
  refreshAll: () => Promise<void>;

  // Search actions
  searchUsers: (params: UserSearchParams) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSearchFilters: (filters: Partial<UserSearchParams>) => void;
  clearSearch: () => void;
}

export const useBuddyConnectionStore = create<BuddyConnectionState>(
  (set, get) => ({
    // Initial state
    connections: [],
    pendingRequests: [],
    receivedRequests: [],
    stats: null,
    mutualConnections: {},
    connectionStatuses: {},
    searchResults: [],
    searchQuery: "",
    searchFilters: {},
    searchMetadata: null,
    isLoading: false,
    isLoadingPending: false,
    isLoadingReceived: false,
    isLoadingStats: false,
    isLoadingSearch: false,
    error: null,

    // Send buddy request
    sendBuddyRequest: async (data: CreateBuddyRequestDto) => {
      set({ isLoading: true, error: null });
      try {
        await BuddyConnectionService.sendBuddyRequest(data);
        // Refresh relevant data
        await Promise.all([
          get().fetchPendingRequests(),
          get().fetchBuddyStats(),
        ]);
      } catch (error: any) {
        set({
          error:
            error.response?.data?.message || "Failed to send buddy request",
        });
      } finally {
        set({ isLoading: false });
      }
    },

    // Respond to buddy request
    respondToBuddyRequest: async (
      requestId: string,
      data: UpdateBuddyRequestDto
    ) => {
      set({ isLoading: true, error: null });
      try {
        await BuddyConnectionService.respondToBuddyRequest(requestId, data);
        // Refresh relevant data
        await Promise.all([
          get().fetchReceivedRequests(),
          get().fetchConnections(),
          get().fetchBuddyStats(),
        ]);
      } catch (error: any) {
        set({
          error:
            error.response?.data?.message ||
            "Failed to respond to buddy request",
        });
      } finally {
        set({ isLoading: false });
      }
    },

    // Fetch connections
    fetchConnections: async (status?: string) => {
      set({ isLoading: true, error: null });
      try {
        const connections = await BuddyConnectionService.getBuddyConnections(
          status as any
        );
        set({ connections });
      } catch (error: any) {
        set({
          error: error.response?.data?.message || "Failed to fetch connections",
        });
      } finally {
        set({ isLoading: false });
      }
    },

    // Fetch pending requests
    fetchPendingRequests: async () => {
      set({ isLoadingPending: true, error: null });
      try {
        const pendingRequests =
          await BuddyConnectionService.getPendingRequests();
        set({ pendingRequests });
      } catch (error: any) {
        set({
          error:
            error.response?.data?.message || "Failed to fetch pending requests",
        });
      } finally {
        set({ isLoadingPending: false });
      }
    },

    // Fetch received requests
    fetchReceivedRequests: async () => {
      set({ isLoadingReceived: true, error: null });
      try {
        const receivedRequests =
          await BuddyConnectionService.getReceivedRequests();
        set({ receivedRequests });
      } catch (error: any) {
        set({
          error:
            error.response?.data?.message ||
            "Failed to fetch received requests",
        });
      } finally {
        set({ isLoadingReceived: false });
      }
    },

    // Fetch buddy stats
    fetchBuddyStats: async () => {
      set({ isLoadingStats: true, error: null });
      try {
        const stats = await BuddyConnectionService.getBuddyStats();
        set({ stats });
      } catch (error: any) {
        set({
          error: error.response?.data?.message || "Failed to fetch buddy stats",
        });
      } finally {
        set({ isLoadingStats: false });
      }
    },

    // Fetch mutual connections
    fetchMutualConnections: async (otherUserId: string) => {
      try {
        const mutualConnections =
          await BuddyConnectionService.getMutualConnections(otherUserId);
        set((state) => ({
          mutualConnections: {
            ...state.mutualConnections,
            [otherUserId]: mutualConnections,
          },
        }));
      } catch (error: any) {
        set({
          error:
            error.response?.data?.message ||
            "Failed to fetch mutual connections",
        });
      }
    },

    // Check connection status
    checkConnectionStatus: async (otherUserId: string) => {
      try {
        const status =
          await BuddyConnectionService.checkConnectionStatus(otherUserId);
        set((state) => ({
          connectionStatuses: {
            ...state.connectionStatuses,
            [otherUserId]: status,
          },
        }));
      } catch (error: any) {
        set({
          error:
            error.response?.data?.message ||
            "Failed to check connection status",
        });
      }
    },

    // Remove buddy connection
    removeBuddyConnection: async (connectionId: string) => {
      set({ isLoading: true, error: null });
      try {
        await BuddyConnectionService.removeBuddyConnection(connectionId);
        // Refresh relevant data
        await Promise.all([get().fetchConnections(), get().fetchBuddyStats()]);
      } catch (error: any) {
        set({
          error:
            error.response?.data?.message ||
            "Failed to remove buddy connection",
        });
      } finally {
        set({ isLoading: false });
      }
    },

    // Clear error
    clearError: () => set({ error: null }),

    // Refresh all data
    refreshAll: async () => {
      await Promise.all([
        get().fetchConnections(),
        get().fetchPendingRequests(),
        get().fetchReceivedRequests(),
        get().fetchBuddyStats(),
      ]);
    },

    // Search users
    searchUsers: async (params: UserSearchParams) => {
      set({ isLoadingSearch: true, error: null });
      try {
        const response = await UserSearchService.searchUsers(params);
        console.log("Store searchUsers response:", response);
        set({
          searchResults: response.data,
          searchMetadata: response.metadata,
          isLoadingSearch: false,
        });
      } catch (error: any) {
        console.error("Store searchUsers error:", error);
        set({
          error: error.response?.data?.message || "Failed to search users",
          isLoadingSearch: false,
        });
      }
    },

    // Set search query
    setSearchQuery: (query: string) => {
      set({ searchQuery: query });
    },

    // Set search filters
    setSearchFilters: (filters: Partial<UserSearchParams>) => {
      set((state) => ({
        searchFilters: { ...state.searchFilters, ...filters },
      }));
    },

    // Clear search
    clearSearch: () => {
      set({
        searchResults: [],
        searchQuery: "",
        searchFilters: {},
        searchMetadata: null,
      });
    },
  })
);
