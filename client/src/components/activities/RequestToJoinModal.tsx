import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Avatar from "@/components/common/Avatar";
import { Calendar, Target, ListChecks, Clock, X } from "lucide-react";
import { IActivityResult, IActivityRule } from "@/types/activity-types";
import { activityJoinRequestService } from "@/services/api/activity/activity-join-request.service";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { activityQueryKeys } from "@/hooks/useActivityData";
import { format } from "date-fns";

const DEFAULT_RULE_TITLES = [
  "Respect & Courtesy",
  "Privacy & Confidentiality",
  "Active Participation",
];

function getRulesForDisplay(rules?: IActivityRule[] | { rule?: string; title?: string; isDefault?: boolean }[]): string[] {
  if (!rules?.length) return DEFAULT_RULE_TITLES.slice(0, 3);
  const custom = rules
    .filter((r) => !(r as IActivityRule).isDefault && !(r as { isDefault?: boolean }).isDefault)
    .map((r) => (r as IActivityRule).title ?? (r as { rule?: string }).rule ?? "")
    .filter(Boolean);
  const defaults = rules
    .filter((r) => (r as IActivityRule).isDefault ?? (r as { isDefault?: boolean }).isDefault)
    .map((r) => (r as IActivityRule).title ?? (r as { rule?: string }).rule ?? "")
    .filter(Boolean);
  const combined = [...custom];
  for (const t of DEFAULT_RULE_TITLES) {
    if (combined.length >= 3) break;
    if (defaults.includes(t) || combined.includes(t)) continue;
    combined.push(t);
  }
  return combined.length > 0 ? combined.slice(0, 3) : DEFAULT_RULE_TITLES.slice(0, 3);
}

interface RequestToJoinModalProps {
  activity: IActivityResult;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestSent?: () => void;
}

export function RequestToJoinModal({
  activity,
  open,
  onOpenChange,
  onRequestSent,
}: RequestToJoinModalProps) {
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const activityId = activity._id ?? activity.id;
  const isPending = activity?.currentUserJoinRequestStatus === "pending";
  const isFull =
    ((activity.participants?.length ?? 0) >= (activity.maxParticipants ?? 0)) &&
    (activity.maxParticipants ?? 0) > 0;
  const description = activity.description ?? "";
  const aboutLines = description.split(/\n/).slice(0, 3).join("\n");
  const rulesDisplay = getRulesForDisplay(activity.rules as IActivityRule[] | undefined);
  const goals = (activity.goals ?? []).slice(0, 3);
  const admin = activity.admin;
  const adminName = admin?.name ?? "Creator";
  const adminAvatar = admin?.avatar ?? (admin as { profileImage?: string })?.profileImage;
  const startDate = activity.startDate ? format(new Date(activity.startDate), "MMM d, yyyy") : "";
  const endDate = activity.endDate ? format(new Date(activity.endDate), "MMM d, yyyy") : "";
  const category = activity.category ?? "";
  const durationMonths = activity.proposedDuration;
  const durationLabel =
    durationMonths != null
      ? durationMonths === 1
        ? "1 month"
        : `${durationMonths} months`
      : "";
  const freq =
    activity.checkinFrequency != null && activity.checkinFrequencyUnit
      ? `${activity.checkinFrequency} ${activity.checkinFrequencyUnit}`
      : "";

  const handleSendRequest = async () => {
    if (!activityId) return;
    if (isFull) return;
    setIsSubmitting(true);
    try {
      const res = await activityJoinRequestService.createRequest(activityId, {
        message: notes.trim() || undefined,
      });
      if (res.success) {
        toast({
          title: "Request sent",
          description: "The activity creator will review your request.",
        });
        setNotes("");
        await queryClient.refetchQueries({ queryKey: activityQueryKeys.lists() });
        onOpenChange(false);
        onRequestSent?.();
      } else {
        toast({
          title: "Error",
          description: (res as { message?: string }).message ?? "Failed to send request",
          variant: "destructive",
        });
      }
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string | string[] } }; message?: string };
      const raw = err.response?.data?.message ?? err.message;
      const message = Array.isArray(raw) ? raw.join(" ") : String(raw ?? "Failed to send request");
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90dvh] w-full max-w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl [&>button.absolute]:hidden">
        {/* Banner: ~1/3 taller; title + close top; bottom-left: category, freq, duration; bottom-right: date range */}
        <div
          className="relative h-56 w-full shrink-0 rounded-t-lg bg-cover bg-center sm:h-60"
          style={{
            backgroundImage: activity.bannerImage
              ? `url(${activity.bannerImage})`
              : "linear-gradient(to bottom right, rgb(147 51 234 / 0.2), rgb(59 130 246 / 0.2))",
          }}
        >
          <div className="absolute inset-0 rounded-t-lg bg-black/45" aria-hidden />
          <div className="relative flex h-full flex-col justify-between px-4 pt-4 pb-3 sm:px-5 sm:pt-5 sm:pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold text-white sm:text-xl">
                Request to Join {activity.name ?? activity.title ?? "Activity"}
              </DialogTitle>
              <DialogClose asChild>
                <button
                  type="button"
                  className="rounded-sm p-1 opacity-90 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-label="Close"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </DialogClose>
            </div>
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {category && (
                  <Badge className="bg-white/20 text-xs font-medium text-white backdrop-blur-sm border-white/30">
                    {String(category)}
                  </Badge>
                )}
                {freq && (
                  <Badge className="bg-white/20 text-xs font-medium text-white backdrop-blur-sm border-white/30">
                    Check-in: {freq}
                  </Badge>
                )}
                {durationLabel && (
                  <Badge className="bg-white/20 text-xs font-medium text-white backdrop-blur-sm border-white/30">
                    <Clock className="mr-1 h-3 w-3" />
                    {durationLabel}
                  </Badge>
                )}
              </div>
              {(startDate || endDate) && (
                <Badge className="shrink-0 bg-white/20 text-xs font-medium text-white backdrop-blur-sm border-white/30">
                  <Calendar className="mr-1 h-3 w-3" />
                  {startDate}
                  {endDate ? ` – ${endDate}` : ""}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="h-full min-h-0 overflow-y-auto overflow-x-hidden px-4 sm:px-6">
            <div className="space-y-4 pb-4 pr-4 pt-4">
            {/* About - first 3 lines */}
            <div>
              <h4 className="text-sm font-semibold text-buddy-gray-800 mb-1">About the event</h4>
              <p className="text-sm text-buddy-gray-600 whitespace-pre-line line-clamp-3">
                {aboutLines || "No description."}
              </p>
            </div>

            {/* Rules - 3 max (default rules when no custom) */}
            <div>
              <h4 className="text-sm font-semibold text-buddy-gray-800 mb-2 flex items-center gap-1.5">
                <ListChecks className="h-4 w-4 text-emerald-600 shrink-0" />
                Rules
              </h4>
              <ul className="list-disc list-inside text-sm text-buddy-gray-600 space-y-1">
                {rulesDisplay.map((title, i) => (
                  <li key={i}>{title}</li>
                ))}
              </ul>
            </div>

            {/* First 3 goals */}
            {goals.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-buddy-gray-800 mb-2 flex items-center gap-1.5">
                  <Target className="h-4 w-4 text-amber-500 shrink-0" />
                  Goals
                </h4>
                <ul className="list-disc list-inside text-sm text-buddy-gray-600 space-y-1">
                  {goals.map((g, i) => (
                    <li key={i}>{typeof g === "string" ? g : (g as { text?: string }).text ?? ""}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Creator */}
            <div className="flex items-center gap-3">
              <Avatar
                size="sm"
                src={adminAvatar}
                alt={adminName}
                initials={adminName?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
              />
              <div>
                <p className="text-sm font-medium text-buddy-gray-800">{adminName}</p>
                <p className="text-xs text-buddy-gray-500">Activity creator</p>
              </div>
            </div>

            {/* Request notes - hide when already pending */}
            {!isPending && (
            <div>
              <label className="text-sm font-medium text-buddy-gray-800 block mb-1.5">
                Add a note (optional)
              </label>
              <Textarea
                placeholder="e.g. why you want to join, your experience..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={500}
                className="min-h-[80px] resize-none"
              />
              <p className="text-xs text-buddy-gray-400 mt-1">{notes.length}/500</p>
            </div>
            )}
            {isFull && (
              <p className="text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                This activity has reached its maximum number of participants. You cannot send a request at this time.
              </p>
            )}
            {isPending && !isFull && (
              <p className="text-sm text-amber-600 font-medium">
                Your request is pending. The activity creator will review it.
              </p>
            )}
          </div>
          </div>
        </div>

        <DialogFooter className="shrink-0 flex-col-reverse gap-2 border-t px-4 py-3 sm:flex-row sm:justify-end sm:px-6 sm:py-4">
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={isSubmitting}
              className="w-full rounded-full sm:w-auto"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleSendRequest}
            disabled={isSubmitting || isPending || isFull}
            className={
              isPending || isFull
                ? "w-full rounded-full border-amber-500 bg-amber-50 text-amber-700 cursor-not-allowed sm:w-auto"
                : "w-full rounded-full bg-gradient-to-r from-buddy-purple to-buddy-blue text-white sm:w-auto"
            }
          >
            {isPending ? "Pending" : isFull ? "Activity Full" : isSubmitting ? "Sending..." : "Send request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
