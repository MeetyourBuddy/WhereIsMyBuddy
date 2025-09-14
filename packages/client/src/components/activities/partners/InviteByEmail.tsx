import React, { useState } from "react";
import { Mail, Send, CheckCircle, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { partnerService } from "@/services/api/activity/partner.service";

interface InviteByEmailProps {
  activityId: string;
  onInviteSent: () => void;
}

const InviteByEmail: React.FC<InviteByEmailProps> = ({
  activityId,
  onInviteSent,
}) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(
    "Hey! I'd love for you to be my accountability partner on this activity. Let's motivate each other to reach our goals together! 🎯"
  );
  const [isSending, setIsSending] = useState(false);
  const [emailError, setEmailError] = useState("");
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (value && !validateEmail(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleSendInvitation = async () => {
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setIsSending(true);
    try {
      await partnerService.createInvitation(activityId, {
        toEmail: email,
        message: message.trim() || undefined,
      });

      toast({
        title: "Invitation Sent!",
        description: `Partnership invitation sent to ${email}`,
      });

      onInviteSent();
      setEmail("");
      setMessage(
        "Hey! I'd love for you to be my accountability partner on this activity. Let's motivate each other to reach our goals together! 🎯"
      );
    } catch (error) {
      console.error("Invite failed:", error);
      toast({
        title: "Invitation Failed",
        description: "Unable to send invitation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Invite by Email
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          Send a partnership invitation to anyone via email. They'll need to
          sign up first if they're not already a member.
        </p>
      </div>

      <Card className="border border-gray-200 rounded-2xl p-6">
        <div className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="email"
                placeholder="friend@example.com"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                className={`pl-10 rounded-full border-gray-200 focus:border-buddy-purple focus:ring-buddy-purple/20 ${
                  emailError
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                    : ""
                }`}
              />
            </div>
            {emailError && (
              <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {emailError}
              </div>
            )}
          </div>

          {/* Optional Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Personal Message (Optional)
            </label>
            <Textarea
              placeholder="Add a personal message to your invitation..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="rounded-2xl border-gray-200 focus:border-buddy-purple focus:ring-buddy-purple/20 resize-none"
              rows={4}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500">
                💡 You can send this message as-is or customize it
              </p>
              <span className="text-xs text-gray-500">
                {message.length}/500 characters
              </span>
            </div>
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSendInvitation}
            disabled={!email.trim() || !!emailError || isSending}
            className="w-full rounded-full bg-gradient-to-r from-buddy-purple to-buddy-blue hover:from-buddy-purple/90 hover:to-buddy-blue/90"
          >
            {isSending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending Invitation...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Send Partnership Invitation
              </div>
            )}
          </Button>
        </div>
      </Card>

      {/* Email Invitation Info */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h5 className="font-medium text-green-900 mb-1">
              What happens next?
            </h5>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• They'll receive a personalized email invitation</li>
              <li>• If they're not a member, they'll be guided to sign up</li>
              <li>
                • After signing up, they can accept your partnership request
              </li>
              <li>• You'll be notified when they respond</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteByEmail;
