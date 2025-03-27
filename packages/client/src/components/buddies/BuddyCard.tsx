
import React from "react";
import { Card } from "@/components/common/Card";
import Avatar from "@/components/common/Avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, UserPlus, MessageCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface BuddyCardProps {
  id: string;
  name: string;
  image?: string;
  location?: string;
  bio?: string;
  interests: string[];
  mutualActivities?: number;
  mutualBuddies?: number;
  status?: "online" | "offline" | "away";
}

const BuddyCard = ({
  id,
  name,
  image,
  location,
  bio,
  interests,
  mutualActivities = 0,
  mutualBuddies = 0,
  status = "offline",
}: BuddyCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/profile/${id}`, { state: { fromApp: true } });
  };

  const handleButtonClick = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    console.log(`${action} for buddy: ${name}`);
    // Implement the action logic here
  };

  return (
    <Card 
      hover 
      className="h-full transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      <Card.Content className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar 
            size="md" 
            src={image}
            status={status}
            className="rounded-full"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-buddy-gray-900 truncate">{name}</h3>
            {location && (
              <div className="flex items-center text-sm text-buddy-gray-500 mt-1">
                <MapPin className="w-3.5 h-3.5 mr-1" />
                <span className="truncate">{location}</span>
              </div>
            )}
          </div>
        </div>
        
        {bio && (
          <p className="text-sm text-buddy-gray-600 mb-4 line-clamp-2">{bio}</p>
        )}
        
        <div className="flex flex-wrap gap-1.5 mb-4">
          {interests.slice(0, 3).map((interest, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="bg-buddy-gray-50 text-xs py-0.5 px-2"
            >
              {interest}
            </Badge>
          ))}
          {interests.length > 3 && (
            <Badge variant="outline" className="bg-buddy-gray-50 text-xs py-0.5 px-2">
              +{interests.length - 3} more
            </Badge>
          )}
        </div>
        
        <div className="flex justify-between text-xs text-buddy-gray-500 mb-5">
          <span>{mutualActivities} mutual activities</span>
          <span>{mutualBuddies} mutual buddies</span>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={(e) => handleButtonClick(e, "message")}
          >
            <MessageCircle className="w-4 h-4 mr-1.5" />
            Message
          </Button>
          <Button 
            variant="default"
            size="sm" 
            className="flex-1"
            onClick={(e) => handleButtonClick(e, "add buddy")}
          >
            <UserPlus className="w-4 h-4 mr-1.5" />
            Add Buddy
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
};

export default BuddyCard;
