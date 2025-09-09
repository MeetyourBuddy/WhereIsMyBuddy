import React from "react";
import { Card } from "@/components/common/Card";
import { Clock } from "lucide-react";
import Avatar from "@/components/common/Avatar";
import ReactionButton from "./ReactionButton";

interface CheckInThreadProps {
  checkIn: {
    _id: string;
    user: {
      _id: string;
      name: string;
      avatar?: string;
    };
    content: string;
    imageUrl?: string;
    checkInDate: string;
    likes: number;
    comments?: number;
  };
}

const CheckInThread: React.FC<CheckInThreadProps> = ({ checkIn }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 rounded-lg border border-buddy-gray-200">
      <div className="p-3">
        <div className="flex items-center mb-2">
          <Avatar
            src={checkIn.user.avatar || "/default-avatar.png"}
            alt={checkIn.user.name}
            size="sm"
            className="mr-2"
          />
          <div>
            <h4 className="font-medium text-buddy-gray-800 text-sm">
              {checkIn.user.name}
            </h4>
            <div className="flex items-center text-xs text-buddy-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              <span>
                {new Date(checkIn.checkInDate).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-buddy-gray-700 mb-2 line-clamp-3">
          {checkIn.content}
        </p>

        {checkIn.imageUrl && (
          <div className="mb-2 rounded-md overflow-hidden">
            <img
              src={checkIn.imageUrl}
              alt="Check-in media"
              className="w-full h-24 object-cover"
            />
          </div>
        )}

        <div className="flex items-center text-xs text-buddy-gray-500 gap-3">
          <ReactionButton checkInId={checkIn._id} />
        </div>
      </div>
    </Card>
  );
};

export default CheckInThread;
