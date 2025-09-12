import React, { useState, useEffect } from "react";
import {
  UserPlus,
  Mail,
  Link2,
  CheckCircle,
  Users,
  ArrowRight,
  Heart,
  Shield,
  Award,
  Flame,
  Search,
  Clock,
  UserCheck,
  UserX,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/store/auth.store";
import InvitePartnersModal from "./partners/InvitePartnersModal";

interface ActivityPartnersProps {
  activityId: string;
}

interface Partner {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  streak: number;
  progress: number;
  lastCheckIn: string;
  status: "active" | "pending" | "inactive";
  activities: number;
  totalCheckIns: number;
}

interface PartnerInvitation {
  id: string;
  fromUser: {
    id: string;
    name: string;
    avatar?: string;
  };
  message?: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
}

const ActivityPartners: React.FC<ActivityPartnersProps> = ({ activityId }) => {
  const [activeTab, setActiveTab] = useState("partners");
  const [partners, setPartners] = useState<Partner[]>([]);
  const [invitations, setInvitations] = useState<PartnerInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Mock partners data - replace with real API call
  useEffect(() => {
    const loadPartnersData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockPartners: Partner[] = [
          {
            id: "1",
            name: "Alex Johnson",
            email: "alex@example.com",
            avatar: "/placeholder.svg",
            streak: 7,
            progress: 76,
            lastCheckIn: "Today",
            status: "active",
            activities: 3,
            totalCheckIns: 45,
          },
          {
            id: "2",
            name: "Jamie Smith",
            email: "jamie@example.com",
            avatar: "/placeholder.svg",
            streak: 5,
            progress: 64,
            lastCheckIn: "Yesterday",
            status: "active",
            activities: 2,
            totalCheckIns: 32,
          },
          {
            id: "3",
            name: "Taylor Brown",
            email: "taylor@example.com",
            avatar: "/placeholder.svg",
            streak: 0,
            progress: 42,
            lastCheckIn: "3 days ago",
            status: "inactive",
            activities: 1,
            totalCheckIns: 18,
          },
          {
            id: "4",
            name: "Jordan Lee",
            email: "jordan@example.com",
            avatar: "/placeholder.svg",
            streak: 0,
            progress: 0,
            lastCheckIn: "",
            status: "pending",
            activities: 0,
            totalCheckIns: 0,
          },
        ];

        const mockInvitations: PartnerInvitation[] = [
          {
            id: "1",
            fromUser: {
              id: "5",
              name: "Sam Wilson",
              avatar: "/placeholder.svg",
            },
            message:
              "Hey! I'd love to be your accountability partner for this activity.",
            status: "pending",
            createdAt: "2024-01-15T10:30:00Z",
          },
        ];

        setPartners(mockPartners);
        setInvitations(mockInvitations);
      } catch (error) {
        console.error("Failed to load partners data:", error);
        toast({
          title: "Loading Failed",
          description: "Unable to load partners data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPartnersData();
  }, [activityId, toast]);

  const handleInviteSent = () => {
    // Refresh partners data after invitation sent
    // In real implementation, this would trigger a data refresh
    toast({
      title: "Invitation Sent!",
      description: "Your partnership invitation has been sent successfully",
    });
  };

  const handleInvitationResponse = async (
    invitationId: string,
    action: "accept" | "decline"
  ) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setInvitations((prev) =>
        prev.map((inv) =>
          inv.id === invitationId
            ? { ...inv, status: action === "accept" ? "accepted" : "declined" }
            : inv
        )
      );

      if (action === "accept") {
        toast({
          title: "Partnership Accepted!",
          description: "You are now accountability partners",
        });
      } else {
        toast({
          title: "Invitation Declined",
          description: "The partnership invitation has been declined",
        });
      }
    } catch (error) {
      console.error("Failed to respond to invitation:", error);
      toast({
        title: "Action Failed",
        description: "Unable to process your response. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-64 bg-gray-200 rounded-2xl"></div>
              <div className="h-32 bg-gray-200 rounded-2xl"></div>
            </div>
            <div className="space-y-4">
              <div className="h-48 bg-gray-200 rounded-2xl"></div>
              <div className="h-32 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-xl md:text-2xl font-semibold mb-2">
              Accountability Partners
            </h3>
            <p className="text-gray-600 max-w-3xl">
              Stay motivated by inviting friends to join your activity.
              Accountability partners can track each other's progress and help
              keep everyone on track.
            </p>
          </div>
          <Button
            onClick={() => setIsInviteModalOpen(true)}
            className="rounded-full bg-gradient-to-r from-buddy-purple to-buddy-blue hover:from-buddy-purple/90 hover:to-buddy-blue/90"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Partners
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Invitation Methods */}
          <Card className="border border-white/80 rounded-2xl shadow-sm bg-white/90 backdrop-blur-sm">
            <div className="p-4 md:p-6">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 rounded-full bg-gray-100 p-1 mb-6">
                  <TabsTrigger
                    value="partners"
                    className="rounded-full data-[state=active]:bg-buddy-purple data-[state=active]:text-white"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Partners</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="requests"
                    className="rounded-full data-[state=active]:bg-buddy-purple data-[state=active]:text-white"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Requests</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="partners" className="space-y-4">
                  {partners.length > 0 ? (
                    <div className="space-y-4">
                      {partners.map((partner) => (
                        <div
                          key={partner.id}
                          className={`rounded-2xl border p-4 transition-all duration-200 ${
                            partner.status === "active"
                              ? "border-green-200 bg-green-50/50"
                              : partner.status === "pending"
                                ? "border-blue-200 bg-blue-50/50"
                                : "border-gray-200 bg-gray-50/50"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-12 h-12">
                                <AvatarImage
                                  src={partner.avatar}
                                  alt={partner.name}
                                />
                                <AvatarFallback className="bg-buddy-purple/10 text-buddy-purple">
                                  {partner.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>

                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {partner.name}
                                  </span>
                                  {partner.status === "active" && (
                                    <Badge className="bg-green-100 text-green-700 border-green-200 rounded-full">
                                      Active
                                    </Badge>
                                  )}
                                  {partner.status === "pending" && (
                                    <Badge className="bg-blue-100 text-blue-700 border-blue-200 rounded-full">
                                      Pending
                                    </Badge>
                                  )}
                                  {partner.status === "inactive" && (
                                    <Badge className="bg-gray-100 text-gray-600 border-gray-200 rounded-full">
                                      Inactive
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">
                                  {partner.email}
                                </p>
                                {partner.status !== "pending" && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Last check-in:{" "}
                                    {partner.lastCheckIn || "Never"}
                                  </p>
                                )}
                              </div>
                            </div>

                            {partner.status === "active" && (
                              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm text-gray-600">
                                      Progress
                                    </span>
                                    <span className="text-sm font-medium">
                                      {partner.progress}%
                                    </span>
                                  </div>
                                  <Progress
                                    value={partner.progress}
                                    className="h-2"
                                  />
                                </div>

                                <div className="flex items-center gap-2">
                                  <div className="p-2 bg-amber-100 text-amber-600 rounded-full">
                                    <Flame className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">
                                      {partner.streak} day streak
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {partner.totalCheckIns} total check-ins
                                    </p>
                                  </div>
                                </div>

                                <div className="text-center">
                                  <p className="text-sm font-medium">
                                    {partner.activities}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Activities
                                  </p>
                                </div>
                              </div>
                            )}

                            {partner.status === "pending" && (
                              <div className="text-sm text-blue-600">
                                Invitation sent, waiting for response
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl">
                      <Users className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                      <p className="text-gray-700 font-medium mb-2">
                        No partners yet
                      </p>
                      <p className="text-gray-600 mb-4 max-w-md mx-auto">
                        Invite friends to join you on this journey. Together,
                        you'll motivate each other to reach your goals.
                      </p>
                      <Button
                        onClick={() => setIsInviteModalOpen(true)}
                        className="rounded-full bg-gradient-to-r from-buddy-purple to-buddy-blue"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Invite Partners
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="requests" className="space-y-4">
                  {invitations.length > 0 ? (
                    <div className="space-y-4">
                      {invitations.map((invitation) => (
                        <div
                          key={invitation.id}
                          className="rounded-2xl border border-gray-200 bg-white p-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage
                                  src={invitation.fromUser.avatar}
                                  alt={invitation.fromUser.name}
                                />
                                <AvatarFallback className="bg-buddy-purple/10 text-buddy-purple">
                                  {invitation.fromUser.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>

                              <div>
                                <p className="font-medium">
                                  {invitation.fromUser.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Wants to be your accountability partner
                                </p>
                                {invitation.message && (
                                  <p className="text-sm text-gray-700 mt-1 italic">
                                    "{invitation.message}"
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex gap-2 ml-auto">
                              <Button
                                onClick={() =>
                                  handleInvitationResponse(
                                    invitation.id,
                                    "accept"
                                  )
                                }
                                className="rounded-full bg-green-600 hover:bg-green-700"
                                size="sm"
                              >
                                <UserCheck className="w-4 h-4" />
                                Accept
                              </Button>
                              <Button
                                onClick={() =>
                                  handleInvitationResponse(
                                    invitation.id,
                                    "decline"
                                  )
                                }
                                variant="outline"
                                className="rounded-full border-red-200 text-red-600 hover:bg-red-50"
                                size="sm"
                              >
                                <UserX className="w-4 h-4" />
                                Decline
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl">
                      <Clock className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                      <p className="text-gray-700 font-medium mb-2">
                        No pending requests
                      </p>
                      <p className="text-gray-600">
                        Partnership requests from other users will appear here
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Benefits Card */}
          <Card className="border border-white/80 rounded-2xl shadow-sm bg-white/90 backdrop-blur-sm">
            <div className="p-4 md:p-6">
              <h3 className="text-lg font-semibold mb-4">Why Have Partners?</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-buddy-purple/10 rounded-full">
                    <Heart className="w-5 h-5 text-buddy-purple" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Support Each Other</h4>
                    <p className="text-sm text-gray-600">
                      Motivation is higher when you have someone to share your
                      journey with.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-buddy-blue/10 rounded-full">
                    <Shield className="w-5 h-5 text-buddy-blue" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Stay Accountable</h4>
                    <p className="text-sm text-gray-600">
                      You're 65% more likely to complete your goals with an
                      accountability partner.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Award className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Celebrate Together</h4>
                    <p className="text-sm text-gray-600">
                      Share victories and milestones with people who understand
                      your journey.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Group Stats */}
          <Card className="border border-white/80 rounded-2xl shadow-sm bg-white/90 backdrop-blur-sm">
            <div className="p-4 md:p-6">
              <h3 className="text-lg font-semibold mb-4">Group Progress</h3>

              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-br from-buddy-purple/10 to-buddy-blue/10 rounded-xl border border-buddy-purple/20">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">Combined Check-ins</h4>
                      <p className="text-sm text-gray-600">All partners</p>
                    </div>
                    <Award className="w-5 h-5 text-buddy-purple" />
                  </div>

                  <div className="mb-2">
                    <Progress value={64} className="h-2.5" />
                  </div>

                  <div className="flex justify-between text-xs text-gray-600">
                    <span>162 check-ins</span>
                    <span>64% complete</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <p className="text-2xl font-bold text-buddy-purple">
                      {partners.filter((p) => p.status === "active").length}
                    </p>
                    <p className="text-xs text-gray-600">Active Partners</p>
                  </div>
                  <div className="text-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <p className="text-2xl font-bold text-buddy-blue">
                      {partners.reduce((sum, p) => sum + p.totalCheckIns, 0)}
                    </p>
                    <p className="text-xs text-gray-600">Total Check-ins</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Invite Partners Modal */}
      <InvitePartnersModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        activityId={activityId}
        onInviteSent={handleInviteSent}
      />
    </div>
  );
};

export default ActivityPartners;
