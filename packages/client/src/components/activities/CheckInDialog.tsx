import React, { useState } from "react";
import { CheckCircle, Camera, Type, X } from "lucide-react";
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
import { toast } from "@/hooks/use-toast";
import { Textarea } from "../ui/textarea";
import { CheckInService } from "@/services/api/checkin/checkin-service";

interface CheckInDialogProps {
  children: React.ReactNode;
  activityId: string;
  onCheckInComplete?: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_IMAGE_DIMENSION = 2048;

const validateImage = (file: File): Promise<string | null> => {
  return new Promise((resolve) => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      resolve('Please upload a JPG, PNG or GIF file');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      resolve('File size must be less than 5MB');
      return;
    }

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      if (img.width > MAX_IMAGE_DIMENSION || img.height > MAX_IMAGE_DIMENSION) {
        resolve(`Image dimensions must be ${MAX_IMAGE_DIMENSION}x${MAX_IMAGE_DIMENSION} or smaller`);
        return;
      }
      resolve(null);
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      resolve('Invalid image file');
    };
  });
};

export const CheckInDialog: React.FC<CheckInDialogProps> = ({
  children,
  activityId,
  onCheckInComplete,
}) => {
  console.log('CheckInDialog received activityId:', activityId);

  const [open, setOpen] = useState(false);
  const [checkinType, setCheckinType] = useState<"text" | "image">("text");
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const error = await validateImage(file);
    if (error) {
      toast({
        title: "Invalid Image",
        description: error,
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setCheckinType("image");
  };

  const clearImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleCheckin = async () => {
    if (!activityId) {
      toast({
        title: "Error",
        description: "Activity ID is missing",
        variant: "destructive",
      });
      return;
    }

    if (!message.trim() && !selectedFile) {
      toast({
        title: "Check-in Failed",
        description: "Please enter a message or upload an image",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      await CheckInService.createCheckIn(
        {
          activityId,
          type: checkinType,
          content: message.trim(),
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
      console.error('Check-in error:', error);
      toast({
        title: "Check-in Failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
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
          <DialogDescription>
            Share your progress or add a photo to your check-in.
          </DialogDescription>
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
