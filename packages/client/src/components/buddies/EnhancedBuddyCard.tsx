import React, { useState, useEffect } from "react";
import { Card } from "@/components/common/Card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  UserPlus,
  MessageCircle,
  Check,
  X,
  Clock,
  Users,
  Flame,
  Star,
  Heart,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useBuddyConnectionStore } from "@/store/buddy-connection.store";
import { useAuth } from "@/store/auth.store";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types/auth-types";

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

  // Check connection status when component mounts (only for real users)
  useEffect(() => {
    if (
      isRealUser &&
      currentUser?._id &&
      "_id" in user &&
      user._id &&
      currentUser._id !== user._id
    ) {
      checkConnectionStatus(user._id);
    }
  }, [isRealUser, currentUser?._id, user, checkConnectionStatus]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      default:
        return "bg-gray-400";
    }
  };

  const getInterestColor = (index: number) => {
    const colors = [
      "bg-buddy-purple/10 text-buddy-purple border-buddy-purple/20",
      "bg-buddy-blue/10 text-buddy-blue border-buddy-blue/20",
      "bg-buddy-green/10 text-buddy-green border-buddy-green/20",
      "bg-buddy-orange/10 text-buddy-orange border-buddy-orange/20",
    ];
    return colors[index % colors.length];
  };

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
      toast({
        title: "Buddy request sent!",
        description: `Your request has been sent to ${user.name}.`,
      });
    } catch (error) {
      toast({
        title: "Failed to send request",
        description: "Please try again later.",
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
      toast({
        title: "Request accepted!",
        description: `You're now connected with ${user.name}.`,
      });
    } catch (error) {
      toast({
        title: "Failed to accept request",
        description: "Please try again later.",
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
      toast({
        title: "Request declined",
        description: `You've declined ${user.name}'s request.`,
      });
    } catch (error) {
      toast({
        title: "Failed to decline request",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getConnectionButton = () => {
    if (
      !isRealUser ||
      !currentUser?._id ||
      !("_id" in user) ||
      currentUser._id === user._id
    ) {
      return (
        <Button
          variant="outline"
          size="sm"
          className="flex-1 rounded-full border-buddy-purple/20 text-buddy-purple hover:bg-buddy-purple hover:text-white transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <MessageCircle className="w-4 h-4" />
          Message
        </Button>
      );
    }

    switch (currentConnectionStatus) {
      case "accepted":
        return (
          <Button
            variant="outline"
            size="sm"
            className="flex-1 rounded-full border-buddy-purple/20 text-buddy-purple hover:bg-buddy-purple hover:text-white transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <MessageCircle className="w-4 h-4" />
            Message
          </Button>
        );
      case "pending":
        return (
          <Button
            variant="outline"
            size="sm"
            className="flex-1 rounded-full border-buddy-orange/20 text-buddy-orange"
            disabled
          >
            <Clock className="w-4 h-4" />
            Pending
          </Button>
        );
      case "declined":
        return (
          <Button
            variant="default"
            size="sm"
            className="flex-1 rounded-full bg-buddy-purple hover:bg-buddy-purple/90 text-white"
            onClick={handleSendRequest}
            disabled={isProcessing || isLoading}
          >
            <UserPlus className="w-4 h-4" />
            {isProcessing ? "Sending..." : "Add Buddy"}
          </Button>
        );
      default:
        return (
          <Button
            variant="default"
            size="sm"
            className="flex-1 rounded-full bg-buddy-purple hover:bg-buddy-purple/90 text-white"
            onClick={handleSendRequest}
            disabled={isProcessing || isLoading}
          >
            <UserPlus className="w-4 h-4" />
            {isProcessing ? "Sending..." : "Add Buddy"}
          </Button>
        );
    }
  };

  const getActionButton = () => {
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
          className="flex-1 rounded-full bg-buddy-purple hover:bg-buddy-purple/90 text-white"
          onClick={(e) => e.stopPropagation()}
        >
          <UserPlus className="w-4 h-4" />
          Add Buddy
        </Button>
      );
    }

    // Check if this is a received request
    if (currentConnectionStatus === "pending" && currentConnectionId) {
      return (
        <div className="flex space-x-1">
          <Button
            variant="default"
            size="sm"
            className="flex-1 rounded-full bg-green-500 hover:bg-green-600 text-white"
            onClick={handleAcceptRequest}
            disabled={isProcessing}
          >
            <Check className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 rounded-full border-red-200 text-red-500 hover:bg-red-50"
            onClick={handleDeclineRequest}
            disabled={isProcessing}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      );
    }

    return getConnectionButton();
  };

  return (
    <Card
      hover
      className="group relative overflow-hidden bg-gradient-to-br from-white to-buddy-gray-50/30 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer h-80 flex flex-col"
      onClick={handleCardClick}
    >
      {/* Status indicator */}
      <div className="absolute top-4 right-4 z-10">
        <div
          className={`w-3 h-3 rounded-full ${getStatusColor(
            ("status" in user ? user.status : "offline") || "offline"
          )} border-2 border-white shadow-sm`}
        />
      </div>

      <Card.Content className="p-6 flex flex-col h-full">
        {/* Header with avatar and basic info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <Avatar className="h-16 w-16 ring-4 ring-buddy-purple/20 shadow-lg">
              <AvatarImage
                src={
                  "picture" in user && user.picture
                    ? String(user.picture)
                    : "profilePicture" in user && user.profilePicture
                      ? String(user.profilePicture)
                      : "image" in user && user.image
                        ? String(user.image)
                        : "avatar" in user && user.avatar
                          ? String(user.avatar)
                          : undefined
                }
                alt={user.name || "User avatar"}
                className="object-cover"
              />
              <AvatarFallback className="bg-buddy-purple text-white font-semibold text-lg">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            {/* Activity streak indicator */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-buddy-orange rounded-full flex items-center justify-center">
              <Flame className="w-3 h-3 text-white" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-buddy-gray-900 truncate group-hover:text-buddy-purple transition-colors">
              {user.name}
            </h3>
            {/* Location display */}
            <div className="flex items-center text-sm text-buddy-gray-500 mt-1">
              <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
              <span className="truncate">
                {"city" in user &&
                user.city &&
                "country" in user &&
                user.country
                  ? `${user.city}, ${user.country}`
                  : "location" in user && user.location
                    ? user.location
                    : "Location not specified"}
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-4 flex-1">
          {user.bio ? (
            <p className="text-sm text-buddy-gray-600 line-clamp-2 leading-relaxed">
              {user.bio}
            </p>
          ) : (
            <p className="text-sm text-buddy-gray-400 italic">
              {(() => {
                // For real users, show status message
                if ("_id" in user) {
                  return user.hasCompletedOnboarding
                    ? "Ready to connect and collaborate!"
                    : "Complete your profile to get started";
                }
                // For mock data, show default message
                return "Looking for accountability partners";
              })()}
            </p>
          )}
        </div>

        {/* Interests */}
        <div className="flex flex-wrap gap-1.5 mb-4 min-h-[2rem]">
          {(() => {
            // Get interests from either interestsCategories (real users) or interests (mock data)
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
                  className="text-xs py-1 px-2 rounded-full border bg-buddy-gray-100 text-buddy-gray-500 border-buddy-gray-200"
                >
                  No interests yet
                </Badge>
              );
            }

            return interests.slice(0, 3).map((interest, index) => (
              <Badge
                key={index}
                variant="outline"
                className={`text-xs py-1 px-2 rounded-full border ${getInterestColor(
                  index
                )}`}
              >
                {typeof interest === "string" ? interest : interest.toString()}
              </Badge>
            ));
          })()}
          {(() => {
            const interests =
              "interestsCategories" in user && user.interestsCategories
                ? user.interestsCategories
                : "interests" in user && user.interests
                  ? user.interests
                  : [];

            return (
              interests.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-xs py-1 px-2 rounded-full bg-buddy-gray-100 text-buddy-gray-600 border-buddy-gray-200"
                >
                  +{interests.length - 3} more
                </Badge>
              )
            );
          })()}
        </div>

        {/* Stats */}
        <div className="flex justify-between text-xs text-buddy-gray-500 mb-5 mt-auto">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>
              {(() => {
                // For real users, show connection status or interests count
                if ("_id" in user) {
                  const interestsCount = user.interestsCategories?.length || 0;
                  return interestsCount > 0
                    ? `${interestsCount} interests`
                    : "New user";
                }
                // For mock data, show mutual activities
                return "interests" in user && user.interests
                  ? `${user.interests.length} interests`
                  : "2 mutual activities";
              })()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3" />
            <span>
              {(() => {
                // For real users, show completion status
                if ("_id" in user) {
                  return user.hasCompletedOnboarding
                    ? "Profile complete"
                    : "Setup pending";
                }
                // For mock data, show completed activities
                return "completedActivities" in user
                  ? `${user.completedActivities} completed`
                  : "24 completed";
              })()}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex space-x-2">
          {getConnectionButton()}
          {getActionButton()}
        </div>
      </Card.Content>
    </Card>
  );
};

export default EnhancedBuddyCard;
