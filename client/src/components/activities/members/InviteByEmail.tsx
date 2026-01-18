import React, { useState } from "react";
import { Mail, Send, AlertCircle, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { activityInvitationService } from "@/services/api/activity/activity-invitation.service";
import { useAuth } from "@/store/auth.store";

interface InviteByEmailProps {
  activityId: string;
  onInviteSent: () => void;
}

const InviteByEmail: React.FC<InviteByEmailProps> = ({
  activityId,
  onInviteSent,
}) => {
  const [email, setEmail] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [message, setMessage] = useState(
    "Hey! I'd love for you to join this private activity. Let's achieve our goals together! 🎯"
  );
  const [isSending, setIsSending] = useState(false);
  const [emailError, setEmailError] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (value && !validateEmail(value)) {
      setEmailError("Please enter a valid email address");
    } else if (
      value &&
      user?.email &&
      value.toLowerCase() === user.email.toLowerCase()
    ) {
      setEmailError("You cannot send an invitation to yourself");
    } else {
      setEmailError("");
    }
  };

  const handleAddEmail = () => {
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!trimmedEmail) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (user?.email && trimmedEmail === user.email.toLowerCase()) {
      setEmailError("You cannot send an invitation to yourself");
      return;
    }

    if (emails.includes(trimmedEmail)) {
      setEmailError("This email is already in the list");
      return;
    }

    setEmails([...emails, trimmedEmail]);
    setEmail("");
    setEmailError("");
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter((e) => e !== emailToRemove));
  };

  const handleSendInvitation = async () => {
    if (emails.length === 0) {
      setEmailError("Please add at least one email address");
      return;
    }

    setIsSending(true);
    try {
      await activityInvitationService.createInvitation(activityId, {
        emails,
        message: message.trim() || undefined,
      });

      toast({
        title: "Invitations Sent!",
        description: `Invitation(s) sent to ${emails.length} email(s)`,
      });

      onInviteSent();
      setEmail("");
      setEmails([]);
      setMessage(
        "Hey! I'd love for you to join this private activity. Let's achieve our goals together! 🎯"
      );
    } catch (error: any) {
      console.error("Invite failed:", error);
      toast({
        title: "Invitation Failed",
        description: error.message || "Unable to send invitation(s). Please try again.",
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
          Send invitations to join this private activity via email. They'll need to
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
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="email"
                  placeholder="friend@example.com"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAddEmail();
                    }
                  }}
                  className={`pl-10 rounded-full border-gray-200 focus:border-buddy-purple focus:ring-buddy-purple/20 ${
                    emailError
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : ""
                  }`}
                />
              </div>
              <Button
                onClick={handleAddEmail}
                disabled={!email.trim() || !!emailError}
                className="rounded-full"
              >
                Add
              </Button>
            </div>
            {emailError && (
              <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                {emailError}
              </div>
            )}
          </div>

          {/* Email List */}
          {emails.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invited Emails ({emails.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {emails.map((emailItem, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    {emailItem}
                    <button
                      onClick={() => handleRemoveEmail(emailItem)}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

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
            disabled={emails.length === 0 || isSending}
            className="w-full rounded-full bg-gradient-to-r from-buddy-purple to-buddy-blue hover:from-buddy-purple/90 hover:to-buddy-blue/90"
          >
            {isSending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending Invitations...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Send Invitations ({emails.length})
              </div>
            )}
          </Button>
        </div>
      </Card>

      {/* Email Invitation Info */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h5 className="font-medium text-green-900 mb-1">
              What happens next?
            </h5>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• They'll receive a personalized email invitation</li>
              <li>• If they're not a member, they'll be guided to sign up</li>
              <li>
                • After signing up, they can accept your invitation and join the activity
              </li>
              <li>• You'll see the invitation status in the Invitations tab</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteByEmail;

