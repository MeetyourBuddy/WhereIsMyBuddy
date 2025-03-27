import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { format, differenceInDays, addDays } from "date-fns";
import { Calendar, Clock, Users, Settings, MapPin, Tag, AlertTriangle, Shield, CheckCircle, Filter } from "lucide-react";
import ShareableActivityCard from "@/components/activities/ShareableActivityCard";
import Header from "@/components/common/Header";
import ActivityDashboard from "@/components/activities/ActivityDashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CheckInDialog from "@/components/activities/CheckInDialog";
import MembersTab from "@/components/activities/MembersTab";
import ActivityLeaderboard from "@/components/activities/ActivityLeaderboard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockActivities = {
  "1": {
    id: "1",
    title: "Morning Yoga Challenge",
    description: "30 minutes of yoga every morning for 30 days to improve flexibility, strength, and mental clarity. Join us to establish a consistent morning routine!",
    category: "Fitness",
    coverImage: "/lovable-uploads/cdc21302-a15c-49dd-8f19-9ac1c4936d4c.png",
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
      image: "/lovable-uploads/cdc21302-a15c-49dd-8f19-9ac1c4936d4c.png",
    },
    participants: [
      { id: "1", name: "Jordan Lee", image: "/lovable-uploads/cdc21302-a15c-49dd-8f19-9ac1c4936d4c.png" },
      { id: "2", name: "Taylor Swift" },
      { id: "3", name: "Alex Johnson" },
    ],
    maxParticipants: 20,
    progress: 64,
    tags: ["Fitness", "Morning Routine", "Wellness"],
    rules: [
      { id: "1", rule: "Check in daily with a photo of your yoga session", isDefault: true },
      { id: "2", rule: "Be respectful in all communications", isDefault: true },
      { id: "3", rule: "No spam or promotional content", isDefault: true },
      { id: "4", rule: "Share your progress at least once a week", isDefault: false }
    ]
  },
  "2": {
    id: "2",
    title: "Book Club: Fiction Favorites",
    description: "A monthly book club focusing on contemporary fiction. We meet virtually to discuss themes, characters, and our overall thoughts on each book.",
    category: "Reading",
    coverImage: "/placeholder.svg",
    location: "Virtual",
    date: "Last Saturday of each month",
    time: "5:00 PM - 6:30 PM",
    duration: "Ongoing",
    frequency: "Monthly",
    startDate: new Date("2023-09-30"),
    endDate: new Date("2024-09-30"),
    createdBy: {
      id: "2",
      name: "Taylor Swift",
    },
    participants: [
      { id: "2", name: "Taylor Swift" },
      { id: "4", name: "Jamie Williams" },
      { id: "5", name: "Morgan Chen" },
      { id: "6", name: "Sam Rodriguez" },
    ],
    maxParticipants: 15,
    progress: 42,
    tags: ["Reading", "Book Club", "Fiction", "Discussion"],
    rules: [
      { id: "1", rule: "Read the assigned book before the meeting", isDefault: false },
      { id: "2", rule: "Be respectful in all communications", isDefault: true },
      { id: "3", rule: "No spam or promotional content", isDefault: true }
    ]
  },
};

const getActivityStatus = (startDate: Date, endDate: Date) => {
  const now = new Date();
  const daysToStart = differenceInDays(startDate, now);
  const daysToEnd = differenceInDays(endDate, now);
  
  if (daysToStart > 0) return { status: "starting-soon", label: "Starting Soon", variant: "info" };
  if (daysToEnd >= 0 && daysToEnd <= 7) return { status: "ending-soon", label: "Ending Soon", variant: "warning" };
  if (daysToEnd < 0) return { status: "ended", label: "Ended", variant: "danger" };
  return { status: "ongoing", label: "Ongoing", variant: "success" };
};

const ActivityPage = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [timeFilter, setTimeFilter] = useState("all-time");
  
  const activity = mockActivities[id as keyof typeof mockActivities] || mockActivities["1"];
  
  const { status, label, variant } = getActivityStatus(activity.startDate, activity.endDate);
  
  const userRole = activity.createdBy.id === "1" ? "admin" : "member";

  const [checkInDialogOpen, setCheckInDialogOpen] = useState(false);

  const handleViewMembers = () => {
    setActiveTab("members");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-blue via-white to-pastel-green relative">
      <Header isLoggedIn={true} />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM0RjdDMkIiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0aDN2M2gtM3Ztf00zMCAzaDN2M2gtM3pNMTcgMTdoM3YzaC0zek0zNiAxN2gzdjNoLTN6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
      
      <div className="container max-w-4xl mx-auto py-8 px-4 relative">
        <div className="mb-6">
          <div className="relative mb-4">
            {activity.coverImage && (
              <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden relative">
                <img 
                  src={activity.coverImage}
                  alt={activity.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                <Badge 
                  className="absolute top-4 right-4 py-1 px-3" 
                  variant={variant as any}
                >
                  {label}
                </Badge>
                
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <h1 className="text-2xl md:text-3xl font-bold mb-1">{activity.title}</h1>
                  <p className="text-white/90 max-w-2xl text-sm md:text-base">
                    {activity.description}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
            <div className="flex items-center space-x-2 md:space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-buddy-gray-300">
                    <Filter className="mr-2 h-4 w-4" />
                    {timeFilter === "today" ? "Today" : 
                     timeFilter === "this-week" ? "This Week" : 
                     timeFilter === "this-month" ? "This Month" : "All Time"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setTimeFilter("today")}>Today</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTimeFilter("this-week")}>This Week</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTimeFilter("this-month")}>This Month</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTimeFilter("all-time")}>All Time</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="flex gap-2">
              <CheckInDialog onCheckInComplete={() => console.log("Check-in completed")}>
                <Button className="bg-gradient-to-r from-buddy-purple to-buddy-blue text-white">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Check In Now
                </Button>
              </CheckInDialog>
              
              {userRole === "admin" && (
                <Link to={`/activities/edit/${activity.id}`}>
                  <Button variant="outline" className="border-buddy-purple text-buddy-purple">
                    <Settings className="mr-2 h-4 w-4" />
                    Manage Activity
                  </Button>
                </Link>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 bg-white/90 backdrop-blur-sm">
              <div className="flex items-start space-x-3">
                <Users className="h-5 w-5 text-buddy-purple" />
                <div>
                  <h3 className="text-sm font-medium text-buddy-gray-700">Participants</h3>
                  <p className="text-buddy-gray-900 font-medium">{activity.participants.length}</p>
                  <p className="text-xs text-buddy-gray-500">of {activity.maxParticipants} max</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-white/90 backdrop-blur-sm">
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-buddy-blue" />
                <div>
                  <h3 className="text-sm font-medium text-buddy-gray-700">Dates</h3>
                  <p className="text-buddy-gray-900 font-medium">
                    {format(activity.startDate, "MMM d")} - {format(activity.endDate, "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-white/90 backdrop-blur-sm">
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-buddy-green" />
                <div>
                  <h3 className="text-sm font-medium text-buddy-gray-700">Time</h3>
                  <p className="text-buddy-gray-900 font-medium">{activity.time}</p>
                  <p className="text-xs text-buddy-gray-500">{activity.frequency}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-white/90 backdrop-blur-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-buddy-orange" />
                <div>
                  <h3 className="text-sm font-medium text-buddy-gray-700">Location</h3>
                  <p className="text-buddy-gray-900 font-medium">{activity.location}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white/80 backdrop-blur-sm mb-6 w-full justify-start">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="discussion">Discussion</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <ActivityDashboard activityId={activity.id} onViewAllMembers={handleViewMembers} />
          </TabsContent>
          
          <TabsContent value="members">
            <MembersTab 
              participants={activity.participants} 
              userRole={userRole} 
              activityId={activity.id}
            />
          </TabsContent>
          
          <TabsContent value="leaderboard">
            <ActivityLeaderboard 
              activityId={activity.id}
              userRole={userRole}
            />
          </TabsContent>
          
          <TabsContent value="gallery">
            <div className="bg-white rounded-lg p-6 text-center text-buddy-gray-500">
              Activity Gallery (Coming Soon)
            </div>
          </TabsContent>
          
          <TabsContent value="discussion">
            <div className="bg-white rounded-lg p-6 text-center text-buddy-gray-500">
              Activity Discussion Board (Coming Soon)
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6">
          <ShareableActivityCard {...activity} />
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
