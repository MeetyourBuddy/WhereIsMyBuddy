import React, { useState, useEffect } from "react";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Users,
  Clock,
  ExternalLink,
} from "lucide-react";
import { differenceInDays } from "date-fns";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ActivityInfo from "./ActivityInfo";
import ActivityCalendarGrid from "./ActivityCalendarGrid";
import { IActivityResult } from "@/types/activity-types";
import { useActivityData } from "@/hooks/useActivityData";
import { CheckInService } from "@/services/api/activity/reaction.service";
import { CheckInService as CheckInDataService } from "@/services/api/checkin/checkin-service";
interface ActivityDashboardProps {
  activity: IActivityResult;
  onViewAllMembers?: () => void;
}

const ActivityDashboard: React.FC<ActivityDashboardProps> = ({ activity }) => {
  const activityId = activity._id || activity.id;
  const { weeklyQuery, participantsQuery } = useActivityData(activityId);
  
  // Check if activity has ended
  const isActivityEnded = activity.endDate 
    ? differenceInDays(new Date(activity.endDate), new Date()) < 0 
    : false;

  // Fetch leaderboard data for more accurate statistics
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);

  // Fetch all check-ins for accurate last 7 days calculation
  const [allCheckIns, setAllCheckIns] = useState([]);
  const [isLoadingCheckIns, setIsLoadingCheckIns] = useState(false);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      if (!activityId) return;

      console.log("🔄 Fetching leaderboard data for activity:", activityId);
      setIsLoadingLeaderboard(true);
      try {
        const response =
          await CheckInService.getActivityLeaderboard(activityId);
        if (response.data?.participants) {
          console.log(
            "✅ ALL-TIME DATA - Leaderboard data fetched successfully:"
          );
          console.log("📊 Raw leaderboard response:", response.data);
          console.log("👥 Participants array:", response.data.participants);

          // Log each participant's all-time data
          response.data.participants.forEach((participant, index) => {
            console.log(`  ${index + 1}. ${participant.name}:`);
            console.log(`     - All-time check-ins: ${participant.checkIns}`);
            console.log(`     - Current streak: ${participant.streak} days`);
            console.log(`     - Points: ${participant.points}`);
            console.log(`     - Role: ${participant.role}`);
            console.log(`     - Last check-in: ${participant.lastCheckIn}`);
            console.log(`     - Join date: ${participant.joinDate}`);
          });

          setLeaderboardData(response.data.participants);
        }
      } catch (error) {
        console.error("❌ Failed to fetch leaderboard data:", error);
      } finally {
        setIsLoadingLeaderboard(false);
      }
    };

    fetchLeaderboardData();
  }, [activityId]);

  // Fetch all check-ins for accurate last 7 days calculation
  useEffect(() => {
    const fetchAllCheckIns = async () => {
      if (!activityId) return;

      try {
        console.log(
          "🔄 Fetching all check-ins for last 7 days calculation:",
          activityId
        );
        setIsLoadingCheckIns(true);
        const checkIns =
          await CheckInDataService.getCheckInsByActivity(activityId);
        if (checkIns) {
          console.log(
            "✅ All check-ins fetched for last 7 days:",
            checkIns.length,
            "check-ins"
          );
          setAllCheckIns(checkIns);
        }
      } catch (error) {
        console.error(
          "❌ Failed to fetch all check-ins for last 7 days:",
          error
        );
      } finally {
        setIsLoadingCheckIns(false);
      }
    };

    fetchAllCheckIns();
  }, [activityId]);

  // Extract data from queries
  const checkInData = weeklyQuery.data?.weeklyData || [
    { name: "Mon", checkins: 0, date: "" },
    { name: "Tue", checkins: 0, date: "" },
    { name: "Wed", checkins: 0, date: "" },
    { name: "Thu", checkins: 0, date: "" },
    { name: "Fri", checkins: 0, date: "" },
    { name: "Sat", checkins: 0, date: "" },
    { name: "Sun", checkins: 0, date: "" },
  ];

  // Log weekly data when it changes
  useEffect(() => {
    if (weeklyQuery.data?.weeklyData) {
      console.log("📅 Weekly query data updated:", weeklyQuery.data.weeklyData);
    }
  }, [weeklyQuery.data]);

  // Function to calculate last 7 days data from actual check-ins
  const calculateLast7Days = (participantId: string) => {
    const last7Days = [];
    const today = new Date();

    // Generate last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split("T")[0];

      // Check if participant has a check-in on this date
      const hasCheckIn = allCheckIns.some((checkIn) => {
        const checkInDate = new Date(checkIn.checkInDate)
          .toISOString()
          .split("T")[0];
        return checkIn.user._id === participantId && checkInDate === dateKey;
      });

      last7Days.push({
        date: dateKey,
        checkedIn: hasCheckIn,
      });
    }

    return last7Days;
  };

  const participants =
    participantsQuery.data?.participants?.slice(0, 5).map((p, index) => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      checkIns: p.checkIns,
      streak: p.streak,
      position: index + 1,
      last7Days:
        allCheckIns.length > 0 ? calculateLast7Days(p.id) : p.last7Days,
    })) || [];

  // Log calculated last 7 days data
  useEffect(() => {
    if (allCheckIns.length > 0 && participants.length > 0) {
      console.log("📅 Calculated last 7 days data for participants:");
      participants.forEach((participant, index) => {
        const checkedInDays =
          participant.last7Days?.filter((day) => day.checkedIn).length || 0;
        console.log(
          `  ${index + 1}. ${participant.name}: ${checkedInDays}/7 days checked in`
        );
        console.log(`     Last 7 days:`, participant.last7Days);
      });
    }
  }, [allCheckIns, participants]);

  const isLoading =
    weeklyQuery.isLoading || participantsQuery.isLoading || isLoadingCheckIns;

  if (isLoading) {
    return (
      <div className="p-6 bg-gradient-to-br from-white via-buddy-gray-50/50 to-white animate-fade-in">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-buddy-purple mx-auto mb-4"></div>
            <p className="text-buddy-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-white via-buddy-gray-50/50 to-white animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Chart and Participant History (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Activity Calendar Grid */}
          <ActivityCalendarGrid
            activityId={activity._id || activity.id}
            weeklyData={checkInData}
          />

          {/* Participant Check-in History */}
          <Card className="p-6 border border-white/80 rounded-2xl shadow-sm bg-white/90 backdrop-blur-sm hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-buddy-blue to-buddy-purple bg-clip-text text-transparent">
                Participant Check-in History
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-buddy-gray-200/50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-buddy-gray-500">
                      Participant
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-buddy-gray-500">
                      Check-ins
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-buddy-gray-500">
                      Streak
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-buddy-gray-500">
                      Last 7 Days
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((participant) => (
                    <tr
                      key={participant.id}
                      className="border-b border-buddy-gray-200/50 hover:bg-buddy-gray-50/50 transition-colors duration-150"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <Avatar className="w-8 h-8 mr-3">
                            <AvatarImage
                              src={participant.avatar}
                              alt={participant.name}
                            />
                            <AvatarFallback className="bg-buddy-purple/10 text-buddy-purple text-xs">
                              {participant.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-buddy-gray-800">
                            {participant.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <span className="text-buddy-purple font-medium cursor-pointer bg-buddy-purple/5 px-2 py-0.5 rounded-full">
                              {participant.checkIns} check-ins
                            </span>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80 p-4 border-buddy-gray-200/80 rounded-xl shadow-md bg-white/95 backdrop-blur-sm">
                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold">
                                {participant.name}'s Activity
                              </h4>
                              <p className="text-sm text-buddy-gray-600">
                                {participant.checkIns > 0
                                  ? `Has completed ${participant.checkIns} check-ins with a ${participant.streak} day streak.`
                                  : "Hasn't checked in yet."}
                              </p>
                              <div className="grid grid-cols-2 gap-2 pt-2">
                                <div className="bg-buddy-gray-100/70 p-2 rounded-md">
                                  <p className="text-xs text-buddy-gray-500">
                                    Total Check-ins
                                  </p>
                                  <p className="font-medium">
                                    {participant.checkIns}
                                  </p>
                                </div>
                                <div className="bg-buddy-gray-100/70 p-2 rounded-md">
                                  <p className="text-xs text-buddy-gray-500">
                                    Current Streak
                                  </p>
                                  <p className="font-medium">
                                    {participant.streak} days
                                  </p>
                                </div>
                                <div className="bg-buddy-gray-100/70 p-2 rounded-md">
                                  <p className="text-xs text-buddy-gray-500">
                                    Last 7 Days
                                  </p>
                                  <p className="font-medium">
                                    {participant.last7Days?.filter(
                                      (day) => day.checkedIn
                                    ).length || 0}
                                    /7
                                  </p>
                                </div>
                                <div className="bg-buddy-gray-100/70 p-2 rounded-md">
                                  <p className="text-xs text-buddy-gray-500">
                                    Recent Activity
                                  </p>
                                  <p className="font-medium">
                                    {participant.last7Days
                                      ?.slice(-3)
                                      .filter((day) => day.checkedIn).length ||
                                      0}
                                    /3
                                  </p>
                                </div>
                              </div>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium bg-amber-100/50 text-amber-600 px-2 py-0.5 rounded-full">
                          {participant.streak} days
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-1">
                          {participant.last7Days?.map((day, i) => {
                            return day.checkedIn ? (
                              <div key={i} title={`${day.date} - Checked in`}>
                                <CheckCircle className="h-4 w-4 text-buddy-green" />
                              </div>
                            ) : (
                              <div key={i} title={`${day.date} - No check-in`}>
                                <XCircle className="h-4 w-4 text-buddy-gray-300" />
                              </div>
                            );
                          }) ||
                            [...Array(7)].map((_, i) => (
                              <XCircle
                                key={i}
                                className="h-4 w-4 text-buddy-gray-300"
                              />
                            ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right column - Activity Info (1/3 width) */}
        <div>
          {activity && (
            <ActivityInfo
              id={activity._id || activity.id}
              title={activity.title}
              description={activity.description || ""}
              category={activity.category}
              // location={activity.location}
              startDate={
                activity.startDate ? new Date(activity.startDate) : new Date()
              }
              endDate={
                activity.endDate ? new Date(activity.endDate) : new Date()
              }
              duration={`${activity.checkinFrequency}`}
              frequency={activity.checkinFrequencyUnit}
              tags={activity.tags || []}
              goals={activity.goals || []}
              participants={activity.participants || []}
              maxParticipants={activity.maxParticipants}
              admin={activity.admin}
              rules={activity.rules || []}
              isActivityEnded={isActivityEnded}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityDashboard;
