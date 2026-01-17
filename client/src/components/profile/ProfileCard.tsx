import React, { useRef, useState, useEffect } from "react";
import { Card } from "@/components/common/Card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Heart,
  Star,
  Sparkles,
  Crown,
  Shield,
  Zap,
  Flame,
  Rocket,
  Gift,
  Rainbow,
  Lightbulb,
  Target,
  Compass,
  Globe,
  Smartphone,
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
import { useAuth } from "@/store/auth.store";
import { postAuthIntent } from "@/lib/post-auth-intent";
import { useNavigate } from "react-router-dom";
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

// Array of beautiful header background images
const HEADER_IMAGES = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=400&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=400&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&h=400&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=400&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop&crop=center",
];

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
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const isGuest = !isAuthenticated;
  const [copied, setCopied] = useState(false);
  const [headerImage, setHeaderImage] = useState("");
  const [activeTab, setActiveTab] = useState("qr");
  const profileUrl = `${window.location.origin}/profile/${id}`;

  // Generate random header image on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * HEADER_IMAGES.length);
    setHeaderImage(HEADER_IMAGES[randomIndex]);
  }, [id]); // Re-randomize when profile ID changes

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
        {/* Cover Image with Randomized Background */}
        <div className="relative h-72 overflow-hidden">
          {headerImage ? (
            <div
              className="w-full h-full bg-cover bg-center transform group-hover:scale-110 transition-transform duration-1000 ease-out"
              style={{ backgroundImage: `url(${headerImage})` }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-buddy-purple via-buddy-blue to-buddy-green flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-buddy-purple/20 via-buddy-blue/20 to-buddy-green/20"></div>
              <span className="text-8xl animate-bounce relative z-10 filter drop-shadow-lg">
                👤
              </span>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 backdrop-blur-[1px]"></div>

          {/* Floating elements for visual interest */}
          <div className="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-8 left-8 w-6 h-6 bg-white/5 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-6 w-3 h-3 bg-white/15 rounded-full animate-ping"></div>
          <div className="absolute top-8 left-8 w-8 h-8 bg-white/5 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-6 right-8 w-4 h-4 bg-white/10 rounded-full animate-bounce delay-500"></div>
        </div>

        <div className="relative px-6 pb-6 -mt-20">
          {/* Profile Avatar with Enhanced Design */}
          <div className="flex justify-between items-end mb-6">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-white rounded-full shadow-2xl transform group-hover:scale-110 transition-all duration-500">
                <AvatarImage
                  src={image}
                  alt={name || "User avatar"}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-buddy-purple to-buddy-orange text-white font-semibold text-2xl">
                  {name ? name.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-r from-buddy-green to-buddy-blue rounded-full border-3 border-white flex items-center justify-center shadow-lg">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              </div>
              {/* Additional decorative elements */}
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-r from-buddy-purple/20 to-buddy-blue/20 rounded-full animate-pulse"></div>
              <div className="absolute -top-1 -right-3 w-4 h-4 bg-gradient-to-r from-buddy-green/20 to-buddy-orange/20 rounded-full animate-bounce delay-300"></div>
            </div>

            <div className="flex space-x-3">
              {isGuest ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-2 border-buddy-purple/30 hover:bg-buddy-purple/10 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                    onClick={() => {
                      postAuthIntent.set({
                        type: "connect-buddy",
                        userId: id,
                        returnTo: `/profile/${id}`,
                      });
                      localStorage.setItem("returnToAfterAuth", `/profile/${id}`);
                      navigate("/signin");
                    }}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Sign in to message
                  </Button>

                  <Button
                    size="sm"
                    className="rounded-full bg-gradient-to-r from-buddy-purple to-buddy-blue text-white shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold"
                    onClick={() => {
                      postAuthIntent.set({
                        type: "connect-buddy",
                        userId: id,
                        returnTo: `/profile/${id}`,
                      });
                      localStorage.setItem("returnToAfterAuth", `/profile/${id}`);
                      navigate("/signup");
                    }}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Sign in to connect
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-2 border-buddy-purple/30 hover:bg-buddy-purple/30 transition-all duration-300 transform hover:scale-105 hover:translate-y-[-2px] font-semibold shadow-lg hover:shadow-xl"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>

                  <Button
                    size="sm"
                    className="rounded-full bg-gradient-to-r from-buddy-purple to-buddy-blue text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:translate-y-[-2px] font-semibold"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Buddy
                  </Button>
                </>
              )}

              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-md hover:from-white/30 hover:to-white/20 transition-all duration-300 transform hover:scale-110 hover:rotate-12 shadow-lg"
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
                        <Link className="w-4 h-4" />
                        Link
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="qr" className="mt-6">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="bg-white p-6 rounded-2xl mb-4 relative shadow-lg border border-buddy-gray-200 transform hover:scale-105 transition-all duration-300">
                          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-5">
                            <div className="text-buddy-purple text-8xl font-bold">
                              {name.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <QRCode
                            size={200}
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
                            className="text-buddy-purple border-buddy-purple/30 hover:bg-buddy-purple/10 rounded-full transition-all duration-300 transform hover:scale-105"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Image
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-buddy-blue border-buddy-blue/30 hover:bg-buddy-blue/10 rounded-full transition-all duration-300 transform hover:scale-105"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Download QR
                          </Button>
                        </div>
                      </div>

                      <Alert className="bg-amber-50 border-amber-200 mt-4">
                        <Smartphone className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-amber-800">
                          <strong>Tip:</strong> Hold your phone camera over the
                          QR code to instantly open {name}'s profile. Perfect
                          for sharing in person!
                        </AlertDescription>
                      </Alert>
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
                              copied
                                ? "bg-green-500 hover:bg-green-600 rounded-full transition-all duration-300 transform hover:scale-105"
                                : "rounded-full transition-all duration-300 transform hover:scale-105"
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

                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-buddy-blue border-buddy-blue/30 hover:bg-buddy-blue/10 rounded-full transition-all duration-300 transform hover:scale-105"
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
                            className="text-buddy-green border-buddy-green/30 hover:bg-buddy-green/10 rounded-full transition-all duration-300 transform hover:scale-105"
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

                      <Alert className="bg-blue-50 border-blue-200 mt-4">
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
                      <Heart className="h-4 w-4 text-buddy-purple" />
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

          {/* Profile Details with Enhanced Design */}
          <div className="mb-6">
            <div className="bg-gradient-to-r from-buddy-purple/5 to-buddy-blue/5 p-6 rounded-2xl border border-buddy-purple/10 shadow-lg hover:shadow-xl transition-all duration-300">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-buddy-purple to-buddy-blue bg-clip-text text-transparent mb-2">
                {name}
              </h1>
              <p className="text-buddy-gray-600 text-lg font-medium mb-4 flex items-center">
                <span className="w-2 h-2 bg-gradient-to-r from-buddy-purple to-buddy-blue rounded-full mr-2"></span>
                @{username}
              </p>

              <p className="text-buddy-gray-700 text-lg leading-relaxed font-medium mb-6">
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

          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-gradient-to-br from-buddy-purple/10 to-buddy-blue/10 rounded-2xl p-6 text-center border border-buddy-purple/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:translate-y-[-2px] group">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-buddy-purple/20 to-buddy-blue/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8 text-buddy-purple" />
              </div>
              <span className="block text-3xl font-bold bg-gradient-to-r from-buddy-purple to-buddy-blue bg-clip-text text-transparent">
                {activityCount}
              </span>
              <span className="text-buddy-gray-700 text-lg font-semibold">
                Activities
              </span>
              <p className="text-buddy-gray-500 text-sm mt-2">
                Amazing journey! 🚀
              </p>
            </div>

            <div className="bg-gradient-to-br from-buddy-green/10 to-buddy-blue/10 rounded-2xl p-6 text-center border border-buddy-green/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:translate-y-[-2px] group">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-buddy-green/20 to-buddy-blue/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-8 h-8 text-buddy-green" />
              </div>
              <span className="block text-3xl font-bold bg-gradient-to-r from-buddy-green to-buddy-blue bg-clip-text text-transparent">
                {buddyCount}
              </span>
              <span className="text-buddy-gray-700 text-lg font-semibold">
                Buddies
              </span>
              <p className="text-buddy-gray-500 text-sm mt-2">
                Great connections! 💜
              </p>
            </div>
          </div>

          {/* Enhanced Interests */}
          <div className="mb-6">
            <div className="bg-gradient-to-r from-buddy-green/5 to-buddy-blue/5 p-6 rounded-2xl border border-buddy-green/10 shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-buddy-gray-900 mb-4 flex items-center">
                <span className="w-3 h-3 bg-gradient-to-r from-buddy-green to-buddy-blue rounded-full mr-3 animate-pulse"></span>
                <Star className="w-5 h-5 text-buddy-green mr-2" />
                Interests & Passions
              </h3>
              <div className="flex flex-wrap gap-3">
                {interests.map((interest, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="py-2 px-4 rounded-full bg-gradient-to-r from-buddy-purple/10 to-buddy-blue/10 text-buddy-purple border-2 border-buddy-purple/20 hover:from-buddy-purple/20 hover:to-buddy-blue/20 transition-all duration-300 transform hover:scale-105 hover:translate-y-[-2px] font-semibold text-sm shadow-md hover:shadow-lg"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Achievements */}
          {achievements.length > 0 && (
            <div className="mb-6">
              <div className="bg-gradient-to-r from-amber-50/50 to-orange-50/50 p-6 rounded-2xl border border-amber-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-bold text-buddy-gray-900 mb-4 flex items-center">
                  <span className="w-3 h-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mr-3 animate-pulse"></span>
                  <Crown className="w-5 h-5 text-amber-600 mr-2" />
                  Achievements & Badges
                </h3>
                <div className="flex flex-wrap gap-4">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-gradient-to-r from-amber-100/80 to-orange-100/80 rounded-xl py-3 px-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:translate-y-[-2px] hover:scale-105 border border-amber-200/50 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Award className="w-5 h-5 text-white" />
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
