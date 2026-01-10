import { useCallback } from "react";
import { NotificationService } from "@/services/api/notification.service";
import { useToast } from "@/hooks/use-toast";

interface ProgressData {
  progress: number;
  completedCheckIns: number;
  totalAvailableCheckIns: number;
  currentStreak?: number;
  lastCheckInDate?: string;
}

interface StreakData {
  currentStreak: number;
  progress: number;
  completedCheckIns: number;
}

export const useProgressNotifications = () => {
  const { toast } = useToast();

  const createProgressNotification = useCallback(
    async (
      activityId: string,
      progressData: ProgressData,
      previousProgress?: number
    ) => {
      try {
        // Only create notifications for significant progress milestones
        const progressMilestones = [25, 50, 75, 100];
        const shouldNotify =
          progressMilestones.includes(progressData.progress) &&
          (!previousProgress || progressData.progress > previousProgress);

        if (shouldNotify) {
          await NotificationService.createProgressNotification(
            activityId,
            progressData
          );

          // Show a toast notification as well
          toast({
            title: "Progress Update! 🎉",
            description: `You've reached ${progressData.progress}% completion!`,
          });
        }
      } catch (error) {
        console.error("Failed to create progress notification:", error);
      }
    },
    [toast]
  );

  const createStreakNotification = useCallback(
    async (
      activityId: string,
      streakData: StreakData,
      previousStreak?: number
    ) => {
      try {
        // Only create notifications for streak milestones
        const streakMilestones = [3, 7, 14, 30, 50, 100];
        const shouldNotify =
          streakMilestones.includes(streakData.currentStreak) &&
          (!previousStreak || streakData.currentStreak > previousStreak);

        if (shouldNotify) {
          await NotificationService.createStreakNotification(
            activityId,
            streakData
          );

          // Show a toast notification as well
          toast({
            title: "Streak Milestone! 🔥",
            description: `You've reached a ${streakData.currentStreak}-day streak!`,
          });
        }
      } catch (error) {
        console.error("Failed to create streak notification:", error);
      }
    },
    [toast]
  );

  return {
    createProgressNotification,
    createStreakNotification,
  };
};
