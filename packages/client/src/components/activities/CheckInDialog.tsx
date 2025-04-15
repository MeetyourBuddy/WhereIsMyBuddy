import React, { useState } from "react";
import { CheckCircle, Camera, Video, Mic, Type } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "../ui/textarea";

interface CheckInDialogProps {
  children: React.ReactNode;
  onCheckInComplete?: () => void;
}

const CheckInDialog: React.FC<CheckInDialogProps> = ({
  children,
  onCheckInComplete,
}) => {
  const [open, setOpen] = useState(false);
  const [checkinType, setCheckinType] = useState<
    "text" | "image" | "video" | "audio"
  >("text");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckin = () => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setOpen(false);
      setMessage("");

      toast({
        title: "Check-in Successful!",
        description: "You've maintained your streak. Keep it up!",
        variant: "default",
      });

      if (onCheckInComplete) {
        onCheckInComplete();
      }
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-lg bg-white rounded-2xl border-0 shadow-lg p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-buddy-purple/10 to-buddy-blue/10 p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-buddy-gray-800">
              Check In Now
            </DialogTitle>
            <DialogDescription className="text-buddy-gray-600 sr-only">
              Share your progress or thoughts
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <Label className="block mb-2 text-buddy-gray-700">
              How would you like to check in today?
            </Label>
            <div className="flex flex-wrap gap-3">
              <Button
                variant={checkinType === "text" ? "default" : "outline"}
                onClick={() => setCheckinType("text")}
                className={
                  checkinType === "text"
                    ? "bg-gradient-to-r from-buddy-purple to-buddy-blue text-white"
                    : ""
                }
              >
                <Type className="mr-2 h-4 w-4" />
                Text
              </Button>
              <Button
                variant={checkinType === "image" ? "default" : "outline"}
                onClick={() => setCheckinType("image")}
                className={
                  checkinType === "image"
                    ? "bg-gradient-to-r from-buddy-purple to-buddy-blue text-white"
                    : ""
                }
              >
                <Camera className="mr-2 h-4 w-4" />
                Image
              </Button>
              {/* <Button 
                variant={checkinType === "video" ? "default" : "outline"} 
                onClick={() => setCheckinType("video")}
                className={checkinType === "video" ? "bg-gradient-to-r from-buddy-purple to-buddy-blue text-white" : ""}
              >
                <Video className="mr-2 h-4 w-4" />
                Video
              </Button> */}
              {/* <Button
                variant={checkinType === "audio" ? "default" : "outline"}
                onClick={() => setCheckinType("audio")}
                className={
                  checkinType === "audio"
                    ? "bg-gradient-to-r from-buddy-purple to-buddy-blue text-white"
                    : ""
                }
              >
                <Mic className="mr-2 h-4 w-4" />
                Audio
              </Button> */}
            </div>
          </div>

          <div className="mb-6">
            {checkinType === "text" && (
              <div>
                <Label
                  htmlFor="checkin-message"
                  className="block mb-2 text-buddy-gray-700"
                >
                  Share your progress or thoughts
                </Label>
                <Textarea
                  id="checkin-message"
                  placeholder="What did you accomplish today? How do you feel about your progress?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 h-[100px] rounded-xl border-buddy-gray-200 focus:border-buddy-purple focus:ring-buddy-purple/20"
                />
              </div>
            )}

            {checkinType === "image" && (
              <div className="border-2 border-dashed border-buddy-gray-300 rounded-lg p-8 text-center hover:border-buddy-purple/50 transition-colors">
                <Camera className="w-12 h-12 mx-auto mb-4 text-buddy-gray-400" />
                <p className="mb-2 text-buddy-gray-600">
                  Drag and drop an image, or click to browse
                </p>
                <p className="text-sm text-buddy-gray-500 mb-4">
                  PNG, JPG, or GIF up to 10MB
                </p>
                <Button variant="outline" className="rounded-xl">
                  Choose Image
                </Button>
              </div>
            )}

            {checkinType === "video" && (
              <div className="border-2 border-dashed border-buddy-gray-300 rounded-lg p-8 text-center hover:border-buddy-purple/50 transition-colors">
                <Video className="w-12 h-12 mx-auto mb-4 text-buddy-gray-400" />
                <p className="mb-2 text-buddy-gray-600">
                  Record a video or upload from your device
                </p>
                <p className="text-sm text-buddy-gray-500 mb-4">
                  Up to 60 seconds or 50MB
                </p>
                <div className="flex justify-center gap-3">
                  <Button variant="outline" className="rounded-xl">
                    Record
                  </Button>
                  <Button variant="outline" className="rounded-xl">
                    Upload
                  </Button>
                </div>
              </div>
            )}

            {checkinType === "audio" && (
              <div className="border-2 border-dashed border-buddy-gray-300 rounded-lg p-8 text-center hover:border-buddy-purple/50 transition-colors">
                <Mic className="w-12 h-12 mx-auto mb-4 text-buddy-gray-400" />
                <p className="mb-2 text-buddy-gray-600">
                  Record an audio message about your progress
                </p>
                <p className="text-sm text-buddy-gray-500 mb-4">
                  Up to 60 seconds or 10MB
                </p>
                <Button variant="outline" className="rounded-xl">
                  Start Recording
                </Button>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="p-6 pt-0">
          <Button
            onClick={handleCheckin}
            disabled={checkinType === "text" && !message.trim()}
            className="w-full sm:w-auto px-8 py-2 bg-gradient-to-r from-buddy-purple to-buddy-blue text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Complete Check-in
            {isSubmitting && (
              <span className="ml-2">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CheckInDialog;
