import { useNavigate } from "react-router-dom";
import {
  Compass,
  Lightbulb,
  Calendar,
  Bell,
  Users,
  UserPlus,
  Star,
  ArrowRight,
  TrendingUp,
  Plus,
  Activity,
  Heart,
  Sparkles,
  Target,
  Clock,
  MapPin,
  CheckCircle,
  Gift,
  Zap,
  Trophy,
  MessageCircle,
  Share2,
} from "lucide-react";

import Container from "@/components/ui/layout/Container";
import { Card } from "@/components/common/Card";
import Button from "@/components/common/Button";
import { Separator } from "@/components/ui/separator";
import Avatar from "@/components/common/Avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/store/auth.store";

const Dashboard = () => {
  const navigate = useNavigate();

  const { user } = useAuth();

  const suggestedActivities = [
    {
      title: "Morning Jog",
      description: "Join fellow runners for a 5km morning jog in Central Park",
      time: "Tomorrow, 7:00 AM",
      location: "Central Park, NY",
      category: "Fitness",
      participants: 5,
      image:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8eW9nYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Book Club",
      description: "Discussion about 'Atomic Habits' by James Clear",
      time: "Saturday, 2:00 PM",
      location: "Main Street Library",
      category: "Reading",
      participants: 8,
      image:
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Coding Workshop",
      description: "Learn the basics of React development",
      time: "Sunday, 10:00 AM",
      location: "Tech Hub Coworking",
      category: "Coding",
      participants: 12,
      image:
        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
  ];

  const suggestedBuddies = [
    {
      name: "Jane Cooper",
      interests: ["Running", "Yoga", "Reading"],
      matchPercentage: 85,
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      name: "Alex Morgan",
      interests: ["Coding", "Photography", "Hiking"],
      matchPercentage: 78,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      name: "Michael Carter",
      interests: ["Tennis", "Cooking", "Meditation"],
      matchPercentage: 72,
      avatar:
        "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  ];

  const activeActivities = [
    {
      id: "act-1",
      title: "Morning Yoga Challenge",
      category: "Fitness",
      progress: 65,
      nextSession: "Tomorrow, 7:00 AM",
      participants: 12,
    },
    {
      id: "act-2",
      title: "Book Club: 'Atomic Habits'",
      category: "Reading",
      progress: 40,
      nextSession: "Saturday, 2:00 PM",
      participants: 8,
    },
  ];

  const connectedBuddies = [
    {
      id: "bud-1",
      name: "Sarah Johnson",
      status: "online",
      lastActive: "Just now",
      avatar: "/avatars/3d-avatar-1.png",
      sharedActivities: 3,
    },
    {
      id: "bud-2",
      name: "Mike Dawson",
      status: "offline",
      lastActive: "2h ago",
      avatar: "/avatars/3d-avatar-2.png",
      sharedActivities: 1,
    },
    {
      id: "bud-3",
      name: "Elena Rivera",
      status: "online",
      lastActive: "Just now",
      avatar: "/avatars/3d-avatar-3.png",
      sharedActivities: 2,
    },
  ];

  return (
    <div className="py-8 min-h-screen bg-gradient-to-br from-pastel-purple/30 via-white to-pastel-blue/40">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5MzUxRTkiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTIwIDUwaDN2M2gtM3Ztf00zMCAyMGgzdjNoLTN6TTE3IDQwaDN2M2gtM3pNNDYgNDBoM3YzaC0zeiIvPjwvZz48L2c+PC9zdmc+')] opacity-75 pointer-events-none"></div>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section
              className="animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-buddy-purple to-buddy-blue bg-clip-text text-transparent mb-1">
                      Hey there, {user?.name || "friend"}!
                    </h2>
                    <h2 className="text-3xl">👋</h2>
                  </div>
                  <p className="text-buddy-gray-600 text-sm">
                    Ready to make today amazing? Let's find your perfect
                    activity buddy!
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-buddy-gray-500 text-sm bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-white">
                    <Bell className="h-4 w-4 text-buddy-purple" />
                    <span>3 new</span>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-buddy-purple/20 to-buddy-blue/20 rounded-full flex items-center justify-center">
                    <Heart className="h-5 w-5 text-buddy-purple" />
                  </div>
                </div>
              </div>

              {/* Quick Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="p-4 bg-gradient-to-br from-buddy-green/10 to-buddy-green/5 border border-buddy-green/20 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-buddy-green/20 rounded-full flex items-center justify-center">
                      <Target className="h-5 w-5 text-buddy-green" />
                    </div>
                    <div>
                      <p className="text-sm text-buddy-gray-600">
                        Active Goals
                      </p>
                      <p className="text-xl font-bold text-buddy-green">3</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-buddy-blue/10 to-buddy-blue/5 border border-buddy-blue/20 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-buddy-blue/20 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-buddy-blue" />
                    </div>
                    <div>
                      <p className="text-sm text-buddy-gray-600">Buddies</p>
                      <p className="text-xl font-bold text-buddy-blue">12</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-buddy-purple/10 to-buddy-purple/5 border border-buddy-purple/20 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-buddy-purple/20 rounded-full flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-buddy-purple" />
                    </div>
                    <div>
                      <p className="text-sm text-buddy-gray-600">Streak</p>
                      <p className="text-xl font-bold text-buddy-purple">
                        7 days
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Profile Completion Card */}
              <Card className="p-6 animate-fade-in hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-pastel-purple/20 border border-white shadow-xl rounded-3xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-buddy-purple/5 rounded-full -translate-y-1/3 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-buddy-blue/5 rounded-full translate-y-1/3 -translate-x-1/3"></div>
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-buddy-purple/20 to-buddy-purple/10 rounded-full flex items-center justify-center shadow-lg">
                        <Sparkles className="h-8 w-8 text-buddy-purple" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                        Complete Your Profile
                        <Badge className="bg-buddy-green/10 text-buddy-green border-buddy-green/20">
                          +25% matches
                        </Badge>
                      </h3>
                      <p className="text-buddy-gray-500 mb-4">
                        Your profile is 65% complete. Add more information to
                        increase your chances of finding the perfect buddy!
                      </p>
                      <div className="w-full bg-buddy-gray-200/50 rounded-full h-2.5 mb-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-buddy-purple to-buddy-blue h-2.5 rounded-full transition-all duration-500"
                          style={{ width: "65%" }}
                        ></div>
                      </div>
                      <Button
                        variant="primary"
                        size="small"
                        className="button-shine rounded-full px-6"
                        onClick={() => navigate("/settings")}
                      >
                        Complete Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            <section
              className="animate-fade-in"
              style={{ animationDelay: "0.15s" }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold flex items-center mb-1">
                    <Activity className="mr-2 h-5 w-5 text-buddy-green" />
                    <span className="bg-gradient-to-r from-buddy-green-dark to-buddy-green bg-clip-text text-transparent">
                      Your Active Activities
                    </span>
                  </h2>
                  <p className="text-sm text-buddy-gray-600">
                    Keep the momentum going! 🚀
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => navigate("/activities")}
                  className="hover:bg-buddy-green/5 text-buddy-green rounded-full"
                >
                  View All
                </Button>
              </div>

              {activeActivities.length > 0 ? (
                <div className="grid gap-4">
                  {activeActivities.map((activity) => (
                    <Card
                      key={activity.id}
                      className="p-5 hover-card rounded-2xl bg-white/90 backdrop-blur-sm border border-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
                      onClick={() => navigate(`/activities/${activity.id}`)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">
                              {activity.title}
                            </h3>
                            <Badge className="bg-buddy-green/10 text-buddy-green border-buddy-green/20 text-xs">
                              <Zap className="w-3 h-3 mr-1" />
                              Active
                            </Badge>
                          </div>
                          <span className="text-xs bg-buddy-gray-100/70 px-3 py-1 rounded-full inline-flex items-center shadow-sm mb-3">
                            {activity.category}
                          </span>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs text-buddy-gray-600">
                            <span className="flex items-center bg-buddy-gray-50 px-2 py-1 rounded-full">
                              <Clock className="h-3 w-3 mr-1 text-buddy-gray-400" />
                              {activity.nextSession}
                            </span>
                            <span className="flex items-center bg-buddy-gray-50 px-2 py-1 rounded-full">
                              <Users className="h-3 w-3 mr-1 text-buddy-gray-400" />
                              {activity.participants} buddies
                            </span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-4 flex flex-col items-end">
                          <div className="text-sm font-medium text-buddy-green mb-1">
                            {activity.progress}% complete
                          </div>
                          <div className="w-20 bg-buddy-gray-200/50 rounded-full h-2 mb-2">
                            <div
                              className="bg-gradient-to-r from-buddy-green to-buddy-blue h-2 rounded-full transition-all duration-500"
                              style={{ width: `${activity.progress}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-buddy-gray-500 group-hover:text-buddy-green transition-colors">
                            Keep going! →
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center rounded-2xl bg-white/90 backdrop-blur-sm border border-white shadow-md">
                  <div className="w-16 h-16 bg-buddy-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="h-8 w-8 text-buddy-green" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Ready to get started?
                  </h3>
                  <p className="text-buddy-gray-500 mb-6">
                    Join an activity or create your own to begin your journey!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={() => navigate("/activities")}
                      className="bg-gradient-to-r from-buddy-green to-buddy-blue text-white rounded-full px-6 shadow-md hover:shadow-lg"
                      size="small"
                    >
                      <Compass className="w-4 h-4 mr-2" />
                      Explore Activities
                    </Button>
                    <Button
                      onClick={() => navigate("/activities/create")}
                      variant="outline"
                      className="border-buddy-green/20 text-buddy-green hover:bg-buddy-green/5 rounded-full px-6"
                      size="small"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Activity
                    </Button>
                  </div>
                </Card>
              )}
            </section>

            <section
              className="animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold flex items-center mb-1">
                    <Compass className="mr-2 h-5 w-5 text-buddy-blue" />
                    <span className="bg-gradient-to-r from-buddy-blue-dark to-buddy-blue bg-clip-text text-transparent">
                      Discover Amazing Activities
                    </span>
                  </h2>
                  <p className="text-sm text-buddy-gray-600">
                    Handpicked just for you! ✨
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => navigate("/activities")}
                    className="rounded-full border-buddy-gray-200 px-4 hover:bg-buddy-blue/5"
                  >
                    View All
                  </Button>
                  <Button
                    size="small"
                    onClick={() => navigate("/activities/create")}
                    className="rounded-full bg-gradient-to-r from-buddy-purple to-buddy-blue text-white shadow-md hover:shadow-lg"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Create
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                {suggestedActivities.map((activity, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden hover-card rounded-3xl bg-white/90 backdrop-blur-sm border border-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative group cursor-pointer"
                    onClick={() => navigate("/activities")}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-buddy-purple/5 to-buddy-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex flex-col md:flex-row">
                      <div className="md:w-1/3 relative overflow-hidden h-48 md:h-auto">
                        <div className="absolute inset-0 bg-gradient-to-br from-buddy-purple/30 to-buddy-blue/30 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <img
                          src={activity.image}
                          alt={activity.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r"></div>
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-white/90 text-buddy-purple border-0 shadow-sm">
                            <Star className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        </div>
                        <div className="absolute bottom-3 left-3 md:hidden">
                          <span className="bg-white/80 backdrop-blur-sm text-buddy-purple px-2 py-0.5 rounded-full text-xs font-medium shadow-sm">
                            {activity.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex-grow p-5">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">
                                {activity.title}
                              </h3>
                              <span className="hidden md:inline-block bg-buddy-purple/10 text-buddy-purple px-2 py-0.5 rounded-full text-xs font-medium">
                                {activity.category}
                              </span>
                            </div>
                            <p className="text-sm text-buddy-gray-500 mb-4">
                              {activity.description}
                            </p>
                            <div className="flex flex-wrap items-center text-xs text-buddy-gray-500 gap-2">
                              <span className="bg-buddy-gray-100/70 px-3 py-1 rounded-full flex items-center shadow-sm">
                                <Clock className="h-3 w-3 mr-1 text-buddy-gray-400" />
                                {activity.time}
                              </span>
                              <span className="bg-buddy-gray-100/70 px-3 py-1 rounded-full flex items-center shadow-sm">
                                <MapPin className="h-3 w-3 mr-1 text-buddy-gray-400" />
                                {activity.location}
                              </span>
                              <span className="bg-buddy-gray-100/70 px-3 py-1 rounded-full flex items-center shadow-sm">
                                <Users className="h-3 w-3 mr-1 text-buddy-gray-400" />
                                {activity.participants} buddies
                              </span>
                            </div>
                          </div>
                          <div className="flex-shrink-0 mt-3 md:mt-0">
                            <Button className="rounded-full bg-gradient-to-r from-buddy-purple to-buddy-blue text-white px-6 hover:shadow-lg shadow-md group-hover:scale-105 transition-transform">
                              <Heart className="w-4 h-4 mr-2" />
                              Join Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section
              className="animate-fade-in"
              style={{ animationDelay: "0.25s" }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold flex items-center mb-1">
                    <Users className="mr-2 h-5 w-5 text-buddy-purple" />
                    <span className="bg-gradient-to-r from-buddy-purple-dark to-buddy-purple bg-clip-text text-transparent">
                      Your Buddy Squad
                    </span>
                  </h2>
                  <p className="text-sm text-buddy-gray-600">
                    Your amazing support team! 💪
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => navigate("/buddies")}
                  className="hover:bg-buddy-purple/5 text-buddy-purple rounded-full"
                >
                  View All
                </Button>
              </div>

              {connectedBuddies.length > 0 ? (
                <div className="space-y-2">
                  {connectedBuddies.map((buddy) => (
                    <Card
                      key={buddy.id}
                      className="p-3 hover-card rounded-xl bg-white/90 backdrop-blur-sm border border-buddy-purple/20 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer group"
                      onClick={() => navigate(`/buddies/${buddy.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          <Avatar
                            src={buddy.avatar}
                            alt={buddy.name}
                            size="sm"
                            className="border-2 border-buddy-purple/20 rounded-full"
                          />
                          <div
                            className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${buddy.status === "online" ? "bg-buddy-green" : "bg-buddy-gray-400"}`}
                          ></div>
                        </div>
                        <div className="flex-grow min-w-0">
                          <h3 className="font-medium text-buddy-gray-900 text-sm truncate">
                            {buddy.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-buddy-gray-500 truncate">
                              {buddy.status === "online"
                                ? "Online"
                                : buddy.lastActive}
                            </span>
                            <span className="text-xs bg-buddy-purple/10 text-buddy-purple px-1.5 py-0.5 rounded-full">
                              {buddy.sharedActivities}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="small"
                          className="text-buddy-purple hover:bg-buddy-purple/5 p-1.5 h-auto opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle message action
                          }}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-4 text-center rounded-xl bg-white/90 backdrop-blur-sm border border-buddy-purple/20 shadow-sm">
                  <div className="w-10 h-10 bg-buddy-purple/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-5 w-5 text-buddy-purple" />
                  </div>
                  <h3 className="text-base font-semibold mb-1">
                    Find Your Squad!
                  </h3>
                  <p className="text-buddy-gray-500 mb-3 text-xs">
                    Connect with amazing people who share your interests
                  </p>
                  <Button
                    onClick={() => navigate("/buddies")}
                    className="bg-gradient-to-r from-buddy-purple to-buddy-blue text-white rounded-full px-4 shadow-sm hover:shadow-md"
                    size="small"
                  >
                    <UserPlus className="w-3 h-3 mr-1" />
                    Find Buddies
                  </Button>
                </Card>
              )}
            </section>

            <section
              className="animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold flex items-center mb-1">
                    <UserPlus className="mr-2 h-5 w-5 text-buddy-blue" />
                    <span className="bg-gradient-to-r from-buddy-blue-dark to-buddy-blue bg-clip-text text-transparent">
                      Perfect Matches
                    </span>
                  </h2>
                  <p className="text-sm text-buddy-gray-600">
                    People you'll love connecting with! 💫
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => navigate("/buddies")}
                  className="hover:bg-buddy-blue/5 text-buddy-blue rounded-full"
                >
                  Find More
                </Button>
              </div>

              {suggestedBuddies.length > 0 ? (
                <div className="space-y-2">
                  {suggestedBuddies.map((buddy, index) => (
                    <Card
                      key={index}
                      className="p-3 hover-card rounded-xl bg-white/90 backdrop-blur-sm border border-buddy-blue/20 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer group"
                      onClick={() =>
                        navigate(
                          `/buddies/${buddy.name.toLowerCase().replace(" ", "-")}`
                        )
                      }
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          <Avatar
                            src={buddy.avatar}
                            alt={buddy.name}
                            size="sm"
                            className="border-2 border-buddy-blue/20 rounded-full"
                          />
                          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-buddy-green rounded-full flex items-center justify-center">
                            <CheckCircle className="w-1.5 h-1.5 text-white" />
                          </div>
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-buddy-gray-900 text-sm truncate">
                              {buddy.name}
                            </h3>
                            <span className="text-xs bg-buddy-green/10 text-buddy-green px-1.5 py-0.5 rounded-full font-medium">
                              {buddy.matchPercentage}%
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {buddy.interests
                              .slice(0, 2)
                              .map((interest, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-buddy-blue/10 text-buddy-blue px-1.5 py-0.5 rounded-full"
                                >
                                  {interest}
                                </span>
                              ))}
                            {buddy.interests.length > 2 && (
                              <span className="text-xs text-buddy-gray-500">
                                +{buddy.interests.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="small"
                          className="text-buddy-blue hover:bg-buddy-blue/5 p-1.5 h-auto opacity-0 group-hover:opacity-100 transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle connect action
                          }}
                        >
                          <Heart className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-4 text-center rounded-xl bg-white/90 backdrop-blur-sm border border-buddy-blue/20 shadow-sm">
                  <div className="w-10 h-10 bg-buddy-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <UserPlus className="h-5 w-5 text-buddy-blue" />
                  </div>
                  <h3 className="text-base font-semibold mb-1">
                    Find Your People!
                  </h3>
                  <p className="text-buddy-gray-500 mb-3 text-xs">
                    Discover amazing people who share your passions
                  </p>
                  <Button
                    onClick={() => navigate("/buddies")}
                    className="bg-gradient-to-r from-buddy-blue to-buddy-purple text-white rounded-full px-4 shadow-sm hover:shadow-md"
                    size="small"
                  >
                    <Compass className="w-3 h-3 mr-1" />
                    Explore Buddies
                  </Button>
                </Card>
              )}
            </section>

            <section
              className="animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <Card className="p-6 rounded-3xl bg-white/90 backdrop-blur-sm border border-white shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-buddy-purple/10 rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-buddy-purple" />
                  </div>
                  <h3 className="font-semibold bg-gradient-to-r from-buddy-purple to-buddy-blue bg-clip-text text-transparent">
                    Today's Schedule
                  </h3>
                </div>
                <Separator className="mb-4 bg-buddy-gray-200/50" />

                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-buddy-purple/10 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-buddy-purple" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">
                    Your day is wide open!
                  </h4>
                  <p className="text-buddy-gray-500 mb-6 text-sm">
                    Perfect time to join an activity or create something new
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={() => navigate("/activities")}
                      className="bg-gradient-to-r from-buddy-purple to-buddy-blue text-white rounded-full px-6 button-shine shadow-md hover:shadow-lg"
                      size="small"
                    >
                      <Compass className="w-4 h-4 mr-2" />
                      Explore
                    </Button>
                    <Button
                      onClick={() => navigate("/activities/create")}
                      variant="outline"
                      className="border-buddy-purple/20 text-buddy-purple hover:bg-buddy-purple/5 rounded-full px-6"
                      size="small"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create
                    </Button>
                  </div>
                </div>
              </Card>
            </section>

            <section
              className="animate-fade-in"
              style={{ animationDelay: "0.5s" }}
            >
              <Card className="p-6 bg-gradient-to-br from-buddy-purple via-buddy-purple to-buddy-blue text-white rounded-3xl hover:shadow-2xl transition-all duration-300 border-0 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/3 blur-lg"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-white/20 rounded-full">
                      <Gift className="h-6 w-6 text-yellow-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Unlock Premium</h3>
                      <p className="text-xs text-white/70">
                        Limited time offer
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-white/90 mb-4">
                    Get unlimited activities, advanced analytics, and priority
                    support to supercharge your journey!
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold">$9.99</span>
                    <span className="text-sm text-white/70 line-through">
                      $19.99
                    </span>
                    <Badge className="bg-yellow-400/20 text-yellow-200 border-yellow-400/30">
                      50% OFF
                    </Badge>
                  </div>
                  <Button
                    variant="secondary"
                    size="small"
                    className="bg-white text-buddy-purple hover:bg-white/90 rounded-full shadow-md hover:shadow-lg w-full"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Upgrade Now
                  </Button>
                </div>
              </Card>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Dashboard;
