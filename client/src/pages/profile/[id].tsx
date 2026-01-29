import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ProfileCard from "@/components/profile/ProfileCard";
import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { userService } from "@/services/api/user/user-service";
import { User } from "@/types/auth-types";
import { useScrollToTopImmediate } from "@/hooks/use-scroll-to-top";

const ProfilePage = () => {
  useScrollToTopImmediate();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user: currentUser } = useAuthStore();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is coming from within the app or external link
  const isInternalNavigation =
    location.state?.fromApp || location.key !== "default";

  // Fetch user data when component mounts or ID changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) {
        setError("No user ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Check if we have user data passed from navigation state
        if (location.state?.userData) {
          console.log(
            "Using user data from navigation state:",
            location.state.userData
          );
          setProfileUser(location.state.userData);
          setIsLoading(false);
          return;
        }

        // Fetch user data from API
        console.log("Fetching user data for ID:", id);
        const response = await userService.getUserById(id);
        console.log("User data response:", response);
        setProfileUser(response.data);
      } catch (error: any) {
        console.error("Error fetching user data:", error);
        setError(
          error.response?.data?.message || "Failed to load user profile"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [id, location.state]);

  // Convert user data to profile format
  const profile = profileUser
    ? {
        id: profileUser._id,
        name: profileUser.name,
        username: profileUser.email,
        bio: profileUser.bio || "No bio available",
        image:
          profileUser.picture || profileUser.avatar || profileUser.profileImage,
        location:
          profileUser.city && profileUser.country
            ? `${profileUser.city}, ${profileUser.country}`
            : profileUser.city || "Location not specified",
        interests: profileUser.interestsCommodities || [],
        joinedDate: profileUser.createdAt || new Date().toISOString(),
        activityCount: 0, // TODO: Get from user stats
        buddyCount: 0, // TODO: Get from user stats
        achievements: [
          { title: "Profile Complete" },
          { title: "Active Member" },
        ],
      }
    : null;

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pastel-purple via-white to-pastel-blue relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5MzUxRTkiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0aDN2M2gtM3Ztf00zMCAzaDN2M2gtM3pNMTcgMTdoM3YzaC0zek0zNiAxN2gzdjNoLTN6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
        <Header isLoggedIn={true} />
        <div className="container max-w-4xl mx-auto py-8 px-4 relative">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-buddy-purple border-t-transparent" />
              <p className="text-buddy-gray-600">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pastel-purple via-white to-pastel-blue relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5MzUxRTkiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0aDN2M2gtM3Ztf00zMCAzaDN2M2gtM3pNMTcgMTdoM3YzaC0zek0zNiAxN2gzdjNoLTN6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
        <Header isLoggedIn={true} />
        <div className="container max-w-4xl mx-auto py-8 px-4 relative">
          {isInternalNavigation && (
            <Button
              variant="ghost"
              size="sm"
              className="mb-4 text-buddy-gray-500 hover:text-white rounded-full"
              onClick={handleBack}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={handleBack} className="rounded-full">
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pastel-purple via-white to-pastel-blue relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5MzUxRTkiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0aDN2M2gtM3Ztf00zMCAzaDN2M2gtM3pNMTcgMTdoM3YzaC0zek0zNiAxN2gzdjNoLTN6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
        <Header isLoggedIn={true} />
        <div className="container max-w-4xl mx-auto py-8 px-4 relative">
          {isInternalNavigation && (
            <Button
              variant="ghost"
              size="sm"
              className="mb-4 text-buddy-gray-500 hover:text-white rounded-full"
              onClick={handleBack}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-buddy-gray-600 mb-4">Profile not found</p>
              <Button onClick={handleBack} className="rounded-full">
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-purple via-white to-pastel-blue relative">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5MzUxRTkiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0aDN2M2gtM3Ztf00zMCAzaDN2M2gtM3pNMTcgMTdoM3YzaC0zek0zNiAxN2gzdjNoLTN6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
      <Header isLoggedIn={true} />
      <div className="container max-w-4xl mx-auto py-8 px-4 relative">
        {isInternalNavigation && (
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 text-buddy-gray-500 hover:text-white rounded-full"
            onClick={handleBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}
        <ProfileCard
          {...profile}
          showJoinButton={true}
          isOwnProfile={
            id === currentUser?._id || id === (currentUser as any)?.id
          }
        />
      </div>
    </div>
  );
};

export default ProfilePage;
