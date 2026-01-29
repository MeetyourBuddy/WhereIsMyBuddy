import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "@/components/ui/layout/Container";
import { Card } from "@/components/common/Card";
import Button from "@/components/common/Button";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Pagination from "@/components/ui/pagination";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  MapPin,
  UserPlus,
  SortAsc,
  X,
  Users,
  Star,
  MessageCircle,
  Flame,
  Heart,
  CalendarDays,
  Clock,
  User as UserIcon,
  Check,
  UserCheck,
  Sparkles,
  Activity,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EnhancedBuddyCard from "@/components/buddies/EnhancedBuddyCard";
import { useBuddyConnectionStore } from "@/store/buddy-connection.store";
import { useAuth } from "@/store/auth.store";
import { AuthWall } from "@/components/auth/AuthWall";
import { Users as UsersIcon } from "lucide-react";
import { UserSearchParams } from "@/services/api/user/user-search.service";
import { User } from "@/types/auth-types";
import { useScrollToTopImmediate } from "@/hooks/use-scroll-to-top";
import { BuddyConnectionService } from "@/services/api/buddy/buddy-connection.service";
import { ActivityService } from "@/services/api/activity/activity-service";

// Type for buddy data from backend
type BuddyUser = User;

// Debounce utility
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const Buddies = () => {
  useScrollToTopImmediate();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const {
    searchResults = [],
    searchQuery = "",
    searchFilters = {},
    isLoadingSearch = false,
    searchMetadata = null,
    searchUsers,
    setSearchQuery,
    setSearchFilters,
    clearSearch,
  } = useBuddyConnectionStore();

  const [activeFilters, setActiveFilters] = useState<string[]>(["All"]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // 5x4 grid
  // Get initial tab from URL parameter, default to "all"
  const getInitialTab = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("tab") || "all";
  };
  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [myBuddies, setMyBuddies] = useState<any[]>([]);
  const [isLoadingMyBuddies, setIsLoadingMyBuddies] = useState(false);
  const [buddyActivityStats, setBuddyActivityStats] = useState<Record<string, { active: number; completed: number }>>({});

  // Update tab when URL parameter changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl && ["all", "my", "recommended", "active", "nearby"].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [location.search]);

  // For guest users, we'll show the page structure but empty content
  const [showFilters, setShowFilters] = useState(true);
  const [sortOption, setSortOption] = useState<string>("default");

  // Sort options for buddies
  const sortOptions = [
    { value: "default", label: "Default" },
    { value: "active", label: "Most Active" },
    { value: "recent", label: "Recently Joined" },
    { value: "matches", label: "Most Matches" },
    { value: "a-z", label: "A-Z" },
    { value: "z-a", label: "Z-A" },
  ];

  // Fetch my buddies when on "my" tab
  useEffect(() => {
    const fetchMyBuddies = async () => {
      if (!isAuthenticated || !user?._id || activeTab !== "my") {
        setMyBuddies([]);
        return;
      }

      try {
        setIsLoadingMyBuddies(true);
        const connections = await BuddyConnectionService.getBuddyConnections("accepted");
        
        // Transform connections to get the buddy user
        const buddyUsers = connections.map((connection) => {
          const isRequester = connection.requester.id === user._id;
          const buddy = isRequester ? connection.recipient : connection.requester;
          
          return {
            ...buddy,
            _id: buddy.id,
            id: buddy.id,
            connectionId: connection.id,
            connectionStatus: "accepted",
          };
        });
        
        setMyBuddies(buddyUsers);
      } catch (error) {
        console.error("Failed to fetch my buddies:", error);
        setMyBuddies([]);
      } finally {
        setIsLoadingMyBuddies(false);
      }
    };

    fetchMyBuddies();
  }, [isAuthenticated, user?._id, activeTab]);

  // Fetch activity stats for all buddies (for Most Active tab)
  useEffect(() => {
    const fetchAllBuddyActivityStats = async () => {
      if (activeTab !== "active" || !isAuthenticated || searchResults.length === 0) {
        return;
      }

      try {
        const statsMap: Record<string, { active: number; completed: number }> = {};
        
        // Fetch all activities
        const activitiesResponse = await ActivityService.getActivities();
        const allActivities = activitiesResponse.data || [];
        
        const now = new Date();
        
        // Calculate stats for each buddy
        for (const buddy of searchResults) {
          const buddyId = buddy._id || buddy.id;
          if (!buddyId) continue;
          
          let activeCount = 0;
          let completedCount = 0;
          
          allActivities.forEach((activity: any) => {
            const isParticipant = activity.participants?.some(
              (p: any) => (p._id || p.id || p) === buddyId
            );
            
            if (isParticipant) {
              const endDate = activity.endDate ? new Date(activity.endDate) : null;
              if (endDate && endDate < now) {
                completedCount++;
              } else {
                activeCount++;
              }
            }
          });
          
          statsMap[buddyId] = { active: activeCount, completed: completedCount };
        }
        
        setBuddyActivityStats(statsMap);
      } catch (error) {
        console.error("Failed to fetch buddy activity stats:", error);
      }
    };

    fetchAllBuddyActivityStats();
  }, [activeTab, searchResults, isAuthenticated]);

  // Load initial data on component mount based on active tab
  useEffect(() => {
    const loadInitialData = async () => {
      if (!isAuthenticated) return;
      
      try {
        if (searchUsers) {
          switch (activeTab) {
            case "all":
              await searchUsers({
                limit: itemsPerPage,
                offset: 0,
              });
              break;
            case "recommended":
              // Load all users, filtering will be done in filteredBuddies
              await searchUsers({
                limit: 100, // Get more users for better matching
                offset: 0,
              });
              break;
            case "active":
              // Load all users, sorting will be done by activity stats
              await searchUsers({
                limit: 100, // Get more users for better stats
                offset: 0,
              });
              break;
            case "nearby":
              // Load users by location
              if (user?.country || user?.city) {
                await searchUsers({
                  country: user?.country ? user.country.toString() : undefined,
                  city: user?.city ? user.city.toString() : undefined,
                  limit: itemsPerPage,
                  offset: 0,
                });
              } else {
                await searchUsers({
                  limit: itemsPerPage,
                  offset: 0,
                });
              }
              break;
            case "my":
              // My buddies are loaded via separate useEffect
              break;
          }
        }
      } catch (error) {
        console.error("Initial data load error:", error);
      }
    };

    loadInitialData();
  }, [isAuthenticated, activeTab]); // Only reload when tab changes

  // Handle search input with debouncing
  const handleSearch = useCallback(
    debounce(async (query: string, filters: UserSearchParams) => {
      try {
        if (searchUsers) {
          const searchParams: UserSearchParams = {
            search: query.trim() || undefined,
            ...filters,
            limit: itemsPerPage,
            offset: 0,
          };
          await searchUsers(searchParams);
        }
      } catch (error) {
        console.error("Search error:", error);
      }
    }, 500),
    [searchUsers, itemsPerPage]
  );

  const handleSearchInputChange = (value: string) => {
    try {
      if (setSearchQuery) {
        setSearchQuery(value);
      }
      if (value.trim()) {
        handleSearch(value, searchFilters);
      } else {
        if (clearSearch) {
          clearSearch();
        }
      }
    } catch (error) {
      console.error("Search input error:", error);
      // Fallback to clearing search on error
      if (clearSearch) {
        clearSearch();
      }
    }
  };

  // Interest categories for filtering
  const interestCategories = [
    "All",
    "Fitness",
    "Coding",
    "Reading",
    "Art",
    "Music",
    "Photography",
    "Hiking",
    "Cooking",
    "Languages",
    "Gaming",
    "Travel",
    "Writing",
    "Dancing",
    "Meditation",
    "Nutrition",
  ];

  // Use real search results from backend with tab-specific filtering
  const filteredBuddies = useMemo(() => {
    try {
      // For "My Buddies" tab, return the fetched connections
      if (activeTab === "my") {
        return myBuddies;
      }

      // For other tabs, filter search results
      if (searchResults.length === 0) {
        return [];
      }

      // Filter out current user for all tabs
      let filtered = searchResults.filter((buddy) => {
        // Exclude current user
        if (buddy._id === user?._id || buddy.id === user?._id) {
          return false;
        }

        // Apply tab-specific filtering
        switch (activeTab) {
          case "recommended":
            // For "Recommended", match based on interestsCommodities
            if (
              user?.interestsCommodities &&
              user.interestsCommodities.length > 0
            ) {
              const userInterests = new Set(
                user.interestsCommodities.map((i) => i.toString().toLowerCase())
              );
              const buddyInterests = buddy.interestsCommodities || [];
              
              // Check if there's at least one matching interest
              return buddyInterests.some((interest) =>
                userInterests.has(interest.toString().toLowerCase())
              );
            }
            return false; // Show no recommendations if user has no interests

          case "active":
            // For "Most Active", show all users who completed onboarding (will be sorted by activity stats)
            return buddy.hasCompletedOnboarding === true;

          case "nearby":
            // For "Nearby", show users from same country AND city (if both available)
            if (user?.country && user?.city) {
              return (
                buddy.country &&
                buddy.city &&
                buddy.country.toString().toLowerCase() === user.country.toString().toLowerCase() &&
                buddy.city.toString().toLowerCase() === user.city.toString().toLowerCase()
              );
            } else if (user?.country) {
              // If only country is available, match by country
              return (
                buddy.country &&
                buddy.country.toString().toLowerCase() === user.country.toString().toLowerCase()
              );
            }
            return false; // Show no nearby users if no location data

          case "all":
          default:
            // For "All Buddies", show all users
            return true;
        }
      });

      // Apply interest filters if any are selected (for All Buddies tab)
      if (activeTab === "all" && activeFilters.length > 0 && !activeFilters.includes("All")) {
        filtered = filtered.filter((buddy) => {
          const matchesInterest =
            buddy.interestsCategories &&
            buddy.interestsCategories.some((interest) =>
              activeFilters.includes(interest.toString())
            );
          return matchesInterest;
        });
      }

      // Apply sorting based on tab and sortOption
      switch (activeTab) {
        case "active":
          // Sort by total activity stats (active + completed)
          filtered.sort((a, b) => {
            const aId = a._id || a.id;
            const bId = b._id || b.id;
            const aStats = buddyActivityStats[aId] || { active: 0, completed: 0 };
            const bStats = buddyActivityStats[bId] || { active: 0, completed: 0 };
            const aTotal = aStats.active + aStats.completed;
            const bTotal = bStats.active + bStats.completed;
            return bTotal - aTotal; // Sort descending
          });
          break;
        case "recommended":
          // Sort by number of matching interests (most matches first)
          if (user?.interestsCommodities && user.interestsCommodities.length > 0) {
            const userInterests = new Set(
              user.interestsCommodities.map((i) => i.toString().toLowerCase())
            );
            filtered.sort((a, b) => {
              const aInterests = a.interestsCommodities || [];
              const bInterests = b.interestsCommodities || [];
              const aMatches = aInterests.filter((i) =>
                userInterests.has(i.toString().toLowerCase())
              ).length;
              const bMatches = bInterests.filter((i) =>
                userInterests.has(i.toString().toLowerCase())
              ).length;
              return bMatches - aMatches;
            });
          }
          break;
        default:
          // Apply general sorting for other tabs
          switch (sortOption) {
            case "active":
              filtered.sort((a, b) => {
                const aId = a._id || a.id;
                const bId = b._id || b.id;
                const aStats = buddyActivityStats[aId] || { active: 0, completed: 0 };
                const bStats = buddyActivityStats[bId] || { active: 0, completed: 0 };
                const aTotal = aStats.active + aStats.completed;
                const bTotal = bStats.active + bStats.completed;
                return bTotal - aTotal;
              });
              break;
            case "recent":
              filtered.sort((a, b) => {
                const dateA = new Date(a.createdAt || 0);
                const dateB = new Date(b.createdAt || 0);
                return dateB.getTime() - dateA.getTime();
              });
              break;
            case "matches":
              if (user?.interestsCommodities && user.interestsCommodities.length > 0) {
                const userInterests = new Set(
                  user.interestsCommodities.map((i) => i.toString().toLowerCase())
                );
                filtered.sort((a, b) => {
                  const aInterests = a.interestsCommodities || [];
                  const bInterests = b.interestsCommodities || [];
                  const aMatches = aInterests.filter((i) =>
                    userInterests.has(i.toString().toLowerCase())
                  ).length;
                  const bMatches = bInterests.filter((i) =>
                    userInterests.has(i.toString().toLowerCase())
                  ).length;
                  return bMatches - aMatches;
                });
              }
              break;
            case "a-z":
              filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
              break;
            case "z-a":
              filtered.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
              break;
          }
          break;
      }

      return filtered;
    } catch (error) {
      console.error("Filter error:", error);
      return [];
    }
  }, [searchResults, activeFilters, activeTab, user, sortOption, myBuddies, buddyActivityStats]);

  // Pagination logic
  const totalPages = useMemo(() => {
    if (activeTab === "my") {
      return Math.ceil(myBuddies.length / itemsPerPage);
    }
    return searchMetadata
      ? Math.ceil(searchMetadata.total / itemsPerPage)
      : Math.ceil(filteredBuddies.length / itemsPerPage);
  }, [activeTab, myBuddies.length, searchMetadata, filteredBuddies.length, itemsPerPage]);

  // For "all" tab we use backend pagination: searchResults is already the current page
  const paginatedBuddies = useMemo(() => {
    if (activeTab === "all") {
      return filteredBuddies; // No slice; API returns one page
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredBuddies.slice(startIndex, endIndex);
  }, [activeTab, filteredBuddies, currentPage, itemsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilters, activeTab]);

  // Handle tab change
  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
    setCurrentPage(1);

    // Update URL with tab parameter
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("tab", tabValue);
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });

    // Load data based on tab
    if (searchUsers) {
      switch (tabValue) {
        case "all":
          // Load all users
          searchUsers({
            limit: itemsPerPage,
            offset: 0,
          });
          break;
        case "my":
          // My buddies are loaded via useEffect when activeTab === "my"
          break;
        case "recommended":
          // Load all users, filtering will be done in filteredBuddies
          searchUsers({
            limit: 100, // Get more users for better matching
            offset: 0,
          });
          break;
        case "active":
          // Load all users, sorting will be done by activity stats
          searchUsers({
            limit: 100, // Get more users for better stats
            offset: 0,
          });
          break;
        case "nearby":
          // Load users by location
          if (user?.country || user?.city) {
            searchUsers({
              country: user?.country ? user.country.toString() : undefined,
              city: user?.city ? user.city.toString() : undefined,
              limit: itemsPerPage,
              offset: 0,
            });
          } else {
            searchUsers({
              limit: itemsPerPage,
              offset: 0,
            });
          }
          break;
      }
    }
  };

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    // For "all" tab, fetch the requested page from the API
    if (activeTab === "all" && searchUsers) {
      await searchUsers({
        limit: itemsPerPage,
        offset: (page - 1) * itemsPerPage,
        search: searchQuery?.trim() || undefined,
        ...searchFilters,
      });
    }
  };

  const clearFilters = () => {
    setActiveFilters(["All"]);
    setCurrentPage(1);
    if (setSearchQuery) {
      setSearchQuery("");
    }
    if (clearSearch) {
      clearSearch();
    }
    setActiveTab("all");
    if (searchUsers) {
      searchUsers({
        limit: itemsPerPage,
        offset: 0,
      });
    }
  };

  const EmptyState = ({ title, description, buttonText, onButtonClick }: any) => (
    <Card className="p-10 text-center rounded-2xl bg-white/90 backdrop-blur-sm border border-white shadow-lg">
      <div className="relative mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-buddy-blue/20 to-buddy-purple/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <UsersIcon className="h-8 w-8 text-buddy-blue" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-buddy-gray-800 mb-3">{title}</h3>
      <p className="text-buddy-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
      {buttonText && onButtonClick && (
        <Button
          onClick={onButtonClick}
          className="bg-gradient-to-r from-buddy-blue to-buddy-purple text-white rounded-full px-6 py-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          size="small"
        >
          {buttonText}
        </Button>
      )}
    </Card>
  );

  return (
    <div className="py-8 min-h-screen bg-gradient-to-br from-pastel-purple/30 via-white to-pastel-blue/40">
      <Container className="py-4 sm:py-6 md:py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-buddy-purple to-buddy-blue bg-clip-text text-transparent mb-2">
            Find Your Buddy
          </h1>
          <p className="text-buddy-gray-600 text-lg">
            Connect with amazing people who share your interests and goals
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-buddy-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search buddies by name, interests, or location..."
              value={searchQuery}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              className="pl-10 rounded-full border-buddy-gray-200 focus:border-buddy-purple focus:ring-buddy-purple/20"
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <ShadcnButton
                  variant="outline"
                  className="rounded-full border-buddy-gray-200 hover:bg-buddy-gray-50"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Sort
                </ShadcnButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setSortOption(option.value)}
                    className={sortOption === option.value ? "bg-buddy-purple/10" : ""}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <ShadcnButton
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-full border-buddy-gray-200 hover:bg-buddy-gray-50"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </ShadcnButton>
          </div>
        </div>

        {/* Interest Filters */}
        {showFilters && (
          <div className="mb-6 flex flex-wrap gap-2">
            {interestCategories.map((category) => (
              <Button
                key={category}
                variant={activeFilters.includes(category) ? "primary" : "outline"}
                size="small"
                onClick={() => {
                  if (category === "All") {
                    setActiveFilters(["All"]);
                  } else {
                    setActiveFilters((prev) => {
                      const filtered = prev.filter((f) => f !== "All");
                      if (prev.includes(category)) {
                        return filtered.filter((f) => f !== category);
                      } else {
                        return [...filtered, category];
                      }
                    });
                  }
                }}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        )}

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full mb-8"
        >
          <TabsList className="rounded-full mb-6 bg-buddy-gray-200/50 w-full overflow-x-auto scrollbar-hide -mx-1 px-1">
            <div className="flex w-full gap-1 sm:gap-2">
              <TabsTrigger
                value="all"
                className="flex-1 rounded-full text-xs sm:text-sm px-2 sm:px-3 py-2 flex items-center justify-center gap-1.5 sm:gap-2 min-w-0"
                title="All Buddies"
              >
                <Users className="w-4 h-4 flex-shrink-0" />
                <span className="hidden md:inline whitespace-nowrap">All Buddies</span>
              </TabsTrigger>
              <TabsTrigger
                value="my"
                className="flex-1 rounded-full text-xs sm:text-sm px-2 sm:px-3 py-2 flex items-center justify-center gap-1.5 sm:gap-2 min-w-0"
                title="My Buddies"
              >
                <UserCheck className="w-4 h-4 flex-shrink-0" />
                <span className="hidden md:inline whitespace-nowrap">My Buddies</span>
              </TabsTrigger>
              <TabsTrigger
                value="recommended"
                className="flex-1 rounded-full text-xs sm:text-sm px-2 sm:px-3 py-2 flex items-center justify-center gap-1.5 sm:gap-2 min-w-0"
                title="Recommended"
              >
                <Sparkles className="w-4 h-4 flex-shrink-0" />
                <span className="hidden md:inline whitespace-nowrap">Recommended</span>
              </TabsTrigger>
              <TabsTrigger
                value="active"
                className="flex-1 rounded-full text-xs sm:text-sm px-2 sm:px-3 py-2 flex items-center justify-center gap-1.5 sm:gap-2 min-w-0"
                title="Most Active"
              >
                <Activity className="w-4 h-4 flex-shrink-0" />
                <span className="hidden md:inline whitespace-nowrap">Most Active</span>
              </TabsTrigger>
              <TabsTrigger
                value="nearby"
                className="flex-1 rounded-full text-xs sm:text-sm px-2 sm:px-3 py-2 flex items-center justify-center gap-1.5 sm:gap-2 min-w-0"
                title="Nearby"
              >
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="hidden md:inline whitespace-nowrap">Nearby</span>
              </TabsTrigger>
            </div>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {!isAuthenticated ? (
              <div className="flex mx-auto items-center justify-center min-h-[400px]">
                <AuthWall
                  title="Sign in to discover buddies"
                  description="Meet new people, make friends, and build connections with others who share your interests and goals."
                  benefits={[
                    "Browse buddies with similar interests",
                    "Send and receive buddy requests",
                    "Build your accountability circle",
                  ]}
                  returnToAfterAuth={location.pathname + location.search}
                />
              </div>
            ) : filteredBuddies.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {paginatedBuddies.map((buddy, index) => (
                    <EnhancedBuddyCard
                      key={buddy._id || buddy.id || `buddy-${index}`}
                      user={buddy}
                      isRealUser={searchResults.length > 0}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      totalItems={searchMetadata?.total || filteredBuddies.length}
                      itemsPerPage={itemsPerPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                title="No buddies found"
                description="We couldn't find any buddies matching your search criteria."
                buttonText="Clear Filters"
                onButtonClick={clearFilters}
              />
            )}
          </TabsContent>

          <TabsContent value="my">
            {!isAuthenticated ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <AuthWall
                  title="Sign in to see your buddies"
                  description="View and manage your connected buddies, track your accountability partnerships."
                  benefits={[
                    "See all your connected buddies",
                    "Track shared activities",
                    "Manage buddy connections",
                  ]}
                  returnToAfterAuth={location.pathname + location.search}
                />
              </div>
            ) : isLoadingMyBuddies ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-buddy-purple/20 border-t-buddy-purple rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-buddy-gray-600">Loading your buddies...</p>
                </div>
              </div>
            ) : filteredBuddies.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {paginatedBuddies.map((buddy: any, index) => (
                    <EnhancedBuddyCard
                      key={buddy._id || buddy.id || `my-buddy-${index}`}
                      user={buddy}
                      isRealUser={true}
                      connectionStatus="accepted"
                      connectionId={buddy.connectionId}
                    />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      totalItems={filteredBuddies.length}
                      itemsPerPage={itemsPerPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                title="No buddies yet"
                description="You haven't connected with any buddies yet. Start by exploring the All Buddies tab!"
                buttonText="View All Buddies"
                onButtonClick={() => handleTabChange("all")}
              />
            )}
          </TabsContent>

          <TabsContent value="recommended">
            {!isAuthenticated ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <AuthWall
                  title="Sign in for personalized recommendations"
                  description="Get matched with buddies who share your interests and goals."
                  benefits={[
                    "AI-powered buddy matching",
                    "Interest-based recommendations",
                    "Find your perfect accountability partner",
                  ]}
                  returnToAfterAuth={location.pathname + location.search}
                />
              </div>
            ) : filteredBuddies.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {paginatedBuddies.map((buddy, index) => (
                    <EnhancedBuddyCard
                      key={buddy._id || buddy.id || `recommended-${index}`}
                      user={buddy}
                      isRealUser={true}
                    />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      totalItems={searchMetadata?.total || filteredBuddies.length}
                      itemsPerPage={itemsPerPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                title="No recommendations"
                description="Complete your profile with interests to get personalized recommendations."
                buttonText="View All Buddies"
                onButtonClick={() => handleTabChange("all")}
              />
            )}
          </TabsContent>

          <TabsContent value="active">
            {!isAuthenticated ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <AuthWall
                  title="Sign in to see active buddies"
                  description="Discover the most active and engaged members in our community."
                  benefits={[
                    "See most active community members",
                    "Connect with engaged buddies",
                    "Join an active accountability circle",
                  ]}
                  returnToAfterAuth={location.pathname + location.search}
                />
              </div>
            ) : filteredBuddies.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {paginatedBuddies.map((buddy, index) => (
                    <EnhancedBuddyCard
                      key={buddy._id || buddy.id || `active-${index}`}
                      user={buddy}
                      isRealUser={true}
                    />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      totalItems={searchMetadata?.total || filteredBuddies.length}
                      itemsPerPage={itemsPerPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                title="No active users"
                description="No active users found. Try the All Buddies tab to see everyone."
                buttonText="View All Buddies"
                onButtonClick={() => handleTabChange("all")}
              />
            )}
          </TabsContent>

          <TabsContent value="nearby">
            {!isAuthenticated ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <AuthWall
                  title="Sign in to find nearby buddies"
                  description="Connect with buddies in your area for local accountability partnerships."
                  benefits={[
                    "Find buddies near you",
                    "Meet up for activities",
                    "Build local connections",
                  ]}
                  returnToAfterAuth={location.pathname + location.search}
                />
              </div>
            ) : filteredBuddies.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {paginatedBuddies.map((buddy, index) => (
                    <EnhancedBuddyCard
                      key={buddy._id || buddy.id || `nearby-${index}`}
                      user={buddy}
                      isRealUser={true}
                    />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      totalItems={searchMetadata?.total || filteredBuddies.length}
                      itemsPerPage={itemsPerPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                title="No nearby users"
                description="No users found in your area. Try the All Buddies tab to see everyone."
                buttonText="View All Buddies"
                onButtonClick={() => handleTabChange("all")}
              />
            )}
          </TabsContent>
        </Tabs>

{isAuthenticated && (
        <div className="mt-12 bg-gradient-to-r from-[#FFDEE2]/30 to-[#FDE1D3]/30 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Let Others Find You Too
              </h3>
              <p className="text-buddy-gray-700 mb-6">
                Complete your profile to improve your visibility and help others
                discover you. Add your interests, location, and a bio to get
                more buddy requests!
              </p>
              <Button
                onClick={() => navigate("/settings")}
                className="bg-gradient-to-r from-buddy-purple to-buddy-blue text-white rounded-full px-6 py-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                size="small"
              >
                Complete Profile
              </Button>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="w-48 h-48 bg-gradient-to-br from-buddy-purple/20 to-buddy-blue/20 rounded-full flex items-center justify-center shadow-lg">
                <Users className="w-24 h-24 text-buddy-purple/50" />
              </div>
            </div>
          </div>
        </div>
      )}
      </Container>
    </div>
  );
};

export default Buddies;
