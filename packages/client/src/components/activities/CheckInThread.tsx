import React, { useState } from "react";
import { Card } from "@/components/common/Card";
import { Heart, Clock } from "lucide-react";
import Avatar from "@/components/common/Avatar";

interface CheckInThreadProps {
  checkIn: {
    id: string;
    user: {
      name: string;
      avatar: string;
    };
    content: string;
    image?: string;
    time: string;
    likes: number;
    comments: number;
  };
}

const CheckInThread: React.FC<CheckInThreadProps> = ({ checkIn }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(checkIn.likes);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiked) {
      setLikeCount((prev) => prev - 1);
    } else {
      setLikeCount((prev) => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 rounded-xl border border-buddy-gray-200">
      <div className="p-4">
        <div className="flex items-center mb-3">
          <Avatar
            src={checkIn.user.avatar}
            alt={checkIn.user.name}
            size="sm"
            className="mr-3"
          />
          <div>
            <h4 className="font-medium text-buddy-gray-800">
              {checkIn.user.name}
            </h4>
            <div className="flex items-center text-xs text-buddy-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              <span>{checkIn.time}</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-buddy-gray-700 mb-3">{checkIn.content}</p>

        {checkIn.image && (
          <div className="mb-3 rounded-lg overflow-hidden">
            <img
              src={checkIn.image}
              alt="Check-in media"
              className="w-full h-48 object-cover"
            />
          </div>
        )}

        <div className="flex items-center text-sm text-buddy-gray-500 gap-4">
          <button
            className={`flex items-center gap-1 ${isLiked ? "text-red-500" : ""}`}
            onClick={handleLike}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500" : ""}`} />
            <span>{likeCount}</span>
          </button>
        </div>
      </div>
    </Card>
  );
};

export default CheckInThread;
