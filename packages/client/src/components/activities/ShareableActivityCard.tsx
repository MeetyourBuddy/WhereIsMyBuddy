
import React, { useState } from "react";
import { Card } from "@/components/common/Card";
import Avatar from "@/components/common/Avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Share2, 
  UserPlus, 
  Calendar, 
  Clock, 
  MapPin, 
  Users,
  Copy,
  Check,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import QRCode from "react-qr-code";

interface ShareableActivityCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  image?: string;
  location: string;
  date: string;
  time: string;
  duration: string;
  frequency: string;
  startDate: Date;
  endDate: Date;
  createdBy: {
    id: string;
    name: string;
    image?: string;
  };
  participants: {
    id: string;
    name: string;
    image?: string;
  }[];
  maxParticipants: number;
  progress?: number;
}

const ShareableActivityCard = ({
  id,
  title,
  description,
  category,
  image,
  location,
  date,
  time,
  duration,
  frequency,
  startDate,
  endDate,
  createdBy,
  participants = [],
  maxParticipants,
  progress = 0,
}: ShareableActivityCardProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const activityUrl = `${window.location.origin}/activity/${id}`;
  
  // Calculate category styles
  const getCategoryColor = (category: string) => {
    const categories: Record<string, string> = {
      "Fitness": "bg-buddy-green-light/60 text-buddy-green-dark border-buddy-green/20",
      "Technology": "bg-buddy-blue-light/60 text-buddy-blue-dark border-buddy-blue/20",
      "Music": "bg-buddy-purple-light/60 text-buddy-purple-dark border-buddy-purple/20",
      "Reading": "bg-buddy-orange-light/60 text-buddy-orange-dark border-buddy-orange/20",
      "default": "bg-pastel-purple/40 text-buddy-purple border-buddy-purple/20"
    };
    
    return categories[category.toLowerCase()] || categories.default;
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    const defaultIcon = "🏷️";
    
    const icons: Record<string, string> = {
      "Fitness": "🧘",
      "Technology": "💻",
      "Music": "🎵",
      "Reading": "📚",
      "Art": "🎨",
      "Cooking": "🍳",
      "Gaming": "🎮",
      "Language": "🗣️",
      "Photography": "📷",
      "Writing": "✍️",
      "Hiking": "🥾",
      "Dancing": "💃",
    };
    
    return icons[category.toLowerCase()] || defaultIcon;
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(activityUrl).then(() => {
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The activity link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    });
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
              <span className="text-6xl animate-pulse">{getCategoryIcon(category)}</span>
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
              {duration}
            </span>
            
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-white border border-white/30 transition-all duration-300 hover:bg-white/30 hover:shadow-md">
              {frequency}
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
                  <SheetTitle className="text-xl font-bold bg-gradient-to-r from-buddy-blue to-buddy-green bg-clip-text text-transparent">Share Activity</SheetTitle>
                </SheetHeader>
                <div className="py-6 flex flex-col items-center">
                  <div className="bg-white p-5 rounded-2xl mb-4 relative shadow-md">
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-10">
                      <div className="text-buddy-blue text-9xl font-bold">B</div>
                    </div>
                    <QRCode 
                      size={200} 
                      value={activityUrl} 
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    />
                  </div>
                  
                  <p className="text-sm text-buddy-gray-600 mb-6">
                    Scan this QR code to view this activity
                  </p>
                  
                  <div className="flex flex-col w-full space-y-4">
                    <div className="flex items-center border rounded-lg p-2 bg-buddy-gray-50/80 backdrop-blur-sm">
                      <input 
                        type="text" 
                        value={activityUrl} 
                        readOnly 
                        className="flex-1 bg-transparent border-none focus:outline-none px-2 py-1 text-sm"
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={copyToClipboard}
                        className="text-buddy-blue"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-lg hover:bg-buddy-blue/10 transition-all duration-300"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Image
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-lg hover:bg-buddy-green/10 transition-all duration-300"
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
          
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-2xl font-bold text-white mb-1 text-shadow">{title}</h1>
          </div>
        </div>
        
        <div className="p-6">
          <p className="text-buddy-gray-600 mb-6">{description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3 transform hover:translate-x-1 transition-transform duration-300">
              <div className="flex items-center text-buddy-gray-700 group">
                <MapPin className="w-4 h-4 mr-3 text-buddy-blue group-hover:text-buddy-blue-dark transition-colors duration-300" />
                <span className="group-hover:text-buddy-gray-900 transition-colors duration-300">{location}</span>
              </div>
              
              <div className="flex items-center text-buddy-gray-700 group">
                <Calendar className="w-4 h-4 mr-3 text-buddy-blue group-hover:text-buddy-blue-dark transition-colors duration-300" />
                <span className="group-hover:text-buddy-gray-900 transition-colors duration-300">{date}</span>
              </div>
              
              <div className="flex items-center text-buddy-gray-700 group">
                <Clock className="w-4 h-4 mr-3 text-buddy-blue group-hover:text-buddy-blue-dark transition-colors duration-300" />
                <span className="group-hover:text-buddy-gray-900 transition-colors duration-300">{time}</span>
              </div>
            </div>
            
            <div>
              <div className="mb-4 transform hover:translate-y-[-2px] transition-transform duration-300">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-buddy-gray-600">Activity Progress</span>
                  <span className="text-sm font-medium text-buddy-blue">{progress}%</span>
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
                  <span className="text-sm text-buddy-gray-700">{participants.length}/{maxParticipants} participants</span>
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
                src={createdBy.image}
                className="rounded-full border-2 border-white shadow-sm group-hover:shadow-md transition-all duration-300" 
              />
              <span className="ml-3 font-medium group-hover:text-buddy-blue transition-colors duration-300">{createdBy.name}</span>
            </div>
          </div>
          
          <div className="mt-6 flex gap-3">
            <Button 
              size="lg" 
              className="flex-1 bg-gradient-to-r from-buddy-blue to-buddy-green text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:translate-y-[-2px]"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Join Activity
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
