import React, { useState, useEffect } from "react";
import { Card } from "@/components/common/Card";
import Avatar from "@/components/common/Avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MapPin,
  UserPlus,
  MessageCircle,
  Check,
  X,
  Clock,
  Activity,
  Flame,
  Star,
  CheckCircle,
  UserMinus,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBuddyConnectionStore } from "@/store/buddy-connection.store";
import { useAuth } from "@/store/auth.store";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types/auth-types";
import BoostModal from "./BoostModal";
import { ActivityService } from "@/services/api/activity/activity-service";

// Mock buddy type for fallback data
interface MockBuddy {
  id: string;
  name: string;
  image: string;
  interests: string[];
  activeStreak: number;
  mutualActivities: number;
  mutualBuddies: number;
  bio: string;
  completedActivities: number;
  joinedDate: string;
  location: string;
  status: "online" | "offline" | "away";
}

// Union type for both real users and mock buddies
type BuddyUser = User | MockBuddy;

// Enhanced buddy card props interface
interface EnhancedBuddyCardProps {
  user: BuddyUser;
  connectionStatus?: string;
  connectionId?: string;
  isRealUser?: boolean;
  onConnect?: (userId: string) => void;
  onViewProfile?: (userId: string) => void;
  onSendMessage?: (userId: string) => void;
}

// Pastel background classes using tailwind config colors
// These are static strings so Tailwind JIT can detect them at build time
const PASTEL_BG_CLASSES = [
  "bg-pastel-pink",
  "bg-pastel-purple", 
  "bg-pastel-blue",
  "bg-pastel-green",
  "bg-pastel-yellow",
  "bg-pastel-orange",
  "bg-pastel-peach",
  "bg-pastel-gray",
] as const;

// Helper function to get pastel color class based on user ID
// Uses a simple hash of the entire userId for better distribution
const getPastelColorClass = (userId: string) => {
  // Create a hash from all characters in the userId
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash) + userId.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  // Make sure the index is positive
  const index = Math.abs(hash) % PASTEL_BG_CLASSES.length;
  return PASTEL_BG_CLASSES[index];
};

// Helper function to get user's timezone display
const getTimezoneDisplay = (user: BuddyUser) => {
  if ("timezone" in user && user.timezone) {
    return user.timezone;
  }
  // Default to UTC if no timezone
  return "UTC";
};

const EnhancedBuddyCard: React.FC<EnhancedBuddyCardProps> = ({
  user,
  connectionStatus,
  connectionId,
  isRealUser = false,
  onConnect,
  onViewProfile,
  onSendMessage,
}) => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const {
    connectionStatuses,
    checkConnectionStatus,
    sendBuddyRequest,
    respondToBuddyRequest,
    removeBuddyConnection,
    pendingRequests,
    receivedRequests,
    fetchPendingRequests,
    fetchReceivedRequests,
    isLoading,
  } = useBuddyConnectionStore();

  // Add error boundary for the component
  if (!user) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500">User data not available</p>
      </Card>
    );
  }

  const [currentConnectionStatus, setCurrentConnectionStatus] = useState<
    string | null
  >(connectionStatus || null);
  const [currentConnectionId, setCurrentConnectionId] = useState<string | null>(
    connectionId || null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);
  const [activityStats, setActivityStats] = useState({ active: 0, completed: 0 });
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isRequester, setIsRequester] = useState<boolean | null>(null); // null = unknown, true = current user sent request, false = current user received request

  // Check connection status and determine if user is requester or recipient
  useEffect(() => {
    if (
      isRealUser &&
      currentUser?._id &&
      "_id" in user &&
      user._id &&
      currentUser._id !== user._id
    ) {
      checkConnectionStatus(user._id);
      // Fetch pending and received requests to determine role
      fetchPendingRequests();
      fetchReceivedRequests();
    }
  }, [isRealUser, currentUser?._id, user, checkConnectionStatus, fetchPendingRequests, fetchReceivedRequests]);

  // Update local state when connection status changes
  useEffect(() => {
    if ("_id" in user) {
      const status = connectionStatuses[user._id];
      if (status) {
        setCurrentConnectionStatus(status.status);
        setCurrentConnectionId(status.connectionId || null);
      }
    }
  }, [connectionStatuses, user]);

  // Determine if current user is the requester or recipient
  useEffect(() => {
    if (!currentUser?._id || !("_id" in user) || !user._id) {
      setIsRequester(null);
      return;
    }

    // Check if current user sent the request (is in pendingRequests)
    const sentRequest = pendingRequests.find(
      (req) => req.recipient.id === user._id && req.status === "pending"
    );
    if (sentRequest) {
      setIsRequester(true);
      return;
    }

    // Check if current user received the request (is in receivedRequests)
    const receivedRequest = receivedRequests.find(
      (req) => req.requester.id === user._id && req.status === "pending"
    );
    if (receivedRequest) {
      setIsRequester(false);
      return;
    }

    // For accepted connections, check both arrays
    const acceptedConnection = [...pendingRequests, ...receivedRequests].find(
      (conn) =>
        (conn.requester.id === currentUser._id && conn.recipient.id === user._id) ||
        (conn.requester.id === user._id && conn.recipient.id === currentUser._id)
    );
    if (acceptedConnection && acceptedConnection.status === "accepted") {
      setIsRequester(acceptedConnection.requester.id === currentUser._id);
    } else {
      setIsRequester(null);
    }
  }, [pendingRequests, receivedRequests, currentUser?._id, user]);

  // Get user profile image
  const getProfileImage = () => {
    if ("picture" in user && user.picture) return String(user.picture);
    if ("profilePicture" in user && user.profilePicture)
      return String(user.profilePicture);
    if ("image" in user && user.image) return String(user.image);
    if ("avatar" in user && user.avatar) return String(user.avatar);
    return null;
  };

  // Get user's first initial
  const getUserInitial = () => {
    return user.name ? user.name.charAt(0).toUpperCase() : "U";
  };

  // Get user ID for color selection
  const userId = "_id" in user ? user._id : user.id;

  // Check if profile is complete
  const isProfileComplete =
    "_id" in user ? user.hasCompletedOnboarding : true;

  // Fetch activity stats for the buddy
  useEffect(() => {
    const fetchActivityStats = async () => {
      if (!isRealUser || !("_id" in user) || !user._id) {
        setActivityStats({ active: 0, completed: 0 });
        return;
      }

      setIsLoadingStats(true);
      try {
        // Fetch all activities and filter by user participation
        const response = await ActivityService.getActivities();
        const allActivities = response.data || [];
        
        const now = new Date();
        let activeCount = 0;
        let completedCount = 0;

        allActivities.forEach((activity: any) => {
          const isParticipant = activity.participants?.some(
            (p: any) => (p._id || p.id || p) === user._id
          );
          
          if (isParticipant) {
            const endDate = activity.endDate ? new Date(activity.endDate) : null;
            if (endDate && endDate < now) {
              completedCount++;
            } else {
              activeCount++;
            }
          }
        });

        setActivityStats({ active: activeCount, completed: completedCount });
      } catch (error) {
        console.error("Failed to fetch activity stats:", error);
        setActivityStats({ active: 0, completed: 0 });
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchActivityStats();
  }, [isRealUser, user]);

  const handleCardClick = () => {
    const userId = "_id" in user ? user._id : user.id;
    if (onViewProfile) {
      onViewProfile(userId);
    } else {
      // Pass user data in navigation state for immediate display
      navigate(`/profile/${userId}`, {
        state: {
          fromApp: true,
          userData: user, // Pass the full user object
        },
      });
    }
  };

  const handleSendRequest = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      !isRealUser ||
      !currentUser?._id ||
      !("_id" in user) ||
      currentUser._id === user._id
    )
      return;

    setIsProcessing(true);
    try {
      await sendBuddyRequest({
        recipientId: user._id,
        message: `Hi ${user.name}! I'd like to connect with you on BuddyFinder.`,
      });
      // Refresh connection status after sending request
      if ("_id" in user) {
        await checkConnectionStatus(user._id);
      }
      toast({
        title: "Buddy request sent!",
        description: `Your request has been sent to ${user.name}.`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to send request",
        description: error?.response?.data?.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAcceptRequest = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentConnectionId) return;

    setIsProcessing(true);
    try {
      await respondToBuddyRequest(currentConnectionId, { status: "accepted" });
      // Refresh connection status after accepting
      if ("_id" in user) {
        await checkConnectionStatus(user._id);
      }
      toast({
        title: "Request accepted!",
        description: `You're now connected with ${user.name}.`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to accept request",
        description: error?.response?.data?.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeclineRequest = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentConnectionId) return;

    setIsProcessing(true);
    try {
      await respondToBuddyRequest(currentConnectionId, { status: "declined" });
      // Refresh connection status after declining
      if ("_id" in user) {
        await checkConnectionStatus(user._id);
      }
      toast({
        title: "Request declined",
        description: `You've declined ${user.name}'s request.`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to decline request",
        description: error?.response?.data?.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBoostClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBoostModalOpen(true);
  };

  const handleBoostSent = () => {
    console.log(`Boost sent to ${user.name}`);
  };

  const handleUnlinkBuddy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentConnectionId) return;

    setIsProcessing(true);
    try {
      await removeBuddyConnection(currentConnectionId);
      // Refresh connection status after unlinking
      if ("_id" in user) {
        await checkConnectionStatus(user._id);
        await fetchPendingRequests();
        await fetchReceivedRequests();
      }
      toast({
        title: "Buddy unlinked",
        description: `You've unlinked ${user.name}.`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to unlink buddy",
        description: error?.response?.data?.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getMainActionButton = () => {
    if (
      !isRealUser ||
      !currentUser?._id ||
      !("_id" in user) ||
      currentUser._id === user._id
    ) {
      return (
        <Button
          variant="default"
          size="sm"
          className="rounded-full bg-buddy-purple hover:bg-buddy-purple/90 text-white px-4"
          onClick={(e) => e.stopPropagation()}
        >
          <UserPlus className="w-4 h-4 mr-1" />
          Add Buddy
        </Button>
      );
    }

    // Handle different connection statuses
    switch (currentConnectionStatus) {
      case "accepted":
        // When accepted, show message and unlink options
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-buddy-purple/20 text-buddy-purple hover:bg-buddy-purple hover:text-white transition-all px-3"
              onClick={(e) => {
                e.stopPropagation();
                if (onSendMessage) {
                  onSendMessage(user._id);
                }
              }}
            >
              <MessageCircle className="w-4 h-4" />
              Chat
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-red-200 text-red-500 hover:bg-red-50 hover:border-red-400 px-3"
              onClick={handleUnlinkBuddy}
              disabled={isProcessing}
              title="Unlink buddy"
            >
              <UserMinus className="w-4 h-4" />
              Unlink
            </Button>
          </div>
        );
      case "pending":
        // Show different UI based on whether user sent or received the request
        if (isRequester === true) {
          // Current user sent the request - show pending status
          return (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-buddy-orange/20 text-buddy-orange px-4"
              disabled
            >
              <Clock className="w-4 h-4 mr-1" />
              Pending
            </Button>
          );
        } else if (isRequester === false) {
          // Current user received the request - show accept/decline buttons
          return (
            <div className="flex gap-2">
              <Button
                variant="default"
                size="sm"
                className="rounded-full bg-green-500 hover:bg-green-600 text-white px-3"
                onClick={handleAcceptRequest}
                disabled={isProcessing}
              >
                <Check className="w-4 h-4" />
                Accept
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-red-200 text-red-500 hover:bg-red-500 hover:text-white px-3"
                onClick={handleDeclineRequest}
                disabled={isProcessing}
              >
                <X className="w-4 h-4" />
                Decline
              </Button>
            </div>
          );
        } else {
          // Unknown state - show pending
          return (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-buddy-orange/20 text-buddy-orange px-4"
              disabled
            >
              <Clock className="w-4 h-4 mr-1" />
              Pending
            </Button>
          );
        }
      case "declined":
        return (
          <Button
            variant="default"
            size="sm"
            className="rounded-full bg-buddy-purple hover:bg-buddy-purple/90 text-white px-4"
            onClick={handleSendRequest}
            disabled={isProcessing || isLoading}
          >
            <UserPlus className="w-4 h-4 mr-1" />
            {isProcessing ? "Sending..." : "Add Buddy"}
          </Button>
        );
      default:
        return (
          <Button
            variant="default"
            size="sm"
            className="rounded-full bg-buddy-purple hover:bg-buddy-purple/90 text-white px-4"
            onClick={handleSendRequest}
            disabled={isProcessing || isLoading}
          >
            <UserPlus className="w-4 h-4 mr-1" />
            {isProcessing ? "Sending..." : "Add Buddy"}
          </Button>
        );
    }
  };

  const profileImage = getProfileImage();

  return (
    <TooltipProvider>
      <Card
        hover
        className="group relative overflow-hidden bg-white border shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer min-h-[400px] flex flex-col"
        onClick={handleCardClick}
      >
        {/* Buddies Badge - Show when connection is accepted */}
        {currentConnectionStatus === "accepted" && (
          <Badge
            className="absolute top-6 left-5 z-10 bg-gradient-to-r from-buddy-purple to-buddy-blue text-white border-0 shadow-lg flex items-center gap-1"
          >
            <Users className="w-3 h-3" />
            Buddies
          </Badge>
        )}
        {/* Profile Image Section with Padding */}
        <div className="p-3 pb-0">
          <div className="relative w-full h-48 overflow-hidden rounded-sm">
            <Avatar
              src={profileImage ?? undefined}
              alt={user.name || "User"}
              initials={
                user.name
                  ? user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2) || getUserInitial()
                  : getUserInitial()
              }
              size="card"
              fallbackClassName={!profileImage ? `${getPastelColorClass(userId)} text-white` : undefined}
            />

            {/* Boost Button - Top Right */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="absolute top-3 right-3 w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-xl transition-transform z-10"
                  onClick={handleBoostClick}
                >
                  <Flame className="w-5 h-5 text-white" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">
                  <span className="font-semibold">Send a Boost</span>
                  <br />
                  Motivate this buddy with an encouraging message
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Content Section */}
        <Card.Content className="p-4 flex flex-col gap-2 flex-1">
          {/* Name with Badges */}
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold text-2xl text-buddy-gray-900 truncate group-hover:text-buddy-purple transition-colors">
              {user.name}
            </h3>
            {/* {isProfileComplete && (
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
            )} */}
            {isProfileComplete && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex">
                    <CheckCircle className="w-5 h-5 text-white bg-green-500 rounded-full" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-sm">
                  <p>Profile complete</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Location + Timezone */}
          <div className="flex items-center gap-2 text-xs text-buddy-gray-500 flex-wrap">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">
                {"city" in user && user.city && "country" in user && user.country
                  ? `${user.city}, ${user.country}`
                  : "location" in user && user.location
                    ? user.location
                    : "Location not set"}
              </span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 flex-shrink-0" />
              <span>{getTimezoneDisplay(user)}</span>
            </div>
          </div>

          {/* Bio (2-line truncate) */}
          <p className="text-sm text-buddy-gray-600 line-clamp-2 leading-snug">
            {user.bio ||
              (isProfileComplete
                ? "Ready to connect and collaborate!"
                : "Complete profile to get started")}
          </p>

          {/* Interest Badges (2 + count) */}
          <div className="flex flex-wrap gap-1 min-h-[24px]">
            {(() => {
              const interests =
                "interestsCategories" in user && user.interestsCategories
                  ? user.interestsCategories
                  : "interests" in user && user.interests
                    ? user.interests
                    : [];

              if (interests.length === 0) {
                return (
                  <Badge
                    variant="outline"
                    className="text-xs py-0.5 px-2 rounded-full bg-buddy-gray-100 text-buddy-gray-500 border-buddy-gray-200"
                  >
                    No interests yet
                  </Badge>
                );
              }

              const displayInterests = interests.slice(0, 2);
              const remainingCount = interests.length - 2;

              return (
                <>
                  {displayInterests.map((interest, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs py-0.5 px-2 rounded-full bg-buddy-purple/10 text-buddy-purple border-buddy-purple/20"
                    >
                      {typeof interest === "string"
                        ? interest
                        : interest.toString()}
                    </Badge>
                  ))}
                  {remainingCount > 0 && (
                    <Badge
                      variant="outline"
                      className="text-xs py-0.5 px-2 rounded-full bg-buddy-gray-100 text-buddy-gray-600 border-buddy-gray-200"
                    >
                      +{remainingCount}
                    </Badge>
                  )}
                </>
              );
            })()}
          </div>

          {/* Stats + Action Button Row */}
          <div className="mt-auto pt-2 flex items-center justify-between">
            {/* Activity Stats - Left Side */}
            <div className="flex gap-3 text-sm text-buddy-gray-600">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 cursor-pointer">
                    <Activity className="w-4 h-4 flex-shrink-0 text-buddy-gray-400" />
                    <span className="font-medium text-2xl text-buddy-gray-900">{activityStats.active}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">
                    <span className="font-semibold">Active Activities</span>
                    <br />
                    Currently participating in {activityStats.active} ongoing {activityStats.active === 1 ? 'activity' : 'activities'}
                  </p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1 cursor-pointer">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 text-buddy-gray-400" />
                    <span className="font-medium text-2xl text-buddy-gray-900">{activityStats.completed}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">
                    <span className="font-semibold">Completed Activities</span>
                    <br />
                    Successfully finished {activityStats.completed} {activityStats.completed === 1 ? 'activity' : 'activities'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Action Button - Right Side */}
            <div className="flex-shrink-0">{getMainActionButton()}</div>
          </div>
        </Card.Content>
      </Card>

      <BoostModal
        isOpen={isBoostModalOpen}
        onClose={() => setIsBoostModalOpen(false)}
        recipientName={user.name || "User"}
        recipientId={"_id" in user ? user._id : user.id}
        onBoostSent={handleBoostSent}
      />
    </TooltipProvider>
  );
};

export default EnhancedBuddyCard;
