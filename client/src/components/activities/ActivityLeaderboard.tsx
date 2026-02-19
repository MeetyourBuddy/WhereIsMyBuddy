import React, { useState, useMemo, useEffect } from "react";
import {
  Medal,
  CheckCircle,
  Calendar,
  MoreHorizontal,
  Shield,
  AlertTriangle,
  Ban,
  UserX,
  XCircle,
  ChevronUp,
  ChevronDown,
  Users,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Avatar from "@/components/common/Avatar";
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
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { CheckInService } from "@/services/api/activity/reaction.service";
import TablePaginationControls from "./TablePaginationControls";

// Mock data for the leaderboard
const mockLeaderboardData = [
  {
    id: "1",
    name: "Jordan Lee",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    position: 1,
    checkIns: 28,
    streak: 14,
    points: 1200,
    role: "admin",
    status: "active",
    joinDate: new Date(2023, 8, 1), // September 1, 2023
  },
  {
    id: "2",
    name: "Taylor Swift",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    position: 2,
    checkIns: 26,
    streak: 12,
    points: 1050,
    role: "moderator",
    status: "active",
    joinDate: new Date(2023, 8, 3), // September 3, 2023
  },
  {
    id: "3",
    name: "Alex Johnson",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    position: 3,
    checkIns: 24,
    streak: 10,
    points: 980,
    role: "member",
    status: "active",
    joinDate: new Date(2023, 8, 5), // September 5, 2023
  },
  {
    id: "4",
    name: "Jamie Williams",
    position: 4,
    checkIns: 22,
    streak: 8,
    points: 900,
    role: "member",
    status: "active",
    joinDate: new Date(2023, 8, 7), // September 7, 2023
  },
  {
    id: "5",
    name: "Morgan Chen",
    position: 5,
    checkIns: 20,
    streak: 6,
    points: 850,
    role: "member",
    status: "active",
    joinDate: new Date(2023, 8, 10), // September 10, 2023
  },
];

interface ActivityLeaderboardProps {
  activityId: string;
  userRole?: string; // 'admin', 'moderator', or 'member'
  currentUserId?: string; // Current user's ID to prevent self-actions
  /** Bump when activity data (e.g. check-ins) changes so leaderboard refetches. */
  refreshDependency?: number;
}

type SortField =
  | "position"
  | "checkIns"
  | "streak"
  | "points"
  | "joinDate"
  | "name"
  | "role";
type SortDirection = "asc" | "desc";

const ActivityLeaderboard = ({
  activityId,
  userRole = "admin",
  currentUserId,
  refreshDependency,
}: ActivityLeaderboardProps) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionParticipant, setActionParticipant] = useState<any>(null);
  const [actionType, setActionType] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>("position");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      if (!activityId) return;

      setIsLoading(true);
      try {
        const response =
          await CheckInService.getActivityLeaderboard(activityId);
        if (response.data?.participants) {
          // Add position to each participant
          const participantsWithPosition = response.data.participants.map(
            (participant, index) => ({
              ...participant,
              position: index + 1,
              image: participant.avatar, // Map avatar to image for compatibility
              joinDate: new Date(participant.joinDate),
            })
          );
          setLeaderboardData(participantsWithPosition);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard data:", error);
        // Keep empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [activityId, refreshDependency]);

  const canPerformActions = userRole === "admin";
  const canPerformActionOnParticipant = (participant: any) => {
    return canPerformActions && participant.id !== currentUserId;
  };

  const handleAction = (participant: any, action: string) => {
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
    if (!actionType || !actionParticipant)
      return { title: "", description: "", icon: null };

    switch (actionType) {
      case "suspend":
        return {
          title: "Suspend Member",
          description: `Are you sure you want to suspend ${actionParticipant.name}? They won't be able to participate until unsuspended.`,
          icon: <AlertTriangle className="h-6 w-6 text-amber-500" />,
        };
      case "ban":
        return {
          title: "Ban Member",
          description: `Are you sure you want to ban ${actionParticipant.name}? This action cannot be undone.`,
          icon: <Ban className="h-6 w-6 text-red-500" />,
        };
      case "remove":
        return {
          title: "Remove Member",
          description: `Are you sure you want to remove ${actionParticipant.name} from this activity?`,
          icon: <UserX className="h-6 w-6 text-red-500" />,
        };
      case "promote-admin":
        return {
          title: "Promote to Admin",
          description: `Are you sure you want to promote ${actionParticipant.name} to admin? They will have full control over this activity.`,
          icon: <Shield className="h-6 w-6 text-buddy-purple" />,
        };
      case "promote-moderator":
        return {
          title: "Promote to Moderator",
          description: `Are you sure you want to promote ${actionParticipant.name} to moderator?`,
          icon: <Shield className="h-6 w-6 text-buddy-blue" />,
        };
      default:
        return { title: "", description: "", icon: null };
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-buddy-purple/20 text-buddy-purple border-buddy-purple/20">
            Admin
          </Badge>
        );
      case "moderator":
        return (
          <Badge className="bg-buddy-blue/20 text-buddy-blue border-buddy-blue/20">
            Moderator
          </Badge>
        );
      default:
        return <Badge className="bg-gray-100 text-gray-800">Member</Badge>;
    }
  };

  // Sorting functionality
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle sort direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new sort field and default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return null;
    }

    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    );
  };

  // Create sorted data
  const sortedData = useMemo(() => {
    return [...leaderboardData].sort((a, b) => {
      // Handle different types of fields
      let comparison = 0;

      if (
        sortField === "position" ||
        sortField === "checkIns" ||
        sortField === "streak" ||
        sortField === "points"
      ) {
        comparison = a[sortField] - b[sortField];
      } else if (sortField === "joinDate") {
        comparison = a.joinDate.getTime() - b.joinDate.getTime();
      } else if (sortField === "name" || sortField === "role") {
        comparison = a[sortField].localeCompare(b[sortField]);
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [leaderboardData, sortField, sortDirection]);

  const totalItems = sortedData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  // Extract top 3 participants
  const topParticipants = useMemo(() => {
    return leaderboardData
      .filter((participant) => participant.position <= 3)
      .sort((a, b) => a.position - b.position);
  }, [leaderboardData]);

  if (isLoading) {
    return (
      <div className="p-3 sm:p-4 md:p-6">
        <div className="flex items-center justify-center h-40 sm:h-48 md:h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-buddy-purple mx-auto mb-3 sm:mb-4"></div>
            <p className="text-xs sm:text-sm md:text-base text-buddy-gray-600">
              Loading leaderboard data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (leaderboardData.length === 0) {
    return (
      <div className="p-3 sm:p-4 md:p-6">
        <div className="flex items-center justify-center h-40 sm:h-48 md:h-64">
          <div className="text-center">
            <Users className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-buddy-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-buddy-gray-800 mb-2">
              No Participants Yet
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-buddy-gray-600">
              This activity doesn't have any participants yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 max-w-full overflow-hidden">
      {/* Top 3 Participants Cards */}
      <div className="mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-base sm:text-lg font-semibold text-buddy-gray-800 mb-3 sm:mb-4">
          Top Participants
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
          {topParticipants.map((participant) => (
            <Card
              key={participant.id}
              className="p-3 sm:p-4 md:p-6 relative overflow-hidden border-buddy-gray-200/50 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="absolute top-0 right-0 w-24 h-24">
                <div
                  className={`
                  absolute transform rotate-45 translate-y-[-50%] translate-x-[25%]
                  w-full h-6 flex items-center justify-center mt-4
                  ${
                    participant.position === 1
                      ? "bg-amber-500"
                      : participant.position === 2
                        ? "bg-gray-400"
                        : "bg-amber-600"
                  }
                  text-white text-xs font-semibold
                `}
                >
                  #{participant.position}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="mb-4 relative">
                  <Avatar
                    src={participant.image}
                    alt={participant.name}
                    size="lg"
                    className="rounded-full border-4 border-buddy-gray-200"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm">
                    {participant.position === 1 ? (
                      <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                        <Medal className="h-4 w-4 text-amber-500" />
                      </div>
                    ) : participant.position === 2 ? (
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                        <Medal className="h-4 w-4 text-gray-500" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center">
                        <Medal className="h-4 w-4 text-amber-400" />
                      </div>
                    )}
                  </div>
                </div>

                <h4 className="text-buddy-gray-800 font-semibold mb-1">
                  {participant.name}
                </h4>
                {getRoleBadge(participant.role)}

                <div className="grid grid-cols-3 gap-1 sm:gap-2 w-full mt-2 sm:mt-3 md:mt-4 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-buddy-gray-600">Points</span>
                    <span className="text-xs sm:text-sm md:text-base text-buddy-purple font-semibold">
                      {participant.points}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-buddy-gray-600">
                      Check-ins
                    </span>
                    <span className="text-xs sm:text-sm md:text-base text-buddy-gray-900 font-medium">
                      {participant.checkIns}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-buddy-gray-600">Streak</span>
                    <span className="text-xs sm:text-sm md:text-base text-amber-600 font-medium">
                      {participant.streak}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card className="rounded-xl shadow-sm border border-buddy-gray-200/50 overflow-hidden">
        <div className="p-3 sm:p-4 md:p-6 border-b border-buddy-gray-200/50">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-buddy-gray-800">
            Activity Leaderboard
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-buddy-gray-600">
            See who's leading the way in this activity with the most check-ins
            and points.
          </p>
          <p className="text-xs text-buddy-gray-500 mt-1 sm:hidden">
            ← Swipe to see more columns →
          </p>
        </div>

        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="min-w-max">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="w-[50px] sm:w-[60px] cursor-pointer"
                    onClick={() => handleSort("position")}
                  >
                    <div className="flex items-center text-xs sm:text-sm">
                      Rank
                      {getSortIcon("position")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer min-w-[140px]"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center text-xs sm:text-sm">
                      Member
                      {getSortIcon("name")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hidden sm:table-cell min-w-[100px]"
                    onClick={() => handleSort("role")}
                  >
                    <div className="flex items-center text-xs sm:text-sm">
                      Role
                      {getSortIcon("role")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hidden md:table-cell min-w-[120px]"
                    onClick={() => handleSort("joinDate")}
                  >
                    <div className="flex items-center text-xs sm:text-sm">
                      Joined
                      {getSortIcon("joinDate")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer min-w-[100px]"
                    onClick={() => handleSort("checkIns")}
                  >
                    <div className="flex items-center text-xs sm:text-sm">
                      Check-ins
                      {getSortIcon("checkIns")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer min-w-[80px]"
                    onClick={() => handleSort("streak")}
                  >
                    <div className="flex items-center text-xs sm:text-sm">
                      Streak
                      {getSortIcon("streak")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer min-w-[80px]"
                    onClick={() => handleSort("points")}
                  >
                    <div className="flex items-center text-xs sm:text-sm">
                      Points
                      {getSortIcon("points")}
                    </div>
                  </TableHead>
                  {canPerformActions && (
                    <TableHead className="w-[50px]">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((participant) => (
                  <TableRow key={participant.id}>
                    <TableCell>
                      <div className="flex justify-center items-center">
                        {participant.position === 1 ? (
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-amber-100 flex items-center justify-center">
                            <Medal className="h-3 w-3 sm:h-5 sm:w-5 text-amber-500" />
                          </div>
                        ) : participant.position === 2 ? (
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <Medal className="h-3 w-3 sm:h-5 sm:w-5 text-gray-500" />
                          </div>
                        ) : participant.position === 3 ? (
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-amber-50 flex items-center justify-center">
                            <Medal className="h-3 w-3 sm:h-5 sm:w-5 text-amber-400" />
                          </div>
                        ) : (
                          <span className="text-xs sm:text-sm text-buddy-gray-600 font-medium">
                            {participant.position}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <Avatar
                          src={participant.image}
                          alt={participant.name}
                          size="sm"
                          className="w-6 h-6 sm:w-8 sm:h-8"
                        />
                        <span className="text-xs sm:text-sm font-medium truncate">
                          {participant.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="scale-75 sm:scale-100">
                        {getRoleBadge(participant.role)}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs sm:text-sm text-buddy-gray-600">
                      {format(participant.joinDate, "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-buddy-green mr-1" />
                        <span className="text-xs sm:text-sm">
                          {participant.checkIns}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-amber-100 text-amber-800 text-xs">
                        {participant.streak}d
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs sm:text-sm font-semibold text-buddy-purple">
                        {participant.points}
                      </span>
                    </TableCell>
                    {canPerformActionOnParticipant(participant) && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full w-6 h-6 sm:w-8 sm:h-8"
                            >
                              <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                              Member Actions
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {userRole === "admin" && (
                              <>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleAction(participant, "promote-admin")
                                  }
                                >
                                  <Shield className="h-4 w-4 mr-2 text-buddy-purple" />
                                  <span>Make Admin</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleAction(
                                      participant,
                                      "promote-moderator"
                                    )
                                  }
                                >
                                  <Shield className="h-4 w-4 mr-2 text-buddy-blue" />
                                  <span>Make Moderator</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            )}
                            <DropdownMenuItem
                              onClick={() =>
                                handleAction(participant, "suspend")
                              }
                            >
                              <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                              <span>Suspend Member</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAction(participant, "ban")}
                            >
                              <Ban className="h-4 w-4 mr-2 text-red-500" />
                              <span>Ban Member</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleAction(participant, "remove")
                              }
                            >
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
        </div>

        <TablePaginationControls
          totalItems={totalItems}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={(rows) => {
            setRowsPerPage(rows);
            setCurrentPage(1);
          }}
        />
      </Card>

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
              className={
                actionType?.includes("promote")
                  ? "bg-buddy-purple"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActivityLeaderboard;
