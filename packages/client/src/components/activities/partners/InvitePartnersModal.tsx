import React, { useState } from "react";
import { X, Search, Mail, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InviteBySearch from "./InviteBySearch";
import InviteByEmail from "./InviteByEmail";
import InviteByLink from "./InviteByLink";

interface InvitePartnersModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityId: string;
  onInviteSent: () => void;
}

const InvitePartnersModal: React.FC<InvitePartnersModalProps> = ({
  isOpen,
  onClose,
  activityId,
  onInviteSent,
}) => {
  const [activeTab, setActiveTab] = useState("search");

  const handleInviteSent = () => {
    onInviteSent();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-buddy-purple to-buddy-blue bg-clip-text text-transparent">
            Invite Accountability Partners
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
                value="search"
                className="rounded-full data-[state=active]:bg-buddy-purple data-[state=active]:text-white"
              >
                <Search className="w-4 h-4 mr-2" />
                Search Users
              </TabsTrigger>
              <TabsTrigger
                value="email"
                className="rounded-full data-[state=active]:bg-buddy-purple data-[state=active]:text-white"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email Invite
              </TabsTrigger>
              <TabsTrigger
                value="link"
                className="rounded-full data-[state=active]:bg-buddy-purple data-[state=active]:text-white"
              >
                <Link2 className="w-4 h-4 mr-2" />
                Share Link
              </TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-6">
              <InviteBySearch
                activityId={activityId}
                onInviteSent={handleInviteSent}
              />
            </TabsContent>

            <TabsContent value="email" className="space-y-6">
              <InviteByEmail
                activityId={activityId}
                onInviteSent={handleInviteSent}
              />
            </TabsContent>

            <TabsContent value="link" className="space-y-6">
              <InviteByLink
                activityId={activityId}
                onInviteSent={handleInviteSent}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose} className="rounded-full">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvitePartnersModal;
