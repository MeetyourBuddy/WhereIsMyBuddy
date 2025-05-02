import React, { useState } from "react";
import { CheckCircle, Camera, Type, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "../ui/textarea";
import { CheckInService } from "@/services/api/checkin/checkin-service";

interface CheckInDialogProps {
  children: React.ReactNode;
  activityId: string;
  onCheckInComplete?: () => void;
}

export const CheckInDialog: React.FC<CheckInDialogProps> = ({
  children,
  activityId,
  onCheckInComplete,
}) => {
  const [open, setOpen] = useState(false);
  const [checkinType, setCheckinType] = useState<"text" | "image">("text");
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setCheckinType("image");
    }
  };

  const clearImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleCheckin = async () => {
    try {
      setIsSubmitting(true);
      console.log('ActivityId in CheckInDialog:', activityId);
      console.log('CheckInData:', {
        activityId,
        type: checkinType,
        content: message,
      });
      
      await CheckInService.createCheckIn(
        {
          activityId,
          type: checkinType,
          content: message,
        },
        selectedFile
      );

      toast({
        title: "Check-in Successful!",
        description: "You've maintained your streak. Keep it up!",
        variant: "default",
      });

      setOpen(false);
      setMessage("");
      clearImage();
      onCheckInComplete?.();
    } catch (error) {
      toast({
        title: "Check-in Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Check In Now</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">
              How would you like to check in today?
            </label>
            <div className="flex gap-2">
              <Button
                variant={checkinType === "text" ? "default" : "outline"}
                onClick={() => setCheckinType("text")}
                size="sm"
              >
                <Type className="w-4 h-4 mr-2" />
                Text
              </Button>
              <Button
                variant={checkinType === "image" ? "default" : "outline"}
                onClick={() => setCheckinType("image")}
                size="sm"
              >
                <Camera className="w-4 h-4 mr-2" />
                Image
              </Button>
            </div>
          </div>

          <Textarea
            placeholder="Share your progress or thoughts..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px]"
          />

          {checkinType === "image" && (
            <div className="mt-4">
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="rounded-lg object-cover w-[300px] h-[200px]"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={clearImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer block p-4"
                  >
                    <Camera className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      Click to upload an image
                    </p>
                  </label>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={handleCheckin}
            disabled={!message.trim() || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2">⏳</span>
                Submitting...
              </span>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Check-in
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
