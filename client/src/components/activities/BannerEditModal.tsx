import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, X, Check, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { UploadService } from "@/services/api/upload/upload-service";

interface BannerEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBanner: string;
  onBannerUpdate: (newBanner: string, bannerFile?: File) => void;
  activityId: string;
}

const getAvailableBanners = () => [
  {
    value:
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=2940",
    label: "Fitness & Health",
    preview:
      "https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=2940",
  },
  {
    value:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2940",
    label: "Nature & Outdoors",
    preview:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2940",
  },
  {
    value:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2940",
    label: "Learning & Education",
    preview:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2940",
  },
  {
    value:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940",
    label: "Technology & Innovation",
    preview:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940",
  },
  {
    value:
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=2940",
    label: "Art & Creativity",
    preview:
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=2940",
  },
  {
    value:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=2940",
    label: "Food & Cooking",
    preview:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=2940",
  },
];

const BannerEditModal: React.FC<BannerEditModalProps> = ({
  isOpen,
  onClose,
  currentBanner,
  onBannerUpdate,
  activityId,
}) => {
  const [selectedBanner, setSelectedBanner] = useState<string>(currentBanner);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [useCustomUpload, setUseCustomUpload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const availableBanners = getAvailableBanners();

  const handleBannerSelect = (bannerValue: string) => {
    setSelectedBanner(bannerValue);
    setUseCustomUpload(false);
    setBannerFile(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPG, PNG, GIF, etc.)",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      setBannerFile(file);
      setUseCustomUpload(true);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setSelectedBanner(previewUrl);
    }
  };

  const handleSave = async () => {
    if (!selectedBanner) {
      toast({
        title: "No banner selected",
        description: "Please select a banner or upload your own image",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      let urlToSave = selectedBanner;

      if (useCustomUpload && bannerFile) {
        const uploadResponse = await UploadService.uploadImage(bannerFile);
        urlToSave = UploadService.getImageUrl(uploadResponse.fileId);
      }

      await onBannerUpdate(urlToSave);
      toast({
        title: "Banner updated successfully",
        description: "Your activity banner has been updated",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Failed to update banner",
        description:
          "There was an error updating your banner. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedBanner(currentBanner);
    setBannerFile(null);
    setUseCustomUpload(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-2xl max-h-[min(90vh,90dvh)] overflow-hidden flex flex-col p-0 bg-gradient-to-br from-white/95 to-buddy-purple/5 backdrop-blur-sm border-2 border-white/20">
        <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
          <DialogTitle className="text-xl sm:text-2xl font-bold text-center bg-gradient-to-r from-buddy-purple to-buddy-blue bg-clip-text text-transparent">
            Edit Activity Banner
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-6">
          <div className="space-y-6 pb-4">
          {/* Current Banner Preview */}
          <div>
            <Label className="text-buddy-gray-700 font-semibold text-base mb-3 block">
              Current Banner Preview
            </Label>
            <div className="w-full h-32 rounded-2xl overflow-hidden border-2 border-buddy-gray-200/50">
              <img
                src={selectedBanner}
                alt="Banner preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Banner Options */}
          <div>
            <Label className="text-buddy-gray-700 font-semibold text-base mb-3 block">
              Choose a Banner
            </Label>

            {/* Default Banners */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {availableBanners.map((banner) => (
                <div
                  key={banner.value}
                  className={cn(
                    "relative border-2 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 aspect-video hover:shadow-lg hover:scale-105",
                    selectedBanner === banner.value && !useCustomUpload
                      ? "ring-2 ring-buddy-purple border-buddy-purple"
                      : "border-buddy-gray-200/50 hover:border-buddy-purple/50"
                  )}
                  onClick={() => handleBannerSelect(banner.value)}
                >
                  <img
                    src={banner.preview}
                    alt={banner.label}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white text-xs p-2">
                    <p className="font-medium">{banner.label}</p>
                  </div>
                  {selectedBanner === banner.value && !useCustomUpload && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-buddy-purple rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Custom Upload */}
            <div className="border-2 border-dashed border-buddy-gray-200/50 rounded-2xl p-6 transition-all duration-300 hover:border-buddy-purple/50 hover:shadow-lg">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-buddy-purple/10 to-buddy-blue/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-buddy-purple" />
                </div>
                <Label
                  htmlFor="banner-upload"
                  className="cursor-pointer text-buddy-gray-700 font-medium"
                >
                  Upload Your Own Banner
                </Label>
                <p className="text-sm text-buddy-gray-500 mt-1 mb-3">
                  JPG, PNG, or GIF up to 5MB
                </p>
                <Input
                  id="banner-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    document.getElementById("banner-upload")?.click()
                  }
                  className="rounded-full border-2 border-buddy-purple/30 text-buddy-purple hover:bg-buddy-purple/10 hover:border-buddy-purple/50 transition-all duration-300"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              </div>
            </div>

            {bannerFile && (
              <div className="mt-4 p-4 bg-gradient-to-br from-buddy-purple/10 to-buddy-blue/10 rounded-2xl border border-buddy-purple/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="w-5 h-5 text-buddy-purple" />
                    <div>
                      <p className="font-medium text-buddy-gray-800">
                        {bannerFile.name}
                      </p>
                      <p className="text-sm text-buddy-gray-500">
                        {Math.round(bannerFile.size / 1024)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setBannerFile(null);
                      setUseCustomUpload(false);
                      setSelectedBanner(currentBanner);
                    }}
                    className="text-buddy-gray-500 hover:text-buddy-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
          </div>
        </div>

        {/* Fixed footer */}
        <div className="flex-shrink-0 flex gap-4 p-6 pt-4 border-t border-buddy-gray-200/50">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="flex-1 rounded-full border-2 border-buddy-gray-300 text-buddy-gray-700 hover:bg-buddy-gray-50 hover:border-buddy-gray-400 transition-all duration-300 h-10 text-sm font-medium"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 rounded-full bg-gradient-to-r from-buddy-purple to-buddy-blue text-white hover:shadow-lg transition-all duration-300 hover:scale-105 h-10 text-sm font-semibold"
          >
            {isLoading ? "Saving..." : "Save Banner"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BannerEditModal;
