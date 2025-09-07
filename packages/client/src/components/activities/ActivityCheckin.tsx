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
import { useAuth } from "@/store/auth.store";
import { IActivityResult } from "@/types/activity-types";
import { format } from "date-fns";

interface ActivityCheckinProps {
  activityId: string;
  streakCount: number;
  totalDays: number;
  daysCompleted: number;
}

const ActivityCheckin: React.FC<ActivityCheckinProps> = ({
  activityId,
  streakCount,
  totalDays,
  daysCompleted,
}) => {
  const { fetchActivityById, currentActivity } = useActivityStore();
  const { user } = useAuth();
  const {
    checkIns,
    stats,
    isLoading,
    fetchCheckInsByActivity,
    fetchCheckInStats,
    hasCheckedInToday,
    refreshActivityData,
  } = useCheckInStore();

  // Fetch activity and check-in data from backend on page load
  useEffect(() => {
    if (activityId) {
      console.log("🔄 Loading fresh data for activity:", activityId);
      fetchActivityById(activityId);
      refreshActivityData(activityId);
    }
  }, [activityId, fetchActivityById, refreshActivityData]);

  // Use real data from backend
  const realStreakCount = stats?.currentStreak || 0;
  const realTotalCheckIns = stats?.totalCheckIns || 0;
  const realOnTimePercentage = stats?.onTimePercentage || 0;
  const lastCheckInDate = stats?.lastCheckInDate
    ? new Date(stats.lastCheckInDate)
    : null;

  // Calculate if user missed yesterday's check-in (only show if they actually have check-ins)
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const missedYesterday =
    realTotalCheckIns > 0 &&
    lastCheckInDate &&
    lastCheckInDate.getDate() !== yesterdayDate.getDate();

  // Check if user has already checked in today
  const userHasCheckedInToday = hasCheckedInToday(activityId, user?._id);

  // Generate badges - all disabled until we implement badge logic
  const badges = [
    {
      id: 1,
      name: "First Check-in",
      icon: <CheckCircle className="w-6 h-6 text-buddy-green" />,
      earned: false, // Disabled until badge logic is implemented
    },
    {
      id: 2,
      name: "3-Day Streak",
      icon: <Flame className="w-6 h-6 text-amber-500" />,
      earned: false, // Disabled until badge logic is implemented
    },
    {
      id: 3,
      name: "7-Day Streak",
      icon: <Flame className="w-6 h-6 text-amber-500" />,
      earned: false, // Disabled until badge logic is implemented
    },
    {
      id: 4,
      name: "Half-way Hero",
      icon: <Award className="w-6 h-6 text-buddy-purple" />,
      earned: false, // Disabled until badge logic is implemented
    },
    {
      id: 5,
      name: "Completion Star",
      icon: <Award className="w-6 h-6 text-buddy-blue" />,
      earned: false, // Disabled until badge logic is implemented
    },
  ];

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

  // Convert real check-ins to display format
  const checkInPeriods = Object.entries(checkInsByDate)
    .map(([dateString, dayCheckIns]) => {
      const date = new Date(dateString);
      const firstCheckIn = dayCheckIns[0];
      const totalParticipants = currentActivity?.participants?.length || 0;
      const checkedInParticipants = dayCheckIns.length;
      const totalLikes = dayCheckIns.reduce((sum, ci) => sum + ci.likes, 0);

      return {
        date,
        title: `${format(date, "MMM dd")}: Check-in Day`,
        description: `Check-ins from ${checkedInParticipants} participant${checkedInParticipants !== 1 ? "s" : ""}`,
        image: firstCheckIn?.imageUrl || undefined,
        totalParticipants,
        checkedInParticipants,
        comments: 0, // TODO: Implement comments
        likes: totalLikes,
        isCheckedIn: dayCheckIns.some(
          (ci) => ci.user._id === currentActivity?.admin?._id
        ), // TODO: Check current user
        checkIns: dayCheckIns,
      };
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());

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

            {missedYesterday && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start">
                  <Info className="text-amber-500 w-5 h-5 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800">
                      Oops! You missed yesterday's check-in
                    </h4>
                    <p className="text-amber-700 text-sm mt-1">
                      Don't give up! Keep going with your activity today.
                      Consistency builds habits!
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
              <div className="space-y-4">
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
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-buddy-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-buddy-gray-800 mb-2">
                  No check-ins yet
                </h3>
                <p className="text-buddy-gray-600 mb-6">
                  Be the first to check in and start building your streak!
                </p>
                {currentActivity && (
                  <CheckInDialog
                    activity={currentActivity}
                    onCheckInComplete={() => {
                      // Refresh all data from backend after successful check-in
                      console.log(
                        "🔄 Refreshing data after check-in completion"
                      );
                      refreshActivityData(currentActivity._id);
                    }}
                  >
                    <Button
                      type="button"
                      disabled={userHasCheckedInToday}
                      className={`rounded-xl px-6 py-2 shadow-md transition-all duration-300 ${
                        userHasCheckedInToday
                          ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                          : "bg-gradient-to-r from-buddy-purple to-buddy-blue text-white hover:shadow-lg"
                      }`}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {userHasCheckedInToday
                        ? "Already Checked In Today"
                        : "Start Your First Check-in"}
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
                  Check-ins Completed
                </span>
                <span className="text-sm font-medium">
                  {realTotalCheckIns} total
                </span>
              </div>
              <Progress
                value={Math.min(
                  (realTotalCheckIns / Math.max(totalDays, 1)) * 100,
                  100
                )}
                className="h-2 bg-buddy-gray-200"
              >
                <div className="h-full bg-gradient-to-r from-buddy-purple to-buddy-blue rounded-full" />
              </Progress>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-5 h-5 text-amber-500" />
                <span className="font-semibold text-buddy-gray-800">
                  Current Streak
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="w-full bg-buddy-gray-100 h-8 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-700"
                    style={{
                      width: `${Math.min((realStreakCount / 7) * 100, 100)}%`,
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                    {realStreakCount} day{realStreakCount !== 1 ? "s" : ""}
                  </div>
                </div>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <button className="text-buddy-gray-400 hover:text-buddy-gray-600 ml-2">
                      <Info className="h-5 w-5" />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 p-4">
                    <h5 className="font-medium mb-2">Streak Information</h5>
                    <p className="text-sm text-buddy-gray-600 mb-3">
                      Your streak increases by 1 each day you check in. If you
                      miss a day, your streak will reset to 0.
                    </p>
                    <div className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span>Current streak:</span>
                        <span className="font-medium">
                          {realStreakCount} days
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Best streak:</span>
                        <span className="font-medium">
                          {stats?.longestStreak || 0} days
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
              <div className="flex justify-between mt-1 text-xs text-buddy-gray-500 px-1">
                <span>0</span>
                <span>7 days</span>
              </div>
            </div>

            <Separator className="my-5" />

            {/* Show success message if user has checked in today */}
            {userHasCheckedInToday && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <h4 className="text-green-800 font-semibold">
                      Great job! You've checked in today 🎉
                    </h4>
                    <p className="text-green-700 text-sm mt-1">
                      Keep up the momentum and check in again tomorrow!
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2 mb-6">
              {currentActivity && (
                <CheckInDialog
                  activity={currentActivity}
                  onCheckInComplete={() => {
                    // Refresh all data from backend after successful check-in
                    console.log("🔄 Refreshing data after check-in completion");
                    refreshActivityData(currentActivity._id);
                  }}
                >
                  <Button
                    type="button"
                    disabled={userHasCheckedInToday}
                    className={`w-full py-2 rounded-xl shadow-md transition-all duration-300 ${
                      userHasCheckedInToday
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-buddy-purple to-buddy-blue text-white hover:shadow-lg"
                    }`}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {userHasCheckedInToday
                      ? "Already Checked In Today"
                      : "Check-in for Today"}
                  </Button>
                </CheckInDialog>
              )}
            </div>

            {/* Badges section moved here */}
            <h3 className="text-lg font-semibold mb-4">Your Badges</h3>
            <div className="grid grid-cols-2 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3 border rounded-lg text-center transition-all ${
                    badge.earned
                      ? "border-buddy-purple/30 bg-buddy-purple/5"
                      : "border-buddy-gray-200 bg-buddy-gray-50 opacity-60"
                  }`}
                >
                  <div
                    className={`w-10 h-10 mx-auto mb-2 flex items-center justify-center rounded-full ${
                      badge.earned ? "bg-buddy-purple/10" : "bg-buddy-gray-200"
                    }`}
                  >
                    {badge.icon}
                  </div>
                  <p
                    className={`text-xs font-medium ${
                      badge.earned
                        ? "text-buddy-gray-800"
                        : "text-buddy-gray-500"
                    }`}
                  >
                    {badge.name}
                  </p>
                  <p className="text-xs text-buddy-gray-500 mt-1">
                    {badge.earned ? "Earned" : "Locked"}
                  </p>
                </div>
              ))}
              <div className="p-3 border border-dashed border-buddy-gray-300 rounded-lg text-center bg-buddy-gray-50 flex flex-col items-center justify-center">
                <PlusCircle className="w-10 h-10 text-buddy-gray-400 mb-1" />
                <p className="text-xs font-medium text-buddy-gray-500">
                  More to unlock!
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ActivityCheckin;
