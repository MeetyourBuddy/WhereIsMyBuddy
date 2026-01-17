import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Container from "@/components/ui/layout/Container";
import { Card } from "@/components/common/Card";
import Button from "@/components/common/Button";
import { Button as ShadcnButton } from "@/components/ui/button";
import ActivityCard from "@/components/dashboard/ActivityCard";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Pagination from "@/components/ui/pagination";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  SortAsc,
  X,
  Users,
  Clock,
  Star,
  Plus,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useActivityData, useUserProgress } from "@/hooks/useActivityData";
import { useAuth } from "@/store/auth.store";
import {
  isActivityCreator,
  isActivityParticipant,
} from "@/types/activity-types";
import { CheckInService } from "@/services/api/activity/reaction.service";
import { tokenService } from "@/services/token/token-service";

const Activities = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    isInitialized,
    setUser,
    verifyUserWithBackend,
    forceReinitialize,
  } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); // 3x3 grid
  const [showFilters, setShowFilters] = useState(true);
  const [sortOption, setSortOption] = useState<string>("default");

  // Sort options for activities
  const sortOptions = [
    { value: "default", label: "Default" },
    { value: "popular", label: "Most Popular" },
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "soon", label: "Starting Soon" },
    { value: "a-z", label: "A-Z" },
    { value: "z-a", label: "Z-A" },
  ];
  
  // Get initial tab from URL parameter, default to "all"
  const getInitialTab = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("tab") || "all";
  };
  const [activeTab, setActiveTab] = useState(getInitialTab());
  
  // Update tab when URL parameter changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl && ["all", "my", "popular"].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [location.search]);

  const {
    activitiesQuery,
    joinActivityMutation,
    quitActivityMutation,
    activities: activitiesFromStore,
    isLoading: isLoadingActivities,
  } = useActivityData();

  // Get user progress data for activities
  const userActivityIds = activitiesFromStore
    .filter((activity) => {
      const isAdmin = isActivityCreator(activity, user?._id);
      const isParticipant = isActivityParticipant(activity, user?._id);
      return isAdmin || isParticipant;
    })
    .map((activity) => activity._id || activity.id);

  const { progressData: userProgressData, isLoading: isLoadingProgress } =
    useUserProgress(userActivityIds);

  // Debug effect to monitor activities changes
  useEffect(() => {
    console.log("📊 Activities from store changed:", activitiesFromStore);
    console.log("📊 Activities count:", activitiesFromStore?.length || 0);
  }, [activitiesFromStore]);

  // Debug effect to monitor user changes
  useEffect(() => {
    console.log("👤 Current user changed:", user);
    console.log("👤 User ID:", user?._id);
    console.log("👤 User object keys:", user ? Object.keys(user) : "no user");
    console.log("👤 Auth store state:", {
      isAuthenticated: user ? "authenticated" : "not authenticated",
      hasUser: !!user,
      userId: user?._id,
      userEmail: user?.email,
      userName: user?.name,
    });

    // Note: Auth flow is now working properly with ID field normalization
  }, [user, isAuthenticated, isInitialized]);

  // Debug effect to monitor activities changes
  useEffect(() => {
    console.log("📊 Activities from store changed:", activitiesFromStore);
    console.log("📊 Activities count:", activitiesFromStore?.length || 0);
  }, [activitiesFromStore]);

  console.log("activitiesFromStore", activitiesFromStore);

  // Use real activities from store, fallback to mock data if empty
  const activities =
    activitiesFromStore.length > 0
      ? activitiesFromStore
      : [
          {
            id: "1",
            title: "Morning Yoga in the Park",
            description:
              "Join us for a refreshing morning yoga session in Central Park. All levels welcome!",
            location: "Central Park, New York",
            date: "Tomorrow",
            time: "7:00 AM - 8:30 AM",
            category: "Fitness",
            image:
              "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=2940",
            participants: [
              {
                id: "u1",
                name: "Emma Wilson",
                image:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
              },
              {
                id: "u2",
                name: "Alex Johnson",
                image:
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
              },
              { id: "u3", name: "Sarah Parker" },
            ],
            maxParticipants: 10,
          },
          {
            id: "2",
            title: "Weekly Code Review & Pair Programming",
            description:
              "Let's improve our coding skills together! We'll review each other's code and do some pair programming.",
            location: "Virtual Meeting",
            date: "This Friday",
            time: "5:00 PM - 7:00 PM",
            category: "Coding",
            image:
              "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2069",
            participants: [
              {
                id: "u4",
                name: "Michael Chen",
                image:
                  "https://images.unsplash.com/photo-1507003211-561732d1e306?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
              },
              {
                id: "u5",
                name: "David Kim",
                image:
                  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
              },
            ],
            maxParticipants: 8,
          },
          {
            id: "3",
            title: "Book Club: 'The Midnight Library'",
            description:
              "Discussion about Matt Haig's 'The Midnight Library'. Join even if you haven't finished the book yet!",
            location: "Coffee House, Downtown",
            date: "Next Monday",
            time: "6:30 PM - 8:00 PM",
            category: "Reading",
            image:
              "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=2070",
            participants: [
              {
                id: "u6",
                name: "Sophia Martinez",
                image:
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
              },
            ],
            maxParticipants: 12,
          },
          {
            id: "4",
            title: "Photography Walk: Urban Architecture",
            description:
              "Explore and photograph the city's most interesting buildings and urban spaces.",
            location: "Downtown Arts District",
            date: "This Saturday",
            time: "3:00 PM - 6:00 PM",
            category: "Photography",
            image:
              "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070",
            participants: [
              {
                id: "u7",
                name: "Jay Wong",
                image:
                  "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
              },
              {
                id: "u8",
                name: "Priya Sharma",
                image:
                  "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
              },
            ],
            maxParticipants: 15,
          },
          {
            id: "5",
            title: "Beginner's Painting Workshop",
            description:
              "Learn basic painting techniques with acrylics. All materials provided!",
            location: "Community Art Center",
            date: "Next Sunday",
            time: "2:00 PM - 5:00 PM",
            category: "Art",
            image:
              "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=2080",
            participants: [
              {
                id: "u9",
                name: "Chris Brown",
                image:
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
              },
            ],
            maxParticipants: 8,
          },
          {
            id: "6",
            title: "Hiking Group: Mountain Trail",
            description:
              "Moderate difficulty 5-mile hike with beautiful views. Bring water and snacks!",
            location: "Mountain Ridge Park",
            date: "Next Saturday",
            time: "9:00 AM - 2:00 PM",
            category: "Hiking",
            image:
              "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070",
            participants: [
              {
                id: "u10",
                name: "Lisa Miller",
                image:
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
              },
              {
                id: "u11",
                name: "Mike Thomas",
                image:
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
              },
              {
                id: "u12",
                name: "Jessica White",
                image:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
              },
            ],
            maxParticipants: 20,
          },
        ];

  const categories = [
    "All",
    "Fitness",
    "Coding",
    "Reading",
    "Photography",
    "Art",
    "Hiking",
  ];

  // Create reusable empty state component
  const EmptyState = ({
    title,
    description,
    buttonText,
    onButtonClick,
    icon: Icon = Search,
  }: {
    title: string;
    description: string;
    buttonText: string;
    onButtonClick: () => void;
    icon?: React.ComponentType<{ className?: string }>;
  }) => (
    <Card className="p-6 sm:p-8 text-center">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-buddy-gray-200 rounded-full flex items-center justify-center mb-3 sm:mb-4">
          <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-buddy-gray-400" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold mb-2">{title}</h3>
        <p className="text-sm sm:text-base text-buddy-gray-600 mb-4 sm:mb-6">
          {description}
        </p>
        <Button
          onClick={onButtonClick}
          className="rounded-full text-sm sm:text-base"
        >
          {buttonText}
        </Button>
      </div>
    </Card>
  );

  // Tab-specific filtering logic
  const getFilteredActivitiesByTab = useMemo(() => {
    if (!activitiesFromStore) return [];

    // Debug logging
    console.log("📊 All activities from store:", activitiesFromStore);
    console.log("👤 Current user:", user);
    console.log("🏷️ Active tab:", activeTab);

    let filtered = [...activitiesFromStore];

    // Apply tab-specific filtering
    switch (activeTab) {
      case "my":
        // Show activities where user is admin or participant
        filtered = filtered.filter((activity) => {
          // Debug logging
          console.log("🔍 Checking activity:", activity.title);
          console.log("👤 Current user ID:", user?._id);
          console.log("👑 Activity admin:", activity.admin);
          console.log("👥 Activity participants:", activity.participants);

          // Use helper functions for more reliable checking
          const isAdmin = isActivityCreator(activity, user?._id);
          const isParticipant = isActivityParticipant(activity, user?._id);

          console.log("✅ Is admin (helper):", isAdmin);
          console.log("✅ Is participant (helper):", isParticipant);
          console.log("✅ Should show:", isAdmin || isParticipant);

          // Temporary: If no user ID, show all activities for debugging
          if (!user?._id) {
            console.log(
              "⚠️ No user ID found, showing all activities for debugging"
            );
            return true;
          }

          return isAdmin || isParticipant;
        });
        break;

      case "popular":
        // Sort by participant count (most popular first)
        filtered = filtered
          .filter((activity) => (activity.participants?.length || 0) > 0)
          .sort(
            (a, b) =>
              (b.participants?.length || 0) - (a.participants?.length || 0)
          );
        break;

      case "new":
        // Sort by creation date (newest first)
        filtered = filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.startDate);
          const dateB = new Date(b.createdAt || b.startDate);
          return dateB.getTime() - dateA.getTime();
        });
        break;

      case "soon":
        // Show activities starting within the next 7 days
        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        filtered = filtered
          .filter((activity) => {
            const startDate = new Date(activity.startDate);
            return startDate >= now && startDate <= nextWeek;
          })
          .sort((a, b) => {
            const dateA = new Date(a.startDate);
            const dateB = new Date(b.startDate);
            return dateA.getTime() - dateB.getTime();
          });
        break;

      default:
        // "all" tab - no additional filtering
        break;
    }

    // Apply search and category filters
    filtered = filtered.filter((activity) => {
      const matchesSearch =
        activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        activity.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        activeFilters.length === 0 ||
        activeFilters.includes("All") ||
        activeFilters.includes(activity.category);

      return matchesSearch && matchesCategory;
    });

    // Apply sorting based on sortOption
    switch (sortOption) {
      case "popular":
        filtered.sort(
          (a, b) =>
            (b.participants?.length || 0) - (a.participants?.length || 0)
        );
        break;
      case "newest":
        filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.startDate);
          const dateB = new Date(b.createdAt || b.startDate);
          return dateB.getTime() - dateA.getTime();
        });
        break;
      case "oldest":
        filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.startDate);
          const dateB = new Date(b.createdAt || b.startDate);
          return dateA.getTime() - dateB.getTime();
        });
        break;
      case "soon":
        filtered.sort((a, b) => {
          const dateA = new Date(a.startDate);
          const dateB = new Date(b.startDate);
          return dateA.getTime() - dateB.getTime();
        });
        break;
      case "a-z":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "z-a":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        // Keep default order
        break;
    }

    // Debug final results
    console.log("🎯 Final filtered activities for tab:", activeTab, filtered);
    console.log("📊 Total count:", filtered.length);

    return filtered;
  }, [activitiesFromStore, activeTab, searchQuery, activeFilters, user?._id, sortOption]);

  // Pagination logic
  const totalPages = Math.ceil(
    getFilteredActivitiesByTab.length / itemsPerPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedActivities = getFilteredActivitiesByTab.slice(
    startIndex,
    endIndex
  );

  // Reset to first page when filters or tab change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilters, activeTab]);

  // Tab change handler
  const handleTabChange = (value: string) => {
    console.log("🔄 Tab changed to:", value);
    setActiveTab(value);
    setCurrentPage(1);
  };

  const toggleFilter = (filter: string) => {
    if (filter === "All") {
      setActiveFilters(["All"]);
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
  };

  const clearFilters = () => {
    setActiveFilters(["All"]);
    setSearchQuery("");
    setActiveTab("all");
  };

  return (
    <div className="min-h-screen bg-buddy-gray-100">
      <div className="pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-10 md:pb-12 bg-gradient-to-b from-[#F2FCE2] to-buddy-gray-100">
        <Container>
          <div className="flex flex-col space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-buddy-gray-900">
                Discover Activities
              </h1>
              <Button
                variant="outline"
                className="border-buddy-purple text-buddy-purple rounded-full w-full sm:w-auto"
                icon={<Users className="w-4 h-4 sm:w-5 sm:h-5" />}
                onClick={() => navigate("/activities/create")}
              >
                <span className="hidden sm:inline">
                  Create Your Own Activity
                </span>
                <span className="sm:hidden">Create Activity</span>
              </Button>
            </div>
            <p className="text-sm sm:text-base text-buddy-gray-600 max-w-3xl">
              Find activities that match your interests, connect with
              like-minded people, and start your accountability journey
              together.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-3 sm:mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-buddy-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <Input
                  type="search"
                  placeholder="Search activities or categories..."
                  className="pl-9 sm:pl-10 bg-white h-10 sm:h-11 rounded-full text-sm sm:text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className={`bg-white rounded-full text-xs sm:text-sm px-3 sm:px-4 ${showFilters ? "border-buddy-purple text-buddy-purple" : ""}`}
                  icon={<Filter className="w-3 h-3 sm:w-4 sm:h-4" />}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <span className="hidden sm:inline">Filters</span>
                  <span className="sm:hidden">Filter</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <ShadcnButton
                      variant="outline"
                      className="bg-white rounded-full text-xs sm:text-sm px-3 sm:px-4 h-auto py-2"
                    >
                      <SortAsc className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      Sort
                    </ShadcnButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    {sortOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => setSortOption(option.value)}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        {option.label}
                        {sortOption === option.value && (
                          <Check className="w-4 h-4 text-buddy-purple" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {showFilters && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      activeFilters.includes(category) ? "primary" : "outline"
                    }
                    size="small"
                    className={
                      activeFilters.includes(category)
                        ? "bg-buddy-purple text-white rounded-full text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5"
                        : "bg-white text-buddy-gray-700 rounded-full text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5"
                    }
                    onClick={() => toggleFilter(category)}
                  >
                    {category}
                  </Button>
                ))}

                {(searchQuery ||
                  (activeFilters.length > 0 &&
                    !activeFilters.includes("All"))) && (
                  <Button
                    variant="ghost"
                    size="small"
                    className="text-buddy-gray-500 rounded-full text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5"
                    onClick={clearFilters}
                    icon={<X className="w-3 h-3 sm:w-4 sm:h-4" />}
                  >
                    <span className="hidden sm:inline">Clear Filters</span>
                    <span className="sm:hidden">Clear</span>
                  </Button>
                )}
              </div>
            )}
          </div>
        </Container>
      </div>

      <Container className="py-4 sm:py-6 md:py-8">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full mb-6 sm:mb-8"
        >
          <TabsList className="mb-4 sm:mb-6 bg-buddy-gray-200/50">
            <div className="flex min-w-max">
              <TabsTrigger
                value="all"
                className="rounded-full text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
              >
                <span className="hidden sm:inline">All Activities</span>
                <span className="sm:hidden">All</span>
              </TabsTrigger>
              <TabsTrigger
                value="my"
                className="rounded-full text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
              >
                <span className="hidden sm:inline">My Activities</span>
                <span className="sm:hidden">My</span>
              </TabsTrigger>
              <TabsTrigger
                value="popular"
                className="rounded-full text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
              >
                Popular
              </TabsTrigger>
              <TabsTrigger
                value="new"
                className="rounded-full text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
              >
                <span className="hidden sm:inline">Newly Added</span>
                <span className="sm:hidden">New</span>
              </TabsTrigger>
              <TabsTrigger
                value="soon"
                className="rounded-full text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
              >
                <span className="hidden sm:inline">Starting Soon</span>
                <span className="sm:hidden">Soon</span>
              </TabsTrigger>
            </div>
          </TabsList>

          <TabsContent value="all" className="space-y-4 sm:space-y-6">
            {paginatedActivities.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {paginatedActivities.map((activity) => (
                    <ActivityCard
                      key={activity._id || activity.id}
                      id={activity._id || activity.id}
                      title={activity.title}
                      description={activity.description}
                      startDate={activity.startDate}
                      endDate={activity.endDate}
                      category={activity.category}
                      bannerImage={activity.bannerImage}
                      participants={activity.participants || []}
                      maxParticipants={activity.maxParticipants}
                      admin={activity.admin}
                      onClick={() =>
                        navigate(`/activities/${activity._id || activity.id}`)
                      }
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-6 sm:mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      totalItems={getFilteredActivitiesByTab.length}
                      itemsPerPage={itemsPerPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                title="No activities found"
                description="We couldn't find any activities matching your search criteria."
                buttonText="Clear Filters"
                onButtonClick={clearFilters}
                icon={Search}
              />
            )}
          </TabsContent>

          <TabsContent value="my" className="space-y-4 sm:space-y-6">
            {paginatedActivities.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {paginatedActivities.map((activity) => {
                    const activityId = (
                      activity._id || activity.id
                    )?.toString();
                    const progressData = userProgressData[activityId];

                    return (
                      <ActivityCard
                        key={activityId}
                        id={activityId}
                        title={activity.title}
                        description={activity.description}
                        startDate={activity.startDate}
                        endDate={activity.endDate}
                        category={activity.category}
                        bannerImage={activity.bannerImage}
                        participants={activity.participants || []}
                        maxParticipants={activity.maxParticipants}
                        admin={activity.admin}
                        showProgress={true}
                        userProgress={progressData}
                        onClick={() => navigate(`/activities/${activityId}`)}
                      />
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="mt-6 sm:mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      totalItems={getFilteredActivitiesByTab.length}
                      itemsPerPage={itemsPerPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                title="No activities yet"
                description={
                  activitiesFromStore.length === 0
                    ? "No activities are available at the moment. Create your first activity to get started!"
                    : "You haven't joined or created any activities yet. Start exploring to find activities that interest you!"
                }
                buttonText={
                  activitiesFromStore.length === 0
                    ? "Create Activity"
                    : "View All Activities"
                }
                onButtonClick={() => {
                  if (activitiesFromStore.length === 0) {
                    navigate("/activities/create");
                  } else {
                    setActiveTab("all");
                  }
                }}
                icon={Users}
              />
            )}
          </TabsContent>

          <TabsContent value="popular" className="space-y-4 sm:space-y-6">
            {paginatedActivities.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {paginatedActivities.map((activity) => (
                    <ActivityCard
                      key={activity._id || activity.id}
                      id={activity._id || activity.id}
                      title={activity.title}
                      description={activity.description}
                      startDate={activity.startDate}
                      endDate={activity.endDate}
                      category={activity.category}
                      bannerImage={activity.bannerImage}
                      participants={activity.participants || []}
                      maxParticipants={activity.maxParticipants}
                      admin={activity.admin}
                      onClick={() =>
                        navigate(`/activities/${activity._id || activity.id}`)
                      }
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-6 sm:mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      totalItems={getFilteredActivitiesByTab.length}
                      itemsPerPage={itemsPerPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                title="No popular activities"
                description="There are no activities with participants yet. Be the first to join an activity!"
                buttonText="View All Activities"
                onButtonClick={() => setActiveTab("all")}
                icon={Star}
              />
            )}
          </TabsContent>

          <TabsContent value="new" className="space-y-4 sm:space-y-6">
            {paginatedActivities.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {paginatedActivities.map((activity) => (
                    <ActivityCard
                      key={activity._id || activity.id}
                      id={activity._id || activity.id}
                      title={activity.title}
                      description={activity.description}
                      startDate={activity.startDate}
                      endDate={activity.endDate}
                      category={activity.category}
                      bannerImage={activity.bannerImage}
                      participants={activity.participants || []}
                      maxParticipants={activity.maxParticipants}
                      admin={activity.admin}
                      onClick={() =>
                        navigate(`/activities/${activity._id || activity.id}`)
                      }
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-6 sm:mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      totalItems={getFilteredActivitiesByTab.length}
                      itemsPerPage={itemsPerPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                title="No new activities"
                description="There are no recently added activities. Check back later or create your own activity!"
                buttonText="Create Activity"
                onButtonClick={() => navigate("/activities/create")}
                icon={Plus}
              />
            )}
          </TabsContent>

          <TabsContent value="soon" className="space-y-4 sm:space-y-6">
            {paginatedActivities.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {paginatedActivities.map((activity) => (
                    <ActivityCard
                      key={activity._id || activity.id}
                      id={activity._id || activity.id}
                      title={activity.title}
                      description={activity.description}
                      startDate={activity.startDate}
                      endDate={activity.endDate}
                      category={activity.category}
                      bannerImage={activity.bannerImage}
                      participants={activity.participants || []}
                      maxParticipants={activity.maxParticipants}
                      admin={activity.admin}
                      onClick={() =>
                        navigate(`/activities/${activity._id || activity.id}`)
                      }
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-6 sm:mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      totalItems={getFilteredActivitiesByTab.length}
                      itemsPerPage={itemsPerPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                title="No upcoming activities"
                description="There are no activities starting in the next 7 days. Check back later or create your own activity!"
                buttonText="Create Activity"
                onButtonClick={() => navigate("/activities/create")}
                icon={Clock}
              />
            )}
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
};

export default Activities;
