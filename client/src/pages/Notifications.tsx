import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Calendar,
  UserPlus,
  MessageSquare,
  Trophy,
  Check,
  HeartHandshake,
  Sparkles,
  Trash2,
  Clock,
  ChevronRight,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
  Flame,
  Users,
  Target,
  Zap,
  Star,
  Activity,
  Mail,
  Inbox,
} from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Container from "@/components/ui/layout/Container";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  NotificationService,
  NotificationData,
} from "@/services/api/notification.service";
import { formatDistanceToNow } from "date-fns";

const Notifications: React.FC = () => {
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  // Fetch notifications from backend
  const fetchNotifications = async (
    pageNum: number = 1,
    reset: boolean = true
  ) => {
    try {
      if (pageNum === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const params: any = {
        page: pageNum,
        limit: 20,
      };

      if (filter !== "all") {
        if (filter === "unread") {
          params.unreadOnly = true;
        } else {
          params.type = filter;
        }
      }

      const response = await NotificationService.getNotifications(params);

      if (reset) {
        setNotifications(response.data.notifications);
      } else {
        setNotifications((prev) => [...prev, ...response.data.notifications]);
      }

      setHasMore(response.data.hasMore);
      setTotal(response.data.total);
      setPage(pageNum);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast({
        title: "Error",
        description: "Failed to load notifications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Load more notifications
  const loadMore = () => {
    if (hasMore && !isLoadingMore) {
      fetchNotifications(page + 1, false);
    }
  };

  // Initial load and filter changes
  useEffect(() => {
    fetchNotifications(1, true);
  }, [filter]);

  const handleMarkAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );
      toast({
        title: "All notifications marked as read",
        description: "Your notification feed has been updated",
      });
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await NotificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await NotificationService.deleteNotification(id);
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );
      setTotal((prev) => prev - 1);
      toast({
        title: "Notification deleted",
        description: "The notification has been removed from your feed",
      });
    } catch (error) {
      console.error("Failed to delete notification:", error);
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      });
    }
  };

  const handleAction = async (id: string, action: string) => {
    // Handle action based on type
    if (action === "accept") {
      toast({
        title: "Buddy request accepted",
        description: "You are now connected with a new buddy",
      });
    } else if (action === "decline") {
      toast({
        title: "Buddy request declined",
        description: "The buddy request has been declined",
      });
    } else if (action === "view") {
      // Navigate to the relevant page
      console.log("View action for notification", id);
    }

    // Mark as read after action
    await handleMarkAsRead(id);
  };

  const filteredNotifications = notifications;
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Function to get empty state content based on filter
  const getEmptyStateContent = (filterType: string) => {
    switch (filterType) {
      case "all":
        return {
          icon: Bell,
          title: "No notifications yet",
          message: "You don't have any notifications yet. Check back later!",
          iconColor: "text-buddy-purple/70",
          bgColor: "from-buddy-purple/20 to-buddy-blue/20",
        };
      case "unread":
        return {
          icon: Inbox,
          title: "All caught up!",
          message:
            "You have no unread notifications. Great job staying on top of things!",
          iconColor: "text-green-500/70",
          bgColor: "from-green-500/20 to-emerald-500/20",
        };
      case "buddy_request":
        return {
          icon: UserPlus,
          title: "No buddy requests",
          message: "You don't have any pending buddy requests at the moment.",
          iconColor: "text-blue-500/70",
          bgColor: "from-blue-500/20 to-cyan-500/20",
        };
      case "activity_comment":
        return {
          icon: MessageSquare,
          title: "No comments yet",
          message:
            "No one has commented on your activities yet. Start engaging with others!",
          iconColor: "text-orange-500/70",
          bgColor: "from-orange-500/20 to-amber-500/20",
        };
      case "milestone_achieved":
        return {
          icon: Trophy,
          title: "No milestones yet",
          message:
            "Keep working on your activities to unlock amazing milestones!",
          iconColor: "text-yellow-500/70",
          bgColor: "from-yellow-500/20 to-orange-500/20",
        };
      case "streak_milestone":
        return {
          icon: Flame,
          title: "No streak milestones",
          message: "Build your activity streaks to unlock streak milestones!",
          iconColor: "text-red-500/70",
          bgColor: "from-red-500/20 to-pink-500/20",
        };
      case "activity_reminder":
        return {
          icon: Clock,
          title: "No reminders",
          message: "You don't have any activity reminders set up yet.",
          iconColor: "text-purple-500/70",
          bgColor: "from-purple-500/20 to-indigo-500/20",
        };
      case "system_welcome":
        return {
          icon: Sparkles,
          title: "Welcome to Buddy!",
          message:
            "You're all set up! Check out other notification types to stay connected.",
          iconColor: "text-buddy-purple/70",
          bgColor: "from-buddy-purple/20 to-buddy-blue/20",
        };
      default:
        return {
          icon: Bell,
          title: "No notifications found",
          message: `No ${filterType} notifications at the moment.`,
          iconColor: "text-buddy-gray-500/70",
          bgColor: "from-buddy-gray-500/20 to-buddy-gray-400/20",
        };
    }
  };

  // Helper function to get notification icon and color
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "buddy_request":
      case "buddy_accepted":
      case "buddy_declined":
        return <UserPlus className="h-6 w-6" />;
      case "milestone_achieved":
      case "streak_milestone":
        return <Trophy className="h-6 w-6" />;
      case "activity_comment":
      case "checkin_comment":
        return <MessageSquare className="h-6 w-6" />;
      case "activity_reminder":
      case "activity_created":
        return <Calendar className="h-6 w-6" />;
      case "system_welcome":
        return <HeartHandshake className="h-6 w-6" />;
      default:
        return <Bell className="h-6 w-6" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "buddy_request":
      case "buddy_accepted":
        return "bg-gradient-to-br from-buddy-purple to-buddy-blue text-white";
      case "milestone_achieved":
      case "streak_milestone":
        return "bg-gradient-to-br from-amber-500 to-amber-400 text-white";
      case "activity_comment":
      case "checkin_comment":
        return "bg-gradient-to-br from-blue-500 to-blue-400 text-white";
      case "activity_reminder":
      case "activity_created":
        return "bg-gradient-to-br from-green-500 to-green-400 text-white";
      case "system_welcome":
        return "bg-gradient-to-br from-buddy-purple to-buddy-blue text-white";
      default:
        return "bg-gradient-to-br from-buddy-purple to-buddy-blue text-white";
    }
  };

  const getNotificationActions = (type: string) => {
    switch (type) {
      case "buddy_request":
        return ["accept", "decline"];
      case "activity_comment":
      case "checkin_comment":
      case "activity_created":
      case "milestone_achieved":
      case "streak_milestone":
        return ["view"];
      default:
        return [];
    }
  };

  // Helper function to render progress information for progress-related notifications
  const renderProgressInfo = (notification: NotificationData) => {
    if (!notification.metadata || !notification.metadata.progressType) {
      return null;
    }

    const metadata = notification.metadata as any;
    const progress = Number(metadata.progress) || 0;
    const completedCheckIns = Number(metadata.completedCheckIns) || 0;
    const totalAvailableCheckIns = Number(metadata.totalAvailableCheckIns) || 0;
    const currentStreak = Number(metadata.currentStreak) || 0;

    return (
      <div className="mt-3 p-4 bg-gradient-to-r from-buddy-purple/5 to-buddy-blue/5 rounded-xl border border-buddy-purple/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-buddy-gray-700">
            Progress Details
          </span>
          <span className="text-sm font-semibold text-buddy-purple">
            {progress}%
          </span>
        </div>

        <div className="w-full bg-buddy-gray-200 rounded-full h-2 mb-2">
          <div
            className="h-2 bg-gradient-to-r from-buddy-blue to-buddy-purple rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex items-center justify-between text-xs text-buddy-gray-600">
          <span>
            {completedCheckIns}/{totalAvailableCheckIns} check-ins
          </span>
          {currentStreak > 0 && (
            <div className="flex items-center space-x-1">
              <Flame className="w-3 h-3 text-orange-500" />
              <span className="text-orange-600 font-medium">
                {currentStreak} day streak
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-12 bg-gradient-to-br from-buddy-purple/5 via-white to-buddy-blue/5 relative">
      <div className="absolute inset-0 z-[-10] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5MzUxRTkiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PHBhdGggZD0iTTM2IDM0aDN2M2gtM3Ztf00zMCAzaDN2M2gtM3pNMTcgMTdoM3YzaC0zek0zNiAxN2gzdjNoLTN6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50 pointer-events-none"></div>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-buddy-purple to-buddy-blue bg-clip-text text-transparent">
                  Notifications
                </h1>
                <p className="text-buddy-gray-500 mt-1 text-sm md:text-base">
                  Stay updated with your activities and buddies
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="rounded-full border-buddy-purple/30 text-buddy-purple hover:bg-buddy-purple hover:text-white transition-all duration-300 shadow-sm"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark all as read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full bg-white/80 shadow-sm border border-buddy-gray-200 hover:bg-buddy-gray-50 transition-all duration-300"
              >
                <Filter className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar Filters */}
            <div className="md:col-span-1">
              <Card className="sticky top-24 rounded-2xl border border-white/80 shadow-lg bg-white/90 backdrop-blur-sm">
                <Card.Content className="p-6">
                  <div className="font-semibold text-buddy-gray-900 mb-4 text-lg">
                    Filter by
                  </div>
                  <ToggleGroup
                    type="single"
                    value={filter}
                    onValueChange={(value) => value && setFilter(value)}
                    className="flex flex-col space-y-2 w-full"
                  >
                    <ToggleGroupItem
                      value="all"
                      className={`flex items-center justify-start px-4 py-3 rounded-full w-full transition-all duration-300 ${
                        filter === "all"
                          ? "bg-gradient-to-r from-buddy-purple to-buddy-blue text-white shadow-lg"
                          : "hover:bg-buddy-gray-50 border border-transparent hover:border-buddy-purple/20"
                      }`}
                    >
                      <Bell className="w-4 h-4 mr-3" />
                      <span className="font-medium">All Notifications</span>
                      <Badge className="ml-auto bg-buddy-purple/20 text-buddy-purple border-0">
                        {notifications.length}
                      </Badge>
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="unread"
                      className={`flex items-center justify-start px-4 py-3 rounded-full w-full transition-all duration-300 ${
                        filter === "unread"
                          ? "bg-gradient-to-r from-buddy-purple to-buddy-blue text-white shadow-lg"
                          : "hover:bg-buddy-gray-50 border border-transparent hover:border-buddy-purple/20"
                      }`}
                    >
                      <MessageSquare className="w-4 h-4 mr-3" />
                      <span className="font-medium">Unread</span>
                      <Badge className="ml-auto bg-red-100 text-red-600 border-0">
                        {unreadCount}
                      </Badge>
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="buddy_request"
                      className={`flex items-center justify-start px-4 py-3 rounded-full w-full transition-all duration-300 ${
                        filter === "buddy_request"
                          ? "bg-gradient-to-r from-buddy-purple to-buddy-blue text-white shadow-lg"
                          : "hover:bg-buddy-gray-50 border border-transparent hover:border-buddy-purple/20"
                      }`}
                    >
                      <UserPlus className="w-4 h-4 mr-3" />
                      <span className="font-medium">Buddy Requests</span>
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="activity_comment"
                      className={`flex items-center justify-start px-4 py-3 rounded-full w-full transition-all duration-300 ${
                        filter === "activity_comment"
                          ? "bg-gradient-to-r from-buddy-purple to-buddy-blue text-white shadow-lg"
                          : "hover:bg-buddy-gray-50 border border-transparent hover:border-buddy-purple/20"
                      }`}
                    >
                      <MessageSquare className="w-4 h-4 mr-3" />
                      <span className="font-medium">Comments</span>
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="milestone_achieved"
                      className={`flex items-center justify-start px-4 py-3 rounded-full w-full transition-all duration-300 ${
                        filter === "milestone_achieved"
                          ? "bg-gradient-to-r from-buddy-purple to-buddy-blue text-white shadow-lg"
                          : "hover:bg-buddy-gray-50 border border-transparent hover:border-buddy-purple/20"
                      }`}
                    >
                      <Trophy className="w-4 h-4 mr-3" />
                      <span className="font-medium">Milestones</span>
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="streak_milestone"
                      className={`flex items-center justify-start px-4 py-3 rounded-full w-full transition-all duration-300 ${
                        filter === "streak_milestone"
                          ? "bg-gradient-to-r from-buddy-purple to-buddy-blue text-white shadow-lg"
                          : "hover:bg-buddy-gray-50 border border-transparent hover:border-buddy-purple/20"
                      }`}
                    >
                      <Flame className="w-4 h-4 mr-3" />
                      <span className="font-medium">Streak Milestones</span>
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="activity_reminder"
                      className={`flex items-center justify-start px-4 py-3 rounded-full w-full transition-all duration-300 ${
                        filter === "activity_reminder"
                          ? "bg-gradient-to-r from-buddy-purple to-buddy-blue text-white shadow-lg"
                          : "hover:bg-buddy-gray-50 border border-transparent hover:border-buddy-purple/20"
                      }`}
                    >
                      <Clock className="w-4 h-4 mr-3" />
                      <span className="font-medium">Reminders</span>
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="system_welcome"
                      className={`flex items-center justify-start px-4 py-3 rounded-full w-full transition-all duration-300 ${
                        filter === "system_welcome"
                          ? "bg-gradient-to-r from-buddy-purple to-buddy-blue text-white shadow-lg"
                          : "hover:bg-buddy-gray-50 border border-transparent hover:border-buddy-purple/20"
                      }`}
                    >
                      <Sparkles className="w-4 h-4 mr-3" />
                      <span className="font-medium">System</span>
                    </ToggleGroupItem>
                  </ToggleGroup>
                </Card.Content>
              </Card>
            </div>

            {/* Notification List */}
            <div className="md:col-span-3 space-y-4">
              {isLoading ? (
                <Card className="flex flex-col items-center justify-center py-16 rounded-2xl border border-white/80 shadow-lg bg-white/90 backdrop-blur-sm">
                  <Loader2 className="w-8 h-8 animate-spin text-buddy-purple mb-4" />
                  <p className="text-buddy-gray-600">
                    Loading notifications...
                  </p>
                </Card>
              ) : filteredNotifications.length === 0 ? (
                (() => {
                  const emptyState = getEmptyStateContent(filter);
                  const IconComponent = emptyState.icon;
                  return (
                    <Card className="flex flex-col items-center justify-center py-16 rounded-2xl border border-white/80 shadow-lg bg-white/90 backdrop-blur-sm">
                      <div
                        className={`bg-gradient-to-br ${emptyState.bgColor} p-6 rounded-full mb-6 shadow-lg`}
                      >
                        <IconComponent
                          className={`w-16 h-16 ${emptyState.iconColor}`}
                        />
                      </div>
                      <h3 className="text-2xl font-semibold text-buddy-gray-800 mb-3">
                        {emptyState.title}
                      </h3>
                      <p className="text-buddy-gray-600 text-center max-w-md text-lg">
                        {emptyState.message}
                      </p>
                    </Card>
                  );
                })()
              ) : (
                filteredNotifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    <Card
                      className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg rounded-2xl border border-white/80 ${
                        notification.isRead
                          ? "bg-white/90 backdrop-blur-sm"
                          : "bg-gradient-to-r from-buddy-purple/5 to-buddy-blue/5 border-l-4 border-l-buddy-purple shadow-md"
                      }`}
                    >
                      <Card.Content className="p-6">
                        <div className="flex">
                          {notification.sender ? (
                            <Avatar className="h-12 w-12 mr-4 ring-2 ring-buddy-purple/20">
                              <AvatarImage
                                src={notification.sender.avatar}
                                alt={notification.sender.name}
                              />
                              <AvatarFallback className="bg-gradient-to-br from-buddy-purple to-buddy-blue text-white font-semibold">
                                {notification.sender.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <div
                              className={`h-12 w-12 rounded-full flex items-center justify-center mr-4 shadow-lg ${getNotificationColor(notification.type)}`}
                            >
                              {getNotificationIcon(notification.type)}
                            </div>
                          )}

                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h3 className="font-semibold text-buddy-gray-900 text-lg mb-1">
                                  {notification.title}
                                </h3>
                                <p className="text-buddy-gray-600 mb-3 leading-relaxed">
                                  {notification.message}
                                </p>
                              </div>
                              <div className="flex items-center space-x-3 ml-4">
                                <span className="text-sm text-buddy-gray-500 flex items-center bg-buddy-gray-100 px-3 py-1 rounded-full">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {formatDistanceToNow(
                                    new Date(notification.createdAt),
                                    { addSuffix: true }
                                  )}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 rounded-full hover:bg-red-100 hover:text-red-600 transition-all duration-300"
                                  onClick={() =>
                                    handleDeleteNotification(notification.id)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            {notification.metadata?.comment && (
                              <div className="mt-3 p-4 bg-gradient-to-r from-buddy-gray-50 to-buddy-gray-100/50 rounded-xl text-sm text-buddy-gray-700 border border-buddy-gray-200/50">
                                <div className="flex items-start">
                                  <MessageSquare className="w-4 h-4 mr-2 mt-0.5 text-buddy-purple flex-shrink-0" />
                                  <span className="italic">
                                    "{String(notification.metadata.comment)}"
                                  </span>
                                </div>
                              </div>
                            )}

                            {/* Render progress information for progress-related notifications */}
                            {renderProgressInfo(notification)}

                            {getNotificationActions(notification.type).length >
                              0 && (
                              <div className="mt-4 flex space-x-3">
                                {getNotificationActions(
                                  notification.type
                                ).includes("accept") && (
                                  <Button
                                    size="sm"
                                    className="rounded-full bg-gradient-to-r from-buddy-purple to-buddy-blue text-white hover:shadow-lg transition-all duration-300 px-6"
                                    onClick={() =>
                                      handleAction(notification.id, "accept")
                                    }
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Accept
                                  </Button>
                                )}
                                {getNotificationActions(
                                  notification.type
                                ).includes("decline") && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition-all duration-300 px-6"
                                    onClick={() =>
                                      handleAction(notification.id, "decline")
                                    }
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Decline
                                  </Button>
                                )}
                                {getNotificationActions(
                                  notification.type
                                ).includes("view") && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="rounded-full text-buddy-purple hover:bg-buddy-purple/10 transition-all duration-300 px-6"
                                    onClick={() =>
                                      handleAction(notification.id, "view")
                                    }
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </Card.Content>
                    </Card>
                  </motion.div>
                ))
              )}

              {/* Load More Button */}
              {hasMore && !isLoading && (
                <div className="flex justify-center mt-6">
                  <Button
                    variant="outline"
                    onClick={loadMore}
                    disabled={isLoadingMore}
                    className="rounded-full border-buddy-purple/30 text-buddy-purple hover:bg-buddy-purple hover:text-white transition-all duration-300 px-8"
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Load More"
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default Notifications;
