import React, { useState } from "react";
import { MessageCircle, Heart, Image } from "lucide-react";
import Avatar from "@/components/common/Avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckInService } from "@/services/api/checkin/checkin-service";
import { toast } from "@/components/ui/use-toast";

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
  const [imageOpen, setImageOpen] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await CheckInService.toggleLike(checkIn.id);
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-100">
      <div className="flex items-start gap-3">
        <Avatar src={checkIn.user.avatar} alt={checkIn.user.name} size="sm" />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-gray-900">{checkIn.user.name}</h4>
            <span className="text-sm text-gray-500">{checkIn.time}</span>
          </div>
          <p className="mt-1 text-gray-600">{checkIn.content}</p>
          
          {checkIn.image && (
            <div className="mt-3">
              <div 
                className="relative cursor-pointer overflow-hidden rounded-lg"
                onClick={() => setImageOpen(true)}
              >
                <img 
                  src={checkIn.image} 
                  alt="Check-in" 
                  className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors">
                  <Image className="w-6 h-6 text-white opacity-0 hover:opacity-100" />
                </div>
              </div>

              <Dialog open={imageOpen} onOpenChange={setImageOpen}>
                <DialogContent className="max-w-3xl p-0">
                  <img 
                    src={checkIn.image} 
                    alt="Check-in full size" 
                    className="w-full h-auto"
                  />
                </DialogContent>
              </Dialog>
            </div>
          )}

          <div className="flex items-center gap-4 mt-3">
            <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
              <Heart className="w-4 h-4" />
              <span className="text-sm">{likeCount}</span>
            </button>
            <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{checkIn.comments}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckInThread;
