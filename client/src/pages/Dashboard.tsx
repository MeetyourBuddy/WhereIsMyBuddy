import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Compass,
  Lightbulb,
  Calendar,
  Bell,
  Users,
  UserPlus,
  Star,
  ArrowRight,
  TrendingUp,
  Plus,
  Activity,
  Heart,
  Sparkles,
  Target,
  Clock,
  MapPin,
  CheckCircle,
  Gift,
  Zap,
  Trophy,
  MessageCircle,
  Share2,
  Flame,
  Award,
  TrendingDown,
} from "lucide-react";

import Container from "@/components/ui/layout/Container";
import { Card } from "@/components/common/Card";
import Button from "@/components/common/Button";
import { Separator } from "@/components/ui/separator";
import Avatar from "@/components/common/Avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/store/auth.store";
import { AuthWall } from "@/components/auth/AuthWall";
import { useToast } from "@/hooks/use-toast";
import { ActivityService } from "@/services/api/activity/activity-service";
import { BuddyConnectionService } from "@/services/api/buddy/buddy-connection.service";
import { CheckInService } from "@/services/api/activity/reaction.service";
import { useScrollToTopImmediate } from "@/hooks/use-scroll-to-top";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Dashboard = () => {
  useScrollToTopImmediate();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  // State for real data
  const [userStats, setUserStats] = useState({
    activeGoals: 0,
    buddies: 0,
    streak: 0,
    longestStreakActivityTitle: "",
    profileCompletion: 0,
  });
  const [activeActivities, setActiveActivities] = useState([]);
  const [suggestedActivities, setSuggestedActivities] = useState([]);
  const [connectedBuddies, setConnectedBuddies] = useState([]);
  const [suggestedBuddies, setSuggestedBuddies] = useState([]);
  const [userProgressByActivity, setUserProgressByActivity] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  console.log("API URL Dashboard:", import.meta.env.VITE_API_URL);

  // Helper function to check if an activity has ended
  const isActivityEnded = (activity) => {
    if (!activity.endDate) return false;
    const endDate = new Date(activity.endDate);
    const now = new Date();
    return endDate < now;
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Fetch all activities
        const activitiesResponse = await ActivityService.getActivities();
        const allActivities = activitiesResponse.data || [];

        // Filter suggested activities: only active or about to start, never ended
        // Exclude private activities unless user is participant or admin
        const userId = user._id;
        const isParticipantOrAdmin = (activity) =>
          activity.participants?.some(
            (p) => p._id === userId || p.id === userId
          ) ||
          activity.admin?._id === userId ||
          activity.admin?.id === userId;
        const filteredSuggested = allActivities
          .filter((activity) => !isActivityEnded(activity))
          .filter(
            (activity) =>
              activity.type !== "private" || isParticipantOrAdmin(activity)
          )
          .slice(0, 3);
        setSuggestedActivities(filteredSuggested);

        // Fetch user's active activities (joined activities)
        const activeActivitiesData = allActivities.filter((activity) =>
          activity.participants?.some(
            (p) => p._id === user._id || p.id === user._id
          )
        );
        setActiveActivities(activeActivitiesData);

        // Fetch buddy connections
        const connections =
          await BuddyConnectionService.getBuddyConnections("accepted");
        
        // Transform connections to get the buddy user (either requester or recipient)
        // Sort by acceptedAt or createdAt (most recent first) and limit to 5
        const buddyUsers = connections
          .map((connection) => {
            // Determine if current user is requester or recipient
            const isRequester = connection.requester.id === user._id;
            const buddy = isRequester ? connection.recipient : connection.requester;
            
            return {
              ...buddy,
              _id: buddy.id,
              id: buddy.id,
              acceptedAt: connection.acceptedAt || connection.createdAt,
              connectionId: connection.id,
            };
          })
          .sort((a, b) => {
            // Sort by acceptedAt/createdAt (most recent first)
            const dateA = new Date(a.acceptedAt || 0).getTime();
            const dateB = new Date(b.acceptedAt || 0).getTime();
            return dateB - dateA;
          })
          .slice(0, 5); // Limit to 5 most recent
        
        setConnectedBuddies(buddyUsers);

        // Fetch all users to find perfect matches
        // Filter out existing buddies and calculate interest match
        try {
          const { UserSearchService } = await import("@/services/api/user/user-search.service");
          const allUsersResponse = await UserSearchService.searchUsers({
            limit: 100, // Get a good sample
            offset: 0,
          });
          
          const allUsers = allUsersResponse.data?.data || [];
          
          // Get IDs of existing buddies
          const buddyIds = new Set(
            connections.map((conn) => {
              const isRequester = conn.requester.id === user._id;
              return isRequester ? conn.recipient.id : conn.requester.id;
            })
          );
          
          // Filter out current user and existing buddies
          const potentialMatches = allUsers.filter(
            (u) => u._id !== user._id && !buddyIds.has(u._id || u.id)
          );
          
          // Calculate interest match percentage for each user
          const userInterests = user.interestsCommodities || [];
          const matchesWithScores = potentialMatches
            .map((match) => {
              const matchInterests = match.interestsCommodities || [];
              
              // Calculate match percentage based on common interests
              let matchCount = 0;
              if (userInterests.length > 0 && matchInterests.length > 0) {
                const userInterestSet = new Set(
                  userInterests.map((i) => i.toString().toLowerCase())
                );
                matchCount = matchInterests.filter((i) =>
                  userInterestSet.has(i.toString().toLowerCase())
                ).length;
                
                // Calculate percentage: common interests / max interests
                const maxInterests = Math.max(userInterests.length, matchInterests.length);
                const matchPercentage = Math.round((matchCount / maxInterests) * 100);
                
                return {
                  ...match,
                  matchPercentage,
                  commonInterests: matchCount,
                };
              }
              
              return {
                ...match,
                matchPercentage: 0,
                commonInterests: 0,
              };
            })
            .filter((match) => match.matchPercentage > 0) // Only show users with some match
            .sort((a, b) => b.matchPercentage - a.matchPercentage) // Sort by match percentage
            .slice(0, 5); // Limit to 5 best matches
          
          setSuggestedBuddies(matchesWithScores);
        } catch (error) {
          console.error("Failed to fetch perfect matches:", error);
          setSuggestedBuddies([]);
        }

        // Get user's progress across all activities to calculate overall streak and progress %
        let overallStreak = 0;
        let longestStreakActivityTitle = "";
        if (activeActivitiesData.length === 0) {
          setUserProgressByActivity({});
        } else {
          try {
            const activityIds = activeActivitiesData.map(
              (activity) => activity._id || activity.id
            );
            const userProgressResponse =
              await CheckInService.getUserProgressForActivities(activityIds);

            // Extract the actual data from the response
            const userProgressData = userProgressResponse.data;

            // Store per-activity progress so "Your Progress" uses real check-in data
            setUserProgressByActivity(userProgressData || {});

            // Longest streak = max of each activity's longest streak (ever) for the current user
            const entries = Object.entries(userProgressData);
            if (entries.length > 0) {
              let maxStreak = 0;
              let activityIdWithMax = null;
              for (const [activityId, progress] of entries) {
                const streak =
                  progress?.longestStreak ?? progress?.currentStreak ?? 0;
                if (streak > maxStreak) {
                  maxStreak = streak;
                  activityIdWithMax = activityId;
                }
              }
              overallStreak = maxStreak;
              if (activityIdWithMax && activeActivitiesData.length > 0) {
                const activity = activeActivitiesData.find(
                  (a) => (a._id || a.id) === activityIdWithMax
                );
                longestStreakActivityTitle = activity?.title ?? "";
              }
            }

            console.log("🎯 Dashboard streak calculation:", {
              activityIds,
              userProgressResponse,
              userProgressData,
              longestStreakActivityTitle,
              overallStreak,
              user: user?.name || user?._id,
              detailedStreaks: Object.entries(userProgressData).map(
                ([activityId, progress]) => ({
                  activityId,
                  currentStreak: progress?.currentStreak,
                  longestStreak: progress?.longestStreak,
                  completedCheckIns: progress?.completedCheckIns,
                  totalAvailableCheckIns: progress?.totalAvailableCheckIns,
                })
              ),
            });
          } catch (error) {
            console.error(
              "Failed to fetch user progress for streak calculation:",
              error
            );
            overallStreak = 0;
            setUserProgressByActivity({});
          }
        }

        // Calculate user stats
        setUserStats({
          activeGoals: activeActivitiesData.length,
          buddies: connections.length,
          streak: overallStreak,
          longestStreakActivityTitle: longestStreakActivityTitle ?? "",
          profileCompletion: calculateProfileCompletion(user),
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        toast({
          title: "Error loading dashboard",
          description: "Failed to load some data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, toast]);

  // Helper function to calculate profile completion
  // This calculates based on actual profile fields, not onboarding status
  const calculateProfileCompletion = (userData) => {
    if (!userData) return 0;

    // Check actual profile fields
    const checks = {
      name: userData.name && userData.name.trim() !== "",
      email: userData.email && userData.email.trim() !== "",
      bio: userData.bio && userData.bio.trim() !== "",
      location: userData.city && userData.country, // Both city and country needed
      interests: userData.interestsCommodities && userData.interestsCommodities.length > 0,
      avatar: userData.avatar && userData.avatar.trim() !== "",
    };

    const completedCount = Object.values(checks).filter(Boolean).length;
    const totalFields = Object.keys(checks).length;

    return Math.round((completedCount / totalFields) * 100);
  };

  // Helper functions for data formatting
  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getActivityProgress = (activity) => {
    const activityId = activity._id || activity.id;
    const progressData = userProgressByActivity[activityId];
    if (progressData != null && typeof progressData.progress === "number") {
      return progressData.progress;
    }
    if (activity.checkIns != null && activity.totalCheckIns != null && activity.totalCheckIns > 0) {
      return Math.round((activity.checkIns / activity.totalCheckIns) * 100);
    }
    return 0;
  };

  // Filter active activities to only show non-ended ones
  // Limit to maximum 2 activities
  const trueActiveActivities = activeActivities
    .filter((activity) => !isActivityEnded(activity))
    .slice(0, 2);

  // Main loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pastel-purple/30 via-white to-pastel-blue/40 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-buddy-purple/20 border-t-buddy-purple rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-buddy-blue/10 border-t-buddy-blue rounded-full animate-pulse mx-auto mb-6"></div>
          </div>
          <h3 className="text-xl font-semibold text-buddy-gray-800 mb-2">
            Loading your dashboard
          </h3>
          <p className="text-buddy-gray-500">
            Getting everything ready for you...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 min-h-screen bg-gradient-to-br from-pastel-purple/30 via-white to-pastel-blue/40">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5MzUxRTkiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTIwIDUwaDN2M2gtM3Ztf00zMCAyMGgzdjNoLTN6TTE3IDQwaDN2M2gtM3pNNDYgNDBoM3YzaC0zeiIvPjwvZz48L2c+PC9zdmc+')] opacity-75 pointer-events-none"></div>

      <Container>
        <div className={`grid grid-cols-1 gap-8 ${isAuthenticated ? 'lg:grid-cols-3' : ''}`}>
          <div className={`space-y-8 ${isAuthenticated ? 'lg:col-span-2' : ''}`}>
            <section
              className="animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-buddy-purple to-buddy-blue bg-clip-text text-transparent mb-1">
                      Hey, {isAuthenticated ? (user?.name || "there") : "Buddy"}!
                    </h2>
                    <h2 className="text-3xl">👋</h2>
                  </div>
                  <p className="text-buddy-gray-600 text-sm">
                    Ready to make today amazing? Let's find your perfect
                    activity buddy!
                  </p>
                </div>
                {isAuthenticated && (
                  <div className="flex items-center gap-2">
                    {/* <div className="flex items-center gap-1 text-buddy-gray-500 text-sm bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-white">
                      <Bell className="h-4 w-4 text-buddy-purple" />
                      <span>3 new</span>
                    </div> */}
                    <div className="flex items-center gap-1 text-buddy-gray-500 text-sm bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-white">
                      <Bell className="h-4 w-4 text-buddy-purple" />
                      <span>3 new</span>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-buddy-purple/20 to-buddy-blue/20 rounded-full flex items-center justify-center">
                      <Heart className="h-5 w-5 text-buddy-purple" />
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="p-4 bg-gradient-to-br from-buddy-purple/10 to-buddy-purple/5 border border-buddy-purple/20 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-buddy-purple/20 rounded-full flex items-center justify-center">
                      <Target className="h-5 w-5 text-buddy-purple" />
                    </div>
                    <div>
                      <p className="text-sm text-buddy-gray-600">Activities</p>
                      <p className="text-xl font-bold text-buddy-purple">
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-buddy-purple/30 border-t-buddy-purple"></div>
                          </div>
                        ) : (
                          userStats.activeGoals
                        )}
                      </p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-buddy-blue/10 to-buddy-blue/5 border border-buddy-blue/20 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-buddy-blue/20 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-buddy-blue" />
                    </div>
                    <div>
                      <p className="text-sm text-buddy-gray-600">Buddies</p>
                      <p className="text-xl font-bold text-buddy-blue">
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-buddy-blue/30 border-t-buddy-blue"></div>
                          </div>
                        ) : (
                          userStats.buddies
                        )}
                      </p>
                    </div>
                  </div>
                </Card>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Card className="p-4 bg-gradient-to-br from-buddy-orange/10 to-buddy-orange/5 border border-buddy-orange/20 rounded-2xl cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-buddy-orange/20 rounded-full flex items-center justify-center">
                            <Flame className="h-5 w-5 text-buddy-orange" />
                          </div>
                          <div>
                            <p className="text-sm text-buddy-gray-600">Longest Streak</p>
                            <p className="text-xl font-bold text-buddy-orange">
                              {isLoading ? (
                                <div className="flex items-center justify-center">
                                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-buddy-orange/30 border-t-buddy-orange"></div>
                                </div>
                              ) : (
                                `${userStats.streak} days`
                              )}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-center">
                    {userStats.streak > 0 ? (
                      <>
                        Congratulations on your <strong>{userStats.streak}-day</strong> longest streak!
                        {userStats.longestStreakActivityTitle ? (
                          <> You achieved this in <strong>{userStats.longestStreakActivityTitle}</strong>.</>
                        ) : (
                          " Keep checking in!"
                        )}
                      </>
                    ) : (
                      "This shows your longest streak across all your activities. Keep checking in!"
                    )}
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Profile Completion Card / Guest Empty State */}
              {isAuthenticated && userStats.profileCompletion < 100 && (
                <Card className="p-6 animate-fade-in hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-pastel-purple/20 border border-white shadow-xl rounded-3xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-buddy-purple/5 rounded-full -translate-y-1/3 translate-x-1/3"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-buddy-blue/5 rounded-full translate-y-1/3 -translate-x-1/3"></div>
                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-buddy-purple/20 to-buddy-purple/10 rounded-full flex items-center justify-center shadow-lg">
                          <Sparkles className="h-8 w-8 text-buddy-purple" />
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                          Complete Your Profile
                          <Badge className="bg-buddy-green/10 text-buddy-green border-buddy-green/20">
                            +25% matches
                          </Badge>
                        </h3>
                        <p className="text-buddy-gray-500 mb-4">
                          Your profile is {userStats.profileCompletion}% complete.
                          Add more information to increase your chances of finding
                          the perfect buddy!
                        </p>
                        <div className="w-full bg-buddy-gray-200/50 rounded-full h-2.5 mb-3 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-buddy-purple to-buddy-blue h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${userStats.profileCompletion}%` }}
                          ></div>
                        </div>
                        <Button
                          variant="primary"
                          size="small"
                          className="button-shine rounded-full px-6"
                          onClick={() => navigate("/settings")}
                        >
                          Complete Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </section>

            <section
              className="animate-fade-in"
              style={{ animationDelay: "0.15s" }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold flex items-center mb-1">
                    <Activity className="mr-2 h-5 w-5 text-buddy-purple" />
                    <span className="bg-gradient-to-r from-buddy-purple to-buddy-blue bg-clip-text text-transparent">
                      Your Active Activities
                    </span>
                  </h2>
                  <p className="text-sm text-buddy-gray-600">
                    Keep the momentum going! 🚀
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => navigate("/activities?tab=my")}
                  className="hover:bg-buddy-purple/5 text-buddy-purple rounded-full"
                >
                  View All
                </Button>
              </div>

              {!isAuthenticated ? (
                <Card className="p-6 sm:p-8 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-buddy-gray-200 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                      <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-buddy-gray-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">
                      Track your activities
                    </h3>
                    <p className="text-sm sm:text-base text-buddy-gray-600 mb-4 sm:mb-6">
                      Sign in to join activities and track your progress with buddies!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        onClick={() => navigate("/signin")}
                        className="rounded-full text-sm sm:text-base"
                      >
                        Sign In
                      </Button>
                      <Button
                        onClick={() => navigate("/signup")}
                        variant="outline"
                        className="rounded-full text-sm sm:text-base"
                      >
                        Create Account
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : trueActiveActivities.length > 0 ? (
                <div className="grid gap-4">
                  {trueActiveActivities.map((activity) => {
                    const progress = getActivityProgress(activity);
                    return (
                      <Card
                        key={activity._id || activity.id}
                        className="p-5 hover-card rounded-2xl bg-white/90 backdrop-blur-sm border border-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
                        onClick={() =>
                          navigate(`/activities/${activity._id || activity.id}`)
                        }
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-grow">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">
                                {activity.title}
                              </h3>
                              <Badge className="bg-buddy-purple/10 text-buddy-purple border-buddy-purple/20 text-xs">
                                <Zap className="w-3 h-3 mr-1" />
                                Active
                              </Badge>
                            </div>
                            <span className="text-xs bg-buddy-gray-100/70 px-3 py-1 rounded-full inline-flex items-center shadow-sm mb-3">
                              {activity.category}
                            </span>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs text-buddy-gray-600">
                              <span className="flex items-center bg-buddy-gray-50 px-2 py-1 rounded-full">
                                <Clock className="h-3 w-3 mr-1 text-buddy-gray-400" />
                                {formatDate(
                                  activity.nextCheckIn || activity.startDate
                                )}
                              </span>
                              <span className="flex items-center bg-buddy-gray-50 px-2 py-1 rounded-full">
                                <Users className="h-3 w-3 mr-1 text-buddy-gray-400" />
                                {activity.participants?.length || 0} buddies
                              </span>
                            </div>
                          </div>
                          <div className="flex-shrink-0 ml-4 flex flex-col items-end">
                            <div className="text-sm font-medium text-buddy-purple mb-1">
                              {progress}% complete
                            </div>
                            <div className="w-20 bg-buddy-gray-200/50 rounded-full h-2 mb-2">
                              <div
                                className="bg-gradient-to-r from-buddy-purple to-buddy-blue h-2 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-buddy-gray-500 group-hover:text-buddy-purple transition-colors">
                              Keep going! →
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card className="p-12 text-center rounded-2xl bg-white/90 backdrop-blur-sm border border-white shadow-lg">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-buddy-purple/20 to-buddy-blue/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Activity className="h-10 w-10 text-buddy-purple" />
                    </div>
                    {/* <div className="absolute -top-2 -right-2 w-6 h-6 bg-buddy-orange/20 rounded-full flex items-center justify-center">
                      <Sparkles className="h-3 w-3 text-buddy-orange" />
                    </div> */}
                  </div>
                  <h3 className="text-2xl font-bold text-buddy-gray-800 mb-3">
                    Ready to get started?
                  </h3>
                  <p className="text-buddy-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
                    Join an activity or create your own to begin your journey!
                    Find your perfect activity buddy and start achieving your
                    goals together.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => navigate("/activities")}
                      className="bg-gradient-to-r from-buddy-purple to-buddy-blue text-white rounded-full px-8 py-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                      size="default"
                    >
                      <Compass className="w-5 h-5 mr-2" />
                      Explore Activities
                    </Button>
                    <Button
                      onClick={() => navigate("/activities/create")}
                      variant="outline"
                      className="border-buddy-purple/30 text-buddy-purple hover:bg-buddy-purple/10 rounded-full px-8 py-3 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                      size="default"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Create Activity
                    </Button>
                  </div>
                </Card>
              )}
            </section>

            <section
              className="animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold flex items-center mb-1">
                    <Compass className="mr-2 h-5 w-5 text-buddy-blue" />
                    <span className="bg-gradient-to-r from-buddy-blue-dark to-buddy-blue bg-clip-text text-transparent">
                      Discover Amazing Activities
                    </span>
                  </h2>
                  <p className="text-sm text-buddy-gray-600">
                    Handpicked just for you! ✨
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => navigate("/activities")}
                    className="rounded-full border-buddy-gray-200 px-4 hover:bg-buddy-blue/5"
                  >
                    View All
                  </Button>
                  {isAuthenticated && (
                    <Button
                      size="small"
                      onClick={() => navigate("/activities/create")}
                      className="rounded-full bg-gradient-to-r from-buddy-purple to-buddy-blue text-white shadow-md hover:shadow-lg"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Create
                    </Button>
                  )}
                </div>
              </div>

              {suggestedActivities.length > 0 ? (
                <div className="grid gap-4">
                  {suggestedActivities.map((activity, index) => {
                    const ended = isActivityEnded(activity);
                    return (
                      <Card
                        key={activity._id || activity.id || index}
                        className={`overflow-hidden hover-card rounded-3xl bg-white/90 backdrop-blur-sm border border-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative group cursor-pointer ${ended ? 'opacity-80' : ''}`}
                        onClick={() =>
                          navigate(`/activities/${activity._id || activity.id}`)
                        }
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-buddy-purple/5 to-buddy-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative w-full z-10 flex flex-col md:flex-row">
                          <div className="relative max-w-[150px] overflow-hidden h-48 md:h-auto">
                            <div className="absolute inset-0 bg-gradient-to-br from-buddy-purple/30 to-buddy-blue/30 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <img
                              src={
                                activity.bannerImage ||
                                activity.image ||
                                "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                              }
                              alt={activity.title}
                              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${ended ? 'grayscale-[30%]' : ''}`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r"></div>
                            <div className="absolute top-3 left-3">
                              {ended ? (
                                <Badge className="bg-buddy-gray-100 text-buddy-gray-600 border-0 shadow-sm">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Ended
                                </Badge>
                              ) : (
                                <Badge className="bg-white/90 text-buddy-purple border-0 shadow-sm">
                                  <Star className="w-3 h-3 mr-1" />
                                  Popular
                                </Badge>
                              )}
                            </div>
                            <div className="absolute bottom-3 left-3 md:hidden">
                              <span className="bg-white/80 backdrop-blur-sm text-buddy-purple px-2 py-0.5 rounded-full text-xs font-medium shadow-sm">
                                {activity.category}
                              </span>
                            </div>
                          </div>
                          <div className="flex-grow p-5">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-lg">
                                    {activity.title}
                                  </h3>
                                  <span className="hidden md:inline-block bg-buddy-purple/10 text-buddy-purple px-2 py-0.5 rounded-full text-xs font-medium">
                                    {activity.category}
                                  </span>
                                  {ended && (
                                    <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 text-xs">
                                      Completed
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-buddy-gray-500 mb-4 line-clamp-3">
                                  {activity.description}
                                </p>
                              </div>
                              <div className="flex-shrink-0 mt-3 md:mt-0 w-full flex justify-between items-center">
                                <div className="flex flex-wrap items-center text-xs text-buddy-gray-500 gap-2">
                                  <span className="bg-buddy-gray-100/70 px-3 py-1 rounded-full flex items-center shadow-sm">
                                    <Clock className="h-3 w-3 mr-1 text-buddy-gray-400" />
                                    {formatDate(activity.startDate)}
                                  </span>
                                  <span className="bg-buddy-gray-100/70 px-3 py-1 rounded-full flex items-center shadow-sm">
                                    <MapPin className="h-3 w-3 mr-1 text-buddy-gray-400" />
                                    {activity.location || "Virtual"}
                                  </span>
                                  <span className="bg-buddy-gray-100/70 px-3 py-1 rounded-full flex items-center shadow-sm">
                                    <Users className="h-3 w-3 mr-1 text-buddy-gray-400" />
                                    {activity.participants?.length || 0} buddies
                                  </span>
                                </div>
                                {ended ? (
                                  <Button
                                    variant="outline"
                                    className="rounded-full border-buddy-gray-300 text-buddy-gray-600 px-6 hover:bg-buddy-gray-100"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(
                                        `/activities/${activity._id || activity.id}`
                                      );
                                    }}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    View Results
                                  </Button>
                                ) : (
                                  <Button
                                    className="rounded-full bg-gradient-to-r from-buddy-purple to-buddy-blue text-white px-6 hover:shadow-lg shadow-md group-hover:scale-105 transition-transform"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(
                                        `/activities/${activity._id || activity.id}`
                                      );
                                    }}
                                  >
                                    <Heart className="w-4 h-4 mr-2" />
                                    Join Now
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card className="p-10 text-center rounded-2xl bg-white/90 backdrop-blur-sm border border-white shadow-lg">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-buddy-blue/20 to-buddy-purple/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Compass className="h-8 w-8 text-buddy-blue" />
                    </div>
                    {/* <div className="absolute -top-1 -right-1 w-5 h-5 bg-buddy-orange/20 rounded-full flex items-center justify-center">
                      <Sparkles className="h-2 w-2 text-buddy-orange" />
                    </div> */}
                  </div>
                  <h3 className="text-xl font-bold text-buddy-gray-800 mb-3">
                    No activities to discover yet
                  </h3>
                  <p className="text-buddy-gray-500 mb-6 max-w-sm mx-auto">
                    We're working on finding amazing activities for you. Check
                    back soon or create your own!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={() => navigate("/activities")}
                      className="bg-gradient-to-r from-buddy-blue to-buddy-purple text-white rounded-full px-6 py-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                      size="small"
                    >
                      <Compass className="w-4 h-4 mr-2" />
                      Browse All
                    </Button>
                    <Button
                      onClick={() => navigate("/activities/create")}
                      variant="outline"
                      className="border-buddy-blue/30 text-buddy-blue hover:bg-buddy-blue/10 rounded-full px-6 py-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200"
                      size="small"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create One
                    </Button>
                  </div>
                </Card>
              )}
            </section>
          </div>

          {isAuthenticated && (
            <div className="space-y-8">
              <section
                className="animate-fade-in"
                style={{ animationDelay: "0.25s" }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold flex items-center mb-1">
                      <Users className="mr-2 h-5 w-5 text-buddy-purple" />
                      <span className="bg-gradient-to-r from-buddy-purple-dark to-buddy-purple bg-clip-text text-transparent">
                        Your Buddy Squad
                      </span>
                    </h2>
                    <p className="text-sm text-buddy-gray-600">
                      Your amazing support team! 💪
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => navigate("/buddies?tab=my")}
                    className="hover:bg-buddy-purple/5 text-buddy-purple rounded-full"
                  >
                    View All
                  </Button>
                </div>

                {connectedBuddies.length > 0 ? (
                  <div className="space-y-2">
                    {connectedBuddies.map((buddy) => (
                      <Card
                        key={buddy._id || buddy.id}
                        className="p-3 hover-card rounded-xl bg-white/90 backdrop-blur-sm border border-buddy-purple/20 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer group"
                        onClick={() =>
                          navigate(`/profile/${buddy.id || buddy._id}`)
                        }
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative flex-shrink-0">
                            <Avatar
                              src={buddy.avatar || buddy.profileImage}
                              alt={buddy.name}
                              size="sm"
                              className="border-2 border-buddy-purple/20 rounded-full"
                            />
                            <div
                              className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${buddy.isOnline ? "bg-buddy-blue" : "bg-buddy-gray-400"}`}
                            ></div>
                          </div>
                          <div className="flex-grow min-w-0">
                            <h3 className="font-medium text-buddy-gray-900 text-sm truncate">
                              {buddy.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-buddy-gray-500 truncate">
                                {buddy.isOnline ? "Online" : "Offline"}
                              </span>
                              <span className="text-xs bg-buddy-purple/10 text-buddy-purple px-1.5 py-0.5 rounded-full">
                                {buddy.sharedActivities || 0}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="small"
                            className="text-buddy-purple hover:bg-buddy-purple/5 p-1.5 h-auto opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle message action - could navigate to messages or open chat
                              navigate("/messages");
                            }}
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center rounded-2xl bg-white/90 backdrop-blur-sm border border-buddy-purple/20 shadow-lg">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-buddy-purple/20 to-buddy-blue/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Users className="h-8 w-8 text-buddy-purple" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-buddy-orange/20 rounded-full flex items-center justify-center">
                        <Heart className="h-2 w-2 text-buddy-orange" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-buddy-gray-800 mb-3">
                      Find Your Squad!
                    </h3>
                    <p className="text-buddy-gray-500 mb-6 max-w-sm mx-auto leading-relaxed">
                      Connect with amazing people who share your interests and
                      start building meaningful relationships together.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        onClick={() => navigate("/buddies")}
                        className="bg-gradient-to-r from-buddy-purple to-buddy-blue text-white rounded-full px-6 py-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                        size="small"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Find Buddies
                      </Button>
                      <Button
                        onClick={() => navigate("/activities")}
                        variant="outline"
                        className="border-buddy-purple/30 text-buddy-purple hover:bg-buddy-purple/10 rounded-full px-6 py-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200"
                        size="small"
                      >
                        <Compass className="w-4 h-4 mr-2" />
                        Join Activities
                      </Button>
                    </div>
                  </Card>
                )}
              </section>

              <section
                className="animate-fade-in"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold flex items-center mb-1">
                      <UserPlus className="mr-2 h-5 w-5 text-buddy-blue" />
                      <span className="bg-gradient-to-r from-buddy-blue-dark to-buddy-blue bg-clip-text text-transparent">
                        Perfect Matches
                      </span>
                    </h2>
                    <p className="text-sm text-buddy-gray-600">
                      People you'll love connecting with! 💫
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => navigate("/buddies")}
                    className="hover:bg-buddy-blue/5 text-buddy-blue rounded-full"
                  >
                    Find More
                  </Button>
                </div>

                {suggestedBuddies.length > 0 ? (
                  <div className="space-y-2">
                    {suggestedBuddies.map((buddy, index) => (
                      <Card
                        key={buddy._id || buddy.id || index}
                        className="p-3 hover-card rounded-xl bg-white/90 backdrop-blur-sm border border-buddy-blue/20 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer group"
                        onClick={() =>
                          navigate(`/profile/${buddy._id || buddy.id}`)
                        }
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative flex-shrink-0">
                            <Avatar
                              src={buddy.avatar || buddy.profileImage}
                              alt={buddy.name}
                              size="sm"
                              className="border-2 border-buddy-blue/20 rounded-full"
                            />
                            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-buddy-blue rounded-full flex items-center justify-center">
                              <CheckCircle className="w-1.5 h-1.5 text-white" />
                            </div>
                          </div>
                          <div className="flex-grow min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-buddy-gray-900 text-sm truncate">
                                {buddy.name}
                              </h3>
                              <span className="text-xs bg-buddy-blue/10 text-buddy-blue px-1.5 py-0.5 rounded-full font-medium">
                                {buddy.matchPercentage || 85}%
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {buddy.interests
                                ?.slice(0, 2)
                                .map((interest, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs bg-buddy-blue/10 text-buddy-blue px-1.5 py-0.5 rounded-full"
                                  >
                                    {interest}
                                  </span>
                                ))}
                              {buddy.interests && buddy.interests.length > 2 && (
                                <span className="text-xs text-buddy-gray-500">
                                  +{buddy.interests.length - 2}
                                </span>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="small"
                            className="text-buddy-blue hover:bg-buddy-blue/5 p-1.5 h-auto opacity-0 group-hover:opacity-100 transition-all"
                            onClick={async (e) => {
                              e.stopPropagation();
                              try {
                                await BuddyConnectionService.sendBuddyRequest({
                                  recipientId: buddy._id || buddy.id,
                                  message: "Let's be buddies!",
                                });
                                toast({
                                  title: "Connection request sent!",
                                  description: `Sent a buddy request to ${buddy.name}`,
                                });
                              } catch (error) {
                                toast({
                                  title: "Failed to send request",
                                  description: "Please try again later.",
                                  variant: "destructive",
                                });
                              }
                            }}
                          >
                            <Heart className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-4 text-center rounded-xl bg-white/90 backdrop-blur-sm border border-buddy-blue/20 shadow-sm">
                    <div className="w-10 h-10 bg-buddy-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <UserPlus className="h-5 w-5 text-buddy-blue" />
                    </div>
                    <h3 className="text-base font-semibold mb-1">
                      Find Your People!
                    </h3>
                    <p className="text-buddy-gray-500 mb-3 text-xs">
                      Discover amazing people who share your passions
                    </p>
                    <Button
                      onClick={() => navigate("/buddies")}
                      className="bg-gradient-to-r from-buddy-blue to-buddy-purple text-white rounded-full px-4 shadow-sm hover:shadow-md"
                      size="small"
                    >
                      <Compass className="w-3 h-3 mr-1" />
                      Explore Buddies
                    </Button>
                  </Card>
                )}
              </section>

              <section
                className="animate-fade-in"
                style={{ animationDelay: "0.4s" }}
              >
                <Card className="p-6 rounded-3xl bg-white/90 backdrop-blur-sm border border-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-buddy-purple/10 rounded-full flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-buddy-purple" />
                    </div>
                    <h3 className="font-semibold bg-gradient-to-r from-buddy-purple to-buddy-blue bg-clip-text text-transparent">
                      Today's Schedule
                    </h3>
                  </div>
                  <Separator className="mb-4 bg-buddy-gray-200/50" />

                  <div className="text-center py-6">
                    <div className="w-16 h-16 rounded-full bg-buddy-purple/10 flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-8 w-8 text-buddy-purple" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2">
                      Your day is wide open!
                    </h4>
                    <p className="text-buddy-gray-500 mb-6 text-sm">
                      Perfect time to join an activity or create something new
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        onClick={() => navigate("/activities")}
                        className="bg-gradient-to-r from-buddy-purple to-buddy-blue text-white rounded-full px-6 button-shine shadow-md hover:shadow-lg"
                        size="small"
                      >
                        <Compass className="w-4 h-4 mr-2" />
                        Explore
                      </Button>
                      <Button
                        onClick={() => navigate("/activities/create")}
                        variant="outline"
                        className="border-buddy-purple/20 text-buddy-purple hover:bg-buddy-purple/5 rounded-full px-6"
                        size="small"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create
                      </Button>
                    </div>
                  </div>
                </Card>
              </section>

              <section
                className="animate-fade-in"
                style={{ animationDelay: "0.5s" }}
              >
                <Card className="p-6 bg-gradient-to-br from-buddy-purple via-buddy-purple to-buddy-blue text-white rounded-3xl hover:shadow-2xl transition-all duration-300 border-0 shadow-xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-xl"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/3 blur-lg"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-white/20 rounded-full">
                        <Gift className="h-6 w-6 text-yellow-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Unlock Premium</h3>
                        <p className="text-xs text-white/70">
                          Limited time offer
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-white/90 mb-4">
                      Get unlimited activities, advanced analytics, and priority
                      support to supercharge your journey!
                    </p>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl font-bold">$9.99</span>
                      <span className="text-sm text-white/70 line-through">
                        $19.99
                      </span>
                      <Badge className="bg-yellow-400/20 text-yellow-200 border-yellow-400/30">
                        50% OFF
                      </Badge>
                    </div>
                    <Button
                      variant="secondary"
                      size="small"
                      className="bg-white text-buddy-purple hover:bg-white/90 rounded-full shadow-md hover:shadow-lg w-full"
                    >
                      {/* <Sparkles className="w-4 h-4 mr-2" /> */}
                      Upgrade Now
                    </Button>
                  </div>
                </Card>
              </section>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Dashboard;
