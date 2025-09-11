import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import ShareableActivityCard from "@/components/activities/ShareableActivityCard";
import Header from "@/components/common/Header";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useActivityStore } from "@/store/activity.store";
import { useAuth } from "@/store/auth.store";
import { CheckInService } from "@/services/api/activity/reaction.service";
import { isActivityParticipant } from "@/types/activity-types";

const ActivityPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { currentActivity, fetchActivityById, isLoading } = useActivityStore();
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  // Progress tracking state
  const [userProgress, setUserProgress] = useState<{
    progress: number;
    completedCheckIns: number;
    totalAvailableCheckIns: number;
    currentStreak?: number;
    lastCheckInDate?: string;
  } | null>(null);
  const [isLoadingProgress, setIsLoadingProgress] = useState(false);

  // Direct admin comparison check - use both _id and id fields
  const userId = user?._id || user?.id;
  const adminId = currentActivity?.admin?._id || currentActivity?.admin?.id;
  const isUserAdmin = user && currentActivity?.admin && userId === adminId;

  // Check if user is a participant
  const isParticipant =
    currentActivity && userId
      ? isActivityParticipant(currentActivity, userId)
      : false;

  // Check if user is coming from within the app or external link
  const isInternalNavigation =
    location.state?.fromApp || location.key !== "default";

  const handleBack = () => {
    navigate(-1);
  };

  // Function to fetch user progress
  const fetchUserProgress = async () => {
    if (!id || !user?._id || !isParticipant) {
      return;
    }

    setIsLoadingProgress(true);
    try {
      const response = await CheckInService.getUserProgress(id);
      setUserProgress(response.data);
    } catch (error) {
      console.error("Failed to fetch user progress:", error);
    } finally {
      setIsLoadingProgress(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchActivityById(id).finally(() => {
        setIsLoadingPage(false);
      });
    } else {
      setIsLoadingPage(false);
    }
  }, [id, fetchActivityById]);

  // Fetch user progress when activity is loaded and user is a participant
  useEffect(() => {
    if (currentActivity && user && isParticipant) {
      fetchUserProgress();
    }
  }, [currentActivity, user, isParticipant]);

  if (isLoadingPage || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pastel-gray via-white to-pastel-blue relative flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-buddy-purple mx-auto mb-4"></div>
          <p className="text-buddy-gray-600">Loading activity...</p>
        </div>
      </div>
    );
  }

  if (!currentActivity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pastel-gray via-white to-pastel-blue relative flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-buddy-gray-800 mb-4">
            Activity Not Found
          </h1>
          <p className="text-buddy-gray-600 mb-6">
            The activity you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/activities")} variant="outline">
            Browse Activities
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-gray via-white to-pastel-blue relative">
      {currentActivity.bannerImage && (
        <div
          className="absolute inset-0 opacity-50 bg-cover bg-center"
          style={{ backgroundImage: `url(${currentActivity.bannerImage})` }}
        ></div>
      )}
      <Header isLoggedIn={!!user} />
      <div className="container max-w-4xl mx-auto py-8 px-4 relative">
        {isInternalNavigation && (
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 text-buddy-gray-600 hover:text-buddy-gray-900"
            onClick={handleBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}
        <ShareableActivityCard
          activity={currentActivity}
          showProgress={isParticipant}
          userProgress={userProgress || undefined}
        />
      </div>
    </div>
  );
};

export default ActivityPage;
