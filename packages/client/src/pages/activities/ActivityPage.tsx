import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ChartPieIcon,
  Medal,
  ImageIcon,
  Calendar,
  ClipboardCheck,
  Users,
  TrendingUp,
  Star,
  MessageCircle,
  Wrench,
  Settings,
  Link,
  CheckCircle,
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/layout/Container";
import AppLayout from "@/components/layout/AppLayout";
import ActivityDashboard from "@/components/activities/ActivityDashboard";
import ActivityLeaderboard from "@/components/activities/ActivityLeaderboard";
import ActivityGallery from "@/components/activities/ActivityGallery";
import ActivitySchedule from "@/components/activities/ActivitySchedule";
import ActivityCheckin from "@/components/activities/ActivityCheckin";
import ActivityPartners from "@/components/activities/ActivityPartners";
import MessageBoard from "@/components/activities/MessageBoard";
import CheckInDialog from "@/components/activities/CheckInDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { differenceInDays } from "date-fns";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { VariantProps } from "class-variance-authority";
import { useActivity } from '@/hooks/use-activity';
import { IActivityResult, IActivityResponse } from "@/types/activity-types";

const getActivityStatus = (startDate: Date, endDate: Date) => {
  const now = new Date();
  const daysToStart = differenceInDays(startDate, now);
  const daysToEnd = differenceInDays(endDate, now);

  if (daysToStart > 0)
    return { status: "starting-soon", label: "Starting Soon", variant: "info" };
  if (daysToEnd >= 0 && daysToEnd <= 7)
    return { status: "ending-soon", label: "Ending Soon", variant: "warning" };
  if (daysToEnd < 0)
    return { status: "ended", label: "Ended", variant: "danger" };
  return { status: "ongoing", label: "Ongoing", variant: "success" };
};

const ActivityPage = () => {
  const { activityId } = useParams<{ activityId: string }>();
  const navigate = useNavigate();
  const { getActivity } = useActivity();
  
  useEffect(() => {
    if (!activityId) {
      console.error('Activity ID is missing in URL params');
      navigate('/activities');
      return;
    }
  }, [activityId, navigate]);
  
  const { data: activityData, isLoading } = activityId 
    ? getActivity(activityId) as { data: IActivityResponse | undefined; isLoading: boolean }
    : { data: undefined, isLoading: false };
    
  const [activeTab, setActiveTab] = useState("dashboard");
  const isMobile = useIsMobile();

  const activity = activityData?.data?.activity as IActivityResult | undefined;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!activity) {
    return <div>Activity not found</div>;
  }

  const { status, label, variant } = getActivityStatus(
    activity.startDate,
    activity.endedAt
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-buddy-purple/5 via-white to-buddy-blue/5 relative">
      <div className="absolute inset-0 z-[-10] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5MzUxRTkiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PHBhdGggZD0iTTM2IDM0aDN2M2gtM3Ztf00zMCAzaDN2M2gtM3pNMTcgMTdoM3YzaC0zek0zNiAxN2gzdjNoLTN6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50 pointer-events-none"></div>

      <div className="relative mb-8">
        <div className="absolute inset-0 z-[-10] bg-gradient-to-r from-buddy-purple/70 to-buddy-blue/70 mix-blend-multiply" />
        <div
          className="relative h-64 md:h-80 w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${activity.bannerImage})` }}
        >
          <Badge
            className="absolute top-4 right-4 py-1 px-3 z-10"
            variant={variant as VariantProps<typeof badgeVariants>["variant"]}
          >
            {label}
          </Badge>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
          <div className="flex items-end h-full pb-8 px-4 md:px-8 lg:px-12 w-full max-w-7xl mx-auto">
            <div className="w-full text-white">
              <div className="flex flex-col md:flex-row md:justify-between md:items-end">
                <div>
                  <div className="flex flex-wrap gap-3 mb-2">
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                      {activity.category}
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                      {activity.duration}
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                      {activity.frequency}
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2 text-shadow-lg">
                    {activity.name}
                  </h1>
                  <p className="max-w-3xl text-white text-shadow-lg text-sm md:text-base">
                    {activity.description}
                  </p>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0 z-[10]">
                  <CheckInDialog
                    onCheckInComplete={() => console.log("Check-in completed")}
                  >
                    <Button
                      variant="default"
                      className="shadow-lg rounded-full bg-gradient-to-r from-buddy-purple to-buddy-blue border-0 px-5 text-white"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Check-in Now
                    </Button>
                  </CheckInDialog>
                  <Button
                    variant="outline"
                    className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 rounded-full px-5"
                    onClick={() => {
                      // Navigate to edit page
                      window.location.href = `/activities/edit/${activity.id}`;
                    }}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Activity
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-8 lg:px-12 mx-auto max-w-7xl">
        <div className="mb-8 animate-fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Card className="p-4 flex items-center bg-gradient-to-br from-buddy-purple/10 to-buddy-purple/5 rounded-2xl border border-white/80 hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-buddy-purple/20 flex items-center justify-center mr-3">
                <Users className="w-5 h-5 text-buddy-purple" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-buddy-gray-600">
                  Participants
                </p>
                <p className="text-lg md:text-xl font-semibold">
                  {activity.participants.length} participants
                </p>
              </div>
            </Card>

            <Card className="p-4 flex items-center bg-gradient-to-br from-buddy-blue/10 to-buddy-blue/5 rounded-2xl border border-white/80 hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-buddy-blue/20 flex items-center justify-center mr-3">
                <ClipboardCheck className="w-5 h-5 text-buddy-blue" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-buddy-gray-600">
                  Check-ins
                </p>
                <p className="text-lg md:text-xl font-semibold bg-gradient-to-r from-buddy-blue to-buddy-blue-light bg-clip-text text-transparent">
                  {activity.checkins}
                </p>
              </div>
            </Card>

            <Card className="p-4 flex items-center bg-gradient-to-br from-buddy-green/10 to-buddy-green/5 rounded-2xl border border-white/80 hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-buddy-green/20 flex items-center justify-center mr-3">
                <ChartPieIcon className="w-5 h-5 text-buddy-green" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-buddy-gray-600">
                  Progress
                </p>
                <p className="text-lg md:text-xl font-semibold bg-gradient-to-r from-buddy-green to-buddy-green-light bg-clip-text text-transparent">
                  {activity.progress}%
                </p>
              </div>
            </Card>

            <Card className="p-4 flex items-center bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-2xl border border-white/80 hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center mr-3">
                <Medal className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-buddy-gray-600">
                  Current Streak
                </p>
                <p className="text-lg md:text-xl font-semibold bg-gradient-to-r from-amber-500 to-amber-400 bg-clip-text text-transparent">
                  {activity.streakCount} days
                </p>
              </div>
            </Card>
          </div>
        </div>

        <Card
          className="overflow-hidden animate-fade-in rounded-2xl border border-white/80 shadow-md mb-8"
          style={{ animationDelay: "0.1s" }}
        >
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full bg-white dark:bg-buddy-gray-800 border-b border-buddy-gray-200/50 rounded-none p-0 h-auto overflow-x-auto">
              <div className="flex w-full">
                <TabsTrigger
                  value="dashboard"
                  className="flex-1 py-4 px-3 md:px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-buddy-purple data-[state=active]:text-buddy-purple data-[state=active]:bg-transparent focus:bg-buddy-gray-100/50"
                >
                  <ChartPieIcon className="mr-2 h-4 w-4" />
                  {!isMobile && "Dashboard"}
                </TabsTrigger>

                <TabsTrigger
                  value="leaderboard"
                  className="flex-1 py-4 px-3 md:px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-buddy-purple data-[state=active]:text-buddy-purple data-[state=active]:bg-transparent focus:bg-buddy-gray-100/50"
                >
                  <Medal className="mr-2 h-4 w-4" />
                  {!isMobile && "Leaderboard"}
                </TabsTrigger>

                {/* TODO: Add gallery tab in v2 */}
                {/* <TabsTrigger
                  value="gallery"
                  className="flex-1 py-4 px-3 md:px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-buddy-purple data-[state=active]:text-buddy-purple data-[state=active]:bg-transparent focus:bg-buddy-gray-100/50"
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  {!isMobile && "Gallery"}
                </TabsTrigger> */}

                {/* TODO: Add schedule tab in v2 */}
                {/* <TabsTrigger
                  value="schedule"
                  className="flex-1 py-4 px-3 md:px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-buddy-purple data-[state=active]:text-buddy-purple data-[state=active]:bg-transparent focus:bg-buddy-gray-100/50"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {!isMobile && "Schedule"}
                </TabsTrigger> */}

                <TabsTrigger
                  value="checkin"
                  className="flex-1 py-4 px-3 md:px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-buddy-purple data-[state=active]:text-buddy-purple data-[state=active]:bg-transparent focus:bg-buddy-gray-100/50"
                >
                  <ClipboardCheck className="mr-2 h-4 w-4" />
                  {!isMobile && "Check-in"}
                </TabsTrigger>

                {/* TODO: Add partners tab in v2 */}
                {/* <TabsTrigger
                  value="partners"
                  className="flex-1 py-4 px-3 md:px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-buddy-purple data-[state=active]:text-buddy-purple data-[state=active]:bg-transparent focus:bg-buddy-gray-100/50"
                >
                  <Users className="mr-2 h-4 w-4" />
                  {!isMobile && "Partners"}
                </TabsTrigger> */}

                <TabsTrigger
                  value="messages"
                  className="flex-1 py-4 px-3 md:px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-buddy-purple data-[state=active]:text-buddy-purple data-[state=active]:bg-transparent focus:bg-buddy-gray-100/50"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {!isMobile && "Messages"}
                </TabsTrigger>
              </div>
            </TabsList>

            <TabsContent value="dashboard" className="p-0 mt-0 animate-fade-in">
              <ActivityDashboard activityId={activity.id} />
            </TabsContent>

            <TabsContent
              value="leaderboard"
              className="p-0 mt-0 animate-fade-in"
            >
              <ActivityLeaderboard activityId={activity.id} />
            </TabsContent>

            {/* TODO: Add gallery tab in v2 */}
            {/* <TabsContent value="gallery" className="p-0 mt-0 animate-fade-in">
                <ActivityGallery activityId={activity.id} />
              </TabsContent> */}

            {/* TODO: Add schedule tab in v2 */}
            {/* <TabsContent value="schedule" className="p-0 mt-0 animate-fade-in">
                <ActivitySchedule activityId={activity.id} />
              </TabsContent> */}

            <TabsContent value="checkin" className="p-0 mt-0 animate-fade-in">
              <ActivityCheckin
                activityId={activity.id}
                streakCount={activity.streakCount}
                totalDays={activity.totalDays}
                daysCompleted={activity.daysCompleted}
              />
            </TabsContent>

            {/* TODO: Add partners tab in v2 */}
            {/* <TabsContent value="partners" className="p-0 mt-0 animate-fade-in">
                  <ActivityPartners activityId={activity.id} />
                </TabsContent> */}

            <TabsContent value="messages" className="p-0 mt-0 animate-fade-in">
              <div className="p-6">
                <MessageBoard activityId={activity.id} />
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default ActivityPage;
