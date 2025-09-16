import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Share2,
  Copy,
  Check,
  QrCode,
  Link as LinkIcon,
  Smartphone,
  Globe,
  Users,
  Heart,
} from "lucide-react";
import QRCode from "react-qr-code";
import { useToast } from "@/hooks/use-toast";

interface ShareActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityUrl: string;
  activityTitle?: string;
}

const ShareActivityModal: React.FC<ShareActivityModalProps> = ({
  isOpen,
  onClose,
  activityUrl,
  activityTitle = "this activity",
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("qr");

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(activityUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Activity link has been copied to your clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy the link to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDownloadQR = () => {
    // Create a canvas element to convert QR code to image
    const svg = document.getElementById("qr-code-svg");
    if (svg) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const svgUrl = URL.createObjectURL(svgBlob);

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `activity-qr-${Date.now()}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();

        URL.revokeObjectURL(svgUrl);
      };

      img.src = svgUrl;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold bg-gradient-to-r from-buddy-purple to-buddy-blue bg-clip-text text-transparent">
            Share {activityTitle}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="qr" className="flex items-center gap-2">
              <QrCode className="w-4 h-4" />
              QR Code
            </TabsTrigger>
            <TabsTrigger value="link" className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              Link
            </TabsTrigger>
          </TabsList>

          <TabsContent value="qr" className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border-2 border-buddy-purple/20">
                <QRCode
                  id="qr-code-svg"
                  size={200}
                  value={activityUrl}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm text-buddy-gray-600">
                  Scan this QR code to view the activity
                </p>
                <Button
                  onClick={handleDownloadQR}
                  variant="outline"
                  size="sm"
                  className="text-buddy-purple border-buddy-purple/30 hover:bg-buddy-purple/10"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Download QR Code
                </Button>
              </div>
            </div>

            <Alert className="bg-amber-50 border-amber-200">
              <Smartphone className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>Tip:</strong> Hold your phone camera over the QR code to
                instantly open the activity page. Perfect for sharing in person!
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="link" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  value={activityUrl}
                  readOnly
                  className="flex-1 bg-buddy-gray-50 border-buddy-gray-200"
                />
                <Button
                  onClick={handleCopyLink}
                  variant={copied ? "default" : "outline"}
                  size="sm"
                  className={copied ? "bg-green-500 hover:bg-green-600" : ""}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-buddy-blue border-buddy-blue/30 hover:bg-buddy-blue/10"
                  onClick={() => {
                    window.open(
                      `mailto:?subject=Check out this activity&body=${activityUrl}`,
                      "_blank"
                    );
                  }}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Email
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-buddy-green border-buddy-green/30 hover:bg-buddy-green/10"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: `Check out ${activityTitle}`,
                        text: `Join me in this activity!`,
                        url: activityUrl,
                      });
                    } else {
                      handleCopyLink();
                    }
                  }}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <Globe className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Easy sharing:</strong> Copy the link to share via text,
                social media, or email. Works on any device!
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>

        <div className="pt-4 border-t border-buddy-gray-100">
          <Alert className="bg-gradient-to-r from-buddy-purple/5 to-buddy-blue/5 border-buddy-purple/20">
            <Users className="h-4 w-4 text-buddy-purple" />
            <AlertDescription className="text-buddy-gray-700">
              <strong>Grow your community:</strong> Share this activity to
              invite friends and build your buddy network. More participants =
              more fun! 💜
            </AlertDescription>
          </Alert>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareActivityModal;
