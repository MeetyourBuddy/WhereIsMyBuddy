import React, { useState } from "react";
import { Card } from "@/components/common/Card";
import Avatar from "@/components/common/Avatar";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  ChevronRight,
  UserPlus,
  UserMinus,
  Shield,
  Flame,
  CheckCircle,
} from "lucide-react";
import { User } from "@/types/auth-types";
import { IUserResponse } from "@/types/user-types";
import { formatDate } from "date-fns";
import { useActivityData } from "@/hooks/useActivityData";
import { useAuth } from "@/store/auth.store";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  isActivityCreator,
  isActivityParticipant,
} from "@/types/activity-types";

interface ActivityCardProps {
  id?: string;
  title: string;
  description: string;
  avatar?: string;
  startDate: string;
  endDate?: string;
  category?: string;
  bannerImage?: string;
  participants: IUserResponse[];
  maxParticipants: number;
  admin?: IUserResponse;
  onClick?: () => void;
  // Progress tracking props (optional)
  showProgress?: boolean;
  userProgress?: {
    progress: number;
    completedCheckIns: number;
    totalAvailableCheckIns: number;
    currentStreak?: number;
    lastCheckInDate?: string;
  };
}

const ActivityCard = ({
  id,
  title,
  description,
  avatar,
  startDate,
  endDate,
  category,
  bannerImage,
  participants,
  maxParticipants,
  admin,
  onClick,
  showProgress = false,
  userProgress,
}: ActivityCardProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { joinActivityMutation, quitActivityMutation } = useActivityData();
  const [isJoining, setIsJoining] = useState(false);

  // Check if user is a participant and creator using helper functions
  // Use both _id and id fields to handle different API responses
  const userId = user?._id || user?.id;
  const isParticipant = isActivityParticipant(
    { participants, admin } as any,
    userId
  );
  const isCreator = isActivityCreator({ admin } as any, userId);

  const handleJoinQuit = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to join activities",
        variant: "destructive",
      });
      return;
    }

    if (!id) {
      toast({
        title: "Error",
        description: "Activity ID is missing",
        variant: "destructive",
      });
      return;
    }

    setIsJoining(true);
    try {
      if (isParticipant) {
        await quitActivityMutation.mutateAsync(id);
      } else {
        await joinActivityMutation.mutateAsync(id);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update activity participation",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };
  // Calculate the images to display for group avatar

  console.log("details in activity card", category);
  console.log("🔍 ActivityCard Debug:", {
    title,
    showProgress,
    userProgress,
    hasUserProgress: !!userProgress,
    progressValue: userProgress?.progress,
    activityId: id,
  });
  const participantImages = participants.map((p) => p.avatar || "");

  // Determine category background color
  const getCategoryColor = (category: string) => {
    if (!category) return "bg-buddy-gray-200 text-buddy-gray-700";

    const categoryMap: Record<string, string> = {
      fitness: "bg-buddy-green-light/70 text-buddy-green-dark",
      technology: "bg-buddy-blue-light/70 text-buddy-blue-dark",
      reading: "bg-buddy-orange-light/70 text-buddy-orange-dark",
      art: "bg-buddy-pink-light/70 text-buddy-pink-dark",
      cooking: "bg-buddy-yellow-light/70 text-buddy-yellow-dark",
      language: "bg-buddy-green-light/70 text-buddy-green-dark",
      meditation: "bg-buddy-purple-light/70 text-buddy-purple-dark",
      finance: "bg-buddy-red-light/70 text-buddy-red-dark",
      default: "bg-buddy-gray-200 text-buddy-gray-700",
    };

    const normalizedCategory = category.toLowerCase().trim();
    return categoryMap[normalizedCategory] || categoryMap.default;
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    if (!category) return "🏷️";

    const defaultIcon = "🏷️";
    const iconMap: Record<string, string> = {
      fitness: "🏃",
      technology: "💻",
      reading: "📚",
      art: "🎨",
      cooking: "🍳",
      language: "🗣️",
      meditation: "🧘",
      finance: "💰",
      other: "🏷️",
    };

    const normalizedCategory = category.toLowerCase().trim();
    return iconMap[normalizedCategory] || defaultIcon;
  };

  // Helper function to safely parse dates
  const parseDate = (date: Date | string) => {
    if (date instanceof Date) return date;
    try {
      return new Date(date);
    } catch (e) {
      return null;
    }
  };

  return (
    <Card
      hover
      className="transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      <Card.Content className="p-0">
        {/* Activity Image */}
        <div className="relative h-40 overflow-hidden">
          {bannerImage ? (
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${bannerImage})` }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-buddy-gray-100 to-buddy-gray-200 flex items-center justify-center">
              <span className="text-4xl">{getCategoryIcon(category)}</span>
            </div>
          )}
          <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-black/0 via-black/0 to-black/30"></div>
          <div className="absolute top-3 left-3">
            {category && (
              <span
                className={`px-3 py-1 backdrop-blur-sm rounded-full text-xs font-medium flex items-center ${getCategoryColor(category)}`}
              >
                <span className="mr-1">{getCategoryIcon(category)}</span>
                {category}
              </span>
            )}
          </div>
          <div className="absolute top-3 right-3">
            <span className="bg-black/40 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
              {participants.length}/{maxParticipants} buddies
            </span>
          </div>
        </div>

        <div className="p-6 pb-4">
          <h3 className="text-xl font-semibold mb-2 text-buddy-gray-900">
            {title}
          </h3>
          <p className="text-buddy-gray-600 text-sm mb-4 line-clamp-2">
            {description}
          </p>

          {/* Progress Indicators - Only show if showProgress is true and userProgress is available */}
          {showProgress && userProgress && (
            <div className="mb-4 p-3 bg-gradient-to-r from-buddy-purple/5 to-buddy-blue/5 rounded-lg border border-buddy-purple/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-buddy-green" />
                  <span className="text-sm font-medium text-buddy-gray-700">
                    Your Progress
                  </span>
                </div>
                <span className="text-sm font-semibold text-buddy-purple">
                  {userProgress.progress || 0}%
                </span>
              </div>

              <Progress
                value={userProgress.progress || 0}
                className="h-2 mb-2 bg-buddy-gray-200"
              />

              <div className="flex items-center justify-between text-xs text-buddy-gray-600">
                <span>
                  {userProgress.completedCheckIns || 0}/
                  {userProgress.totalAvailableCheckIns || 0} check-ins
                </span>
                {userProgress.currentStreak &&
                  userProgress.currentStreak > 0 && (
                    <div className="flex items-center space-x-1">
                      <Flame className="w-3 h-3 text-orange-500" />
                      <span className="text-orange-600 font-medium">
                        {userProgress.currentStreak} day streak
                      </span>
                    </div>
                  )}
              </div>
            </div>
          )}

          <div className="space-y-2 mb-4">
            {/* <div className="flex items-center text-buddy-gray-700 text-sm">
              <MapPin className="w-4 h-4 mr-2 text-buddy-gray-500" />
              <span>{location}</span>
            </div> */}
            <div className="flex items-center text-buddy-gray-700 text-sm">
              <Calendar className="w-4 h-4 mr-2 text-buddy-gray-500" />
              <span>
                {startDate
                  ? formatDate(new Date(startDate), "MMM dd, yyyy")
                  : "Invalid date"}{" "}
                -{" "}
                {endDate
                  ? formatDate(new Date(endDate), "MMM dd, yyyy")
                  : "No end date"}
              </span>
            </div>
            {/* <div className="flex items-center text-buddy-gray-700 text-sm">
              <Clock className="w-4 h-4 mr-2 text-buddy-gray-500" />
              <span>{time}</span>
            </div> */}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-buddy-gray-100">
          <div className="flex items-center">
            <Avatar isGroup groupImages={participantImages} size="sm" />
            <span className="ml-3 text-sm font-medium text-buddy-gray-600">
              {participants.length > 0
                ? participants.length === 1
                  ? `${participants[0].name} is going`
                  : `${participants[0].name} and ${participants.length - 1} others`
                : "Be the first to join!"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {id && (
              <>
                {isCreator ? (
                  <div className="h-9 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-buddy-purple to-buddy-blue text-white rounded-full text-sm font-medium">
                    <Shield className="w-4 h-4" />
                    CREATOR
                  </div>
                ) : (
                  <Button
                    variant="default"
                    onClick={handleJoinQuit}
                    disabled={
                      isJoining ||
                      joinActivityMutation.isPending ||
                      quitActivityMutation.isPending
                    }
                    className={`h-9 rounded-full ${
                      isParticipant
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : ""
                    }`}
                  >
                    {isParticipant ? (
                      <>
                        <UserMinus className="w-4 h-4" />
                        {isJoining ? "Leaving..." : "Quit"}
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        {isJoining ? "Joining..." : "Join"}
                      </>
                    )}
                  </Button>
                )}
              </>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="text-buddy-gray-500 rounded-full border hover:border-buddy-gray-400 hover:text-buddy-gray-900 hover:bg-buddy-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                onClick && onClick();
              }}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default ActivityCard;
