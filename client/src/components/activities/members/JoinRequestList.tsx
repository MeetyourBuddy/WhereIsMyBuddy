import React from "react";
import { UserPlus, Check, X, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Avatar from "@/components/common/Avatar";
import {
  ActivityJoinRequest,
  activityJoinRequestService,
} from "@/services/api/activity/activity-join-request.service";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { activityQueryKeys } from "@/hooks/useActivityData";

interface JoinRequestListProps {
  activityId: string;
  requests: ActivityJoinRequest[];
  isLoading: boolean;
  onRefresh: () => void;
}

export function JoinRequestList({
  activityId,
  requests,
  isLoading,
  onRefresh,
}: JoinRequestListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const pending = requests.filter((r) => r.status === "pending");

  const invalidateActivities = () => {
    queryClient.invalidateQueries({ queryKey: activityQueryKeys.lists() });
    queryClient.invalidateQueries({
      queryKey: activityQueryKeys.detail(activityId),
    });
    queryClient.invalidateQueries({
      queryKey: activityQueryKeys.participants(activityId),
    });
  };

  const handleAccept = async (requestId: string) => {
    try {
      const res = await activityJoinRequestService.acceptRequest(
        activityId,
        requestId
      );
      if (res.success) {
        toast({
          title: "Request accepted",
          description: "The user can now join the activity.",
        });
        invalidateActivities();
        onRefresh();
      }
    } catch (e: unknown) {
      const message =
        e && typeof e === "object" && "message" in e
          ? String((e as { message: unknown }).message)
          : "Failed to accept request";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      const res = await activityJoinRequestService.declineRequest(
        activityId,
        requestId
      );
      if (res.success) {
        toast({
          title: "Request declined",
          description: "The join request has been declined.",
        });
        invalidateActivities();
        onRefresh();
      }
    } catch (e: unknown) {
      const message =
        e && typeof e === "object" && "message" in e
          ? String((e as { message: unknown }).message)
          : "Failed to decline request";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-buddy-purple border-t-transparent" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <Card className="p-8 text-center">
        <UserPlus className="w-12 h-12 text-buddy-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-buddy-gray-800 mb-2">
          No join requests yet
        </h3>
        <p className="text-sm text-buddy-gray-600">
          When someone requests to join this private activity, they will appear here.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-buddy-gray-800">
          Join requests ({pending.length} pending)
        </h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          className="rounded-full"
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Refresh
        </Button>
      </div>

      <div className="space-y-3">
        {requests.map((req) => {
          const userObj = req.user ?? (typeof req.userId === "object" ? req.userId : null);
          const name = userObj && typeof userObj === "object" && "name" in userObj
            ? (userObj as { name?: string }).name
            : "User";
          const avatar = userObj && typeof userObj === "object" && "avatar" in userObj
            ? (userObj as { avatar?: string }).avatar
            : undefined;
          const isPending = req.status === "pending";

          return (
            <Card
              key={req._id}
              className="p-4 border border-buddy-gray-200 rounded-xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <Avatar
                    src={avatar}
                    alt={name}
                    initials={name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                    size="sm"
                    className="rounded-full shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-buddy-gray-800 truncate">
                      {name ?? "User"}
                    </p>
                    {req.message && (
                      <p className="text-sm text-buddy-gray-600 mt-1 line-clamp-2">
                        {req.message}
                      </p>
                    )}
                    <p className="text-xs text-buddy-gray-500 mt-1">
                      Requested {format(new Date(req.createdAt), "MMM d, yyyy")}
                    </p>
                    {req.status !== "pending" && (
                      <Badge
                        variant="secondary"
                        className="mt-2 text-xs"
                      >
                        {req.status === "accepted" ? "Accepted" : "Declined"}
                      </Badge>
                    )}
                  </div>
                </div>
                {isPending && (
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAccept(req._id)}
                      className="rounded-full text-green-700 border-green-200 hover:bg-green-50"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDecline(req._id)}
                      className="rounded-full text-red-700 border-red-200 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Decline
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
