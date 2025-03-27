
import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ProfileCard from "@/components/profile/ProfileCard";
import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Mock data - in a real app, this would come from an API
const mockProfiles = {
  "1": {
    id: "1",
    name: "Jordan Lee",
    username: "jordanlee",
    bio: "Fitness enthusiast and coding mentor. Love hiking on weekends and teaching programming during weekdays.",
    image: "/lovable-uploads/cdc21302-a15c-49dd-8f19-9ac1c4936d4c.png",
    location: "San Francisco, CA",
    interests: ["Fitness", "Coding", "Hiking", "Teaching", "Photography"],
    joinedDate: "January 2023",
    activityCount: 24,
    buddyCount: 56,
    achievements: [
      { title: "30-Day Streak" },
      { title: "Activity Creator" },
      { title: "Super Connector" },
    ],
  },
  "2": {
    id: "2",
    name: "Taylor Swift",
    username: "taylorswift",
    bio: "Music lover, songwriter, and book club enthusiast. Looking to connect with creative minds!",
    location: "Nashville, TN",
    interests: ["Music", "Reading", "Writing", "Poetry", "Baking"],
    joinedDate: "March 2023",
    activityCount: 16,
    buddyCount: 89,
    achievements: [
      { title: "Top Contributor" },
      { title: "Community Favorite" },
    ],
  },
};

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if user is coming from within the app or external link
  const isInternalNavigation = location.state?.fromApp || location.key !== 'default';
  
  // In a real app, you would fetch profile data based on the ID
  const profile = mockProfiles[id as keyof typeof mockProfiles] || mockProfiles["1"];

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-purple via-white to-pastel-blue relative">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5MzUxRTkiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0aDN2M2gtM3Ztf00zMCAzaDN2M2gtM3pNMTcgMTdoM3YzaC0zek0zNiAxN2gzdjNoLTN6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
      <Header isLoggedIn={true} />
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
        <ProfileCard {...profile} showJoinButton={true} />
      </div>
    </div>
  );
};

export default ProfilePage;
