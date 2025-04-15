
import React, { useState } from "react";
import { UserPlus, Mail, Link2, CheckCircle, Users, ArrowRight, Heart, Shield, Award, Flame } from "lucide-react";
import { Card } from "@/components/common/Card";
import Avatar from "@/components/common/Avatar";
import Button from "@/components/common/Button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

interface ActivityPartnersProps {
  activityId: string;
}

interface Partner {
  id: string;
  name: string;
  avatar: string;
  streak: number;
  progress: number;
  lastCheckIn: string;
  status: "active" | "pending" | "inactive";
}

const ActivityPartners: React.FC<ActivityPartnersProps> = ({ activityId }) => {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showLinkCopied, setShowLinkCopied] = useState(false);
  
  // Mock partners data
  const partners: Partner[] = [
    {
      id: "1",
      name: "Alex Johnson",
      avatar: "/placeholder.svg",
      streak: 7,
      progress: 76,
      lastCheckIn: "Today",
      status: "active"
    },
    {
      id: "2",
      name: "Jamie Smith",
      avatar: "/placeholder.svg",
      streak: 5,
      progress: 64,
      lastCheckIn: "Yesterday",
      status: "active"
    },
    {
      id: "3",
      name: "Taylor Brown",
      avatar: "/placeholder.svg",
      streak: 0,
      progress: 42,
      lastCheckIn: "3 days ago",
      status: "inactive"
    },
    {
      id: "4",
      name: "Jordan Lee",
      avatar: "/placeholder.svg",
      streak: 0,
      progress: 0,
      lastCheckIn: "",
      status: "pending"
    }
  ];
  
  const handleInvite = () => {
    if (!email) return;
    
    setIsSending(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      setEmail("");
      
      toast({
        title: "Invitation Sent!",
        description: `An invitation email has been sent to ${email}`,
        variant: "default",
      });
    }, 1500);
  };
  
  const copyInviteLink = () => {
    navigator.clipboard.writeText(`https://buddy-app.com/join/${activityId}`);
    setShowLinkCopied(true);
    
    toast({
      title: "Link Copied!",
      description: "Share it with your accountability partners",
      variant: "default",
    });
    
    setTimeout(() => setShowLinkCopied(false), 3000);
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-2">Accountability Partners</h3>
            <p className="text-buddy-gray-600 mb-6 max-w-3xl">
              Stay motivated by inviting friends to join your activity. Accountability partners 
              can track each other's progress and help keep everyone on track.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="p-5 bg-buddy-purple/5 rounded-xl border border-buddy-purple/20">
                <Heart className="w-8 h-8 text-buddy-purple mb-3" />
                <h4 className="font-semibold text-lg mb-1">Support Each Other</h4>
                <p className="text-sm text-buddy-gray-600">
                  Motivation is higher when you have someone to share your journey with.
                </p>
              </div>
              
              <div className="p-5 bg-buddy-blue/5 rounded-xl border border-buddy-blue/20">
                <Shield className="w-8 h-8 text-buddy-blue mb-3" />
                <h4 className="font-semibold text-lg mb-1">Stay Accountable</h4>
                <p className="text-sm text-buddy-gray-600">
                  You're 65% more likely to complete your goals with an accountability partner.
                </p>
              </div>
            </div>
            
            <div className="mb-8">
              <h4 className="font-semibold mb-4">Invite by Email</h4>
              <div className="flex gap-3">
                <Input
                  placeholder="friend@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  variant="primary" 
                  icon={<Mail />}
                  isLoading={isSending}
                  onClick={handleInvite}
                  disabled={!email.includes('@')}
                >
                  Send Invite
                </Button>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold mb-4">Or Share a Link</h4>
              <div className="flex gap-3">
                <Input
                  value={`https://buddy-app.com/join/${activityId}`}
                  readOnly
                  className="flex-1 bg-buddy-gray-50"
                />
                <Button 
                  variant="outline" 
                  icon={<Link2 />}
                  onClick={copyInviteLink}
                >
                  {showLinkCopied ? "Copied!" : "Copy Link"}
                </Button>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <h4 className="font-semibold mb-4">Your Partners</h4>
            
            {partners.length > 0 ? (
              <div className="space-y-4">
                {partners.map((partner) => (
                  <div 
                    key={partner.id}
                    className={`rounded-lg border ${
                      partner.status === "active" 
                        ? "border-buddy-green/30 bg-buddy-green/5" 
                        : partner.status === "pending"
                          ? "border-buddy-blue/30 bg-buddy-blue/5"
                          : "border-buddy-gray-200 bg-buddy-gray-50"
                    } p-4`}
                  >
                    <div className="flex flex-wrap items-center gap-4">
                      <Avatar src={partner.avatar} alt={partner.name} size="md" />
                      
                      <div className="flex-1 min-w-[150px]">
                        <div className="flex items-center">
                          <span className="font-medium">{partner.name}</span>
                          {partner.status === "active" && (
                            <Badge className="ml-2 bg-buddy-green/10 text-buddy-green border-buddy-green/20">Active</Badge>
                          )}
                          {partner.status === "pending" && (
                            <Badge className="ml-2 bg-buddy-blue/10 text-buddy-blue border-buddy-blue/20">Pending</Badge>
                          )}
                          {partner.status === "inactive" && (
                            <Badge className="ml-2 bg-buddy-gray-200 text-buddy-gray-600 border-buddy-gray-300">Inactive</Badge>
                          )}
                        </div>
                        
                        {partner.status !== "pending" && (
                          <div className="text-sm text-buddy-gray-600 mt-1">
                            Last check-in: {partner.lastCheckIn || "Never"}
                          </div>
                        )}
                      </div>
                      
                      {partner.status === "active" && (
                        <div className="flex-1 min-w-[180px]">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-buddy-gray-600">Progress</span>
                            <span className="text-sm font-medium">{partner.progress}%</span>
                          </div>
                          <Progress value={partner.progress} className="h-2" />
                        </div>
                      )}
                      
                      {partner.status === "active" && (
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-amber-500/10 text-amber-500 rounded-full">
                            <Flame className="w-4 h-4" />
                          </div>
                          <span className="font-medium">{partner.streak} day streak</span>
                        </div>
                      )}
                      
                      {partner.status === "pending" && (
                        <div className="text-sm text-buddy-blue">
                          Invitation sent, waiting for response
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-buddy-gray-50 rounded-lg">
                <Users className="w-12 h-12 mx-auto text-buddy-gray-400 mb-3" />
                <p className="text-buddy-gray-700 font-medium mb-2">No partners yet</p>
                <p className="text-buddy-gray-600 mb-4 max-w-md mx-auto">
                  Invite friends to join you on this journey. Together, you'll motivate each other to reach your goals.
                </p>
                <Button variant="primary" icon={<UserPlus />}>
                  Invite Partners
                </Button>
              </div>
            )}
          </Card>
        </div>
        
        <div className="lg:col-span-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Partner Activity</h3>
            
            <div className="space-y-5 mb-6">
              {partners
                .filter(p => p.status === "active")
                .slice(0, 4)
                .map((partner, index) => {
                  const date = new Date();
                  date.setHours(date.getHours() - (index * 5));
                  
                  return (
                    <div key={partner.id} className="flex items-start">
                      <Avatar src={partner.avatar} alt={partner.name} size="sm" className="mr-3" />
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-sm">{partner.name}</span>
                          <span className="text-xs text-buddy-gray-500">
                            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-buddy-gray-600">
                          {["Completed today's check-in", "Reached a 5-day streak!", "Posted a photo update", "Added a comment"][index]}
                        </p>
                      </div>
                    </div>
                  );
              })}
            </div>
            
            <Separator className="my-5" />
            
            <h4 className="font-medium mb-3">Tips for Success</h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-buddy-purple/10 rounded-full p-1 mr-3 mt-1">
                  <CheckCircle className="w-4 h-4 text-buddy-purple" />
                </div>
                <p className="text-sm text-buddy-gray-700">
                  Set a regular time to check in with your partners
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="bg-buddy-purple/10 rounded-full p-1 mr-3 mt-1">
                  <CheckCircle className="w-4 h-4 text-buddy-purple" />
                </div>
                <p className="text-sm text-buddy-gray-700">
                  Offer encouragement when a partner misses a day
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="bg-buddy-purple/10 rounded-full p-1 mr-3 mt-1">
                  <CheckCircle className="w-4 h-4 text-buddy-purple" />
                </div>
                <p className="text-sm text-buddy-gray-700">
                  Celebrate your collective wins, no matter how small
                </p>
              </div>
            </div>
            
            <Separator className="my-5" />
            
            <div className="p-4 bg-gradient-to-br from-buddy-purple/10 to-buddy-blue/10 rounded-xl border border-buddy-purple/20">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium">Group Milestone</h4>
                  <p className="text-sm text-buddy-gray-600">Combined progress</p>
                </div>
                <Award className="w-5 h-5 text-buddy-purple" />
              </div>
              
              <div className="mb-1">
                <Progress value={64} className="h-2.5" />
              </div>
              
              <div className="flex justify-between text-xs text-buddy-gray-600">
                <span>64% complete</span>
                <span>162/250 check-ins</span>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 mt-6">
            <h3 className="text-lg font-semibold mb-3">Top Partners</h3>
            <p className="text-sm text-buddy-gray-600 mb-5">
              Based on consistency and check-in streaks
            </p>
            
            <div className="space-y-4">
              {partners
                .filter(p => p.status === "active")
                .sort((a, b) => b.streak - a.streak)
                .map((partner, index) => (
                  <div key={partner.id} className="flex items-center">
                    <div className="w-7 h-7 rounded-full bg-buddy-gray-100 flex items-center justify-center mr-3">
                      <span className="font-medium text-buddy-gray-700">{index + 1}</span>
                    </div>
                    
                    <Avatar src={partner.avatar} alt={partner.name} size="sm" className="mr-3" />
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{partner.name}</p>
                      <div className="flex items-center mt-0.5">
                        <div className="w-20 h-1.5 bg-buddy-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-amber-400 to-amber-500" 
                            style={{ width: `${Math.min(100, partner.streak * 14)}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-xs text-buddy-gray-600">
                          {partner.streak} day streak
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            
            <div className="mt-5 pt-5 border-t border-buddy-gray-100">
              <Button variant="outline" className="w-full" icon={<ArrowRight className="h-4 w-4" />}>
                View All Partners
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ActivityPartners;
