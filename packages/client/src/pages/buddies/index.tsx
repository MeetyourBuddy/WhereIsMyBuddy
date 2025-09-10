import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "@/components/ui/layout/Container";
import { Card } from "@/components/common/Card";
import Button from "@/components/common/Button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
} from "lucide-react";
import EnhancedBuddyCard from "@/components/buddies/EnhancedBuddyCard";
import { useBuddyConnectionStore } from "@/store/buddy-connection.store";
import { useAuth } from "@/store/auth.store";
import { UserSearchParams } from "@/services/api/user/user-search.service";
import { User } from "@/types/auth-types";

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
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
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

  // Load initial data on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log("Loading initial data...");
        if (searchUsers) {
          const result = await searchUsers({
            limit: itemsPerPage,
            offset: 0,
          });
          console.log("Initial data load result:", result);
        } else {
          console.log("searchUsers function not available");
        }
      } catch (error) {
        console.error("Initial data load error:", error);
      }
    };

    loadInitialData();
  }, [searchUsers, itemsPerPage]);

  // Debug effect to monitor searchResults changes
  useEffect(() => {
    console.log("searchResults changed:", searchResults);
    console.log("searchResults length:", searchResults.length);
    console.log("isLoadingSearch:", isLoadingSearch);
  }, [searchResults, isLoadingSearch]);

  // Test direct API call
  useEffect(() => {
    const testDirectAPI = async () => {
      try {
        console.log("Testing direct API call...");
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"}/users?limit=10&offset=0`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        console.log("Direct API response:", data);
      } catch (error) {
        console.error("Direct API error:", error);
      }
    };

    testDirectAPI();
  }, []);

  // Enhanced search handler with debounce
  const handleSearch = useCallback(
    debounce(async (query: string, filters: UserSearchParams) => {
      try {
        if (searchUsers) {
          // Convert active filters to interests array
          const interests = activeFilters.filter((filter) => filter !== "All");

          await searchUsers({
            search: query,
            interests: interests.length > 0 ? interests : undefined,
            ...filters,
            limit: itemsPerPage,
            offset: (currentPage - 1) * itemsPerPage,
          });
        }
      } catch (error) {
        console.error("Search error:", error);
        // Don't throw the error, just log it to prevent white screen
      }
    }, 300),
    [searchUsers, currentPage, itemsPerPage, activeFilters]
  );

  // Handle search input changes
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

  // Use real search results from backend
  const filteredBuddies = useMemo(() => {
    try {
      // Debug logging
      console.log("Search results:", searchResults);
      console.log("Search results length:", searchResults.length);
      console.log("Active filters:", activeFilters);

      // Filter search results based on active filters
      if (searchResults.length === 0) {
        console.log("No search results, returning empty array");
        return [];
      }

      const filtered = searchResults.filter((buddy) => {
        // If no filters are active or "All" is selected, show all users
        if (activeFilters.length === 0 || activeFilters.includes("All")) {
          return true;
        }

        // Filter by interests if any are selected
        const matchesInterest =
          buddy.interestsCategories &&
          buddy.interestsCategories.some((interest) =>
            activeFilters.includes(interest.toString())
          );

        return matchesInterest;
      });

      console.log("Filtered buddies:", filtered);
      return filtered;
    } catch (error) {
      console.error("Filter error:", error);
      // Return empty array as fallback
      return [];
    }
  }, [searchResults, activeFilters]);

  // Pagination logic - use backend pagination
  const totalPages = searchMetadata
    ? Math.ceil(searchMetadata.total / itemsPerPage)
    : 1;
  const paginatedBuddies = filteredBuddies || [];

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilters]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Trigger search with new page
    if (searchQuery.trim()) {
      handleSearch(searchQuery, searchFilters);
    } else {
      // Load users for new page
      if (searchUsers) {
        const interests = activeFilters.filter((f) => f !== "All");
        searchUsers({
          interests: interests.length > 0 ? interests : undefined,
          limit: itemsPerPage,
          offset: (page - 1) * itemsPerPage,
        });
      }
    }
  };

  const toggleFilter = (filter: string) => {
    try {
      if (filter === "All") {
        setActiveFilters(["All"]);
        // Trigger search with no interest filters
        if (searchQuery.trim()) {
          handleSearch(searchQuery, searchFilters);
        } else {
          // Load all users if no search query
          if (searchUsers) {
            searchUsers({
              limit: itemsPerPage,
              offset: (currentPage - 1) * itemsPerPage,
            });
          }
        }
        return;
      }

      let newFilters = [...activeFilters];

      newFilters = newFilters.filter((f) => f !== "All");

      if (newFilters.includes(filter)) {
        newFilters = newFilters.filter((f) => f !== filter);
      } else {
        newFilters.push(filter);
      }

      if (newFilters.length === 0) {
        newFilters = ["All"];
      }

      setActiveFilters(newFilters);

      // Trigger search with new filters
      if (searchQuery.trim()) {
        handleSearch(searchQuery, searchFilters);
      } else {
        // Load users with interest filters
        if (searchUsers) {
          const interests = newFilters.filter((f) => f !== "All");
          searchUsers({
            interests: interests.length > 0 ? interests : undefined,
            limit: itemsPerPage,
            offset: (currentPage - 1) * itemsPerPage,
          });
        }
      }
    } catch (error) {
      console.error("Filter toggle error:", error);
      // Fallback to "All" filter
      setActiveFilters(["All"]);
    }
  };

  const clearFilters = () => {
    try {
      setActiveFilters(["All"]);
      if (setSearchQuery) {
        setSearchQuery("");
      }
      if (clearSearch) {
        clearSearch();
      }
      // Load all users after clearing filters
      if (searchUsers) {
        searchUsers({
          limit: itemsPerPage,
          offset: 0,
        });
      }
    } catch (error) {
      console.error("Clear filters error:", error);
      // Fallback to basic state reset
      setActiveFilters(["All"]);
      if (setSearchQuery) {
        setSearchQuery("");
      }
    }
  };

  // Show loading state
  if (isLoadingSearch) {
    return (
      <div className="min-h-screen bg-buddy-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-buddy-purple border-t-transparent" />
          <p className="text-buddy-gray-600">Searching for buddies...</p>
        </div>
      </div>
    );
  }

  // Safety check to prevent crashes
  if (!filteredBuddies || !Array.isArray(filteredBuddies)) {
    console.error("filteredBuddies is not an array:", filteredBuddies);
    return (
      <div className="min-h-screen bg-buddy-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-buddy-gray-600">Loading buddies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-buddy-gray-100">
      <div className="pt-20 pb-12 bg-gradient-to-b from-[#E5DEFF] to-buddy-gray-100">
        <Container>
          <div className="flex flex-col space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-buddy-gray-900">
              Find Buddies
            </h1>
            <p className="text-buddy-gray-600 max-w-3xl">
              Connect with like-minded individuals who share your interests and
              goals. Find accountability partners to help you stay on track.
            </p>

            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-buddy-gray-400" />
                <Input
                  type="search"
                  placeholder="Search buddies by name, interests, or location..."
                  className="pl-10 bg-white rounded-full"
                  value={searchQuery}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="bg-white rounded-full"
                  icon={<Filter className="w-4 h-4" />}
                >
                  Filters
                </Button>
                <Button
                  variant="outline"
                  className="bg-white rounded-full"
                  icon={<SortAsc className="w-4 h-4" />}
                >
                  Sort
                </Button>
                <Button
                  variant="outline"
                  className="bg-white rounded-full"
                  icon={<MapPin className="w-4 h-4" />}
                >
                  Near Me
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {interestCategories.map((interest) => (
                <Button
                  key={interest}
                  variant={
                    activeFilters.includes(interest) ? "primary" : "outline"
                  }
                  size="small"
                  className={
                    activeFilters.includes(interest)
                      ? "bg-buddy-purple text-white rounded-full"
                      : "bg-white text-buddy-gray-700 rounded-full"
                  }
                  onClick={() => toggleFilter(interest)}
                >
                  {interest}
                </Button>
              ))}

              {(searchQuery ||
                (activeFilters.length > 0 &&
                  !activeFilters.includes("All"))) && (
                <Button
                  variant="ghost"
                  size="small"
                  className="text-buddy-gray-500 rounded-full"
                  onClick={clearFilters}
                  icon={<X className="w-4 h-4" />}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8">
        <Tabs defaultValue="all" className="w-full mb-8">
          <TabsList className="mb-6 bg-buddy-gray-200/50">
            <TabsTrigger value="all" className="rounded-full">
              All Buddies
            </TabsTrigger>
            <TabsTrigger value="my" className="rounded-full">
              My Buddies
            </TabsTrigger>
            <TabsTrigger value="recommended" className="rounded-full">
              Recommended
            </TabsTrigger>
            <TabsTrigger value="active" className="rounded-full">
              Most Active
            </TabsTrigger>
            <TabsTrigger value="nearby" className="rounded-full">
              Nearby
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {filteredBuddies.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                      totalItems={searchMetadata?.total || 0}
                      itemsPerPage={itemsPerPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <Card className="p-8 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-buddy-gray-200 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-buddy-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    No buddies found
                  </h3>
                  <p className="text-buddy-gray-600 mb-6">
                    We couldn't find any buddies matching your search criteria.
                  </p>
                  <Button onClick={clearFilters} className="rounded-full">
                    Clear Filters
                  </Button>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="my">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredBuddies.length > 0 ? (
                filteredBuddies.map((buddy, index) => (
                  <EnhancedBuddyCard
                    key={buddy._id || `my-buddy-${index}`}
                    user={buddy}
                    isRealUser={true}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-buddy-gray-600">No buddies found</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="recommended">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredBuddies.length > 0 ? (
                filteredBuddies
                  .slice(0, 4)
                  .map((buddy, index) => (
                    <EnhancedBuddyCard
                      key={buddy._id || `recommended-${index}`}
                      user={buddy}
                      isRealUser={true}
                    />
                  ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-buddy-gray-600">
                    No recommended buddies found
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="active">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredBuddies.length > 0 ? (
                filteredBuddies
                  .slice(0, 4)
                  .map((buddy, index) => (
                    <EnhancedBuddyCard
                      key={buddy._id || `active-${index}`}
                      user={buddy}
                      isRealUser={true}
                    />
                  ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-buddy-gray-600">No active buddies found</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="nearby">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredBuddies.length > 0 ? (
                filteredBuddies
                  .slice(0, 4)
                  .map((buddy, index) => (
                    <EnhancedBuddyCard
                      key={buddy._id || `nearby-${index}`}
                      user={buddy}
                      isRealUser={true}
                    />
                  ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-buddy-gray-600">No nearby buddies found</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 bg-gradient-to-r from-[#FFDEE2]/30 to-[#FDE1D3]/30 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Let Others Find You Too
              </h3>
              <p className="text-buddy-gray-700 mb-6">
                Complete your profile to improve your visibility and help others
                with similar interests discover you.
              </p>
              <Button
                className="bg-buddy-purple text-white rounded-full"
                icon={<Star className="w-5 h-5" />}
              >
                Complete Your Profile
              </Button>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="relative w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-lg">
                <div className="w-36 h-36 bg-buddy-purple-light/20 rounded-full flex items-center justify-center">
                  <Heart className="w-16 h-16 text-buddy-purple-light" />
                </div>
                <div className="absolute w-12 h-12 bg-buddy-blue-light rounded-full -top-2 right-5 flex items-center justify-center">
                  <Star className="w-7 h-7 text-white" />
                </div>
                <div className="absolute w-10 h-10 bg-buddy-green-light rounded-full bottom-4 -right-2 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-buddy-green-dark" />
                </div>
                <div className="absolute w-14 h-14 bg-buddy-orange-light rounded-full bottom-0 left-5 flex items-center justify-center">
                  <UserIcon className="w-8 h-8 text-buddy-orange-dark" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Buddies;
