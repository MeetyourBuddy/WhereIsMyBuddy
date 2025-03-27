import React from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import ShareableActivityCard from "@/components/activities/ShareableActivityCard";
import Header from "@/components/common/Header";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockActivities = {
  "1": {
    id: "1",
    title: "Morning Yoga Challenge",
    description:
      "30 minutes of yoga every morning for 30 days to improve flexibility, strength, and mental clarity. Join us to establish a consistent morning routine!",
    category: "Fitness",
    coverImage:
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=2940",
    location: "Central Park, NY",
    date: "Daily, Oct 1-30, 2023",
    time: "6:00 AM - 6:30 AM",
    duration: "30 days",
    frequency: "Daily",
    startDate: new Date("2023-10-01"),
    endDate: new Date("2023-10-30"),
    createdBy: {
      id: "1",
      name: "Jordan Lee",
      image:
        "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    participants: [
      {
        id: "1",
        name: "Jordan Lee",
        image:
          "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      { id: "2", name: "Taylor Swift" },
      { id: "3", name: "Alex Johnson" },
    ],
    maxParticipants: 20,
    image:
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=2940",
    progress: 64,
    tags: ["Fitness", "Morning Routine", "Wellness"],
    rules: [
      {
        id: "1",
        rule: "Check in daily with a photo of your yoga session",
        isDefault: true,
      },
      { id: "2", rule: "Be respectful in all communications", isDefault: true },
      { id: "3", rule: "No spam or promotional content", isDefault: true },
      {
        id: "4",
        rule: "Share your progress at least once a week",
        isDefault: false,
      },
    ],
  },
};

const ActivityPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is coming from within the app or external link
  const isInternalNavigation =
    location.state?.fromApp || location.key !== "default";

  const handleBack = () => {
    navigate(-1);
  };

  const activity =
    mockActivities[id as keyof typeof mockActivities] || mockActivities["1"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-gray via-white to-pastel-blue relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=2940')] opacity-50"></div>
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
        <ShareableActivityCard {...activity} />
      </div>
    </div>
  );
};

export default ActivityPage;
