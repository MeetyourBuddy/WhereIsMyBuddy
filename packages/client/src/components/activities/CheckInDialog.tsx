import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Camera,
  Type,
  Flame,
  Trophy,
  Target,
  Calendar,
  Clock,
  Star,
  Zap,
  Heart,
  TrendingUp,
  Award,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "../ui/textarea";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import ImageUpload from "../common/ImageUpload";
import { IActivityResult } from "@/types/activity-types";
import { useCheckInStore } from "@/store/checkin.store";
import { useBadgeStore } from "@/store/badge.store";
import { UploadService } from "@/services/api/upload/upload-service";

interface CheckInDialogProps {
  children: React.ReactNode;
  activity: IActivityResult;
  onCheckInComplete?: () => void;
}

const CheckInDialog: React.FC<CheckInDialogProps> = ({
  children,
  activity,
  onCheckInComplete,
}) => {
  const [open, setOpen] = useState(false);
  const [checkinType, setCheckinType] = useState<"text" | "image">("text");
  const [message, setMessage] = useState("");
  const [uploadedImageId, setUploadedImageId] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { stats, createCheckIn, fetchCheckInStats, isLoading } =
    useCheckInStore();
  const { fetchUserBadges } = useBadgeStore();

  // Note: Stats are now fetched by the parent component when needed
  // No automatic stats fetching when dialog opens

  // Real data from backend
  const userStreak = stats?.currentStreak || 0;
  const totalCheckIns = stats?.totalCheckIns || 0;
  const activityProgress = stats?.onTimePercentage || 0;
  const nextMilestone = Math.max(10, Math.ceil(totalCheckIns * 1.5)); // Dynamic milestone
  const pointsEarned = totalCheckIns * 10; // 10 points per check-in
  const isOnTime = true; // Will be determined by backend

  const handleImageUploaded = (fileId: string, imageUrl: string) => {
    setUploadedImageId(fileId);
    setUploadedImageUrl(imageUrl);
  };

  const handleImageRemoved = () => {
    setUploadedImageId(null);
    setUploadedImageUrl(null);
  };

  const handleCheckin = async () => {
    // Validate input based on check-in type
    if (checkinType === "text" && !message.trim()) {
      toast({
        title: "Message required",
        description: "Please share your progress or thoughts",
        variant: "destructive",
      });
      return;
    }

    if (checkinType === "image" && !uploadedImageId) {
      toast({
        title: "Image required",
        description: "Please upload an image for your check-in",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate proper scheduled date based on activity frequency
      const getScheduledDate = (activity: IActivityResult) => {
        const now = new Date();
        const startDate = new Date(activity.startDate);

        // For now, use current time as scheduled date
        // TODO: Implement proper scheduling based on activity frequency
        // This would consider checkinFrequency, checkinFrequencyUnit, checkinDays, etc.
        return now.toISOString();
      };

      // Prepare check-in data
      const checkInData = {
        activityId: activity._id,
        type: checkinType,
        content: checkinType === "text" ? message : "Image check-in",
        imageUrl: checkinType === "image" ? uploadedImageUrl : undefined,
        fileId: checkinType === "image" ? uploadedImageId : undefined,
        scheduledDate: getScheduledDate(activity),
      };

      // Create check-in via API
      const newCheckIn = await createCheckIn(checkInData);

      if (newCheckIn) {
        // Reset form
        setMessage("");
        setUploadedImageId(null);
        setUploadedImageUrl(null);
        setOpen(false);

        // Refresh stats and badges
        await fetchCheckInStats(activity._id);
        await fetchUserBadges(activity._id);

        if (onCheckInComplete) {
          onCheckInComplete();
        }
      }
    } catch (error) {
      console.error("Check-in failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl bg-white rounded-2xl border shadow-2xl p-6">
        {/* Motivational Header */}
        <div className="rounded-xl bg-gradient-to-r from-buddy-purple via-buddy-blue to-buddy-green p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

          <DialogHeader className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold">
                    Time to Check In! 🎯
                  </DialogTitle>
                  <DialogDescription className="text-white/90 text-sm">
                    {activity.title}
                  </DialogDescription>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 text-yellow-300">
                  <Flame className="w-5 h-5" />
                  <span className="font-bold text-lg">{userStreak}</span>
                </div>
                <p className="text-xs text-white/80">Day Streak</p>
              </div>
            </div>

            {/* Progress Stats */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Target className="w-4 h-4" />
                  <span className="font-semibold">{totalCheckIns}</span>
                </div>
                <p className="text-xs text-white/80">Total Check-ins</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-semibold">{activityProgress}%</span>
                </div>
                <p className="text-xs text-white/80">Activity Progress</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Zap className="w-4 h-4" />
                  <span className="font-semibold">{pointsEarned}</span>
                </div>
                <p className="text-xs text-white/80">Points Earned</p>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6">
          {/* Motivational Message */}
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <Heart className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">
                You're doing amazing!
              </span>
            </div>
            <p className="text-sm text-green-700">
              {userStreak >= 7
                ? "🔥 You're on fire! Keep this incredible streak going!"
                : userStreak >= 3
                  ? "💪 Great momentum! You're building strong habits!"
                  : "🌟 Every check-in counts! You're making progress!"}
            </p>
          </div>

          {/* Check-in Type Selection */}
          <div className="mb-6">
            <Label className="block mb-3 text-buddy-gray-700 font-medium">
              How would you like to share your progress today?
            </Label>
            <div className="flex gap-3">
              <Button
                variant={checkinType === "text" ? "default" : "outline"}
                onClick={() => setCheckinType("text")}
                className={`flex-1 rounded-full ${
                  checkinType === "text"
                    ? "bg-gradient-to-r from-buddy-purple to-buddy-blue text-white shadow-lg"
                    : "hover:border-buddy-purple/50"
                }`}
              >
                <Type className="mr-2 h-4 w-4" />
                Share Thoughts
              </Button>
              <Button
                variant={checkinType === "image" ? "default" : "outline"}
                onClick={() => setCheckinType("image")}
                className={`flex-1 rounded-full ${
                  checkinType === "image"
                    ? "bg-gradient-to-r from-buddy-purple to-buddy-blue text-white shadow-lg"
                    : "hover:border-buddy-purple/50"
                }`}
              >
                <Camera className="mr-2 h-4 w-4" />
                Share Photo
              </Button>
            </div>
          </div>

          {/* Check-in Content */}
          <div className="mb-6">
            {checkinType === "text" && (
              <div>
                <Label
                  htmlFor="checkin-message"
                  className="block mb-2 text-buddy-gray-700 font-medium"
                >
                  What did you accomplish today? 💭
                </Label>
                <Textarea
                  id="checkin-message"
                  placeholder="Share your progress, thoughts, or how you're feeling about your journey..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-4 h-32 rounded-xl border-buddy-gray-200 focus:border-buddy-purple focus:ring-buddy-purple/20 resize-none"
                />
                <p className="text-xs text-buddy-gray-500 mt-2">
                  {message.length}/500 characters
                </p>
              </div>
            )}

            {checkinType === "image" && (
              <div>
                <Label className="block mb-2 text-buddy-gray-700 font-medium">
                  Share a photo of your progress 📸
                </Label>
                <ImageUpload
                  onImageUploaded={handleImageUploaded}
                  onImageRemoved={handleImageRemoved}
                  maxSize={5}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Milestone Progress */}
          <div className="mb-6 p-4 bg-buddy-gray-50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-buddy-gray-800">
                  Next Milestone
                </span>
              </div>
              <Badge
                variant="outline"
                className="text-buddy-purple border-buddy-purple"
              >
                {nextMilestone - totalCheckIns} more to go!
              </Badge>
            </div>
            <Progress
              value={(totalCheckIns / nextMilestone) * 100}
              className="h-2"
            />
            <p className="text-xs text-buddy-gray-600 mt-2">
              {totalCheckIns} of {nextMilestone} check-ins completed
            </p>
          </div>
        </div>

        <DialogFooter className="p-6 pt-0 bg-buddy-gray-50">
          <div className="flex w-full space-x-3">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-full"
              disabled={isSubmitting}
            >
              Maybe Later
            </Button>
            <Button
              onClick={handleCheckin}
              disabled={
                isSubmitting ||
                (checkinType === "text" && !message.trim()) ||
                (checkinType === "image" && !uploadedImageId)
              }
              className="flex-1 bg-gradient-to-r rounded-full from-buddy-purple to-buddy-blue text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Complete Check-in
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CheckInDialog;
