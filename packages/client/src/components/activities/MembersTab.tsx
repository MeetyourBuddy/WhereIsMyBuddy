
import React, { useState } from "react";
import { User, Shield, AlertTriangle, Ban, UserX, UserPlus, MoreHorizontal, CheckCircle, XCircle } from "lucide-react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import Avatar from "@/components/common/Avatar";
import { toast } from "@/hooks/use-toast";

interface Participant {
  id: string;
  name: string;
  image?: string;
  role?: "admin" | "moderator" | "member";
  status?: "active" | "suspended" | "banned";
  joinDate?: Date;
  lastActive?: Date;
  totalCheckIns?: number;
  streak?: number;
}

interface MembersTabProps {
  participants: Participant[];
  userRole: string;
  activityId: string;
}

const MembersTab = ({ participants, userRole, activityId }: MembersTabProps) => {
  const [actionParticipant, setActionParticipant] = useState<Participant | null>(null);
  const [actionType, setActionType] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Enhanced participant data
  const enhancedParticipants = participants.map(p => ({
    ...p,
    role: p.role || "member",
    status: p.status || "active",
    joinDate: p.joinDate || new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    lastActive: p.lastActive || new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    totalCheckIns: p.totalCheckIns || Math.floor(Math.random() * 50) + 1,
    streak: p.streak || Math.floor(Math.random() * 14)
  }));
  
  const handleAction = (participant: Participant, action: string) => {
    setActionParticipant(participant);
    setActionType(action);
    setDialogOpen(true);
  };
  
  const confirmAction = () => {
    if (!actionParticipant || !actionType) return;
    
    // In a real app, this would call an API
    let successMessage = "";
    
    switch (actionType) {
      case "suspend":
        successMessage = `${actionParticipant.name} has been suspended`;
        break;
      case "ban":
        successMessage = `${actionParticipant.name} has been banned`;
        break;
      case "remove":
        successMessage = `${actionParticipant.name} has been removed from the activity`;
        break;
      case "promote-admin":
        successMessage = `${actionParticipant.name} has been promoted to admin`;
        break;
      case "promote-moderator":
        successMessage = `${actionParticipant.name} has been promoted to moderator`;
        break;
      default:
        successMessage = "Action completed successfully";
    }
    
    toast({
      title: "Action Completed",
      description: successMessage,
    });
    
    setDialogOpen(false);
    setActionParticipant(null);
    setActionType(null);
  };
  
  const getActionDetails = () => {
    if (!actionType || !actionParticipant) return { title: "", description: "", icon: null };
    
    switch (actionType) {
      case "suspend":
        return {
          title: "Suspend Member",
          description: `Are you sure you want to suspend ${actionParticipant.name}? They won't be able to participate until unsuspended.`,
          icon: <AlertTriangle className="h-6 w-6 text-amber-500" />
        };
      case "ban":
        return {
          title: "Ban Member",
          description: `Are you sure you want to ban ${actionParticipant.name}? This action cannot be undone.`,
          icon: <Ban className="h-6 w-6 text-red-500" />
        };
      case "remove":
        return {
          title: "Remove Member",
          description: `Are you sure you want to remove ${actionParticipant.name} from this activity?`,
          icon: <UserX className="h-6 w-6 text-red-500" />
        };
      case "promote-admin":
        return {
          title: "Promote to Admin",
          description: `Are you sure you want to promote ${actionParticipant.name} to admin? They will have full control over this activity.`,
          icon: <Shield className="h-6 w-6 text-buddy-purple" />
        };
      case "promote-moderator":
        return {
          title: "Promote to Moderator",
          description: `Are you sure you want to promote ${actionParticipant.name} to moderator?`,
          icon: <Shield className="h-6 w-6 text-buddy-blue" />
        };
      default:
        return { title: "", description: "", icon: null };
    }
  };
  
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-buddy-purple/20 text-buddy-purple border-buddy-purple/20">Admin</Badge>;
      case "moderator":
        return <Badge className="bg-buddy-blue/20 text-buddy-blue border-buddy-blue/20">Moderator</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Member</Badge>;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "suspended":
        return <Badge className="bg-amber-100 text-amber-800">Suspended</Badge>;
      case "banned":
        return <Badge className="bg-red-100 text-red-800">Banned</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    }
  };

  return (
    <Card className="p-6 bg-white shadow-sm rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-buddy-gray-800">Activity Members</h2>
        {userRole === "admin" && (
          <Button size="sm" className="bg-buddy-green">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Members
          </Button>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Check-ins</TableHead>
              <TableHead>Streak</TableHead>
              {userRole === "admin" && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {enhancedParticipants.map((participant) => (
              <TableRow key={participant.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar 
                      src={participant.image}
                      alt={participant.name}
                      size="sm"
                    />
                    <span className="font-medium">{participant.name}</span>
                  </div>
                </TableCell>
                <TableCell>{getRoleBadge(participant.role || "member")}</TableCell>
                <TableCell>{getStatusBadge(participant.status || "active")}</TableCell>
                <TableCell className="text-sm text-buddy-gray-600">
                  {participant.joinDate?.toLocaleDateString()}
                </TableCell>
                <TableCell className="text-sm text-buddy-gray-600">
                  {participant.lastActive?.toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-buddy-green mr-1" />
                    <span>{participant.totalCheckIns}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className="bg-amber-100 text-amber-800">
                    {participant.streak} days
                  </Badge>
                </TableCell>
                {userRole === "admin" && (
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Member Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleAction(participant, "promote-admin")}>
                          <Shield className="h-4 w-4 mr-2 text-buddy-purple" />
                          <span>Make Admin</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction(participant, "promote-moderator")}>
                          <Shield className="h-4 w-4 mr-2 text-buddy-blue" />
                          <span>Make Moderator</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleAction(participant, "suspend")}>
                          <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                          <span>Suspend Member</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction(participant, "ban")}>
                          <Ban className="h-4 w-4 mr-2 text-red-500" />
                          <span>Ban Member</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction(participant, "remove")}>
                          <UserX className="h-4 w-4 mr-2 text-red-500" />
                          <span>Remove from Activity</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3">
              {getActionDetails().icon}
              <DialogTitle>{getActionDetails().title}</DialogTitle>
            </div>
            <DialogDescription>
              {getActionDetails().description}
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              <XCircle className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={confirmAction}
              className={actionType?.includes('promote') ? 'bg-buddy-purple' : 'bg-red-600 hover:bg-red-700'}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default MembersTab;
