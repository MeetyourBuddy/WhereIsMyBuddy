import React, { useState, useEffect } from "react";
import { Link2, Copy, Check, Share2, QrCode, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import QRCode from "react-qr-code";
import { partnerService } from "@/services/api/activity/partner.service";

interface InviteByLinkProps {
  activityId: string;
  onInviteSent: () => void;
}

const InviteByLink: React.FC<InviteByLinkProps> = ({
  activityId,
  onInviteSent,
}) => {
  const [inviteLink, setInviteLink] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [linkExpiry, setLinkExpiry] = useState<Date | null>(null);
  const { toast } = useToast();

  // Generate invite link
  const generateInviteLink = async () => {
    setIsGenerating(true);
    try {
      // Create a link invitation (no specific recipient)
      const invitation = await partnerService.createInvitation(activityId, {
        isLinkInvitation: "true", // Flag to indicate this is a link invitation
      });

      const baseUrl = window.location.origin;
      const link = `${baseUrl}/invite/partner/${invitation.invitationToken}`;
      setInviteLink(link);

      // Set expiry date from the invitation
      const expiry = new Date(invitation.expiresAt);
      setLinkExpiry(expiry);

      toast({
        title: "Invite Link Generated!",
        description: "Your partnership invitation link is ready to share",
      });

      // Don't call onInviteSent() here as it closes the modal
      // The link generation is just for display, not sending
    } catch (error) {
      console.error("Link generation failed:", error);
      toast({
        title: "Link Generation Failed",
        description: "Unable to generate invite link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy link to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setIsCopied(true);
      toast({
        title: "Link Copied!",
        description: "Partnership invitation link copied to clipboard",
      });

      setTimeout(() => setIsCopied(false), 3000);
    } catch (error) {
      console.error("Copy failed:", error);
      toast({
        title: "Copy Failed",
        description: "Unable to copy link. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Share via native share API
  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join me as an accountability partner!",
          text: "I'd like you to be my accountability partner on this activity. Join me!",
          url: inviteLink,
        });
      } catch (error) {
        console.error("Share failed:", error);
      }
    } else {
      // Fallback to copy
      copyToClipboard();
    }
  };

  const handleDownloadQR = () => {
    // Create a canvas element to convert QR code to image
    const svg = document.getElementById("partner-qr-code-svg");
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
        downloadLink.download = `partner-invite-qr-${Date.now()}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();

        URL.revokeObjectURL(svgUrl);
      };

      img.src = svgUrl;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <Link2 className="w-4 h-4" />
          Share Invitation Link
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          Create a shareable link that anyone can use to join as your
          accountability partner.
        </p>
      </div>

      {!inviteLink ? (
        <Card className="border border-gray-200 rounded-2xl p-6 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-buddy-purple/20 to-buddy-blue/20 rounded-full flex items-center justify-center mx-auto">
              <Link2 className="w-8 h-8 text-buddy-purple" />
            </div>

            <div>
              <h5 className="font-medium text-gray-900 mb-2">
                Generate Invitation Link
              </h5>
              <p className="text-sm text-gray-600 mb-4">
                Create a unique link that you can share with anyone. They'll be
                able to join as your accountability partner.
              </p>
            </div>

            <Button
              onClick={generateInviteLink}
              disabled={isGenerating}
              className="rounded-full bg-gradient-to-r from-buddy-purple to-buddy-blue hover:from-buddy-purple/90 hover:to-buddy-blue/90"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4" />
                  Generate Link
                </div>
              )}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Generated Link */}
          <Card className="border border-gray-200 rounded-2xl p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="font-medium text-gray-900">
                  Your Invitation Link
                </h5>
                {linkExpiry && (
                  <Badge variant="outline" className="text-xs">
                    Expires {linkExpiry.toLocaleDateString()}
                  </Badge>
                )}
              </div>

              <div className="flex gap-2">
                <Input
                  value={inviteLink}
                  readOnly
                  className="flex-1 rounded-full bg-gray-50 border-gray-200"
                />
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                  className="rounded-full px-4"
                >
                  {isCopied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={shareLink}
                  variant="outline"
                  className="flex-1 rounded-full"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button
                  onClick={() => window.open(inviteLink, "_blank")}
                  variant="outline"
                  className="flex-1 rounded-full"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
            </div>
          </Card>

          {/* QR Code */}
          <Card className="border border-gray-200 rounded-2xl p-6">
            <div className="text-center space-y-4">
              <h5 className="font-medium text-gray-900">QR Code</h5>
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-xl shadow-sm border-2 border-buddy-purple/20">
                  {inviteLink ? (
                    <QRCode
                      id="partner-qr-code-svg"
                      size={200}
                      value={inviteLink}
                      style={{
                        height: "auto",
                        maxWidth: "100%",
                        width: "100%",
                      }}
                    />
                  ) : (
                    <div className="w-[200px] h-[200px] flex items-center justify-center text-gray-400 text-sm">
                      Generate link first
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-gray-600">
                  Scan this QR code to access the invitation link
                </p>
                {inviteLink && (
                  <Button
                    onClick={handleDownloadQR}
                    variant="outline"
                    size="sm"
                    className="text-buddy-purple border-buddy-purple/30 hover:bg-buddy-purple/10 rounded-full"
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    Download QR Code
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Link Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <h5 className="font-medium text-blue-900 mb-2">How it works</h5>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                • Share this link with anyone via text, email, or social media
              </li>
              <li>
                • When they click the link, they'll see your partnership
                invitation
              </li>
              <li>
                • If they're not a member, they'll be guided to sign up first
              </li>
              <li>
                • After signing up, they can accept your partnership request
              </li>
              <li>• The link expires in 7 days for security</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default InviteByLink;
