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
  ArrowLeft,
  Share2,
  Edit3,
  Flame,
  Download,
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/layout/Container";
import AppLayout from "@/components/layout/AppLayout";
import ActivityDashboard from "@/components/activities/ActivityDashboard";
import ActivityLeaderboard from "@/components/activities/ActivityLeaderboard";
import ActivityGallery from "@/components/activities/ActivityGallery";
import ActivitySchedule from "@/components/activities/ActivitySchedule";
import MilestoneProgress from "@/components/activities/MilestoneProgress";
import DataExport from "@/components/activities/DataExport";
import ActivityCheckin from "@/components/activities/ActivityCheckin";
import ActivityPartners from "@/components/activities/ActivityPartners";
import MessageBoard from "@/components/activities/MessageBoard";
import CheckInDialog from "@/components/activities/CheckInDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { differenceInDays } from "date-fns";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { VariantProps } from "class-variance-authority";
import EditActivityDialog from "@/components/activities/EditActivityDialog";
import ShareActivityModal from "@/components/activities/ShareActivityModal";
import BannerEditModal from "@/components/activities/BannerEditModal";
import { useActivityStore } from "@/store/activity.store";
import { useCheckInStore } from "@/store/checkin.store";
import { useBadgeStore } from "@/store/badge.store";
import { useAuth } from "@/store/auth.store";
import { useToast } from "@/hooks/use-toast";
import {
  isActivityCreator,
  isActivityParticipant,
} from "@/types/activity-types";
import { CheckInService } from "@/services/api/activity/reaction.service";

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

const formatDuration = (duration: number, unit: string) => {
  return `${duration} ${unit}${duration > 1 ? "s" : ""}`;
};

const formatFrequency = (frequency: number, unit: string) => {
  return `${frequency}x ${unit}`;
};

const ActivityPage = () => {
  const { activityId } = useParams<{ activityId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isBannerEditModalOpen, setIsBannerEditModalOpen] = useState(false);
  const [hasCheckedInCurrentPeriod, setHasCheckedInCurrentPeriod] =
    useState(false);
  const [isLoadingCheckInStatus, setIsLoadingCheckInStatus] = useState(false);
  const [activityStats, setActivityStats] = useState({
    longestStreak: 0,
    highestCheckIns: 0,
    averageProgress: 0,
  });
  const isMobile = useIsMobile();

  const {
    isLoading: isLoadingActivities,
    fetchActivityById,
    currentActivity,
    updateActivity,
  } = useActivityStore();

  const { fetchCheckInsByActivity, fetchCheckInStats, refreshActivityData } =
    useCheckInStore();

  const { fetchUserBadges } = useBadgeStore();

  useEffect(() => {
    if (!activityId) {
      navigate("/activities");
      return;
    }

    // Load activity data
    fetchActivityById(activityId);

    // Load check-in related data
    const loadCheckInData = async () => {
      try {
        console.log("🔄 Loading check-in data for activity:", activityId);

        // Load check-ins for the activity
        await fetchCheckInsByActivity(activityId);

        // Load check-in stats for the current user
        await fetchCheckInStats(activityId);

        // Load user badges for this activity
        await fetchUserBadges(activityId);

        // Refresh activity data to get updated stats
        await refreshActivityData(activityId);

        console.log("✅ Check-in data loaded successfully");
      } catch (error) {
        console.error("❌ Failed to load check-in data:", error);
      }
    };

    loadCheckInData();
  }, [
    activityId,
    navigate,
    fetchActivityById,
    fetchCheckInsByActivity,
    fetchCheckInStats,
    fetchUserBadges,
    refreshActivityData,
  ]);

  // Check if user has checked in for current period
  useEffect(() => {
    const checkCurrentPeriodStatus = async () => {
      if (!user?._id || !activityId) return;

      setIsLoadingCheckInStatus(true);
      try {
        const response =
          await CheckInService.getCurrentPeriodStatus(activityId);
        setHasCheckedInCurrentPeriod(response.data.hasCheckedIn);
      } catch (error) {
        console.error("Failed to check current period status:", error);
      } finally {
        setIsLoadingCheckInStatus(false);
      }
    };

    checkCurrentPeriodStatus();
  }, [activityId, user?._id]);

  // Fetch activity statistics
  useEffect(() => {
    const fetchActivityStatistics = async () => {
      if (!activityId) return;

      try {
        console.log("📊 Fetching activity statistics for:", activityId);
        const response = await CheckInService.getActivityStatistics(activityId);
        console.log("📊 Activity statistics response:", response);

        setActivityStats({
          longestStreak: response.data.longestStreak,
          highestCheckIns: response.data.highestCheckIns,
          averageProgress: response.data.averageProgress,
        });
      } catch (error) {
        console.error("Failed to fetch activity statistics:", error);
        // Fallback to basic stats from activity data
        if (currentActivity) {
          setActivityStats({
            longestStreak: currentActivity.streakCount || 0,
            highestCheckIns: currentActivity.checkins || 0,
            averageProgress: currentActivity.progress || 0,
          });
        }
      }
    };

    fetchActivityStatistics();
  }, [activityId]);

  if (isLoadingActivities || isLoading) {
    return <div>Loading...</div>;
  }

  if (!currentActivity) {
    return <div>Activity not found</div>;
  }

  // Add debug log
  console.log("Activity data from query:", currentActivity);

  // Format the data for display
  const displayData = {
    name: currentActivity.title || "No title available",
    description: currentActivity.description || "No description available",
    duration: formatDuration(currentActivity.proposedDuration || 0, "month"),
    frequency: formatFrequency(
      currentActivity.checkinFrequency || 0,
      currentActivity.checkinFrequencyUnit || ""
    ),
    category: currentActivity.category || "No category available",
    bannerImage:
      currentActivity.bannerImage ||
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=2940", // You might want to add a default banner
    participants: currentActivity.participants || [],
    participantCount: Array.isArray(currentActivity.participants)
      ? currentActivity.participants.length
      : 0,
    // Use server-computed values
    checkins: currentActivity.checkins || 0,
    progress: currentActivity.progress || 0,
    streakCount: currentActivity.streakCount || 0,
    totalDays: currentActivity.totalDays || 0,
    daysCompleted: currentActivity.daysCompleted || 0,
    admin: currentActivity.admin,
    id: currentActivity._id || currentActivity.id,
  };

  // Add debug log
  console.log("Display data:", displayData);

  const { status, label, variant } = getActivityStatus(
    new Date(currentActivity.startDate || ""),
    currentActivity.endDate ? new Date(currentActivity.endDate) : new Date()
  );

  // Check if current user is a participant using helper function
  const userId = user?._id || user?.id;
  const isUserParticipant = currentActivity
    ? isActivityParticipant(currentActivity, userId)
    : false;

  // Direct admin comparison check - use both _id and id fields
  const adminId = currentActivity?.admin?._id || currentActivity?.admin?.id;
  const isUserAdmin = user && currentActivity?.admin && userId === adminId;

  // Handle banner update
  const handleBannerUpdate = async (newBanner: string, bannerFile?: File) => {
    if (!currentActivity || !activityId) return;

    try {
      // If it's a file upload, we'll need to handle file upload to server
      // For now, we'll just update the banner URL
      const updateData = {
        bannerImage: newBanner,
      };

      await updateActivity(activityId, updateData);

      // Refresh the activity data to show the new banner
      await fetchActivityById(activityId);
    } catch (error) {
      console.error("Error updating banner:", error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-buddy-purple/5 via-white to-buddy-blue/5 relative">
      <div className="absolute inset-0 z-[-10] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5MzUxRTkiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PHBhdGggZD0iTTM2IDM0aDN2M2gtM3Ztf00zMCAzaDN2M2gtM3pNMTcgMTdoM3YzaC0zek0zNiAxN2gzdjNoLTN6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50 pointer-events-none"></div>
      <div className="relative mb-8">
        <div className="absolute inset-0 z-[-10] bg-gradient-to-r from-buddy-purple/70 to-buddy-blue/70 mix-blend-multiply" />
        <div
          className="relative h-80 md:h-80 w-full bg-cover bg-center z-[1]"
          style={{ backgroundImage: `url(${displayData.bannerImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 z-[-1]"></div>
          <div className="mx-auto absolute top-4 right-0 flex items-center justify-between md:px-8 lg:px-12 w-full max-w-7xl z-10">
            <Button
              variant="outline"
              onClick={() => navigate("/activities")}
              className="shadow-lg rounded-full bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Badge
                className="py-1 px-3"
                variant={
                  variant as VariantProps<typeof badgeVariants>["variant"]
                }
              >
                {label}
              </Badge>
              {isUserAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsBannerEditModalOpen(true)}
                  className="h-8 w-8 p-0 bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 hover:scale-110 transition-all duration-300 rounded-full"
                  title="Edit banner"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsShareModalOpen(true)}
                className="h-8 w-8 p-0 bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 hover:scale-110 transition-all duration-300 rounded-full"
                title="Share"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-end h-full pb-8 px-4 md:px-8 lg:px-12 w-full max-w-7xl mx-auto">
            <div className="w-full text-white">
              <div className="flex flex-col md:flex-row md:justify-between md:items-end">
                <div>
                  <div className="flex flex-wrap gap-3 mb-2">
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                      {displayData.category}
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                      {displayData.duration}
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                      {displayData.frequency}
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2 text-shadow-lg">
                    {displayData.name}
                  </h1>
                  <p className="max-w-3xl text-white text-shadow-lg text-sm md:text-base line-clamp-3">
                    {displayData.description}
                  </p>
                </div>
                <div className="flex flex-row gap-2 mt-4 md:mt-0 z-[10]">
                  {isUserParticipant && (
                    <CheckInDialog
                      activity={currentActivity}
                      onCheckInComplete={() => {
                        console.log("Check-in completed");
                        // Refresh check-in status after successful check-in
                        setHasCheckedInCurrentPeriod(true);
                      }}
                    >
                      <Button
                        variant="default"
                        disabled={
                          hasCheckedInCurrentPeriod || isLoadingCheckInStatus
                        }
                        className="shadow-lg rounded-full bg-gradient-to-r from-buddy-purple to-buddy-blue border-0 px-3 sm:px-5 text-white disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                      >
                        <CheckCircle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">
                          {isLoadingCheckInStatus
                            ? "Checking..."
                            : hasCheckedInCurrentPeriod
                              ? "Already Checked In"
                              : "Check-in Now"}
                        </span>
                        <span className="sm:hidden">
                          {isLoadingCheckInStatus
                            ? "Checking..."
                            : hasCheckedInCurrentPeriod
                              ? "Checked In"
                              : "Check-in"}
                        </span>
                      </Button>
                    </CheckInDialog>
                  )}
                  {user &&
                    currentActivity &&
                    isActivityCreator(currentActivity, userId) && (
                      <EditActivityDialog activity={currentActivity}>
                        <Button
                          variant="outline"
                          className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 rounded-full px-3 sm:px-5 text-xs sm:text-sm"
                        >
                          <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">
                            Manage Activity
                          </span>
                          <span className="sm:hidden">Manage</span>
                        </Button>
                      </EditActivityDialog>
                    )}
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
                  {displayData.participantCount} participants
                </p>
              </div>
            </Card>

            <Card className="p-4 flex items-center bg-gradient-to-br from-buddy-blue/10 to-buddy-blue/5 rounded-2xl border border-white/80 hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-buddy-blue/20 flex items-center justify-center mr-3">
                <ClipboardCheck className="w-5 h-5 text-buddy-blue" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-buddy-gray-600">
                  Most Check-ins
                </p>
                {/* <p className="text-xs text-buddy-gray-500">
                  Highest: {activityStats.highestCheckIns}
                </p> */}
                <p className="text-lg md:text-xl font-semibold bg-gradient-to-r from-buddy-blue to-buddy-blue-light bg-clip-text text-transparent">
                  {displayData.checkins}
                </p>
              </div>
            </Card>

            <Card className="p-4 flex items-center bg-gradient-to-br from-buddy-green/10 to-buddy-green/5 rounded-2xl border border-white/80 hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-buddy-green/20 flex items-center justify-center mr-3">
                <ChartPieIcon className="w-5 h-5 text-buddy-green" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-buddy-gray-600">
                  Avg. Activity Progress
                </p>
                <p className="text-lg md:text-xl font-semibold bg-gradient-to-r from-buddy-green to-buddy-green-light bg-clip-text text-transparent">
                  {activityStats.averageProgress}%
                </p>
                {/* <p className="text-xs text-buddy-gray-500">
                  Avg: {activityStats.averageProgress}%
                </p> */}
              </div>
            </Card>

            <Card className="p-4 flex items-center bg-gradient-to-br from-amber-500/10 to-amber-500/5 rounded-2xl border border-white/80 hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center mr-3">
                <Flame className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-buddy-gray-600">
                  Longest Streak
                </p>
                <p className="text-lg md:text-xl font-semibold bg-gradient-to-r from-amber-500 to-amber-400 bg-clip-text text-transparent">
                  {activityStats.longestStreak} days
                </p>
                {/* <p className="text-xs text-buddy-gray-500">
                  Across all participants
                </p> */}
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
              <div className="flex w-full min-w-max">
                <TabsTrigger
                  value="dashboard"
                  className="flex-1 py-3 md:py-4 px-2 md:px-3 lg:px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-buddy-purple data-[state=active]:text-buddy-purple data-[state=active]:bg-transparent focus:bg-buddy-gray-100/50 whitespace-nowrap"
                >
                  <ChartPieIcon className="mr-1 md:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </TabsTrigger>

                <TabsTrigger
                  value="leaderboard"
                  className="flex-1 py-3 md:py-4 px-2 md:px-3 lg:px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-buddy-purple data-[state=active]:text-buddy-purple data-[state=active]:bg-transparent focus:bg-buddy-gray-100/50 whitespace-nowrap"
                >
                  <Medal className="mr-1 md:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Leaderboard</span>
                </TabsTrigger>

                {/* TODO: Re-enable milestones tab after MVP launch */}
                {/* <TabsTrigger
                  value="milestones"
                  className="flex-1 py-4 px-3 md:px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-buddy-purple data-[state=active]:text-buddy-purple data-[state=active]:bg-transparent focus:bg-buddy-gray-100/50"
                >
                  <Star className="mr-2 h-4 w-4" />
                  {!isMobile && "Milestones"}
                </TabsTrigger> */}

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
                  className="flex-1 py-3 md:py-4 px-2 md:px-3 lg:px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-buddy-purple data-[state=active]:text-buddy-purple data-[state=active]:bg-transparent focus:bg-buddy-gray-100/50 whitespace-nowrap"
                >
                  <ClipboardCheck className="mr-1 md:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Check-in</span>
                </TabsTrigger>

                <TabsTrigger
                  value="partners"
                  className="flex-1 py-3 md:py-4 px-2 md:px-3 lg:px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-buddy-purple data-[state=active]:text-buddy-purple data-[state=active]:bg-transparent focus:bg-buddy-gray-100/50 whitespace-nowrap"
                >
                  <Users className="mr-1 md:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Partners</span>
                </TabsTrigger>

                <TabsTrigger
                  value="messages"
                  className="flex-1 py-3 md:py-4 px-2 md:px-3 lg:px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-buddy-purple data-[state=active]:text-buddy-purple data-[state=active]:bg-transparent focus:bg-buddy-gray-100/50 whitespace-nowrap"
                >
                  <MessageCircle className="mr-1 md:mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Messages</span>
                </TabsTrigger>

                {/* TODO: Re-enable export tab after MVP launch */}
                {/* <TabsTrigger
                  value="export"
                  className="flex-1 py-4 px-3 md:px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-buddy-purple data-[state=active]:text-buddy-purple data-[state=active]:bg-transparent focus:bg-buddy-gray-100/50"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {!isMobile && "Export"}
                </TabsTrigger> */}
              </div>
            </TabsList>

            <TabsContent value="dashboard" className="p-0 mt-0 animate-fade-in">
              <ActivityDashboard activity={currentActivity} />
            </TabsContent>

            <TabsContent
              value="leaderboard"
              className="p-0 mt-0 animate-fade-in overflow-hidden"
            >
              <ActivityLeaderboard
                activityId={displayData.id}
                userRole={isUserAdmin ? "admin" : "member"}
                currentUserId={userId}
              />
            </TabsContent>

            {/* TODO: Re-enable milestones tab content after MVP launch */}
            {/* <TabsContent
              value="milestones"
              className="p-0 mt-0 animate-fade-in"
            >
              <div className="p-6">
                <MilestoneProgress
                  activityId={displayData.id}
                  userId={userId}
                />
              </div>
            </TabsContent> */}

            {/* TODO: Add gallery tab in v2 */}
            {/* <TabsContent value="gallery" className="p-0 mt-0 animate-fade-in">
                <ActivityGallery activityId={displayData.id} />
              </TabsContent> */}

            {/* TODO: Add schedule tab in v2 */}
            {/* <TabsContent value="schedule" className="p-0 mt-0 animate-fade-in">
                <ActivitySchedule activityId={displayData.id} />
              </TabsContent> */}

            <TabsContent value="checkin" className="p-0 mt-0 animate-fade-in">
              <ActivityCheckin activityId={displayData.id} />
            </TabsContent>

            {/* TODO: Add partners tab in v2 */}
            <TabsContent value="partners" className="p-0 mt-0 animate-fade-in">
              <ActivityPartners activityId={displayData.id} />
            </TabsContent>

            <TabsContent value="messages" className="p-0 mt-0 animate-fade-in">
              <div className="p-6">
                <MessageBoard activityId={displayData.id} />
              </div>
            </TabsContent>

            {/* TODO: Re-enable export tab content after MVP launch */}
            {/* <TabsContent value="export" className="p-0 mt-0 animate-fade-in">
              <div className="p-6">
                <DataExport
                  activityId={displayData.id}
                  activityTitle={displayData.title}
                />
              </div>
            </TabsContent> */}
          </Tabs>
        </Card>
      </div>

      {/* Share Activity Modal */}
      <ShareActivityModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        activityUrl={`${window.location.origin}/activity/${activityId}`}
        activityTitle={currentActivity?.title}
      />

      {/* Banner Edit Modal */}
      <BannerEditModal
        isOpen={isBannerEditModalOpen}
        onClose={() => setIsBannerEditModalOpen(false)}
        currentBanner={displayData.bannerImage}
        onBannerUpdate={handleBannerUpdate}
        activityId={activityId || ""}
      />
    </div>
  );
};

export default ActivityPage;
