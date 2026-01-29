import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Info,
  Flame,
  Award,
  PlusCircle,
  Calendar,
  Users,
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import CheckInDialog from "./CheckInDialog";
import CheckInCard from "./CheckInCard";
import { useActivityStore } from "@/store/activity.store";
import { useCheckInStore } from "@/store/checkin.store";
import { useBadgeStore } from "@/store/badge.store";
import { useAuth } from "@/store/auth.store";
import { CheckInService } from "@/services/api/activity/reaction.service";
import {
  IActivityResult,
  isActivityParticipant,
  isActivityCreator,
} from "@/types/activity-types";
import { format } from "date-fns";

interface ActivityCheckinProps {
  activityId: string;
  isActivityEnded?: boolean;
}

const ActivityCheckin: React.FC<ActivityCheckinProps> = ({ activityId, isActivityEnded = false }) => {
  console.log(
    "🎯 ActivityCheckin component rendered with activityId:",
    activityId
  );

  try {
    const { fetchActivityById, currentActivity } = useActivityStore();
    const { user } = useAuth();
    console.log("👤 User object:", user);
    console.log("👤 User ID:", user?._id);

    // Check if user is a participant or admin
    const userId = user?._id || user?.id;
    const isUserParticipant = currentActivity
      ? isActivityParticipant(currentActivity, userId)
      : false;
    const isUserAdmin = currentActivity
      ? isActivityCreator(currentActivity, userId)
      : false;
    const canAccessCheckIn = isUserParticipant || isUserAdmin;

    console.log("🔐 Access check:", {
      isUserParticipant,
      isUserAdmin,
      canAccessCheckIn,
      userId,
      activityId,
    });
    const {
      checkIns,
      stats,
      isLoading,
      fetchCheckInsByActivity,
      fetchCheckInStats,
      hasCheckedInToday,
      refreshActivityData,
      getComments,
    } = useCheckInStore();
    const { userBadges, fetchUserBadges } = useBadgeStore();
    const [hasCheckedInCurrentPeriod, setHasCheckedInCurrentPeriod] =
      useState(false);
    const [isLoadingPeriodStatus, setIsLoadingPeriodStatus] = useState(false);
    const [userProgress, setUserProgress] = useState({
      progress: 0,
      completedCheckIns: 0,
      totalAvailableCheckIns: 0,
    });
    const [isLoadingProgress, setIsLoadingProgress] = useState(false);

    // Fetch check-in data when component mounts
    useEffect(() => {
      const loadCheckInData = async () => {
        if (!activityId) {
          console.log("❌ No activityId provided to ActivityCheckin");
          return;
        }

        console.log(
          "🔄 ActivityCheckin: Loading check-in data for activity:",
          activityId
        );

        try {
          // Fetch activity data first, then check-ins and stats
          await fetchActivityById(activityId);

          // Fetch check-ins and stats for this activity
          await Promise.all([
            fetchCheckInsByActivity(activityId),
            fetchCheckInStats(activityId),
          ]);

          console.log("✅ ActivityCheckin: Check-in data loaded successfully");
        } catch (error) {
          console.error(
            "❌ ActivityCheckin: Failed to load check-in data:",
            error
          );
        }
      };

      loadCheckInData();
    }, [
      activityId,
      fetchActivityById,
      fetchCheckInsByActivity,
      fetchCheckInStats,
    ]);

    // Check current period status
    useEffect(() => {
      const checkPeriodStatus = async () => {
        if (!user?._id || !activityId) return;

        setIsLoadingPeriodStatus(true);
        try {
          const response =
            await CheckInService.getCurrentPeriodStatus(activityId);
          setHasCheckedInCurrentPeriod(response.data.hasCheckedIn);
        } catch (error) {
          console.error("Failed to check period status:", error);
        } finally {
          setIsLoadingPeriodStatus(false);
        }
      };

      checkPeriodStatus();
    }, [activityId, user?._id]);

    // Fetch user progress
    useEffect(() => {
      console.log("🔍 ActivityCheckin useEffect triggered:", {
        hasUser: !!user,
        userId: user?._id,
        activityId,
        userObject: user,
      });

      const fetchUserProgress = async () => {
        if (!user?._id || !activityId) {
          console.log("❌ Missing user ID or activity ID:", {
            hasUserId: !!user?._id,
            hasActivityId: !!activityId,
          });
          return;
        }

        console.log("🔄 Fetching user progress for:", {
          activityId,
          userId: user._id,
          userObject: user,
        });
        setIsLoadingProgress(true);
        try {
          console.log("🚀 Making API call to getUserProgress...");
          const response = await CheckInService.getUserProgress(activityId);
          console.log("📊 User progress response:", response);
          console.log("📊 User progress response data:", response.data);
          setUserProgress(response.data);
        } catch (error) {
          console.error("❌ Failed to fetch user progress:", error);
          console.error(
            "❌ Error details:",
            error.response?.data || error.message
          );
        } finally {
          setIsLoadingProgress(false);
        }
      };

      fetchUserProgress();
    }, [activityId, user?._id]);

    const refetchUserProgress = async () => {
      if (!activityId || !user?._id) return;
      try {
        const response = await CheckInService.getUserProgress(activityId);
        setUserProgress(response.data);
      } catch {
        // Non-blocking
      }
    };

    // Use real data from backend
    const realStreakCount = stats?.currentStreak || 0;
    const realTotalCheckIns = stats?.totalCheckIns || 0;
    const realOnTimePercentage = stats?.onTimePercentage || 0;
    const lastCheckInDate = stats?.lastCheckInDate
      ? new Date(stats.lastCheckInDate)
      : null;

    // Calculate if user missed a check-in period (only show if they actually have check-ins)
    const hasMissedCheckIn = (() => {
      if (realTotalCheckIns === 0 || !lastCheckInDate || !currentActivity) {
        return false;
      }

      // Get activity check-in frequency
      const { checkinFrequency, checkinFrequencyUnit, startDate } =
        currentActivity;
      if (!checkinFrequency || !checkinFrequencyUnit || !startDate) {
        return false;
      }

      // Calculate the expected next check-in date based on frequency
      const activityStart = new Date(startDate);
      const lastCheckIn = new Date(lastCheckInDate);
      const now = new Date();

      // Calculate period duration based on frequency unit
      let periodDuration: number;
      switch (checkinFrequencyUnit) {
        case "daily":
          periodDuration = 24 * 60 * 60 * 1000; // 1 day in milliseconds
          break;
        case "weekly":
          periodDuration = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
          break;
        case "monthly":
          periodDuration = 30 * 24 * 60 * 60 * 1000; // 1 month in milliseconds
          break;
        default:
          periodDuration = 24 * 60 * 60 * 1000; // Default to daily
      }

      // Calculate the expected next check-in date
      const expectedNextCheckIn = new Date(
        lastCheckIn.getTime() + periodDuration * checkinFrequency
      );

      // Check if we're past the expected next check-in date
      return now > expectedNextCheckIn;
    })();

    // Check if user has already checked in for current period
    const userHasCheckedInCurrentPeriod = hasCheckedInCurrentPeriod;

    // Streak color and intensity functions
    const getStreakColor = (streak: number) => {
      if (streak >= 10) return "text-red-500"; // Red for high streaks
      if (streak >= 5) return "text-yellow-500"; // Yellow for medium streaks
      return "text-amber-500"; // Amber for low streaks
    };

    const getStreakIntensity = (streak: number) => {
      if (streak >= 10) return "High Intensity 🔥";
      if (streak >= 5) return "Medium Intensity 🔥";
      return "Getting Started 🔥";
    };

    // Generate badges from real data
    const getBadgeIcon = (iconName: string, color: string) => {
      const iconProps = { className: `w-6 h-6`, style: { color } };

      switch (iconName) {
        case "CheckCircle":
          return <CheckCircle {...iconProps} />;
        case "Flame":
          return <Flame {...iconProps} />;
        case "Award":
          return <Award {...iconProps} />;
        case "Star":
          return <Award {...iconProps} />;
        case "Clock":
          return <Calendar {...iconProps} />;
        default:
          return <Award {...iconProps} />;
      }
    };

    const badges = userBadges.map((userBadge) => ({
      id: userBadge._id,
      name: userBadge.badge.name,
      icon: getBadgeIcon(userBadge.badge.icon, userBadge.badge.color),
      earned: true,
      earnedAt: userBadge.earnedAt,
      rarity: userBadge.badge.rarity,
      description: userBadge.badge.description,
    }));

    // Log check-in data for debugging
    console.log("📊 ActivityCheckin: Current check-in data:", {
      checkInsCount: checkIns.length,
      checkIns: checkIns,
      stats: stats,
      isLoading: isLoading,
      user: user?._id,
      currentActivity: currentActivity,
      activityId: activityId,
    });

    // Group check-ins by date for display
    const checkInsByDate = checkIns.reduce(
      (acc, checkIn) => {
        const date = new Date(checkIn.checkInDate).toDateString();
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(checkIn);
        return acc;
      },
      {} as Record<string, typeof checkIns>
    );

    console.log(
      "📅 ActivityCheckin: Check-ins grouped by date:",
      checkInsByDate
    );

    // Convert real check-ins to display format
    const checkInPeriods = Object.entries(checkInsByDate)
      .map(([dateString, dayCheckIns]) => {
        const date = new Date(dateString);
        const firstCheckIn = dayCheckIns[0];

        // Debug: Log the current activity data
        console.log("🔍 Processing check-in period for date:", dateString, {
          currentActivity: currentActivity,
          participants: currentActivity?.participants,
          participantsLength: currentActivity?.participants?.length,
          dayCheckIns: dayCheckIns,
          dayCheckInsLength: dayCheckIns.length,
        });

        // Fix: Use the actual number of unique participants who checked in on this day
        const uniqueParticipants = new Set(
          dayCheckIns.map((ci) => ci.user._id)
        );
        const totalParticipants = Math.max(
          currentActivity?.participants?.length || 1, // At least 1 (the current user)
          uniqueParticipants.size // Or the number of unique participants who checked in
        );
        const checkedInParticipants = uniqueParticipants.size;

        console.log("📊 Calculated participants:", {
          totalParticipants,
          checkedInParticipants,
          uniqueParticipants: Array.from(uniqueParticipants),
        });

        return {
          date,
          title: `${format(date, "MMM dd")}: Check-in Day`,
          description: `Check-ins from ${checkedInParticipants} participant${checkedInParticipants !== 1 ? "s" : ""}`,
          image: firstCheckIn?.imageUrl || undefined,
          totalParticipants,
          checkedInParticipants,
          comments: getComments(firstCheckIn._id).length, // Real comment count
          likes: 0, // Note: Likes are now handled by the ReactionButton component
          isCheckedIn: dayCheckIns.some((ci) => ci.user._id === user?._id), // Check current user
          checkIns: dayCheckIns,
        };
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    console.log(
      "🎯 ActivityCheckin: Final check-in periods to display:",
      checkInPeriods
    );

    // Debug: Log each period's check-ins data
    checkInPeriods.forEach((period, index) => {
      console.log(`📋 Period ${index + 1} (${period.title}):`, {
        date: period.date,
        checkInsCount: period.checkIns.length,
        checkIns: period.checkIns,
        totalParticipants: period.totalParticipants,
        checkedInParticipants: period.checkedInParticipants,
        isCheckedIn: period.isCheckedIn,
      });
    });

  // Show access denied message for non-participants
  if (!canAccessCheckIn) {
    return (
      <div className="p-4 md:p-6">
        <Card className="p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-buddy-gray-100 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-buddy-gray-400" />
            </div>
            {isActivityEnded ? (
              <>
                <h3 className="text-xl font-semibold text-buddy-gray-800 mb-2">
                  Activity Ended
                </h3>
                <p className="text-buddy-gray-600 mb-6">
                  This activity has ended. Check-in features are no longer available.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-buddy-gray-800 mb-2">
                  Join Activity to Check In
                </h3>
                <p className="text-buddy-gray-600 mb-6">
                  You need to be a participant in this activity to access check-in
                  features and view check-in history.
                </p>
                <div className="space-y-3">
                  <p className="text-sm text-buddy-gray-500">
                    As a participant, you'll be able to:
                  </p>
                  <ul className="text-sm text-buddy-gray-600 space-y-1">
                    <li>• Check in and track your progress</li>
                    <li>• View your streak and statistics</li>
                    <li>• See check-in history and threads</li>
                    <li>• Earn badges and achievements</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    );
  }

    return (
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          <div className="lg:col-span-8">
            <Card className="p-4 md:p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Check-in History</h3>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-buddy-purple/10 text-buddy-purple border-buddy-purple/20"
                  >
                    {realTotalCheckIns} check-ins
                  </Badge>
                  {realStreakCount > 0 && (
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-700 border-amber-200"
                    >
                      <Flame className="w-3 h-3 mr-1" />
                      {realStreakCount} day streak
                    </Badge>
                  )}
                </div>
              </div>

              {isActivityEnded ? (
                <div className="mb-6 p-4 bg-buddy-gray-100 border border-buddy-gray-200 rounded-lg">
                  <div className="flex items-start">
                    <Info className="text-buddy-gray-500 w-5 h-5 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-buddy-gray-800">
                        This activity has ended
                      </h4>
                      <p className="text-buddy-gray-600 text-sm mt-1">
                        Great job on completing this activity! Check-ins are no longer available, 
                        but you can still view your progress and check-in history.
                      </p>
                    </div>
                  </div>
                </div>
              ) : hasMissedCheckIn && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start">
                    <Info className="text-amber-500 w-5 h-5 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-800">
                        Oops! You missed a check-in period
                      </h4>
                      <p className="text-amber-700 text-sm mt-1">
                        Don't give up! Keep going with your activity.
                        Consistency builds habits - every check-in counts!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-buddy-purple"></div>
                  <span className="ml-3 text-buddy-gray-600">
                    Loading check-ins...
                  </span>
                </div>
              ) : checkInPeriods.length > 0 ? (
                <div className="space-y-2">
                  {checkInPeriods.map(
                    (period, index) =>
                      currentActivity && (
                        <CheckInCard
                          key={index}
                          date={period.date}
                          title={period.title}
                          description={period.description}
                          image={period.image}
                          totalParticipants={period.totalParticipants}
                          checkedInParticipants={period.checkedInParticipants}
                          comments={period.comments}
                          likes={period.likes}
                          isCheckedIn={period.isCheckedIn}
                          activity={currentActivity}
                          checkIns={period.checkIns}
                        />
                      )
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-buddy-gray-300 mx-auto mb-3" />
                  <h3 className="text-base font-medium text-buddy-gray-800 mb-2">
                    {isActivityEnded ? "No check-ins were recorded" : "No check-ins yet"}
                  </h3>
                  <p className="text-buddy-gray-600 mb-4 text-sm">
                    {isActivityEnded 
                      ? "This activity ended without any check-ins being recorded."
                      : "Be the first to check in and start building your streak!"
                    }
                  </p>
                  {currentActivity && !isActivityEnded && (
                    <CheckInDialog
                      activity={currentActivity}
                      onCheckInComplete={() => {
                        // Refresh all data from backend after successful check-in
                        console.log(
                          "🔄 Refreshing data after check-in completion"
                        );
                        refreshActivityData(currentActivity._id);
                        refetchUserProgress();
                      }}
                    >
                      <Button
                        type="button"
                        disabled={
                          userHasCheckedInCurrentPeriod || isLoadingPeriodStatus
                        }
                        className={`rounded-full px-6 py-2 shadow-md transition-all duration-300 ${
                          userHasCheckedInCurrentPeriod
                            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                            : "bg-gradient-to-r from-buddy-purple to-buddy-blue text-white hover:shadow-lg"
                        }`}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {isLoadingPeriodStatus
                          ? "Checking..."
                          : userHasCheckedInCurrentPeriod
                            ? "Already Checked In This Period"
                            : "Check In Now"}
                      </Button>
                    </CheckInDialog>
                  )}
                </div>
              )}
            </Card>
          </div>

          <div className="lg:col-span-4">
            <Card className="p-4 md:p-6">
              <h3 className="text-lg font-semibold mb-4">Your Progress</h3>

              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-buddy-gray-600">
                    Your Progress
                  </span>
                  <span className="text-sm font-medium">
                    {isLoadingProgress ? "..." : `${userProgress.progress}%`}
                  </span>
                </div>
                <Progress
                  value={userProgress.progress}
                  className="h-2 bg-buddy-gray-200"
                >
                  <div className="h-full bg-gradient-to-r from-buddy-purple to-buddy-blue rounded-full" />
                </Progress>
                <div className="flex justify-between mt-1 text-xs text-buddy-gray-500">
                  <span>
                    {userProgress.completedCheckIns} check-ins completed
                  </span>
                  <span>
                    {userProgress.totalAvailableCheckIns} total available
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Flame
                    className={`w-6 h-6 ${getStreakColor(realStreakCount)}`}
                  />
                  <span className="font-semibold text-buddy-gray-800">
                    Current Streak
                  </span>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <button className="text-buddy-gray-400 hover:text-buddy-gray-600 ml-2">
                        <Info className="h-5 w-5" />
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 p-4">
                      <h5 className="font-medium mb-2">Streak Information</h5>
                      <p className="text-sm text-buddy-gray-600 mb-3">
                        Your streak increases by 1 each check-in period you
                        complete. Streaks are calculated based on your
                        activity's check-in frequency.
                      </p>
                      <div className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span>Current streak:</span>
                          <span className="font-medium">
                            {realStreakCount} periods
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Best streak:</span>
                          <span className="font-medium">
                            {stats?.longestStreak || 0} periods
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>On-time rate:</span>
                          <span className="font-medium">
                            {realOnTimePercentage}%
                          </span>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-buddy-gray-800">
                    {realStreakCount}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-buddy-gray-700">
                      {getStreakIntensity(realStreakCount)}
                    </div>
                    <div className="text-xs text-buddy-gray-500">
                      {realStreakCount} consecutive period
                      {realStreakCount !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-5" />

              {/* Show success message if user has checked in for current period */}
              {userHasCheckedInCurrentPeriod && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <h4 className="text-green-800 font-semibold">
                        Great job! You've checked in for this period 🎉
                      </h4>
                      <p className="text-green-700 text-sm mt-1">
                        Keep up the momentum and check in again next period!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 mb-6">
                {currentActivity && !isActivityEnded ? (
                  <CheckInDialog
                    activity={currentActivity}
                    onCheckInComplete={() => {
                      // Refresh all data from backend after successful check-in
                      console.log(
                        "🔄 Refreshing data after check-in completion"
                      );
                      refreshActivityData(currentActivity._id);
                      refetchUserProgress();
                    }}
                  >
                    <Button
                      type="button"
                      disabled={
                        userHasCheckedInCurrentPeriod || isLoadingPeriodStatus
                      }
                      className={`w-full py-2 rounded-full shadow-md transition-all duration-300 ${
                        userHasCheckedInCurrentPeriod
                          ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                          : "bg-gradient-to-r from-buddy-purple to-buddy-blue text-white hover:shadow-lg"
                      }`}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {isLoadingPeriodStatus
                        ? "Checking..."
                        : userHasCheckedInCurrentPeriod
                          ? "Already Checked In This Period"
                          : "Check In Now"}
                    </Button>
                  </CheckInDialog>
                ) : isActivityEnded ? (
                  <Button
                    type="button"
                    disabled
                    className="w-full py-2 rounded-full shadow-md bg-buddy-gray-300 text-buddy-gray-600 cursor-not-allowed"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Activity Ended
                  </Button>
                ) : null}
              </div>

              {/* Badges section moved here */}
              <h3 className="text-lg font-semibold mb-4">Your Badges</h3>
              {badges.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className="p-3 border border-buddy-purple/30 bg-buddy-purple/5 rounded-lg text-center transition-all hover:shadow-md"
                    >
                      <div className="w-10 h-10 mx-auto mb-2 flex items-center justify-center rounded-full bg-buddy-purple/10">
                        {badge.icon}
                      </div>
                      <p className="text-xs font-medium text-buddy-gray-800">
                        {badge.name}
                      </p>
                      <p className="text-xs text-buddy-gray-500 mt-1">
                        Earned {format(new Date(badge.earnedAt), "MMM dd")}
                      </p>
                      {badge.rarity > 3 && (
                        <div className="mt-1">
                          <span className="inline-block w-2 h-2 bg-yellow-400 rounded-full"></span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="w-12 h-12 text-buddy-gray-300 mx-auto mb-3" />
                  <p className="text-buddy-gray-500 text-sm">
                    No badges earned yet. Keep checking in to unlock your first
                    badge!
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in ActivityCheckin component:", error);
    return <div>Error loading check-in data</div>;
  }
};

export default ActivityCheckin;
