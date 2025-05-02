import React from "react";
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
import { useActivity } from "@/hooks/use-activity";
import { IActivityResult } from "@/types/activity-types";
import CheckInCard from "./CheckInCard";

interface ActivityDashboardProps {
  activity: IActivityResult;
  onViewAllMembers?: () => void;
}

const ActivityDashboard: React.FC<ActivityDashboardProps> = ({ activity }) => {
  // Mock data for charts and metrics (would come from API in a real app)
  const checkInData = [
    { name: "Mon", checkins: 18 },
    { name: "Tue", checkins: 22 },
    { name: "Wed", checkins: 16 },
    { name: "Thu", checkins: 25 },
    { name: "Fri", checkins: 20 },
    { name: "Sat", checkins: 12 },
    { name: "Sun", checkins: 15 },
  ];

  const participants = [
    {
      id: 1,
      name: "Sophia Kim",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      checkIns: 28,
      streak: 14,
    },
    {
      id: 2,
      name: "Marcus Chen",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      checkIns: 26,
      streak: 8,
    },
    {
      id: 3,
      name: "Aisha Patel",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      checkIns: 24,
      streak: 12,
    },
    {
      id: 4,
      name: "James Wilson",
      avatar:
        "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      checkIns: 22,
      streak: 6,
    },
    {
      id: 5,
      name: "Emma Davis",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      checkIns: 20,
      streak: 4,
    },
  ];

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
                          {[...Array(7)].map((_, i) => {
                            // Random completed status for demonstration
                            const completed = Math.random() > 0.3;
                            return completed ? (
                              <CheckCircle
                                key={i}
                                className="h-4 w-4 text-buddy-green"
                              />
                            ) : (
                              <XCircle
                                key={i}
                                className="h-4 w-4 text-buddy-gray-300"
                              />
                            );
                          })}
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
              rules={activity.rules || []}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityDashboard;
