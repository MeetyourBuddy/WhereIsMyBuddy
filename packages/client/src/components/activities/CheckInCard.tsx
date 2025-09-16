import React, { useState } from "react";
import { Card } from "@/components/common/Card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Heart, Share, UserCheck, Calendar } from "lucide-react";
import Avatar from "@/components/common/Avatar";
import { Button } from "@/components/ui/button";
import CheckInDialog from "./CheckInDialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import CheckInThread from "./CheckInThread";
import { IActivityResult } from "@/types/activity-types";

interface CheckInCardProps {
  date: Date;
  title: string;
  description: string;
  image?: string;
  totalParticipants: number;
  checkedInParticipants: number;
  comments: number;
  likes: number;
  isCheckedIn?: boolean;
  activity: IActivityResult;
  checkIns: any[]; // Real check-in data from backend
}

const CheckInCard: React.FC<CheckInCardProps> = ({
  date,
  title,
  description,
  image,
  totalParticipants,
  checkedInParticipants,
  comments,
  likes,
  isCheckedIn = false,
  activity,
  checkIns,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [isThreadExpanded, setIsThreadExpanded] = useState(false);

  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const completionPercentage =
    (checkedInParticipants / totalParticipants) * 100;

  const handleLike = () => {
    if (isLiked) {
      setLikeCount((prev) => prev - 1);
    } else {
      setLikeCount((prev) => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  const defaultImage =
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80";

  // Use real check-in data passed from parent component
  // The checkIns prop should be passed from ActivityCheckin component

  const toggleThread = () => {
    setIsThreadExpanded(!isThreadExpanded);
  };

  return (
    <div className="mb-6 animate-fade-in transition-all duration-300">
      <Card className="overflow-hidden hover:shadow-md transition-all duration-300 rounded-2xl">
        <div className="cursor-pointer" onClick={toggleThread}>
          <div className="relative">
            <img
              src={image || defaultImage}
              alt={title}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4 text-white">
              <div className="flex items-center mb-1">
                <Calendar className="w-4 h-4 mr-2 text-white/80" />
                <span className="text-sm font-medium">{formattedDate}</span>
              </div>
              <h3 className="text-xl font-bold">{title}</h3>
            </div>
            {isCheckedIn && (
              <Badge className="absolute top-4 right-4 bg-buddy-green text-white">
                Completed
              </Badge>
            )}
          </div>

          <div className="p-4">
            <p className="text-sm text-buddy-gray-600 mb-4">{description}</p>

            <div className="mb-4">
              <div className="flex justify-between mb-1 text-sm">
                <span className="text-buddy-gray-600">
                  Participants checked in
                </span>
                <span className="font-medium">
                  {checkedInParticipants} of {totalParticipants}
                </span>
              </div>
              <Progress value={completionPercentage} className="h-2">
                <div
                  className="h-full bg-gradient-to-r from-buddy-purple to-buddy-blue rounded-full"
                  style={{ width: `${completionPercentage}%` }}
                />
              </Progress>
            </div>
          </div>
        </div>

        <div className="p-4 pt-0 flex justify-between items-center border-t border-buddy-gray-100">
          <div className="flex items-center text-sm text-buddy-gray-500">
            <UserCheck className="w-4 h-4 mr-1" />
            <span>{checkedInParticipants} checked in</span>
          </div>

          {!isCheckedIn && (
            <CheckInDialog activity={activity}>
              <Button className="bg-gradient-to-r from-buddy-purple to-buddy-blue text-white rounded-xl px-4 py-2 shadow-sm hover:shadow-md transition-all duration-300">
                Check In
              </Button>
            </CheckInDialog>
          )}
        </div>
      </Card>

      {isThreadExpanded && (
        <div className="mt-3 pl-4 border-l-2 border-buddy-purple/30 animate-slide-down">
          <div className="flex items-center mb-4 text-sm text-buddy-gray-500">
            <MessageCircle className="w-4 h-4 mr-1" />
            <span>{checkIns.length} check-ins for this day</span>
          </div>

          <div className="space-y-4">
            {checkIns.length > 0 ? (
              checkIns.map((checkIn) => (
                <CheckInThread key={checkIn._id} checkIn={checkIn} />
              ))
            ) : (
              <div className="text-center py-8 text-buddy-gray-500">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No check-ins yet for this day</p>
              </div>
            )}
          </div>

          {!isCheckedIn && (
            <div className="mt-4 flex justify-center">
              <CheckInDialog activity={activity}>
                <Button className="bg-gradient-to-r from-buddy-purple/80 to-buddy-blue/80 text-white rounded-xl px-6 py-2 shadow-sm hover:shadow-md transition-all duration-300">
                  Add Your Check-in
                </Button>
              </CheckInDialog>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckInCard;
