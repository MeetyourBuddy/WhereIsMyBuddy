import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Type,
  Flame,
  Trophy,
  Target,
  Zap,
  Heart,
  TrendingUp,
  Upload,
  X,
  Image as ImageIcon,
  Info,
  LucideAlarmClockCheck,
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IActivityResult } from "@/types/activity-types";
import { useCheckInStore } from "@/store/checkin.store";
import { useBadgeStore } from "@/store/badge.store";
import { UploadService } from "@/services/api/upload/upload-service";
import { CheckInService } from "@/services/api/activity/reaction.service";
import { useAuthStore } from "@/store/auth.store";
import { useQueryClient } from "@tanstack/react-query";
import { activityQueryKeys } from "@/hooks/useActivityData";

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
  // Remove checkinType state since we now always support text + optional image
  const [message, setMessage] = useState("");
  const [uploadedImageId, setUploadedImageId] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProgress, setUserProgress] = useState<{
    progress: number;
    completedCheckIns: number;
    totalAvailableCheckIns: number;
  } | null>(null);
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);

  const { stats, createCheckIn, fetchCheckInStats } = useCheckInStore();
  const { fetchUserBadges } = useBadgeStore();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // Fetch user progress and activity-specific stats when dialog opens
  useEffect(() => {
    if (!user?._id || !activity._id || !open) return;

    const activityId = activity._id ?? activity.id;

    const loadDialogData = async () => {
      setIsLoadingProgress(true);
      try {
        const [progressRes] = await Promise.all([
          CheckInService.getUserProgress(activityId),
          fetchCheckInStats(activityId),
        ]);
        setUserProgress(progressRes.data);
      } catch (error) {
        console.error("CheckInDialog: failed to load progress/stats", error);
      } finally {
        setIsLoadingProgress(false);
      }
    };

    loadDialogData();
  }, [activity._id, activity.id, user?._id, open, fetchCheckInStats]);

  // All metrics are for this activity only (from userProgress + stats fetched when dialog opens)
  const completedCheckIns = userProgress?.completedCheckIns ?? 0;
  const totalAvailableCheckIns = userProgress?.totalAvailableCheckIns ?? 0;
  const activityProgress = userProgress?.progress ?? 0;
  const activityStreak = stats?.currentStreak ?? 0;
  const nextMilestone = totalAvailableCheckIns;
  const pointsEarned = completedCheckIns * 10 + activityStreak * 5;
  const userStreak = activityStreak;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const acceptedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!acceptedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description:
          "Please select a valid image file (JPEG, PNG, GIF, or WebP)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB max)
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > 5) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Store the file and create preview
    setSelectedFile(file);
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  };

  const handleImageRemoved = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadedImageId(null);
    setUploadedImageUrl(null);
  };

  const handleCheckin = async () => {
    // Validate input - text is always required
    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please share your progress or thoughts",
        variant: "destructive",
      });
      return;
    }

    // Ensure we have the correct activity ID for this dialog (data integrity)
    const activityId = activity?._id ?? activity?.id;
    if (!activityId) {
      toast({
        title: "Error",
        description: "Activity not found. Please refresh and try again.",
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

        // Calculate the current check-in period based on activity frequency
        const calculateCheckInPeriod = (
          activity: IActivityResult,
          date: Date
        ) => {
          const { checkinFrequency, checkinFrequencyUnit } = activity;

          // Calculate period duration based on frequency unit
          let periodDuration: number;
          switch (checkinFrequencyUnit) {
            case "daily":
              periodDuration = 24 * 60 * 60 * 1000; // 1 day in milliseconds
              break;
            case "weekly":
              periodDuration = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
              break;
            case "monthly":
              periodDuration = 30 * 24 * 60 * 60 * 1000; // 1 month in milliseconds
              break;
            default:
              periodDuration = 24 * 60 * 60 * 1000; // Default to daily
          }

          // Calculate how many periods have passed since activity start
          const timeSinceStart = date.getTime() - startDate.getTime();
          const periodsPassed = Math.floor(
            timeSinceStart / (periodDuration * checkinFrequency)
          );

          // Calculate the start of the current period
          const periodStart = new Date(
            startDate.getTime() +
              periodsPassed * periodDuration * checkinFrequency
          );

          return periodStart;
        };

        // Get the current check-in period start date
        const currentPeriodStart = calculateCheckInPeriod(activity, now);

        // If we have specific check-in days, find the next valid day
        if (activity.checkinDays && activity.checkinDays.length > 0) {
          const dayNames = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
          ];
          const currentDay = now.getDay();
          const allowedDays = activity.checkinDays.map((day) =>
            dayNames.indexOf(day.toLowerCase())
          );

          // Find the next allowed day within the current period
          for (let i = 0; i < 7; i++) {
            const checkDay = (currentDay + i) % 7;
            if (allowedDays.includes(checkDay)) {
              const targetDate = new Date(now);
              targetDate.setDate(targetDate.getDate() + i);
              targetDate.setHours(0, 0, 0, 0);
              return targetDate.toISOString();
            }
          }
        }

        // If we have specific dates of month, check if today matches
        if (
          activity.checkinDatesOfMonth &&
          activity.checkinDatesOfMonth.length > 0
        ) {
          const currentDate = now.getDate();
          if (activity.checkinDatesOfMonth.includes(currentDate)) {
            const targetDate = new Date(now);
            targetDate.setHours(0, 0, 0, 0);
            return targetDate.toISOString();
          }
        }

        // Default: use the current period start date
        return currentPeriodStart.toISOString();
      };

      // Upload image if provided (optional)
      let imageUrl = undefined;
      let fileId = undefined;

      if (selectedFile) {
        try {
          const uploadResponse = await UploadService.uploadImage(selectedFile);
          fileId = uploadResponse.fileId;
          imageUrl = UploadService.getImageUrl(uploadResponse.fileId);
        } catch (error) {
          console.error("Image upload failed:", error);
          toast({
            title: "Upload failed",
            description: "Failed to upload image. Please try again.",
            variant: "destructive",
          });
          return;
        }
      }

      // Prepare check-in data (use activityId from above to avoid wrong activity)
      const checkInData = {
        activityId,
        type: (selectedFile ? "image" : "text") as "image" | "text", // Set type based on whether image is provided
        content: message, // Always use the text message
        imageUrl: imageUrl,
        fileId: fileId,
        scheduledDate: getScheduledDate(activity),
      };

      // Debug: Log the check-in data being sent
      console.log("📤 CheckInDialog sending checkInData:", {
        activityId: checkInData.activityId,
        type: checkInData.type,
        content: checkInData.content,
        imageUrl: checkInData.imageUrl,
        fileId: checkInData.fileId,
        hasSelectedFile: !!selectedFile,
        hasImageUrl: !!imageUrl,
        hasFileId: !!fileId,
        selectedFileName: selectedFile?.name,
        selectedFileSize: selectedFile?.size,
        selectedFileType: selectedFile?.type,
        uploadResponse: selectedFile ? "Upload attempted" : "No file selected",
      });

      // Create check-in via API
      const newCheckIn = await createCheckIn(checkInData);

      if (newCheckIn) {
        // Reset form and close so the flow feels immediate
        setMessage("");
        setSelectedFile(null);
        setPreviewUrl(null);
        setUploadedImageId(null);
        setUploadedImageUrl(null);
        setOpen(false);

        // Single source of truth: invalidate all activity-related queries once so UI updates everywhere
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: activityQueryKeys.stats(activityId) }),
          queryClient.invalidateQueries({ queryKey: activityQueryKeys.progress(activityId) }),
          queryClient.invalidateQueries({ queryKey: activityQueryKeys.detail(activityId) }),
          queryClient.invalidateQueries({ queryKey: activityQueryKeys.weekly(activityId) }),
          queryClient.invalidateQueries({ queryKey: activityQueryKeys.participants(activityId) }),
          queryClient.invalidateQueries({ queryKey: activityQueryKeys.lists() }),
        ]);

        // Badges and local progress (non-blocking)
        fetchUserBadges(activityId).catch(() => {});
        CheckInService.getUserProgress(activityId)
          .then((res) => setUserProgress(res.data))
          .catch(() => {});

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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] bg-white rounded-2xl border shadow-2xl p-0 flex flex-col">
        {/* Motivational Header */}
        <div className="bg-gradient-to-r from-buddy-purple rounded-t-xl via-buddy-blue to-buddy-green p-6 text-white relative overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

          <DialogHeader className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <LucideAlarmClockCheck className="w-6 h-6" />
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
                <div className="flex items-center justify-center space-x-1 text-yellow-300">
                  <Flame className="w-5 h-5" />
                  <span className="font-bold text-lg">{userStreak}</span>
                </div>
                <p className="text-xs text-white/80">Current streak</p>
              </div>
            </div>

            {/* Progress Stats */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Target className="w-4 h-4" />
                  <span className="font-semibold">{completedCheckIns}</span>
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
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-center cursor-pointer">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Zap className="w-4 h-4" />
                      <span className="font-semibold">{pointsEarned}</span>
                      <Info className="w-3 h-3 text-white/70" />
                    </div>
                    <p className="text-xs text-white/80">Points Earned</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[240px] text-sm">
                  <p className="font-medium mb-1">How points work</p>
                  <p className="text-muted-foreground">
                    You earn 10 points per check-in plus 5 points per day of your
                    current streak. Keep checking in to grow your score!
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </DialogHeader>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
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

          {/* Check-in Content */}
          <div className="mb-6">
            <Label className="block mb-3 text-buddy-gray-700 font-medium">
              Share your progress today
            </Label>
          </div>

          {/* Text Input - Always Required */}
          <div className="mb-6">
            <Label
              htmlFor="checkin-message"
              className="block mb-2 text-buddy-gray-700 font-medium"
            >
              What did you accomplish today?
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

          {/* Optional Image Upload */}
          <div className="mb-6">
            <Label className="block mb-2 text-buddy-gray-700 font-medium">
              Add a photo (optional)
            </Label>
            <div className="space-y-4">
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileSelect}
                className="hidden"
                id="image-upload"
              />

              {previewUrl ? (
                <div className="relative group">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-buddy-gray-200">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={handleImageRemoved}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className="relative w-full h-48 border-2 border-dashed border-buddy-gray-300 rounded-lg flex flex-col items-center justify-center space-y-4 cursor-pointer transition-colors duration-200 hover:border-buddy-purple hover:bg-buddy-purple/5"
                  onClick={() =>
                    document.getElementById("image-upload")?.click()
                  }
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="p-3 rounded-full bg-buddy-purple/10">
                      <ImageIcon className="w-6 h-6 text-buddy-purple" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-buddy-gray-700">
                        Click to add an image
                      </p>
                      <p className="text-xs text-buddy-gray-500">
                        PNG, JPG, GIF, WebP up to 5MB
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("image-upload")?.click()}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                {previewUrl ? "Change Image" : "Add Image"}
              </Button>
            </div>
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
                {nextMilestone - completedCheckIns} more to go!
              </Badge>
            </div>
            <Progress
              value={
                nextMilestone > 0
                  ? (completedCheckIns / nextMilestone) * 100
                  : 0
              }
              className="h-2"
            />
            <p className="text-xs text-buddy-gray-600 mt-2">
              {completedCheckIns} of {nextMilestone} check-ins completed
            </p>
          </div>
        </div>

        {/* Fixed Footer */}
        <DialogFooter className="p-6 pt-0 bg-buddy-gray-50 flex-shrink-0">
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
                isSubmitting || !message.trim() // Only require text message
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
