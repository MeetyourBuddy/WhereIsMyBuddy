import React, { useState, useRef } from "react";
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
  Lock,
  LockIcon,
  LockKeyhole,
  AlertTriangle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/types/auth-types";
import { IUserResponse } from "@/types/user-types";
import { formatDate, differenceInDays } from "date-fns";
import { useActivityData } from "@/hooks/useActivityData";
import { useAuth } from "@/store/auth.store";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  isActivityCreator,
  isActivityParticipant,
  ActivityType,
  IActivityResult,
} from "@/types/activity-types";
import { RequestToJoinModal } from "@/components/activities/RequestToJoinModal";

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
  type?: ActivityType | string;
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
  hasPendingInvitation?: boolean; // Whether user has a pending invitation to this activity
  /** User's join request was accepted (show Quit, not Request) even before participants list refetches */
  hasAcceptedJoinRequest?: boolean;
  /** User has a pending join request (show disabled Pending button) */
  hasPendingJoinRequest?: boolean;
  /** Full activity object for private "Request to join" modal; required to show Request flow */
  activity?: IActivityResult;
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
  type,
  onClick,
  showProgress = false,
  userProgress,
  hasPendingInvitation = false,
  hasAcceptedJoinRequest = false,
  hasPendingJoinRequest = false,
  activity: activityProp,
}: ActivityCardProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { joinActivityMutation, quitActivityMutation } = useActivityData();
  const [isJoining, setIsJoining] = useState(false);
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const requestModalJustClosedRef = useRef(false);

  // Check if user is a participant and creator using helper functions
  // Use both _id and id fields to handle different API responses
  const userId = user?._id || user?.id;
  const isParticipant = isActivityParticipant(
    { participants, admin } as any,
    userId
  );
  const isCreator = isActivityCreator({ admin } as any, userId);

  // Check if activity has ended
  const isEnded = endDate ? differenceInDays(new Date(endDate), new Date()) < 0 : false;

  // Check if activity is private
  const isPrivate = type === ActivityType.PRIVATE || type === "private";

  // Treat accepted join request as participant for UI (Quit button)
  const effectiveParticipant = isParticipant || hasAcceptedJoinRequest;
  // Check if user can access private activity (admin, participant, pending invite, or accepted request)
  const canAccessPrivate = isPrivate && (isCreator || isParticipant || hasPendingInvitation || hasAcceptedJoinRequest);

  const participantCount = participants?.length ?? 0;
  const isFull = maxParticipants != null && maxParticipants > 0 && participantCount >= maxParticipants;

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

    // Prevent joining private activities if user doesn't have access
    if (isPrivate && !canAccessPrivate) {
      toast({
        title: "Private Activity",
        description: "This activity is private. Only invited members can join it.",
        variant: "default",
      });
      return;
    }

    // If user is a participant (or has accepted join request), show quit confirmation modal
    if (effectiveParticipant) {
      setShowQuitModal(true);
      return;
    }

    // Otherwise, join the activity
    setIsJoining(true);
    try {
      await joinActivityMutation.mutateAsync(id);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ?? error?.message ?? "";
      const isFull =
        /full|capacity|maximum.*participant/i.test(String(message));
      toast({
        title: "Join Failed",
        description: isFull
          ? "This activity has reached its maximum number of participants. Try another activity!"
          : message || "Failed to join activity",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  const handleConfirmQuit = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (!id) return;

    setIsJoining(true);
    setShowQuitModal(false);
    try {
      await quitActivityMutation.mutateAsync(id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to quit activity",
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

  // Handle card click - for private without access, open Request modal if activity provided; else toast
  const handleCardClick = () => {
    if (requestModalJustClosedRef.current) {
      requestModalJustClosedRef.current = false;
      return;
    }
    if (isPrivate && !canAccessPrivate) {
      if (activityProp && user && !isFull) {
        setShowRequestModal(true);
      } else if (activityProp && user && isFull) {
        toast({
          title: "Activity full",
          description: "This activity has reached its maximum number of participants.",
          variant: "default",
        });
      } else if (!user) {
        toast({
          title: "Please sign in",
          description: "You need to sign in to request to join.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Private Activity",
          description: "This activity is private. Only invited members can view it.",
          variant: "default",
        });
      }
      return;
    }
    onClick && onClick();
  };

  return (
    <Card
      hover={!isPrivate || canAccessPrivate}
      className={`transition-all duration-300 overflow-hidden ${
        isPrivate && !canAccessPrivate
          ? "cursor-not-allowed opacity-75"
          : "cursor-pointer"
      }`}
      onClick={handleCardClick}
    >
      <Card.Content className="p-0 flex flex-col h-full">
        {/* Activity Image */}
        <div className="relative h-40 overflow-hidden flex-shrink-0">
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
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {category && (
              <span
                className={`px-3 py-1 backdrop-blur-sm rounded-full text-xs font-medium flex items-center text-white ${getCategoryColor(category)}`}
              >
                <span className="mr-1">{getCategoryIcon(category)}</span>
                {category}
              </span>
            )}
          </div>
          <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
            <span className="bg-black/40 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
              {participantCount}/{maxParticipants} buddies
            </span>
            {isFull && (
              <Badge className="bg-amber-500/90 hover:bg-amber-500/90 text-white border-0 text-xs font-medium">
                Full
              </Badge>
            )}
          </div>
        </div>

        <div className="p-6 pb-4 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="text-xl font-semibold text-buddy-gray-900">
              {title}
            </h3>
            {isPrivate && (
              <Badge variant="secondary" className="gap-1 text-xs font-medium">
                <LockKeyhole className="w-3.5 h-3.5" />
                Private
              </Badge>
            )}
          </div>
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

          <div className="space-y-2 mt-auto">
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

        <div className="flex items-center justify-between p-4 border-t border-buddy-gray-100 flex-shrink-0">
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
                {isEnded ? (
                  <Badge
                    variant="destructive"
                    className="h-9 px-4 rounded-full bg-red-100 text-red-700 border border-red-200 hover:bg-red-100"
                  >
                    Ended
                  </Badge>
                ) : isCreator ? (
                  <div className="h-9 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-buddy-purple to-buddy-blue text-white rounded-full text-sm font-medium">
                    <Shield className="w-4 h-4" />
                    CREATOR
                  </div>
                ) : isPrivate && !canAccessPrivate && hasPendingJoinRequest ? (
                  <Button
                    variant="outline"
                    disabled
                    className="h-9 rounded-full border-amber-400 bg-amber-50 text-amber-800 cursor-not-allowed hover:bg-amber-50 hover:text-amber-800"
                  >
                    Pending
                  </Button>
                ) : isPrivate && !canAccessPrivate && activityProp && user && !hasAcceptedJoinRequest && isFull ? (
                  <Button
                    variant="outline"
                    disabled
                    className="h-9 rounded-full opacity-70 cursor-not-allowed border-buddy-gray-300 bg-buddy-gray-100 text-buddy-gray-600"
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    Full
                  </Button>
                ) : isPrivate && !canAccessPrivate && activityProp && user && !hasAcceptedJoinRequest ? (
                  <Button
                    variant="default"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowRequestModal(true);
                    }}
                    className="h-9 rounded-full bg-gradient-to-r from-buddy-purple to-buddy-blue text-white"
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    Request
                  </Button>
                ) : isPrivate && !canAccessPrivate ? (
                  <Badge
                    variant="secondary"
                    className="h-9 px-4 rounded-full bg-buddy-gray-200 text-buddy-gray-700 border border-buddy-gray-300 hover:bg-buddy-gray-200 cursor-not-allowed"
                  >
                    <Lock className="w-4 h-4 mr-1" />
                    Private
                  </Badge>
                ) : (
                  <Button
                    variant="default"
                    onClick={handleJoinQuit}
                    disabled={
                      isFull ||
                      isJoining ||
                      joinActivityMutation.isPending ||
                      quitActivityMutation.isPending
                    }
                    className={`h-9 rounded-full ${
                      effectiveParticipant
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : isFull
                          ? "opacity-70 cursor-not-allowed"
                          : ""
                    }`}
                  >
                    {effectiveParticipant ? (
                      <>
                        <UserMinus className="w-4 h-4" />
                        {isJoining ? "Leaving..." : "Quit"}
                      </>
                    ) : isFull ? (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Full
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
                handleCardClick();
              }}
              disabled={isPrivate && !canAccessPrivate}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </Card.Content>

      {/* Request to join (private activity) modal */}
      {activityProp && (
        <RequestToJoinModal
          activity={activityProp}
          open={showRequestModal}
          onOpenChange={(open) => {
            if (!open) requestModalJustClosedRef.current = true;
            setShowRequestModal(open);
            if (!open) {
              setTimeout(() => {
                requestModalJustClosedRef.current = false;
              }, 300);
            }
          }}
          onRequestSent={() => {
            setShowRequestModal(false);
          }}
        />
      )}

      {/* Quit Activity Confirmation Modal */}
      <Dialog open={showQuitModal} onOpenChange={setShowQuitModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Confirm Quit Activity
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to quit this activity?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-buddy-gray-700">
              If you quit this activity, <strong>all your progress will be lost</strong>, including:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-buddy-gray-600 list-disc list-inside">
              <li>All check-ins you've completed</li>
              <li>Your current streak</li>
              <li>Your progress percentage</li>
              <li>All activity statistics</li>
            </ul>
            <p className="mt-4 text-sm font-medium text-buddy-gray-800">
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowQuitModal(false)}
              disabled={isJoining}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmQuit}
              disabled={isJoining}
              className="bg-red-500 hover:bg-red-600"
            >
              {isJoining ? "Leaving..." : "Yes, Quit Activity"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ActivityCard;
