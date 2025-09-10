import React, { useState, useEffect } from "react";
import { Card } from "@/components/common/Card";
import Avatar from "@/components/common/Avatar";
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
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useBuddyConnectionStore } from "@/store/buddy-connection.store";
import { useAuth } from "@/store/auth.store";
import { useToast } from "@/hooks/use-toast";

interface BuddyCardProps {
  id: string;
  name: string;
  image?: string;
  location?: string;
  bio?: string;
  interests: string[];
  mutualActivities?: number;
  mutualBuddies?: number;
  status?: "online" | "offline" | "away";
  isRealUser?: boolean; // Flag to indicate if this is a real user or mock data
}

const BuddyCard = ({
  id,
  name,
  image,
  location,
  bio,
  interests,
  mutualActivities = 0,
  mutualBuddies = 0,
  status = "offline",
  isRealUser = false,
}: BuddyCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    connectionStatuses,
    checkConnectionStatus,
    sendBuddyRequest,
    respondToBuddyRequest,
    isLoading,
  } = useBuddyConnectionStore();

  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Check connection status when component mounts or user changes
  useEffect(() => {
    if (isRealUser && user?._id && user._id !== id) {
      checkConnectionStatus(id);
    }
  }, [isRealUser, user?._id, id, checkConnectionStatus]);

  // Update local state when connection status changes
  useEffect(() => {
    const status = connectionStatuses[id];
    if (status) {
      setConnectionStatus(status.status);
      setConnectionId(status.connectionId || null);
    }
  }, [connectionStatuses, id]);

  const handleCardClick = () => {
    navigate(`/profile/${id}`, { state: { fromApp: true } });
  };

  const handleSendRequest = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isRealUser || !user?._id || user._id === id) return;

    setIsProcessing(true);
    try {
      await sendBuddyRequest({
        recipientId: id,
        message: `Hi ${name}! I'd like to connect with you on BuddyFinder.`,
      });
      toast({
        title: "Buddy request sent!",
        description: `Your request has been sent to ${name}.`,
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
    if (!connectionId) return;

    setIsProcessing(true);
    try {
      await respondToBuddyRequest(connectionId, { status: "accepted" });
      toast({
        title: "Request accepted!",
        description: `You're now connected with ${name}.`,
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
    if (!connectionId) return;

    setIsProcessing(true);
    try {
      await respondToBuddyRequest(connectionId, { status: "declined" });
      toast({
        title: "Request declined",
        description: `You've declined ${name}'s request.`,
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
    if (!isRealUser || !user?._id || user._id === id) {
      return (
        <Button
          variant="outline"
          size="sm"
          className="flex-1 rounded-full"
          onClick={(e) => e.stopPropagation()}
        >
          <MessageCircle className="w-4 h-4" />
          Message
        </Button>
      );
    }

    switch (connectionStatus) {
      case "accepted":
        return (
          <Button
            variant="outline"
            size="sm"
            className="flex-1 rounded-full"
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
            className="flex-1 rounded-full"
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
            className="flex-1 rounded-full"
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
            className="flex-1 rounded-full"
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
    if (!isRealUser || !user?._id || user._id === id) {
      return (
        <Button
          variant="default"
          size="sm"
          className="flex-1 rounded-full"
          onClick={(e) => e.stopPropagation()}
        >
          <UserPlus className="w-4 h-4" />
          Add Buddy
        </Button>
      );
    }

    // Check if this is a received request
    if (connectionStatus === "pending" && connectionId) {
      return (
        <div className="flex space-x-1">
          <Button
            variant="default"
            size="sm"
            className="flex-1 rounded-full bg-green-500 hover:bg-green-600"
            onClick={handleAcceptRequest}
            disabled={isProcessing}
          >
            <Check className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 rounded-full"
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
      className="h-full transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      <Card.Content className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar
            size="md"
            src={image}
            status={status}
            className="rounded-full"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-buddy-gray-900 truncate">
              {name}
            </h3>
            {location && (
              <div className="flex items-center text-sm text-buddy-gray-500 mt-1">
                <MapPin className="w-3.5 h-3.5 mr-1" />
                <span className="truncate">{location}</span>
              </div>
            )}
          </div>
        </div>

        {bio && (
          <p className="text-sm text-buddy-gray-600 mb-4 line-clamp-2">{bio}</p>
        )}

        <div className="flex flex-wrap gap-1.5 mb-4">
          {interests.slice(0, 3).map((interest, index) => (
            <Badge
              key={index}
              variant="outline"
              className="bg-buddy-gray-50 text-xs py-0.5 px-2"
            >
              {interest}
            </Badge>
          ))}
          {interests.length > 3 && (
            <Badge
              variant="outline"
              className="bg-buddy-gray-50 text-xs py-0.5 px-2"
            >
              +{interests.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex justify-between text-xs text-buddy-gray-500 mb-5">
          <span>{mutualActivities} mutual activities</span>
          <span>{mutualBuddies} mutual buddies</span>
        </div>

        <div className="flex space-x-2">
          {getConnectionButton()}
          {getActionButton()}
        </div>
      </Card.Content>
    </Card>
  );
};

export default BuddyCard;
