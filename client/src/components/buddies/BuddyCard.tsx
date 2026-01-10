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
  Zap,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useBuddyConnectionStore } from "@/store/buddy-connection.store";
import { useAuth } from "@/store/auth.store";
import { useToast } from "@/hooks/use-toast";
import BoostModal from "./BoostModal";

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
  const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);

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

  const handleBoostClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBoostModalOpen(true);
  };

  const handleBoostSent = () => {
    // Handle boost sent - could update local state or trigger refresh
    console.log(`Boost sent to ${name}`);
  };

  const getMainActionButton = () => {
    if (!isRealUser || !user?._id || user._id === id) {
      return (
        <Button
          variant="default"
          size="sm"
          className="rounded-full"
          onClick={(e) => e.stopPropagation()}
        >
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline ml-1">Add Buddy</span>
        </Button>
      );
    }

    // Check if this is a received request
    if (connectionStatus === "pending" && connectionId) {
      return (
        <div className="flex space-x-1 w-full justify-between">
          <Button
            variant="default"
            size="sm"
            className="rounded-full bg-green-500 hover:bg-green-600 w-full"
            onClick={handleAcceptRequest}
            disabled={isProcessing}
          >
            <Check className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full w-full hover:bg-red-500"
            onClick={handleDeclineRequest}
            disabled={isProcessing}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      );
    }

    // Handle different connection statuses
    switch (connectionStatus) {
      case "accepted":
        return (
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={(e) => e.stopPropagation()}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline ml-1">Message</span>
          </Button>
        );
      case "pending":
        return (
          <Button variant="outline" size="sm" className="rounded-full" disabled>
            <Clock className="w-4 h-4" />
            <span className="hidden sm:inline ml-1">Pending</span>
          </Button>
        );
      case "declined":
        return (
          <Button
            variant="default"
            size="sm"
            className="rounded-full"
            onClick={handleSendRequest}
            disabled={isProcessing || isLoading}
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline ml-1">
              {isProcessing ? "Sending..." : "Add Buddy"}
            </span>
          </Button>
        );
      default:
        return (
          <Button
            variant="default"
            size="sm"
            className="rounded-full"
            onClick={handleSendRequest}
            disabled={isProcessing || isLoading}
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline ml-1">
              {isProcessing ? "Sending..." : "Add Buddy"}
            </span>
          </Button>
        );
    }
  };

  return (
    <>
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
            <p className="text-sm text-buddy-gray-600 mb-4 line-clamp-2">
              {bio}
            </p>
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
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-buddy-purple text-buddy-purple hover:bg-buddy-purple hover:text-white relative overflow-hidden group transition-all duration-300 hover:shadow-lg hover:shadow-buddy-purple/25"
              onClick={handleBoostClick}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
              <Zap className="w-4 h-4 relative z-10" />
              <span className="hidden sm:inline ml-1 relative z-10">Boost</span>
            </Button>
            {getMainActionButton()}
          </div>
        </Card.Content>
      </Card>

      <BoostModal
        isOpen={isBoostModalOpen}
        onClose={() => setIsBoostModalOpen(false)}
        recipientName={name}
        recipientId={id}
        onBoostSent={handleBoostSent}
      />
    </>
  );
};

export default BuddyCard;
