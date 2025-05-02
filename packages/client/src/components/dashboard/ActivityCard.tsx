import React from "react";
import { Card } from "@/components/common/Card";
import Avatar from "@/components/common/Avatar";
import Button from "@/components/common/Button";
import { MapPin, Calendar, Clock, Users, ChevronRight } from "lucide-react";
import { User } from "@/types/auth-types";
import { IUserResponse } from "@/types/user-types";
import { formatDate } from "date-fns";

interface ActivityCardProps {
  title: string;
  description: string;
  avatar?: string;
  startDate: string;
  endDate?: string;
  category?: string;
  image?: string;
  participants: IUserResponse[];
  maxParticipants: number;
  onClick?: () => void;
}

const ActivityCard = ({
  title,
  description,
  avatar,
  startDate,
  endDate,
  category,
  image,
  participants,
  maxParticipants,
  onClick,
}: ActivityCardProps) => {
  // Calculate the images to display for group avatar

  console.log("details in activity card", category);
  const participantImages = participants.map((p) => p.avatar || "");

  // Determine category background color
  const getCategoryColor = (category: string) => {
    if (!category) return "bg-buddy-gray-200 text-buddy-gray-700";

    const categoryMap: Record<string, string> = {
      fitness: "bg-buddy-green-light/70 text-buddy-green-dark",
      technology: "bg-buddy-blue-light/70 text-buddy-blue-dark",
      reading: "bg-buddy-orange-light/70 text-buddy-orange-dark",
      art: "bg-buddy-pink-light/70 text-buddy-pink-dark",
      cooking: "bg-buddy-yellow-light/70 text-buddy-yellow-dark",
      language: "bg-buddy-green-light/70 text-buddy-green-dark",
      meditation: "bg-buddy-purple-light/70 text-buddy-purple-dark",
      finance: "bg-buddy-red-light/70 text-buddy-red-dark",
      default: "bg-buddy-gray-200 text-buddy-gray-700",
    };

    const normalizedCategory = category.toLowerCase().trim();
    return categoryMap[normalizedCategory] || categoryMap.default;
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    if (!category) return "🏷️";

    const defaultIcon = "🏷️";
    const iconMap: Record<string, string> = {
      fitness: "🏃",
      technology: "💻",
      reading: "📚",
      art: "🎨",
      cooking: "🍳",
      language: "🗣️",
      meditation: "🧘",
      finance: "💰",
      other: "🏷️",
    };

    const normalizedCategory = category.toLowerCase().trim();
    return iconMap[normalizedCategory] || defaultIcon;
  };

  // Helper function to safely parse dates
  const parseDate = (date: Date | string) => {
    if (date instanceof Date) return date;
    try {
      return new Date(date);
    } catch (e) {
      return null;
    }
  };

  return (
    <Card
      hover
      className="transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      <Card.Content className="p-0">
        {/* Activity Image */}
        <div className="relative h-40 overflow-hidden">
          {image ? (
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${image})` }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-buddy-gray-100 to-buddy-gray-200 flex items-center justify-center">
              <span className="text-4xl">{getCategoryIcon(category)}</span>
            </div>
          )}
          <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-black/0 via-black/0 to-black/30"></div>
          <div className="absolute top-3 left-3">
            {category && (
              <span
                className={`px-3 py-1 backdrop-blur-sm rounded-full text-xs font-medium flex items-center ${getCategoryColor(category)}`}
              >
                <span className="mr-1">{getCategoryIcon(category)}</span>
                {category}
              </span>
            )}
          </div>
          <div className="absolute top-3 right-3">
            <span className="bg-black/40 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
              {participants.length}/{maxParticipants} buddies
            </span>
          </div>
        </div>

        <div className="p-6 pb-4">
          <h3 className="text-xl font-semibold mb-2 text-buddy-gray-900">
            {title}
          </h3>
          <p className="text-buddy-gray-600 text-sm mb-4 line-clamp-2">
            {description}
          </p>

          <div className="space-y-2 mb-4">
            {/* <div className="flex items-center text-buddy-gray-700 text-sm">
              <MapPin className="w-4 h-4 mr-2 text-buddy-gray-500" />
              <span>{location}</span>
            </div> */}
            <div className="flex items-center text-buddy-gray-700 text-sm">
              <Calendar className="w-4 h-4 mr-2 text-buddy-gray-500" />
              <span>
                {startDate
                  ? formatDate(new Date(startDate), "MMM dd, yyyy")
                  : "Invalid date"}{" "}
                -{" "}
                {endDate
                  ? formatDate(new Date(endDate), "MMM dd, yyyy")
                  : "No end date"}
              </span>
            </div>
            {/* <div className="flex items-center text-buddy-gray-700 text-sm">
              <Clock className="w-4 h-4 mr-2 text-buddy-gray-500" />
              <span>{time}</span>
            </div> */}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-buddy-gray-100">
          <div className="flex items-center">
            <Avatar isGroup groupImages={participantImages} size="sm" />
            <span className="ml-3 text-sm font-medium text-buddy-gray-600">
              {participants.length > 0
                ? participants.length === 1
                  ? `${participants[0].name} is going`
                  : `${participants[0].name} and ${participants.length - 1} others`
                : "Be the first to join!"}
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-buddy-gray-500 hover:text-buddy-gray-900"
            onClick={(e) => {
              e.stopPropagation();
              // onClick && onClick();
            }}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
};

export default ActivityCard;
