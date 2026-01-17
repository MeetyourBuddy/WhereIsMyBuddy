import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/common/Card";
import Avatar from "@/components/common/Avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Share2,
  UserPlus,
  UserMinus,
  Calendar,
  Clock,
  MapPin,
  Users,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  QrCode,
  Link as LinkIcon,
  Smartphone,
  Globe,
  LogIn,
  Shield,
  CheckCircle,
  Flame,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import QRCode from "react-qr-code";
import { useAuth } from "@/store/auth.store";
import { useActivityData } from "@/hooks/useActivityData";

import {
  IActivityResult,
  isActivityCreator,
  isActivityParticipant,
} from "@/types/activity-types";

interface ShareableActivityCardProps {
  activity: IActivityResult;
  // Progress tracking props (optional)
  showProgress?: boolean;
  userProgress?: {
    progress: number;
    completedCheckIns: number;
    totalAvailableCheckIns: number;
    currentStreak?: number;
    lastCheckInDate?: string;
  };
}

const ShareableActivityCard = ({
  activity,
  showProgress = false,
  userProgress,
}: ShareableActivityCardProps) => {
  console.log("🚀 ShareableActivityCard RENDERED with activity:", activity);
  console.log("🔥 FIRE TEST - This should definitely show up in console!");

  // Alert to make sure component is rendering
  if (typeof window !== "undefined") {
    console.log("🚨 COMPONENT IS RENDERING - Check browser console!");
  }

  // Extract data from activity
  const {
    _id: id,
    title,
    description,
    category,
    bannerImage: image,
    location,
    startDate,
    endDate,
    admin: createdBy,
    participants = [],
    maxParticipants,
    progress = 0,
    checkinFrequency,
    checkinFrequencyUnit,
    proposedDuration,
  } = activity;
  const { toast } = useToast();
  const { user } = useAuth();
  const { joinActivityMutation, quitActivityMutation } = useActivityData(id);

  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [activeTab, setActiveTab] = useState("qr");
  const activityUrl = `${window.location.origin}/activity/${id}`;

  // Format dates and times
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDuration = () => {
    return `${proposedDuration} ${checkinFrequencyUnit}`;
  };

  const formatFrequency = () => {
    return `${checkinFrequency}x ${checkinFrequencyUnit}`;
  };

  // Check if user is a participant and creator using helper functions
  // Use both _id and id fields to handle different API responses
  const userId = user?._id || user?.id;
  const isParticipant = isActivityParticipant(activity, userId);
  const isAdmin = isActivityCreator(activity, userId);

  const handleJoinQuit = async () => {
    if (!user) {
      // Store the current activity URL to redirect back after signup
      localStorage.setItem("redirectAfterSignup", activityUrl);
      toast({
        title: "Sign up to join activities",
        description:
          "Create an account to join this activity and start your journey!",
        variant: "default",
      });
      navigate("/signup");
      return;
    }

    setIsJoining(true);
    try {
      if (isParticipant) {
        await quitActivityMutation.mutateAsync(id);
        // Toast is handled by the mutation
      } else {
        await joinActivityMutation.mutateAsync(id);
        // Toast is handled by the mutation
      }
    } catch (error: any) {
      // Error toast is handled by the mutation, but we can add additional handling here if needed
      console.error("Activity join/quit error:", error);
    } finally {
      setIsJoining(false);
    }
  };

  // Calculate category styles
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

  // Get category icon
  const getCategoryIcon = (category: string) => {
    const defaultIcon = "🏷️";

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

    return icons[category.toLowerCase()] || defaultIcon;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(activityUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Activity link has been copied to your clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy the link to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDownloadQR = () => {
    // Create a canvas element to convert QR code to image
    const svg = document.getElementById("qr-code-svg-card");
    if (svg) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const svgUrl = URL.createObjectURL(svgBlob);

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `activity-qr-${Date.now()}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();

        URL.revokeObjectURL(svgUrl);
      };

      img.src = svgUrl;
    }
  };

  return (
    <div className="animate-fade-in">
      <Card className="overflow-hidden border-0 shadow-2xl rounded-3xl backdrop-blur-md bg-white/95 transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] group">
        {/* Activity Image */}
        <div className="relative h-72 overflow-hidden">
          {image ? (
            <div
              className="w-full h-full bg-cover bg-center transform group-hover:scale-110 transition-transform duration-1000 ease-out"
              style={{ backgroundImage: `url(${image})` }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-buddy-purple via-buddy-blue to-buddy-green flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-buddy-purple/20 via-buddy-blue/20 to-buddy-green/20"></div>
              <span className="text-8xl animate-bounce relative z-10 filter drop-shadow-lg">
                {getCategoryIcon(category)}
              </span>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 backdrop-blur-[1px]"></div>

          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span
              className={`px-4 py-2 backdrop-blur-md rounded-full text-sm font-semibold flex items-center border-2 shadow-lg ${getCategoryColor(category)} transition-all duration-300 hover:shadow-xl transform hover:translate-y-[-3px] hover:scale-105`}
            >
              <span className="mr-2 text-lg">{getCategoryIcon(category)}</span>
              {category}
            </span>

            <span className="bg-gradient-to-r from-white/30 to-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold text-white border-2 border-white/40 shadow-lg transition-all duration-300 hover:bg-white/40 hover:shadow-xl transform hover:translate-y-[-3px] hover:scale-105">
              <Clock className="w-4 h-4 mr-2" />
              {formatDuration()}
            </span>

            <span className="bg-gradient-to-r from-white/30 to-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold text-white border-2 border-white/40 shadow-lg transition-all duration-300 hover:bg-white/40 hover:shadow-xl transform hover:translate-y-[-3px] hover:scale-105">
              <Calendar className="w-4 h-4 mr-2" />
              {formatFrequency()}
            </span>
          </div>

          <div className="absolute top-4 right-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-gradient-to-r from-white/30 to-white/20 backdrop-blur-md hover:from-white/50 hover:to-white/30 text-white border-2 border-white/40 shadow-lg transition-all duration-300 hover:shadow-xl transform hover:scale-110 hover:rotate-12"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="border-l border-white/20 backdrop-blur-md bg-white/95">
                <SheetHeader>
                  <SheetTitle className="text-xl font-bold bg-gradient-to-r from-buddy-purple to-buddy-blue bg-clip-text text-transparent">
                    Share {title}
                  </SheetTitle>
                </SheetHeader>

                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full mt-6"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      value="qr"
                      className="flex items-center gap-2 rounded-full"
                    >
                      <QrCode className="w-4 h-4" />
                      QR Code
                    </TabsTrigger>
                    <TabsTrigger
                      value="link"
                      className="flex items-center gap-2 rounded-full"
                    >
                      <LinkIcon className="w-4 h-4" />
                      Link
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="qr" className="space-y-4 mt-6">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="bg-white p-4 rounded-xl shadow-sm border-2 border-buddy-purple/20">
                        <QRCode
                          id="qr-code-svg-card"
                          size={200}
                          value={activityUrl}
                          style={{
                            height: "auto",
                            maxWidth: "100%",
                            width: "100%",
                          }}
                        />
                      </div>

                      <div className="text-center space-y-2">
                        <p className="text-sm text-buddy-gray-600">
                          Scan this QR code to view the activity
                        </p>
                        <Button
                          onClick={handleDownloadQR}
                          variant="outline"
                          size="sm"
                          className="text-buddy-purple border-buddy-purple/30 hover:bg-buddy-purple/10 rounded-full"
                        >
                          <QrCode className="w-4 h-4 " />
                          Download QR Code
                        </Button>
                      </div>
                    </div>

                    <Alert className="bg-amber-50 border-amber-200">
                      <Smartphone className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-amber-800">
                        <strong>Tip:</strong> Hold your phone camera over the QR
                        code to instantly open the activity page. Perfect for
                        sharing in person!
                      </AlertDescription>
                    </Alert>
                  </TabsContent>

                  <TabsContent value="link" className="space-y-4 mt-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Input
                          value={activityUrl}
                          readOnly
                          className="flex-1 bg-buddy-gray-50 border-buddy-gray-200"
                        />
                        <Button
                          onClick={handleCopyLink}
                          variant={copied ? "default" : "outline"}
                          size="sm"
                          className={
                            copied
                              ? "bg-green-500 hover:bg-green-600 rounded-full"
                              : "rounded-full"
                          }
                        >
                          {copied ? (
                            <>
                              <Check className="w-4 h-4 " />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 " />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-buddy-blue border-buddy-blue/30 hover:bg-buddy-blue/10 rounded-full"
                          onClick={() => {
                            window.open(
                              `mailto:?subject=Check out this activity&body=${activityUrl}`,
                              "_blank"
                            );
                          }}
                        >
                          <Globe className="w-4 h-4 " />
                          Email
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-buddy-green border-buddy-green/30 hover:bg-buddy-green/10 rounded-full"
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({
                                title: `Check out ${title}`,
                                text: `Join me in this activity!`,
                                url: activityUrl,
                              });
                            } else {
                              handleCopyLink();
                            }
                          }}
                        >
                          <Share2 className="w-4 h-4 " />
                          Share
                        </Button>
                      </div>
                    </div>

                    <Alert className="bg-blue-50 border-blue-200">
                      <Globe className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        <strong>Easy sharing:</strong> Copy the link to share
                        via text, social media, or email. Works on any device!
                      </AlertDescription>
                    </Alert>
                  </TabsContent>
                </Tabs>

                <div className="pt-4 border-t border-buddy-gray-100 mt-6">
                  <Alert className="bg-gradient-to-r from-buddy-purple/5 to-buddy-blue/5 border-buddy-purple/20">
                    <Users className="h-4 w-4 text-buddy-purple" />
                    <AlertDescription className="text-buddy-gray-700">
                      <strong>Grow your community:</strong> Share this activity
                      to invite friends and build your buddy network. More
                      participants = more fun! 💜
                    </AlertDescription>
                  </Alert>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-gradient-to-r from-black/40 to-transparent backdrop-blur-sm rounded-tr-2xl rounded-tl-2xl p-4 -m-4 flex flex-row items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 text-shadow-lg leading-tight">
                  {title}
                </h1>

                {(isParticipant || isAdmin) && (
                  <p className="text-white/90 text-sm font-medium">
                    You are joined by {participants.length}{" "}
                    {participants.length === 1 ? "person" : "people"} in this
                    amazing journey
                  </p>
                )}

                {!isAdmin && !isParticipant && (
                  <p className="text-white/90 text-sm font-medium">
                    Join {participants.length}{" "}
                    {participants.length === 1 ? "person" : "people"} in this
                    amazing journey
                  </p>
                )}
              </div>

              {isAdmin && (
                <div className="flex items-center rounded-full gap-3 px-8 py-4 bg-gradient-to-r from-buddy-purple to-buddy-blue text-white text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <Shield className="w-6 h-6" />
                  CREATOR
                </div>
              )}

              {isParticipant && !isAdmin && (
                <div className="flex items-center rounded-full gap-3 px-8 py-4 bg-gradient-to-r from-buddy-green to-buddy-blue text-white text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <Users className="w-6 h-6" />
                  JOINED
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <p className="text-buddy-gray-700 text-lg leading-relaxed font-medium">
              {description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center text-buddy-gray-700 group p-3 rounded-xl hover:bg-gradient-to-r hover:from-buddy-purple/5 hover:to-buddy-blue/5 transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-buddy-blue/20 to-buddy-purple/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-5 h-5 text-buddy-blue group-hover:text-buddy-purple transition-colors duration-300" />
                </div>
                <span className="font-medium group-hover:text-buddy-gray-900 transition-colors duration-300">
                  {location || "Virtual Activity"}
                </span>
              </div>

              <div className="flex items-center text-buddy-gray-700 group p-3 rounded-xl hover:bg-gradient-to-r hover:from-buddy-green/5 hover:to-buddy-blue/5 transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-buddy-green/20 to-buddy-blue/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-5 h-5 text-buddy-green group-hover:text-buddy-blue transition-colors duration-300" />
                </div>
                <span className="font-medium group-hover:text-buddy-gray-900 transition-colors duration-300">
                  {formatDate(startDate)}{" "}
                  {endDate && `- ${formatDate(endDate)}`}
                </span>
              </div>

              <div className="flex items-center text-buddy-gray-700 group p-3 rounded-xl hover:bg-gradient-to-r hover:from-buddy-orange/5 hover:to-buddy-purple/5 transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-buddy-orange/20 to-buddy-purple/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-5 h-5 text-buddy-orange group-hover:text-buddy-purple transition-colors duration-300" />
                </div>
                <span className="font-medium group-hover:text-buddy-gray-900 transition-colors duration-300">
                  {formatTime(startDate)}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {/* Progress Indicators - Only show if showProgress is true and userProgress is available */}
              {showProgress && userProgress && (
                <div className="bg-gradient-to-r from-buddy-purple/5 to-buddy-blue/5 p-6 rounded-2xl border border-buddy-purple/10 transform hover:translate-y-[-2px] transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-buddy-green" />
                      <span className="text-lg font-semibold text-buddy-gray-800">
                        Your Progress
                      </span>
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-buddy-blue to-buddy-purple bg-clip-text text-transparent">
                      {userProgress.progress || 0}%
                    </span>
                  </div>

                  <div className="h-3 bg-buddy-gray-100 rounded-full overflow-hidden shadow-inner mb-3">
                    <div
                      className="h-full bg-gradient-to-r from-buddy-blue via-buddy-purple to-buddy-green rounded-full transition-all duration-1000 ease-out shadow-lg"
                      style={{ width: `${userProgress.progress || 0}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-buddy-gray-600 mb-2">
                    <span>
                      {userProgress.completedCheckIns || 0}/
                      {userProgress.totalAvailableCheckIns || 0} check-ins
                    </span>
                    {userProgress.currentStreak &&
                      userProgress.currentStreak > 0 && (
                        <div className="flex items-center space-x-1">
                          <Flame className="w-4 h-4 text-orange-500" />
                          <span className="text-orange-600 font-medium">
                            {userProgress.currentStreak} day streak
                          </span>
                        </div>
                      )}
                  </div>

                  <p className="text-sm text-buddy-gray-600">
                    {userProgress.progress === 100
                      ? "Congratulations! You've completed this activity! 🎉"
                      : userProgress.progress >= 75
                        ? "Almost there! You're doing amazing! 🚀"
                        : userProgress.progress >= 50
                          ? "Great progress! You're halfway there! 💪"
                          : userProgress.progress >= 25
                            ? "Keep going! You're making great progress! 📈"
                            : "Every step counts! Keep up the great work! 🌟"}
                  </p>
                </div>
              )}

              {/* Default progress display when no user progress is available */}
              {!showProgress && (
                <div className="bg-gradient-to-r from-buddy-purple/5 to-buddy-blue/5 p-6 rounded-2xl border border-buddy-purple/10 transform hover:translate-y-[-2px] transition-all duration-300 hover:shadow-lg">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-semibold text-buddy-gray-800">
                      Activity Progress
                    </span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-buddy-blue to-buddy-purple bg-clip-text text-transparent">
                      {progress}%
                    </span>
                  </div>
                  <div className="h-3 bg-buddy-gray-100 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-buddy-blue via-buddy-purple to-buddy-green rounded-full transition-all duration-1000 ease-out shadow-lg"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-buddy-gray-600 mt-2">
                    {isParticipant
                      ? "Join this activity to start tracking your progress!"
                      : "Join this activity to start tracking your progress!"}
                  </p>
                </div>
              )}

              <div className="bg-gradient-to-r from-buddy-green/5 to-buddy-blue/5 p-6 rounded-2xl border border-buddy-green/10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-buddy-green/20 to-buddy-blue/20 flex items-center justify-center mr-4">
                      <Users className="w-6 h-6 text-buddy-green" />
                    </div>
                    <div>
                      <span className="text-lg font-semibold text-buddy-gray-800 block">
                        {participants.length}/{maxParticipants}
                      </span>
                      <span className="text-sm text-buddy-gray-600">
                        Amazing people joined
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="text-buddy-green border-buddy-green/50 hover:bg-buddy-green/10 rounded-full transition-all duration-300 hover:scale-105"
                  >
                    View All
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-buddy-purple/5 to-buddy-blue/5 p-6 rounded-2xl border border-buddy-purple/10 group hover:shadow-lg transition-all duration-300">
            <p className="text-sm font-semibold text-buddy-gray-600 mb-4 flex items-center">
              <span className="w-2 h-2 bg-gradient-to-r from-buddy-purple to-buddy-blue rounded-full mr-2"></span>
              Created by
            </p>
            <div className="flex items-center">
              <Avatar
                size="md"
                src={createdBy.avatar || createdBy.profileImage}
                className="rounded-full border-3 border-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110"
              />
              <div className="ml-4">
                <span className="text-lg font-semibold group-hover:text-buddy-purple transition-colors duration-300 block">
                  {createdBy.name}
                </span>
                <span className="text-sm text-buddy-gray-500">
                  Activity Creator
                </span>
              </div>
            </div>
          </div>

          {/* Show view activity button for activity creators, join/quit button for others */}
          {isAdmin ? (
            <Button
              variant="outline"
              size="lg"
              className="w-full h-12 mt-8 rounded-full border-2 border-buddy-purple/30 hover:bg-buddy-purple/10 transition-all duration-300 transform hover:translate-y-[-2px] hover:scale-105 text-buddy-purple font-semibold"
              onClick={() => navigate(`/activities/${id}`)}
            >
              View Activity
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <div className="mt-8 space-y-4">
              <Button
                size="lg"
                onClick={handleJoinQuit}
                disabled={isJoining || isLoading}
                className={`w-full h-14 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:translate-y-[-3px] hover:scale-105 text-lg font-bold ${
                  user && isParticipant
                    ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                    : "bg-gradient-to-r from-buddy-purple to-buddy-blue hover:from-buddy-purple/90 hover:to-buddy-blue/90"
                }`}
              >
                {!user ? (
                  <>
                    <LogIn className="w-5 h-5 mr-3" />
                    Sign Up to Join This Amazing Journey
                  </>
                ) : user && isParticipant ? (
                  <>
                    <UserMinus className="w-5 h-5 mr-3" />
                    {isJoining ? "Leaving..." : "Quit Activity"}
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-3" />
                    {isJoining ? "Joining..." : "Join This Amazing Activity"}
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full h-12 rounded-full border-2 border-buddy-purple/30 hover:bg-buddy-purple/10 transition-all duration-300 transform hover:translate-y-[-2px] hover:scale-105 text-buddy-purple font-semibold"
                onClick={() => navigate(`/activities/${id}`)}
              >
                Learn More About This Activity
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ShareableActivityCard;
