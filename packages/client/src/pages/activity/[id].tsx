import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import ShareableActivityCard from "@/components/activities/ShareableActivityCard";
import Header from "@/components/common/Header";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useActivityStore } from "@/store/activity.store";
import { useAuth } from "@/store/auth.store";

const ActivityPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { currentActivity, fetchActivityById, isLoading } = useActivityStore();
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  // Check if user is coming from within the app or external link
  const isInternalNavigation =
    location.state?.fromApp || location.key !== "default";

  const handleBack = () => {
    navigate(-1);
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
        <ShareableActivityCard activity={currentActivity} />
      </div>
    </div>
  );
};

export default ActivityPage;
