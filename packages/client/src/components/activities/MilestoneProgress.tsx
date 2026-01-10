import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  MilestoneService,
  MilestoneProgress,
} from "@/services/api/milestone.service";
import { NotificationService } from "@/services/api/notification.service";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Target, Zap, Star, Crown, Gem } from "lucide-react";

interface MilestoneProgressProps {
  activityId?: string;
  userId?: string;
}

const MilestoneProgress: React.FC<MilestoneProgressProps> = ({
  activityId,
  userId,
}) => {
  const [milestoneProgress, setMilestoneProgress] = useState<
    MilestoneProgress[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMilestones, setNewMilestones] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchMilestoneProgress();
  }, [activityId]);

  const fetchMilestoneProgress = async () => {
    try {
      setIsLoading(true);
      const response =
        await MilestoneService.getUserMilestoneProgress(activityId);
      if (response.data?.progress) {
        setMilestoneProgress(response.data.progress);
      }
    } catch (error) {
      console.error("Failed to fetch milestone progress:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkForNewMilestones = async () => {
    try {
      const response =
        await MilestoneService.checkAndAwardMilestones(activityId);
      if (
        response.data?.newMilestones &&
        response.data.newMilestones.length > 0
      ) {
        setNewMilestones(response.data.newMilestones);
        // Show celebration toast for each new milestone
        response.data.newMilestones.forEach((milestone: any) => {
          toast({
            title: "🎉 Milestone Achieved!",
            description:
              milestone.milestone.celebrationMessage ||
              `Congratulations! You've achieved ${milestone.milestone.name}!`,
            duration: 5000,
          });
        });
        // Refresh progress
        fetchMilestoneProgress();
      }

      // Also check for progress notifications
      const notificationResponse =
        await NotificationService.checkProgressNotifications(activityId);
      if (
        notificationResponse.data?.notifications &&
        notificationResponse.data.notifications.length > 0
      ) {
        notificationResponse.data.notifications.forEach((notification) => {
          toast({
            title: notification.title,
            description: notification.message,
            duration: notification.priority === "high" ? 8000 : 5000,
            variant: notification.priority === "high" ? "default" : "default",
          });
        });
      }
    } catch (error) {
      console.error("Failed to check for new milestones:", error);
    }
  };

  const claimMilestone = async (milestoneId: string) => {
    try {
      await MilestoneService.claimMilestone(milestoneId);
      toast({
        title: "Milestone Claimed!",
        description: "You've successfully claimed your reward!",
      });
      fetchMilestoneProgress();
    } catch (error) {
      console.error("Failed to claim milestone:", error);
      toast({
        title: "Error",
        description: "Failed to claim milestone. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "bronze":
        return <Trophy className="h-4 w-4 text-amber-600" />;
      case "silver":
        return <Target className="h-4 w-4 text-gray-400" />;
      case "gold":
        return <Zap className="h-4 w-4 text-yellow-500" />;
      case "platinum":
        return <Star className="h-4 w-4 text-blue-400" />;
      case "diamond":
        return <Gem className="h-4 w-4 text-purple-500" />;
      default:
        return <Trophy className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "bronze":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "silver":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "gold":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "platinum":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "diamond":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "streak":
        return "🔥";
      case "checkins":
        return "✅";
      case "completion":
        return "📊";
      case "time_based":
        return "⏰";
      default:
        return "🎯";
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-buddy-gray-800 flex items-center">
          <Crown className="h-5 w-5 mr-2 text-buddy-purple" />
          Milestones & Achievements
        </h3>
        <Button
          onClick={checkForNewMilestones}
          variant="outline"
          size="sm"
          className="rounded-full"
        >
          Check Progress
        </Button>
      </div>

      <div className="space-y-4">
        {milestoneProgress.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 text-buddy-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-buddy-gray-600 mb-2">
              No Milestones Yet
            </h4>
            <p className="text-buddy-gray-500">
              Start checking in to unlock your first milestone!
            </p>
          </div>
        ) : (
          milestoneProgress.map((item) => (
            <div
              key={item.milestone._id}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                item.isAchieved
                  ? "border-buddy-green bg-buddy-green/5"
                  : "border-buddy-gray-200 bg-white"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {getTypeIcon(item.milestone.type)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-buddy-gray-800 flex items-center">
                      {item.milestone.name}
                      {getTierIcon(item.milestone.tier)}
                    </h4>
                    <p className="text-sm text-buddy-gray-600">
                      {item.milestone.description}
                    </p>
                  </div>
                </div>
                <Badge
                  className={`${getTierColor(item.milestone.tier)} text-xs font-medium`}
                >
                  {item.milestone.tier.toUpperCase()}
                </Badge>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-sm text-buddy-gray-600 mb-1">
                  <span>Progress</span>
                  <span>
                    {item.currentValue} / {item.milestone.targetValue}
                  </span>
                </div>
                <Progress value={item.progress} className="h-2" />
                <div className="text-right text-xs text-buddy-gray-500 mt-1">
                  {item.progress}%
                </div>
              </div>

              {item.isAchieved && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="text-buddy-green">🎉</div>
                    <span className="text-sm font-medium text-buddy-green">
                      Achieved on{" "}
                      {new Date(item.achievedAt!).toLocaleDateString()}
                    </span>
                  </div>
                  {!item.isClaimed && (
                    <Button
                      onClick={() => claimMilestone(item.milestone._id)}
                      size="sm"
                      className="rounded-full bg-buddy-purple hover:bg-buddy-purple/90"
                    >
                      Claim Reward
                    </Button>
                  )}
                  {item.isClaimed && (
                    <Badge
                      variant="outline"
                      className="text-buddy-green border-buddy-green"
                    >
                      Claimed
                    </Badge>
                  )}
                </div>
              )}

              {!item.isAchieved && item.progress > 0 && (
                <div className="text-sm text-buddy-gray-500">
                  {item.milestone.unlockMessage ||
                    `Keep going! You're ${item.milestone.targetValue - item.currentValue} away from this milestone.`}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default MilestoneProgress;
