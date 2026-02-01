import React, { useState, useEffect } from "react";
import { Mail, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InviteByEmail from "./InviteByEmail";
import InvitationList from "./InvitationList";
import { JoinRequestList } from "./JoinRequestList";
import { activityInvitationService } from "@/services/api/activity/activity-invitation.service";
import { activityJoinRequestService, ActivityJoinRequest } from "@/services/api/activity/activity-join-request.service";
import { useToast } from "@/hooks/use-toast";

interface InviteMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityId: string;
  onInviteSent: () => void;
}

const InviteMembersModal: React.FC<InviteMembersModalProps> = ({
  isOpen,
  onClose,
  activityId,
  onInviteSent,
}) => {
  const [activeTab, setActiveTab] = useState("email");
  const [invitations, setInvitations] = useState<any[]>([]);
  const [joinRequests, setJoinRequests] = useState<ActivityJoinRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const { toast } = useToast();

  // Fetch invitations when modal opens
  useEffect(() => {
    if (isOpen && activityId) {
      fetchInvitations();
      fetchJoinRequests();
    }
  }, [isOpen, activityId]);

  const fetchJoinRequests = async () => {
    try {
      setIsLoadingRequests(true);
      const res = await activityJoinRequestService.getRequests(activityId);
      if (res.success && Array.isArray(res.data)) {
        setJoinRequests(res.data);
      } else {
        setJoinRequests([]);
      }
    } catch {
      setJoinRequests([]);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const fetchInvitations = async () => {
    try {
      setIsLoading(true);
      const response = await activityInvitationService.getInvitations(activityId);
      if (response.success) {
        setInvitations(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error("Failed to fetch invitations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteSent = () => {
    fetchInvitations(); // Refresh invitations list
    onInviteSent();
  };

  const handleDeleteInvitation = async (invitationId: string) => {
    try {
      await activityInvitationService.deleteInvitation(activityId, invitationId);
      toast({
        title: "Invitation deleted",
        description: "The invitation has been removed",
      });
      fetchInvitations(); // Refresh list
    } catch (error: any) {
      toast({
        title: "Failed to delete",
        description: error.message || "Could not delete invitation",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-buddy-purple to-buddy-blue bg-clip-text text-transparent">
            Invite Members to Activity
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 rounded-full bg-gray-100 p-1 mb-6">
              <TabsTrigger
                value="email"
                className="rounded-full data-[state=active]:bg-buddy-purple data-[state=active]:text-white"
              >
                <Mail className="w-4 h-4 mr-2" />
                Invite by Email
              </TabsTrigger>
              <TabsTrigger
                value="list"
                className="rounded-full data-[state=active]:bg-buddy-purple data-[state=active]:text-white"
              >
                Invitations ({invitations.length})
              </TabsTrigger>
              <TabsTrigger
                value="requests"
                className="rounded-full data-[state=active]:bg-buddy-purple data-[state=active]:text-white"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Join requests ({joinRequests.filter((r) => r.status === "pending").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-6">
              <InviteByEmail
                activityId={activityId}
                onInviteSent={handleInviteSent}
              />
            </TabsContent>

            <TabsContent value="list" className="space-y-6">
              <InvitationList
                invitations={invitations}
                isLoading={isLoading}
                onDelete={handleDeleteInvitation}
                onRefresh={fetchInvitations}
              />
            </TabsContent>

            <TabsContent value="requests" className="space-y-6">
              <JoinRequestList
                activityId={activityId}
                requests={joinRequests}
                isLoading={isLoadingRequests}
                onRefresh={fetchJoinRequests}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose} className="rounded-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMembersModal;

