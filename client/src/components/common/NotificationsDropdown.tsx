import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCircle, XCircle, Eye, Loader2, Mail, Zap } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Avatar from "@/components/common/Avatar";
import { NotificationService, NotificationData } from "@/services/api/notification.service";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/store/auth.store";
import { useBuddyConnectionStore } from "@/store/buddy-connection.store";
import { useToast } from "@/hooks/use-toast";
import { activityQueryKeys } from "@/hooks/useActivityData";

const NotificationsDropdown: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { respondToBuddyRequest } = useBuddyConnectionStore();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch recent notifications and unread count
  const fetchNotifications = async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    try {
      const [notificationsResponse, unreadResponse] = await Promise.all([
        NotificationService.getNotifications({ page: 1, limit: 5 }),
        NotificationService.getUnreadCount(),
      ]);

      const list = notificationsResponse.data.notifications || [];
      setNotifications(list);
      setUnreadCount(unreadResponse.data.unreadCount || 0);
      // If any join-request-declined notification exists, revalidate activities so button shows Request again
      if (list.some((n: NotificationData) => n.type === "activity_join_request_declined")) {
        queryClient.invalidateQueries({ queryKey: activityQueryKeys.lists() });
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      // Refresh notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Refresh when dropdown opens
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchNotifications();
    }
  }, [isOpen, isAuthenticated]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await NotificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleAcceptBuddyRequest = async (notification: NotificationData) => {
    try {
      const connectionId = notification.metadata?.buddyConnectionId as string;
      if (!connectionId) {
        toast({
          title: "Error",
          description: "Connection ID not found",
          variant: "destructive",
        });
        return;
      }

      await respondToBuddyRequest(connectionId, { status: "accepted" });
      await handleMarkAsRead(notification.id);
      await fetchNotifications(); // Refresh notifications

      toast({
        title: "Buddy request accepted",
        description: "You are now connected!",
      });
    } catch (error: any) {
      toast({
        title: "Failed to accept request",
        description: error?.response?.data?.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleDeclineBuddyRequest = async (notification: NotificationData) => {
    try {
      const connectionId = notification.metadata?.buddyConnectionId as string;
      if (!connectionId) {
        toast({
          title: "Error",
          description: "Connection ID not found",
          variant: "destructive",
        });
        return;
      }

      await respondToBuddyRequest(connectionId, { status: "declined" });
      await handleMarkAsRead(notification.id);
      await fetchNotifications(); // Refresh notifications

      toast({
        title: "Buddy request declined",
        description: "The request has been declined",
      });
    } catch (error: any) {
      toast({
        title: "Failed to decline request",
        description: error?.response?.data?.message || "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleNotificationClick = async (notification: NotificationData) => {
    await handleMarkAsRead(notification.id);
    setIsOpen(false); // Close dropdown before navigating

    if (notification.type === "activity_join_request_declined") {
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.lists() });
      toast({
        title: "Join request declined",
        description: notification.message || "Your request to join was declined.",
        variant: "default",
      });
    }

    // Navigate based on notification type
    if (notification.type === "boost") {
      navigate("/boost-wall");
    } else if (notification.type === "activity_invite" && notification.activity?.id) {
      navigate(`/activities/${notification.activity.id}`);
    } else if (notification.type === "activity_join_request_declined" && notification.metadata?.activityId) {
      navigate("/activities");
    } else if (notification.type === "buddy_request") {
      // Already handled by accept/decline buttons, but navigate to notifications page
      navigate("/notifications");
    } else if (notification.activity?.id) {
      navigate(`/activities/${notification.activity.id}`);
    } else {
      // Default: navigate to notifications page for any other notification type
      navigate("/notifications");
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "buddy_request":
      case "buddy_accepted":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "buddy_declined":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "activity_invite":
      case "activity_invitation":
        return <Bell className="w-4 h-4 text-buddy-purple" />;
      case "activity_join_request_declined":
        return <XCircle className="w-4 h-4 text-amber-500" />;
      default:
        return <Bell className="w-4 h-4 text-buddy-gray-500" />;
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div
          className={`cursor-pointer p-3 rounded-full text-buddy-gray-600 relative transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-buddy-purple focus:ring-offset-2 ${
            isOpen
              ? "text-buddy-gray-900 bg-buddy-gray-100 ring-2 ring-buddy-purple-light ring-offset-2"
              : "hover:text-buddy-gray-900 hover:bg-buddy-gray-100"
          }`}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs rounded-full border-2 border-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 p-0 rounded-xl border-buddy-gray-200 shadow-lg"
      >
        <div className="p-4 border-b border-buddy-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-buddy-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-buddy-purple/10 text-buddy-purple">
                {unreadCount} new
              </Badge>
            )}
          </div>
        </div>

        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-buddy-purple" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4">
              <Bell className="w-12 h-12 text-buddy-gray-300 mb-2" />
              <p className="text-sm text-buddy-gray-500 text-center">
                No notifications yet
              </p>
            </div>
          ) : (
            <div className="divide-y divide-buddy-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-buddy-gray-50 transition-colors cursor-pointer ${
                    !notification.isRead ? "bg-buddy-purple/5" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    {notification.sender ? (
                      <Avatar
                        src={notification.sender.avatar}
                        alt={notification.sender.name}
                        initials={notification.sender.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                        size="md"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-buddy-purple/10 flex items-center justify-center">
                        {getNotificationIcon(notification.type)}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-buddy-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-xs text-buddy-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-buddy-gray-400 mt-1">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div className="h-2 w-2 rounded-full bg-buddy-purple flex-shrink-0 mt-1" />
                        )}
                      </div>

                      {/* Action buttons for buddy requests */}
                      {notification.type === "buddy_request" && !notification.isRead && (
                        <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                          <Button
                            size="sm"
                            variant="default"
                            className="h-7 text-xs rounded-full bg-green-500 hover:bg-green-600"
                            onClick={() => handleAcceptBuddyRequest(notification)}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs rounded-full border-red-200 text-red-500 hover:bg-red-50"
                            onClick={() => handleDeclineBuddyRequest(notification)}
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="p-3 border-t border-buddy-gray-100">
          <Button
            variant="ghost"
            className="w-full rounded-full text-buddy-purple hover:bg-buddy-purple/10"
            onClick={() => {
              setIsOpen(false);
              navigate("/notifications");
            }}
          >
            <Eye className="w-4 h-4 mr-2" />
            See all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;

