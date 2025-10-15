import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/common/Card";
import Avatar from "@/components/common/Avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Calendar,
  Clock,
  MapPin,
  Flame,
  CheckCircle,
  Target,
  TrendingUp,
  UserPlus,
  LogIn,
  ArrowRight,
  Heart,
  Star,
  Zap,
  Award,
  Activity,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PartnerInviteData {
  inviter: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    profileImage?: string;
    location?: string;
    joinedDate: string;
  };
  activity: {
    _id: string;
    title: string;
    description: string;
    category: string;
    bannerImage?: string;
    location?: string;
    startDate: string;
    endDate?: string;
    checkinFrequency: number;
    checkinFrequencyUnit: string;
    proposedDuration: number;
    participants: any[];
    maxParticipants: number;
  };
  inviterStats: {
    currentStreak: number;
    totalCheckIns: number;
    activityProgress: number;
    longestStreak: number;
    averageCheckIns: number;
    lastCheckInDate?: string;
  };
  token: string;
}

const PartnerInvite: React.FC = () => {
  const { activityId } = useParams<{ activityId: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [inviteData, setInviteData] = useState<PartnerInviteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    const fetchInviteData = async () => {
      try {
        setIsLoading(true);
        console.log("🔍 Fetching invite data for:", { activityId, token });

        // Simulate API call to fetch invite data
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mock data - replace with actual API call
        const mockData: PartnerInviteData = {
          inviter: {
            _id: "inviter123",
            name: "Sarah Johnson",
            email: "sarah@example.com",
            avatar:
              "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
            location: "San Francisco, CA",
            joinedDate: "2024-01-15",
          },
          activity: {
            _id: activityId || "",
            title: "Daily Morning Yoga",
            description:
              "Join us for a refreshing morning yoga session to start your day with energy and mindfulness. Perfect for all skill levels!",
            category: "Fitness",
            bannerImage:
              "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=400&fit=crop",
            location: "Virtual",
            startDate: "2024-01-01",
            endDate: "2024-12-31",
            checkinFrequency: 1,
            checkinFrequencyUnit: "day",
            proposedDuration: 30,
            participants: [],
            maxParticipants: 50,
          },
          inviterStats: {
            currentStreak: 15,
            totalCheckIns: 45,
            activityProgress: 75,
            longestStreak: 22,
            averageCheckIns: 1.2,
            lastCheckInDate: "2024-01-20",
          },
          token: token || "",
        };

        setInviteData(mockData);
        console.log("✅ Mock data set successfully");
      } catch (error) {
        console.error("❌ Failed to fetch invite data:", error);
        toast({
          title: "Invitation not found",
          description: "This invitation link may be invalid or expired.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
        console.log("🏁 Loading completed");
      }
    };

    console.log("🚀 useEffect triggered with:", { activityId, token });
    if (activityId && token) {
      fetchInviteData();
    } else {
      console.log("⚠️ Missing required params:", { activityId, token });
      setIsLoading(false);
    }
  }, [activityId, token, toast]);

  const handleJoinApp = () => {
    // Store the invite token for after signup
    localStorage.setItem("partnerInviteToken", token || "");
    localStorage.setItem("partnerInviteActivityId", activityId || "");
    navigate("/signup");
  };

  const handleSignIn = () => {
    // Store the invite token for after signin
    localStorage.setItem("partnerInviteToken", token || "");
    localStorage.setItem("partnerInviteActivityId", activityId || "");
    navigate("/signin");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDuration = (duration: number, unit: string) => {
    return `${duration} ${unit}${duration > 1 ? "s" : ""}`;
  };

  const getCategoryColor = (category: string) => {
    const categories: Record<string, string> = {
      Fitness:
        "bg-buddy-green-light/60 text-buddy-green-dark border-buddy-green/20",
      Technology:
        "bg-buddy-blue-light/60 text-buddy-blue-dark border-buddy-blue/20",
      Music:
        "bg-buddy-purple-light/60 text-buddy-purple-dark border-buddy-purple/20",
      Reading:
        "bg-buddy-orange-light/60 text-buddy-orange-dark border-buddy-orange/20",
      default: "bg-pastel-purple/40 text-buddy-purple border-buddy-purple/20",
    };
    return categories[category.toLowerCase()] || categories.default;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      Fitness: "🧘",
      Technology: "💻",
      Music: "🎵",
      Reading: "📚",
      Art: "🎨",
      Cooking: "🍳",
      Gaming: "🎮",
      Language: "🗣️",
      Photography: "📷",
      Writing: "✍️",
      Hiking: "🥾",
      Dancing: "💃",
    };
    return icons[category.toLowerCase()] || "🏷️";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-buddy-purple/5 via-buddy-blue/5 to-buddy-green/5 flex items-center justify-center p-4">
        <Card className="max-w-4xl w-full p-8 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </Card>
      </div>
    );
  }

  if (!inviteData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-buddy-purple/5 via-buddy-blue/5 to-buddy-green/5 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 text-center">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Invitation Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            This invitation link may be invalid or expired. Please check with
            the person who invited you.
          </p>
          <Button onClick={() => navigate("/")} className="rounded-full">
            Go to Homepage
          </Button>
        </Card>
      </div>
    );
  }

  const { inviter, activity, inviterStats } = inviteData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-buddy-purple/5 via-buddy-blue/5 to-buddy-green/5 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="text-center p-8 border-0 shadow-2xl rounded-3xl backdrop-blur-md bg-white/95">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-buddy-purple to-buddy-blue bg-clip-text text-transparent mb-2">
            You're Invited!
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            <strong>{inviter.name}</strong> wants you to be their accountability
            partner
          </p>
          <div className="flex items-center justify-center gap-2 text-buddy-purple">
            <Heart className="w-5 h-5" />
            <span className="font-medium">
              Join them on their journey to success!
            </span>
          </div>
        </Card>

        {/* Activity Overview */}
        <Card className="overflow-hidden border-0 shadow-2xl rounded-3xl backdrop-blur-md bg-white/95">
          {/* Activity Image */}
          <div className="relative h-64 overflow-hidden">
            {activity.bannerImage ? (
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${activity.bannerImage})` }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-buddy-purple via-buddy-blue to-buddy-green flex items-center justify-center">
                <span className="text-6xl">
                  {getCategoryIcon(activity.category)}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

            <div className="absolute top-4 left-4">
              <Badge
                className={`px-4 py-2 rounded-full text-sm font-semibold ${getCategoryColor(activity.category)}`}
              >
                <span className="mr-2 text-lg">
                  {getCategoryIcon(activity.category)}
                </span>
                {activity.category}
              </Badge>
            </div>

            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-3xl font-bold text-white mb-2">
                {activity.title}
              </h2>
              <p className="text-white/90 text-lg">{activity.description}</p>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Activity Details */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Activity Details
                </h3>

                <div className="flex items-center text-gray-700 p-3 rounded-xl hover:bg-gradient-to-r hover:from-buddy-purple/5 hover:to-buddy-blue/5 transition-all duration-300">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-buddy-blue/20 to-buddy-purple/20 flex items-center justify-center mr-4">
                    <MapPin className="w-5 h-5 text-buddy-blue" />
                  </div>
                  <span className="font-medium">
                    {activity.location || "Virtual Activity"}
                  </span>
                </div>

                <div className="flex items-center text-gray-700 p-3 rounded-xl hover:bg-gradient-to-r hover:from-buddy-green/5 hover:to-buddy-blue/5 transition-all duration-300">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-buddy-green/20 to-buddy-blue/20 flex items-center justify-center mr-4">
                    <Calendar className="w-5 h-5 text-buddy-green" />
                  </div>
                  <span className="font-medium">
                    {formatDate(activity.startDate)}
                    {activity.endDate && ` - ${formatDate(activity.endDate)}`}
                  </span>
                </div>

                <div className="flex items-center text-gray-700 p-3 rounded-xl hover:bg-gradient-to-r hover:from-buddy-orange/5 hover:to-buddy-purple/5 transition-all duration-300">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-buddy-orange/20 to-buddy-purple/20 flex items-center justify-center mr-4">
                    <Clock className="w-5 h-5 text-buddy-orange" />
                  </div>
                  <span className="font-medium">
                    {activity.checkinFrequency}x per{" "}
                    {activity.checkinFrequencyUnit}
                  </span>
                </div>

                <div className="flex items-center text-gray-700 p-3 rounded-xl hover:bg-gradient-to-r hover:from-buddy-purple/5 hover:to-buddy-blue/5 transition-all duration-300">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-buddy-purple/20 to-buddy-blue/20 flex items-center justify-center mr-4">
                    <Target className="w-5 h-5 text-buddy-purple" />
                  </div>
                  <span className="font-medium">
                    {formatDuration(
                      activity.proposedDuration,
                      activity.checkinFrequencyUnit
                    )}{" "}
                    duration
                  </span>
                </div>
              </div>

              {/* Inviter Stats */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Your Partner's Progress
                </h3>

                {/* Current Streak */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Flame className="w-6 h-6 text-orange-500" />
                      <span className="text-lg font-semibold text-gray-800">
                        Current Streak
                      </span>
                    </div>
                    <span className="text-3xl font-bold text-orange-600">
                      {inviterStats.currentStreak}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">days in a row! 🔥</p>
                </div>

                {/* Activity Progress */}
                <div className="bg-gradient-to-r from-buddy-purple/5 to-buddy-blue/5 p-6 rounded-2xl border border-buddy-purple/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-6 h-6 text-buddy-purple" />
                      <span className="text-lg font-semibold text-gray-800">
                        Activity Progress
                      </span>
                    </div>
                    <span className="text-3xl font-bold bg-gradient-to-r from-buddy-blue to-buddy-purple bg-clip-text text-transparent">
                      {inviterStats.activityProgress}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-gradient-to-r from-buddy-blue via-buddy-purple to-buddy-green rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${inviterStats.activityProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {inviterStats.totalCheckIns} total check-ins completed
                  </p>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-buddy-green/5 to-buddy-blue/5 p-4 rounded-xl border border-buddy-green/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <Award className="w-5 h-5 text-buddy-green" />
                      <span className="font-semibold text-gray-800">
                        Best Streak
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-buddy-green">
                      {inviterStats.longestStreak}
                    </span>
                    <p className="text-xs text-gray-600">days</p>
                  </div>

                  <div className="bg-gradient-to-r from-buddy-blue/5 to-buddy-purple/5 p-4 rounded-xl border border-buddy-blue/10">
                    <div className="flex items-center space-x-2 mb-2">
                      <Activity className="w-5 h-5 text-buddy-blue" />
                      <span className="font-semibold text-gray-800">
                        Daily Avg
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-buddy-blue">
                      {inviterStats.averageCheckIns}
                    </span>
                    <p className="text-xs text-gray-600">check-ins</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Inviter Profile */}
        <Card className="p-8 border-0 shadow-2xl rounded-3xl backdrop-blur-md bg-white/95">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Meet Your Accountability Partner
            </h3>
            <p className="text-gray-600">
              The person who believes in your potential
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <Avatar
                size="xl"
                src={inviter.avatar || inviter.profileImage}
                className="rounded-full border-4 border-white shadow-xl"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h4 className="text-2xl font-bold text-gray-800 mb-2">
                {inviter.name}
              </h4>
              <p className="text-gray-600 mb-4">
                {inviter.location && (
                  <span className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <MapPin className="w-4 h-4" />
                    {inviter.location}
                  </span>
                )}
                <span className="flex items-center justify-center md:justify-start gap-2">
                  <Calendar className="w-4 h-4" />
                  Joined {formatDate(inviter.joinedDate)}
                </span>
              </p>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge variant="outline" className="rounded-full">
                  <Star className="w-4 h-4 mr-1" />
                  Dedicated Partner
                </Badge>
                <Badge variant="outline" className="rounded-full">
                  <Zap className="w-4 h-4 mr-1" />
                  {inviterStats.currentStreak} Day Streak
                </Badge>
                <Badge variant="outline" className="rounded-full">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  {inviterStats.totalCheckIns} Check-ins
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Call to Action */}
        <Card className="p-8 border-0 shadow-2xl rounded-3xl backdrop-blur-md bg-gradient-to-r from-buddy-purple/10 to-buddy-blue/10">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Ready to Start Your Journey Together?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join {inviter.name} and thousands of others who are achieving
              their goals with the power of accountability partnerships.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={handleJoinApp}
                disabled={isJoining}
                className="h-14 px-8 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:translate-y-[-2px] hover:scale-105 text-lg font-bold bg-gradient-to-r from-buddy-purple to-buddy-blue hover:from-buddy-purple/90 hover:to-buddy-blue/90"
              >
                <UserPlus className="w-6 h-6 mr-3" />
                {isJoining
                  ? "Creating Account..."
                  : "Join the App & Accept Partnership"}
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={handleSignIn}
                className="h-14 px-8 rounded-full border-2 border-buddy-purple/30 hover:bg-buddy-purple/10 transition-all duration-300 transform hover:translate-y-[-2px] hover:scale-105 text-lg font-semibold text-buddy-purple"
              >
                <LogIn className="w-5 h-5 mr-3" />
                Already Have an Account? Sign In
              </Button>
            </div>

            <div className="mt-8 p-6 bg-white/50 rounded-2xl border border-white/20">
              <h4 className="font-semibold text-gray-800 mb-3">
                What happens next?
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-buddy-purple text-white flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <span>Create your account or sign in</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-buddy-blue text-white flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <span>Accept the partnership invitation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-buddy-green text-white flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <span>Start your accountability journey together!</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PartnerInvite;
