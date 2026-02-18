import React, { useState, useMemo } from "react";
import { Card } from "@/components/common/Card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Share,
  UserCheck,
  Calendar,
  Heart,
  ThumbsUp,
  Star,
  Zap,
  Trophy,
  Target,
} from "lucide-react";
import Avatar from "@/components/common/Avatar";
import { Button } from "@/components/ui/button";
import CheckInDialog from "./CheckInDialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import CheckInThread from "./CheckInThread";
import {
  IActivityResult,
  isActivityParticipant,
  isActivityCreator,
} from "@/types/activity-types";
import { useAuth } from "@/store/auth.store";

interface CheckInCardProps {
  date: Date;
  title: string;
  description: string;
  image?: string;
  totalParticipants: number;
  checkedInParticipants: number;
  comments: number;
  likes: number;
  isCheckedIn?: boolean;
  activity: IActivityResult;
  checkIns: any[]; // Real check-in data from backend
  /** When true, this card is for a past period; hide "Check In Now" and "Add Your Check-in" */
  isPeriodPassed?: boolean;
  /** Called after a successful check-in so the parent can revalidate activity data */
  onCheckInComplete?: () => void;
}

// Motivational images array - 31 images for each day of the month
const MOTIVATIONAL_IMAGES = [
  "https://images.unsplash.com/photo-1464822759844-d150baec2b1c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Victory celebration
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Marathon finish line
  "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Mountain peak achievement
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Determined athlete
  "https://images.unsplash.com/photo-1508672019048-805c876b67e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Team victory
  "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Graduation celebration
  "https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Weightlifting success
  "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Reading achievement
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Coding success
  "https://images.unsplash.com/photo-1508672019048-805c876b67e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Creative breakthrough
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Sunrise achievement
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Yoga mastery
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Running victory
  "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Climbing success
  "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Learning milestone
  "https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Team success
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Nature triumph
  "https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Fitness victory
  "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Knowledge achievement
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Tech breakthrough
  "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Creative success
  "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Adventure conquest
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Endurance victory
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Peak achievement
  "https://images.unsplash.com/photo-1464822759844-d150baec2b1c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Victory celebration
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Focused success
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Balanced achievement
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Strength victory
  "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Growth success
  "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Knowledge triumph
  "https://images.unsplash.com/photo-1508672019048-805c876b67e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Collaborative win
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Inspiring success
  "https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Health victory
  "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Wisdom achievement
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Innovation success
  "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Creative victory
  "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Challenge conquered
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Endurance triumph
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Ultimate success
];

const CheckInCard: React.FC<CheckInCardProps> = ({
  date,
  title,
  description,
  image,
  totalParticipants,
  checkedInParticipants,
  comments,
  likes,
  isCheckedIn = false,
  activity,
  checkIns,
  isPeriodPassed = false,
  onCheckInComplete,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isThreadExpanded, setIsThreadExpanded] = useState(false);
  const { user } = useAuth();

  // Check if user is a participant or admin
  const userId = user?._id || user?.id;
  const isUserParticipant = isActivityParticipant(activity, userId);
  const isUserAdmin = isActivityCreator(activity, userId);
  const canAccessCheckIn = isUserParticipant || isUserAdmin;

  // Debug: Log the props received by CheckInCard
  console.log("🎴 CheckInCard received props:", {
    date,
    title,
    description,
    totalParticipants,
    checkedInParticipants,
    comments,
    likes,
    isCheckedIn,
    checkInsCount: checkIns?.length || 0,
    checkIns: checkIns,
  });

  // Get motivational image based on date of month
  const motivationalImage = useMemo(() => {
    const dayOfMonth = date.getDate();
    return MOTIVATIONAL_IMAGES[(dayOfMonth - 1) % MOTIVATIONAL_IMAGES.length];
  }, [date]);

  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const completionPercentage =
    (checkedInParticipants / totalParticipants) * 100;

  // Note: Like functionality moved to ReactionButton component

  const defaultImage =
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80";

  // Use real check-in data passed from parent component
  // The checkIns prop should be passed from ActivityCheckin component

  const toggleThread = () => {
    setIsThreadExpanded(!isThreadExpanded);
  };

  return (
    <div className="pb-6 animate-fade-in transition-all duration-300">
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 rounded-2xl border-0 shadow-md bg-white/95 backdrop-blur-sm">
        <div className="cursor-pointer" onClick={toggleThread}>
          <div className="relative">
            <img
              src={motivationalImage}
              alt={`Motivational image for ${formattedDate}`}
              className="w-full h-40 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

            {/* Date and title overlay */}
            <div className="absolute bottom-0 left-0 p-4 text-white">
              <div className="flex items-center mb-2">
                <Calendar className="w-4 h-4 mr-2 text-white/90" />
                <span className="text-sm font-medium text-white/90">
                  {formattedDate}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-1">{title}</h3>
              <p className="text-sm text-white/80 line-clamp-2">
                {description}
              </p>
            </div>

            {/* Status badge */}
            {isCheckedIn && (
              <Badge className="absolute top-4 right-4 bg-gradient-to-r from-buddy-green to-buddy-blue text-white text-xs px-3 py-1.5 rounded-full shadow-lg border-0">
                <Trophy className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            )}

            {/* Motivational quote overlay */}
            <div className="absolute top-4 left-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                <div className="flex items-center">
                  <Zap className="w-4 h-4 text-yellow-300 mr-2" />
                  <span className="text-xs font-medium text-white">
                    Daily Motivation
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4">
            {/* Progress section */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <Target className="w-4 h-4 text-buddy-purple mr-2" />
                  <span className="text-sm font-medium text-buddy-gray-700">
                    Progress
                  </span>
                </div>
                <span className="text-sm font-bold text-buddy-purple">
                  {checkedInParticipants} of {totalParticipants}
                </span>
              </div>
              <Progress
                value={completionPercentage}
                className="h-2 bg-buddy-gray-200"
              >
                <div
                  className="h-full bg-gradient-to-r from-buddy-purple to-buddy-blue rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </Progress>
              <div className="flex justify-between mt-1 text-xs text-buddy-gray-500">
                <span>0%</span>
                <span className="font-medium">
                  {Math.round(completionPercentage)}%
                </span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 flex justify-between items-center border-t border-buddy-gray-100 bg-gradient-to-r from-buddy-gray-50/50 to-white">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleThread();
            }}
            className="flex items-center text-sm text-buddy-gray-600 hover:text-buddy-blue cursor-pointer transition-colors rounded-md px-2 py-1.5 -mx-2 hover:bg-buddy-blue/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-buddy-blue/50 focus-visible:ring-offset-1"
            aria-label={`View check-ins and comments (${checkIns.length})`}
          >
            <MessageCircle className="w-4 h-4 mr-2 text-buddy-blue shrink-0" />
            <span className="font-medium">View check-ins &amp; comments ({checkIns.length})</span>
          </button>

          {!isPeriodPassed && !isCheckedIn && canAccessCheckIn && (
            <CheckInDialog activity={activity} onCheckInComplete={onCheckInComplete}>
              <Button
                type="button"
                className="bg-gradient-to-r from-buddy-purple to-buddy-blue text-white rounded-full px-6 py-2 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Zap className="w-4 h-4 mr-2" />
                Check In Now
              </Button>
            </CheckInDialog>
          )}
        </div>
      </Card>

      {isThreadExpanded && (
        <div className="mt-4 pl-4 border-l-4 border-gradient-to-b from-buddy-purple to-buddy-blue animate-slide-down">
          <div className="bg-gradient-to-r from-buddy-purple/5 to-buddy-blue/5 rounded-lg p-4">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-buddy-purple to-buddy-blue rounded-full flex items-center justify-center mr-3">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-buddy-gray-800">
                  Check-in Activity
                </h4>
                <p className="text-xs text-buddy-gray-600">
                  {checkIns.length} check-ins for {formattedDate}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {checkIns.length > 0 ? (
                checkIns.map((checkIn) => (
                  <CheckInThread key={checkIn._id} checkIn={checkIn} />
                ))
              ) : (
                <div className="text-center py-6 bg-white/50 rounded-lg border border-buddy-gray-200">
                  <div className="w-12 h-12 bg-buddy-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="w-6 h-6 text-buddy-gray-400" />
                  </div>
                  <p className="text-sm text-buddy-gray-600 font-medium">
                    No check-ins yet
                  </p>
                  <p className="text-xs text-buddy-gray-500 mt-1">
                    Be the first to check in for this day!
                  </p>
                </div>
              )}
            </div>

            {!isPeriodPassed && !isCheckedIn && canAccessCheckIn && (
              <div className="mt-4 flex justify-center">
                <CheckInDialog activity={activity} onCheckInComplete={onCheckInComplete}>
                  <Button
                    type="button"
                    className="bg-gradient-to-r from-buddy-purple to-buddy-blue text-white rounded-full px-6 py-2 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Add Your Check-in
                  </Button>
                </CheckInDialog>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckInCard;
