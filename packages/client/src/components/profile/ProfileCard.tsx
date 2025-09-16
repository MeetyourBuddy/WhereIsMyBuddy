import React, { useRef, useState } from "react";
import { Card } from "@/components/common/Card";
import Avatar from "@/components/common/Avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Share2,
  UserPlus,
  MessageCircle,
  Calendar,
  MapPin,
  Award,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  Link,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import QRCode from "react-qr-code";
import { InterestCategory } from "@/types/auth-types";
import { format } from "date-fns";
interface ProfileCardProps {
  id: string;
  name: string;
  username: string;
  bio: string;
  image?: string;
  location?: string;
  interests: InterestCategory[];
  joinedDate: string;
  activityCount: number;
  buddyCount: number;
  achievements?: {
    title: string;
    icon?: string;
  }[];
  showJoinButton?: boolean;
}

const ProfileCard = ({
  id,
  name,
  username,
  bio,
  image,
  location,
  interests,
  joinedDate,
  activityCount,
  buddyCount,
  achievements = [],
  showJoinButton = false,
}: ProfileCardProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const profileUrl = `${window.location.origin}/profile/${id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The profile link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="animate-fade-in">
      <Card className="overflow-hidden border-0 shadow-2xl rounded-3xl backdrop-blur-md bg-white/95 transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] group">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-br from-buddy-purple via-buddy-blue to-buddy-green relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-buddy-purple/20 via-buddy-blue/20 to-buddy-green/20"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNGRkZGRkYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoM3YzaC0zem0tNi0zMWgzdjNoLTN6TTE3IDE3aDN2M2gtM3pNMzYgMTdoM3YzaC0zeiIvPjwvZz48L2c+PC9zdmc+')] opacity-60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

          {/* Floating elements for visual interest */}
          <div className="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-8 left-8 w-6 h-6 bg-white/5 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-6 w-3 h-3 bg-white/15 rounded-full animate-ping"></div>
        </div>

        <div className="relative px-6 pb-6 -mt-16">
          {/* Profile Avatar */}
          <div className="flex justify-between items-end mb-4">
            <div className="relative">
              <Avatar
                size="lg"
                status="online"
                src={image}
                className="border-4 border-white rounded-full shadow-2xl transform group-hover:scale-110 transition-all duration-500"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-buddy-green to-buddy-blue rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="flex space-x-2">
              {showJoinButton ? (
                <Button
                  size="sm"
                  className="rounded-2xl bg-gradient-to-r from-buddy-purple to-buddy-blue text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:translate-y-[-2px] font-semibold"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join Now
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-2xl border-2 border-buddy-purple/30 hover:bg-buddy-purple/10 transition-all duration-300 transform hover:scale-105 hover:translate-y-[-2px] font-semibold"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
              )}

              <Button
                size="sm"
                className="rounded-2xl bg-gradient-to-r from-buddy-green to-buddy-blue text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:translate-y-[-2px] font-semibold"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Buddy
              </Button>

              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-2xl bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-md hover:from-white/30 hover:to-white/20 transition-all duration-300 transform hover:scale-110 hover:rotate-12 shadow-lg"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="border-l border-white/20 backdrop-blur-md bg-white/95">
                  <SheetHeader>
                    <SheetTitle className="text-xl font-bold bg-gradient-to-r from-buddy-purple to-buddy-blue bg-clip-text text-transparent">
                      Share {name}'s Profile
                    </SheetTitle>
                  </SheetHeader>

                  <Tabs defaultValue="qr" className="w-full mt-6">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger
                        value="qr"
                        className="flex items-center gap-2"
                      >
                        <QrCode className="w-4 h-4" />
                        QR Code
                      </TabsTrigger>
                      <TabsTrigger
                        value="link"
                        className="flex items-center gap-2"
                      >
                        <Link className="w-4 h-4" />
                        Link
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="qr" className="mt-6">
                      <div className="flex flex-col items-center">
                        <div className="bg-white p-6 rounded-2xl mb-4 relative shadow-lg border border-buddy-gray-200">
                          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-5">
                            <div className="text-buddy-purple text-8xl font-bold">
                              {name.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <QRCode
                            size={180}
                            value={profileUrl}
                            style={{
                              height: "auto",
                              maxWidth: "100%",
                              width: "100%",
                            }}
                          />
                        </div>

                        <p className="text-sm text-buddy-gray-600 mb-4 text-center">
                          Scan this QR code to view {name}'s profile
                        </p>

                        <div className="grid grid-cols-2 gap-3 w-full">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-buddy-purple border-buddy-purple/30 hover:bg-buddy-purple/10"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Image
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-buddy-blue border-buddy-blue/30 hover:bg-buddy-blue/10"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Download QR
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="link" className="mt-6">
                      <div className="space-y-4">
                        <div className="flex items-center border rounded-lg p-3 bg-buddy-gray-50/80 backdrop-blur-sm">
                          <input
                            type="text"
                            value={profileUrl}
                            readOnly
                            className="flex-1 bg-transparent border-none focus:outline-none px-2 py-1 text-sm"
                          />
                          <Button
                            onClick={copyToClipboard}
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
                                `mailto:?subject=Check out ${name}'s profile&body=${profileUrl}`,
                                "_blank"
                              );
                            }}
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Email
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-buddy-green border-buddy-green/30 hover:bg-buddy-green/10"
                            onClick={() => {
                              if (navigator.share) {
                                navigator.share({
                                  title: `Check out ${name}'s profile`,
                                  text: `View ${name}'s profile on BuddyFinder!`,
                                  url: profileUrl,
                                });
                              } else {
                                copyToClipboard();
                              }
                            }}
                          >
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="pt-4 border-t border-buddy-gray-100 mt-6">
                    <Alert className="bg-gradient-to-r from-buddy-purple/5 to-buddy-blue/5 border-buddy-purple/20">
                      <UserPlus className="h-4 w-4 text-buddy-purple" />
                      <AlertDescription className="text-buddy-gray-700">
                        <strong>Connect with {name}:</strong> Share this profile
                        to help {name} grow their network and find new activity
                        buddies! 🤝
                      </AlertDescription>
                    </Alert>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Profile Details */}
          <div className="mb-6">
            <div className="bg-gradient-to-r from-buddy-purple/5 to-buddy-blue/5 p-4 rounded-2xl border border-buddy-purple/10">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-buddy-purple to-buddy-blue bg-clip-text text-transparent mb-1">
                {name}
              </h1>
              <p className="text-buddy-gray-600 text-base font-medium mb-3">
                @{username}
              </p>

              <p className="text-buddy-gray-700 text-base leading-relaxed font-medium mb-4">
                {bio}
              </p>

              <div className="space-y-2">
                <div className="flex items-center text-buddy-gray-700 group p-2 rounded-xl hover:bg-gradient-to-r hover:from-buddy-purple/5 hover:to-buddy-blue/5 transition-all duration-300">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-buddy-purple/20 to-buddy-blue/20 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-4 h-4 text-buddy-purple group-hover:text-buddy-blue transition-colors duration-300" />
                  </div>
                  <span className="font-medium group-hover:text-buddy-gray-900 transition-colors duration-300 text-sm">
                    {location || "No location set"}
                  </span>
                </div>

                <div className="flex items-center text-buddy-gray-700 group p-2 rounded-xl hover:bg-gradient-to-r hover:from-buddy-green/5 hover:to-buddy-blue/5 transition-all duration-300">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-buddy-green/20 to-buddy-blue/20 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="w-4 h-4 text-buddy-green group-hover:text-buddy-blue transition-colors duration-300" />
                  </div>
                  <span className="font-medium group-hover:text-buddy-gray-900 transition-colors duration-300 text-sm">
                    Joined {format(new Date(joinedDate), "MMMM d, yyyy")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-buddy-purple/10 to-buddy-blue/10 rounded-2xl p-4 text-center border border-buddy-purple/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:translate-y-[-2px]">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-buddy-purple/20 to-buddy-blue/20 flex items-center justify-center">
                <span className="text-xl">🎯</span>
              </div>
              <span className="block text-2xl font-bold bg-gradient-to-r from-buddy-purple to-buddy-blue bg-clip-text text-transparent">
                {activityCount}
              </span>
              <span className="text-buddy-gray-700 text-base font-semibold">
                Activities
              </span>
              <p className="text-buddy-gray-500 text-xs mt-1">
                Amazing journey!
              </p>
            </div>

            <div className="bg-gradient-to-br from-buddy-green/10 to-buddy-blue/10 rounded-2xl p-4 text-center border border-buddy-green/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:translate-y-[-2px]">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-buddy-green/20 to-buddy-blue/20 flex items-center justify-center">
                <span className="text-xl">👥</span>
              </div>
              <span className="block text-2xl font-bold bg-gradient-to-r from-buddy-green to-buddy-blue bg-clip-text text-transparent">
                {buddyCount}
              </span>
              <span className="text-buddy-gray-700 text-base font-semibold">
                Buddies
              </span>
              <p className="text-buddy-gray-500 text-xs mt-1">
                Great connections!
              </p>
            </div>
          </div>

          {/* Interests */}
          <div className="mb-6">
            <div className="bg-gradient-to-r from-buddy-green/5 to-buddy-blue/5 p-4 rounded-2xl border border-buddy-green/10">
              <h3 className="text-lg font-bold text-buddy-gray-900 mb-3 flex items-center">
                <span className="w-2 h-2 bg-gradient-to-r from-buddy-green to-buddy-blue rounded-full mr-2"></span>
                Interests & Passions
              </h3>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="py-1 px-3 rounded-xl bg-gradient-to-r from-buddy-purple/10 to-buddy-blue/10 text-buddy-purple border-2 border-buddy-purple/20 hover:from-buddy-purple/20 hover:to-buddy-blue/20 transition-all duration-300 transform hover:scale-105 hover:translate-y-[-2px] font-semibold text-sm"
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements */}
          {achievements.length > 0 && (
            <div className="mb-4">
              <div className="bg-gradient-to-r from-amber-50/50 to-orange-50/50 p-4 rounded-2xl border border-amber-200/50">
                <h3 className="text-lg font-bold text-buddy-gray-900 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mr-2"></span>
                  Achievements & Badges
                </h3>
                <div className="flex flex-wrap gap-3">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gradient-to-r from-amber-100/80 to-orange-100/80 rounded-xl py-2 px-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:translate-y-[-2px] hover:scale-105 border border-amber-200/50"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 flex items-center justify-center">
                        <Award className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold text-amber-800 text-sm">
                        {achievement.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProfileCard;
