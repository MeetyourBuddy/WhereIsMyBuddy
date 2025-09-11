import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Users,
  Clock,
  ExternalLink,
} from "lucide-react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Avatar from "@/components/common/Avatar";
import ActivityInfo from "./ActivityInfo";
import { IActivityResult } from "@/types/activity-types";
import { CheckInService } from "@/services/api/activity/reaction.service";
interface ActivityDashboardProps {
  activity: IActivityResult;
  onViewAllMembers?: () => void;
}

const ActivityDashboard: React.FC<ActivityDashboardProps> = ({ activity }) => {
  const [checkInData, setCheckInData] = useState([
    { name: "Mon", checkins: 0 },
    { name: "Tue", checkins: 0 },
    { name: "Wed", checkins: 0 },
    { name: "Thu", checkins: 0 },
    { name: "Fri", checkins: 0 },
    { name: "Sat", checkins: 0 },
    { name: "Sun", checkins: 0 },
  ]);
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!activity?._id && !activity?.id) return;

      const activityId = activity._id || activity.id;
      setIsLoading(true);

      try {
        // Fetch weekly activity data
        const weeklyResponse =
          await CheckInService.getWeeklyActivity(activityId);
        if (weeklyResponse.data?.weeklyData) {
          setCheckInData(weeklyResponse.data.weeklyData);
        }

        // Fetch participant history data for the dashboard
        const historyResponse =
          await CheckInService.getParticipantHistory(activityId);
        if (historyResponse.data?.participants) {
          // Take top 5 participants for the dashboard
          const topParticipants = historyResponse.data.participants
            .slice(0, 5)
            .map((p, index) => ({
              id: p.id,
              name: p.name,
              avatar: p.avatar,
              checkIns: p.checkIns,
              streak: p.streak,
              position: index + 1,
              last7Days: p.last7Days, // Include the last 7 days data
            }));
          setParticipants(topParticipants);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // Keep default empty data on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [activity]);

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
          {/* Weekly Check-in Activity Chart */}
          <Card className="p-6 border border-white/80 rounded-2xl shadow-sm bg-white/90 backdrop-blur-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-buddy-purple to-buddy-blue bg-clip-text text-transparent">
              Weekly Check-in Activity
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={checkInData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #E2E6EF",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="checkins"
                    name="Check-ins"
                    fill="url(#barGradient)"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1000}
                  />
                  <defs>
                    <linearGradient
                      id="barGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#6E56CF" />
                      <stop offset="100%" stopColor="#9E8CFC" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

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
                          <Avatar
                            src={participant.avatar}
                            alt={participant.name}
                            className="mr-3"
                            size="sm"
                          />
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
                                Joined 3 weeks ago and has been consistently
                                checking in.
                              </p>
                              <div className="grid grid-cols-2 gap-2 pt-2">
                                <div className="bg-buddy-gray-100/70 p-2 rounded-md">
                                  <p className="text-xs text-buddy-gray-500">
                                    Completion Rate
                                  </p>
                                  <p className="font-medium">
                                    {Math.round(
                                      (participant.checkIns / 30) * 100
                                    )}
                                    %
                                  </p>
                                </div>
                                <div className="bg-buddy-gray-100/70 p-2 rounded-md">
                                  <p className="text-xs text-buddy-gray-500">
                                    Best Day
                                  </p>
                                  <p className="font-medium">Tuesday</p>
                                </div>
                              </div>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-buddy-gray-800 bg-amber-100/50 text-amber-600 px-2 py-0.5 rounded-full">
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
              admin={activity.admin}
              rules={activity.rules || []}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityDashboard;
