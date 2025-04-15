
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
  ExternalLink
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import QRCode from "react-qr-code";

interface ProfileCardProps {
  id: string;
  name: string;
  username: string;
  bio: string;
  image?: string;
  location?: string;
  interests: string[];
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
      <Card className="overflow-hidden border border-white/90 shadow-lg rounded-2xl backdrop-blur-md bg-white/90 transition-all duration-300 hover:shadow-xl">
        {/* Cover Image */}
        <div className="h-52 bg-gradient-to-r from-pastel-purple to-pastel-blue relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNGRkZGRkYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoM3YzaC0zem0tNi0zMWgzdjNoLTN6TTE3IDE3aDN2M2gtM3pNMzYgMTdoM3YzaC0zeiIvPjwvZz48L2c+PC9zdmc+')] opacity-80"></div>
        </div>
        
        <div className="relative px-6 pb-6 -mt-16">
          {/* Profile Avatar */}
          <div className="flex justify-between items-end mb-4">
            <Avatar 
              size="xl" 
              status="online" 
              src={image}
              className="border-4 border-white rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300"
            />
            
            <div className="flex space-x-2">
              {showJoinButton ? (
                <Button size="sm" className="rounded-full bg-gradient-to-r from-buddy-purple to-buddy-blue text-white shadow-md hover:shadow-lg transition-all duration-300">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join Now
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="rounded-full hover:bg-buddy-purple/10 transition-colors duration-300">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
              )}
              
              <Button size="sm" className="rounded-full bg-gradient-to-r from-buddy-purple to-buddy-blue text-white shadow-md hover:shadow-lg transition-all duration-300">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Buddy
              </Button>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full hover:bg-buddy-purple/10 transition-colors duration-300">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="border-l border-white/20 backdrop-blur-md bg-white/95">
                  <SheetHeader>
                    <SheetTitle className="text-xl font-bold bg-gradient-to-r from-buddy-purple to-buddy-blue bg-clip-text text-transparent">Share Profile</SheetTitle>
                  </SheetHeader>
                  <div className="py-6 flex flex-col items-center">
                    <div className="bg-white p-5 rounded-2xl mb-4 relative shadow-md">
                      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-10">
                        <div className="text-buddy-purple text-9xl font-bold">B</div>
                      </div>
                      <QRCode 
                        size={200} 
                        value={profileUrl} 
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                      />
                    </div>
                    
                    <p className="text-sm text-buddy-gray-600 mb-6">
                      Scan this QR code to view {name}'s profile
                    </p>
                    
                    <div className="flex flex-col w-full space-y-4">
                      <div className="flex items-center border rounded-lg p-2 bg-buddy-gray-50/80 backdrop-blur-sm">
                        <input 
                          type="text" 
                          value={profileUrl} 
                          readOnly 
                          className="flex-1 bg-transparent border-none focus:outline-none px-2 py-1 text-sm"
                        />
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={copyToClipboard}
                          className="text-buddy-purple"
                        >
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="rounded-lg hover:bg-buddy-purple/10 transition-all duration-300"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Image
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="rounded-lg hover:bg-buddy-blue/10 transition-all duration-300"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Download QR
                        </Button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          
          {/* Profile Details */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-buddy-purple to-buddy-blue bg-clip-text text-transparent">{name}</h1>
            <p className="text-buddy-gray-600 text-sm">@{username}</p>
            
            <p className="mt-4 text-buddy-gray-700">{bio}</p>
            
            <div className="flex items-center mt-3 text-buddy-gray-600 text-sm">
              <MapPin className="w-4 h-4 mr-1 text-buddy-purple/70" />
              {location || "No location set"}
            </div>
            
            <div className="flex items-center mt-1 text-buddy-gray-600 text-sm">
              <Calendar className="w-4 h-4 mr-1 text-buddy-purple/70" />
              Joined {joinedDate}
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-pastel-purple to-pastel-blue/40 rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105">
              <span className="block text-2xl font-bold text-buddy-purple">{activityCount}</span>
              <span className="text-buddy-gray-700 text-sm">Activities</span>
            </div>
            
            <div className="bg-gradient-to-br from-pastel-blue to-pastel-purple/40 rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105">
              <span className="block text-2xl font-bold text-buddy-blue">{buddyCount}</span>
              <span className="text-buddy-gray-700 text-sm">Buddies</span>
            </div>
          </div>
          
          {/* Interests */}
          <div className="mb-6">
            <h3 className="font-medium text-buddy-gray-900 mb-3">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="py-1 px-3 rounded-full bg-pastel-purple/30 text-buddy-purple border-buddy-purple/20 hover:bg-pastel-purple/50 transition-colors duration-300"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Achievements */}
          {achievements.length > 0 && (
            <div>
              <h3 className="font-medium text-buddy-gray-900 mb-3">Achievements</h3>
              <div className="flex flex-wrap gap-3">
                {achievements.map((achievement, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-amber-100/80 rounded-full py-1 px-3 shadow-sm hover:shadow-md transition-all duration-300 transform hover:translate-y-[-2px]"
                  >
                    <Award className="w-4 h-4 text-amber-500" />
                    <span className="text-sm">{achievement.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProfileCard;
