import React from "react";
import { Mail, Clock, CheckCircle, X, Trash2, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Avatar from "@/components/common/Avatar";

interface Invitation {
  _id: string;
  toEmail?: string;
  toUser?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  message?: string;
  status: "pending" | "accepted" | "declined" | "expired";
  createdAt: string;
  expiresAt: string;
}

interface InvitationListProps {
  invitations: Invitation[];
  isLoading: boolean;
  onDelete: (invitationId: string) => void;
  onRefresh: () => void;
}

const InvitationList: React.FC<InvitationListProps> = ({
  invitations,
  isLoading,
  onDelete,
  onRefresh,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "accepted":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Accepted
          </Badge>
        );
      case "declined":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <X className="w-3 h-3 mr-1" />
            Declined
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            <Clock className="w-3 h-3 mr-1" />
            Expired
          </Badge>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-buddy-purple border-t-transparent"></div>
      </div>
    );
  }

  if (invitations.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          No Invitations Yet
        </h3>
        <p className="text-sm text-gray-600">
          Start inviting members to your private activity using the "Invite by Email" tab.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-800">
          Invitation History ({invitations.length})
        </h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          className="rounded-full"
        >
          Refresh
        </Button>
      </div>

      <div className="space-y-3">
        {invitations.map((invitation) => (
          <Card
            key={invitation._id}
            className="p-4 border border-gray-200 rounded-xl"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                {invitation.toUser ? (
                  <Avatar
                    src={invitation.toUser.avatar}
                    alt={invitation.toUser.name}
                    size="sm"
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-buddy-purple/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-buddy-purple" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="font-medium text-gray-900">
                      {invitation.toUser?.name || invitation.toEmail}
                    </h5>
                    {getStatusBadge(invitation.status)}
                  </div>
                  
                  {invitation.toUser && (
                    <p className="text-sm text-gray-500 mb-1">
                      {invitation.toUser.email}
                    </p>
                  )}

                  {invitation.message && (
                    <p className="text-sm text-gray-600 mt-2 italic">
                      "{invitation.message}"
                    </p>
                  )}

                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>
                      Sent: {format(new Date(invitation.createdAt), "MMM d, yyyy")}
                    </span>
                    {invitation.status === "pending" && (
                      <span>
                        Expires: {format(new Date(invitation.expiresAt), "MMM d, yyyy")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {invitation.status === "pending" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(invitation._id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InvitationList;

