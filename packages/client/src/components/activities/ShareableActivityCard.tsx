import React, { useState } from "react";
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
import { useActivityStore } from "@/store/activity.store";
import { useAuth } from "@/store/auth.store";

import { IActivityResult } from "@/types/activity-types";

interface ShareableActivityCardProps {
  activity: IActivityResult;
}

const ShareableActivityCard = ({ activity }: ShareableActivityCardProps) => {
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
  const { joinActivity, quitActivity, isUserParticipant, isLoading } =
    useActivityStore();
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

  // Check if user is a participant
  const isParticipant = participants.some(
    (participant) => participant._id === user?._id
  );
  const isAdmin = createdBy._id === user?._id;

  const handleJoinQuit = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to join activities",
        variant: "destructive",
      });
      return;
    }

    setIsJoining(true);
    try {
      if (isParticipant) {
        await quitActivity(id);
        toast({
          title: "Left activity",
          description: "You have successfully left the activity",
        });
      } else {
        await joinActivity(id);
        toast({
          title: "Joined activity",
          description: "You have successfully joined the activity",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update activity participation",
        variant: "destructive",
      });
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
      <Card className="overflow-hidden border border-white/90 shadow-lg rounded-2xl backdrop-blur-md bg-white/90 transition-all duration-300 hover:shadow-xl">
        {/* Activity Image */}
        <div className="relative h-64 overflow-hidden">
          {image ? (
            <div
              className="w-full h-full bg-cover bg-center transform hover:scale-105 transition-transform duration-700"
              style={{ backgroundImage: `url(${image})` }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-pastel-blue to-pastel-green flex items-center justify-center">
              <span className="text-6xl animate-pulse">
                {getCategoryIcon(category)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/60 backdrop-blur-[1px]"></div>

          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span
              className={`px-3 py-1 backdrop-blur-sm rounded-full text-sm font-medium flex items-center border ${getCategoryColor(category)} transition-all duration-300 hover:shadow-md transform hover:translate-y-[-2px]`}
            >
              <span className="mr-1">{getCategoryIcon(category)}</span>
              {category}
            </span>

            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-white border border-white/30 transition-all duration-300 hover:bg-white/30 hover:shadow-md">
              {formatDuration()}
            </span>

            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-white border border-white/30 transition-all duration-300 hover:bg-white/30 hover:shadow-md">
              {formatFrequency()}
            </span>
          </div>

          <div className="absolute top-4 right-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 transition-all duration-300 hover:shadow-md"
                >
                  <Share2 className="w-4 h-4" />
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
                    <TabsTrigger value="qr" className="flex items-center gap-2">
                      <QrCode className="w-4 h-4" />
                      QR Code
                    </TabsTrigger>
                    <TabsTrigger
                      value="link"
                      className="flex items-center gap-2"
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
                          className="text-buddy-purple border-buddy-purple/30 hover:bg-buddy-purple/10"
                        >
                          <QrCode className="w-4 h-4 mr-2" />
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
                            copied ? "bg-green-500 hover:bg-green-600" : ""
                          }
                        >
                          {copied ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-buddy-blue border-buddy-blue/30 hover:bg-buddy-blue/10"
                          onClick={() => {
                            window.open(
                              `mailto:?subject=Check out this activity&body=${activityUrl}`,
                              "_blank"
                            );
                          }}
                        >
                          <Globe className="w-4 h-4 mr-2" />
                          Email
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-buddy-green border-buddy-green/30 hover:bg-buddy-green/10"
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
                          <Share2 className="w-4 h-4 mr-2" />
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
            <h1 className="text-2xl font-bold text-white mb-1 text-shadow">
              {title}
            </h1>
          </div>
        </div>

        <div className="p-6">
          <p className="text-buddy-gray-600 mb-6">{description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3 transform hover:translate-x-1 transition-transform duration-300">
              <div className="flex items-center text-buddy-gray-700 group">
                <MapPin className="w-4 h-4 mr-3 text-buddy-blue group-hover:text-buddy-blue-dark transition-colors duration-300" />
                <span className="group-hover:text-buddy-gray-900 transition-colors duration-300">
                  {location || "Virtual Activity"}
                </span>
              </div>

              <div className="flex items-center text-buddy-gray-700 group">
                <Calendar className="w-4 h-4 mr-3 text-buddy-blue group-hover:text-buddy-blue-dark transition-colors duration-300" />
                <span className="group-hover:text-buddy-gray-900 transition-colors duration-300">
                  {formatDate(startDate)}{" "}
                  {endDate && `- ${formatDate(endDate)}`}
                </span>
              </div>

              <div className="flex items-center text-buddy-gray-700 group">
                <Clock className="w-4 h-4 mr-3 text-buddy-blue group-hover:text-buddy-blue-dark transition-colors duration-300" />
                <span className="group-hover:text-buddy-gray-900 transition-colors duration-300">
                  {formatTime(startDate)}
                </span>
              </div>
            </div>

            <div>
              <div className="mb-4 transform hover:translate-y-[-2px] transition-transform duration-300">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-buddy-gray-600">
                    Activity Progress
                  </span>
                  <span className="text-sm font-medium text-buddy-blue">
                    {progress}%
                  </span>
                </div>
                <div className="h-2 bg-buddy-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-buddy-blue to-buddy-green rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-buddy-green" />
                  <span className="text-sm text-buddy-gray-700">
                    {participants.length}/{maxParticipants} participants
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-buddy-green border-buddy-green/50 hover:bg-buddy-green/10 rounded-full transition-all duration-300"
                >
                  View All
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-buddy-gray-100 pt-5 pb-3 group hover:border-buddy-gray-200 transition-colors duration-300">
            <p className="text-sm text-buddy-gray-600 mb-3">Created by</p>
            <div className="flex items-center">
              <Avatar
                size="sm"
                src={createdBy.avatar || createdBy.profileImage}
                className="rounded-full border-2 border-white shadow-sm group-hover:shadow-md transition-all duration-300"
              />
              <span className="ml-3 font-medium group-hover:text-buddy-blue transition-colors duration-300">
                {createdBy.name}
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              size="lg"
              onClick={handleJoinQuit}
              disabled={isJoining || isLoading || isAdmin}
              className={`flex-1 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:translate-y-[-2px] ${
                isParticipant
                  ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                  : "bg-gradient-to-r from-buddy-blue to-buddy-green hover:from-buddy-blue/90 hover:to-buddy-green/90"
              }`}
            >
              {isParticipant ? (
                <>
                  <UserMinus className="w-4 h-4 mr-2" />
                  {isJoining ? "Leaving..." : "Quit Activity"}
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  {isJoining ? "Joining..." : "Join Activity"}
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="flex-1 rounded-full border-buddy-gray-300 hover:bg-buddy-gray-50 transition-all duration-300 transform hover:translate-y-[-2px]"
            >
              Learn More
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ShareableActivityCard;
