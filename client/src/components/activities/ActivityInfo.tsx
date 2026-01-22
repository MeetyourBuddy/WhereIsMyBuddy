import React, { useState } from "react";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  AlertTriangle,
  Shield,
  Info,
  UserPlus,
  UserMinus,
  Users,
  Target,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/store/auth.store";
import { useToast } from "@/hooks/use-toast";
import Avatar from "@/components/common/Avatar";
import {
  isActivityCreator,
  isActivityParticipant,
} from "@/types/activity-types";
import { useActivityData } from "@/hooks/useActivityData";

interface ActivityInfoProps {
  id?: string;
  title: string;
  description: string;
  category: string;
  location?: string;
  startDate: Date;
  endDate: Date;
  duration: string;
  frequency: string;
  tags?: string[];
  goals?: string[];
  participants?: any[];
  admin?: {
    _id: string;
    id?: string; // Some APIs use 'id' instead of '_id'
    name: string;
    email: string;
    avatar?: string;
  };
  rules?: {
    _id: string;
    title: string;
    description?: string;
    isDefault: boolean;
  }[];
  isActivityEnded?: boolean;
}

const ActivityInfo: React.FC<ActivityInfoProps> = ({
  id,
  title,
  description,
  category,
  location,
  startDate,
  endDate,
  duration,
  frequency,
  tags,
  goals,
  participants = [],
  admin,
  rules,
  isActivityEnded = false,
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { joinActivityMutation, quitActivityMutation } = useActivityData(id);
  const [isJoining, setIsJoining] = useState(false);
  const [showQuitModal, setShowQuitModal] = useState(false);
  
  // Check if either mutation is pending
  const isLoading = joinActivityMutation.isPending || quitActivityMutation.isPending;

  // Check if user is a participant and creator using helper functions
  // Use both _id and id fields to handle different API responses
  const userId = user?._id || user?.id;
  const isParticipant = isActivityParticipant(
    { participants, admin } as any,
    userId
  );
  const isCreator = isActivityCreator({ admin } as any, userId);

  const handleJoinQuit = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to join activities",
        variant: "destructive",
      });
      return;
    }

    if (!id) {
      toast({
        title: "Error",
        description: "Activity ID is missing",
        variant: "destructive",
      });
      return;
    }

    // If user is a participant, show confirmation modal
    if (isParticipant) {
      setShowQuitModal(true);
      return;
    }

    // Otherwise, join the activity
    setIsJoining(true);
    try {
      await joinActivityMutation.mutateAsync(id);
      // Toast is handled by the mutation
    } catch (error: any) {
      // Error toast is handled by the mutation, but we can add additional handling here if needed
      console.error("Activity join/quit error:", error);
    } finally {
      setIsJoining(false);
    }
  };

  const handleConfirmQuit = async () => {
    if (!id) return;

    setIsJoining(true);
    setShowQuitModal(false);
    try {
      await quitActivityMutation.mutateAsync(id);
      // Toast is handled by the mutation
    } catch (error: any) {
      // Error toast is handled by the mutation
      console.error("Activity quit error:", error);
    } finally {
      setIsJoining(false);
    }
  };
  // Add validation
  const formattedStartDate =
    startDate instanceof Date && !isNaN(startDate.getTime())
      ? format(startDate, "MMM d, yyyy")
      : "Invalid date";
  const formattedEndDate =
    endDate instanceof Date && !isNaN(endDate.getTime())
      ? format(endDate, "MMM d, yyyy")
      : "Invalid date";

  return (
    <Card className="p-5 bg-white rounded-xl">
      <h3 className="text-lg font-semibold text-buddy-gray-800 mb-4 flex items-center">
        <Info className="h-5 w-5 mr-2 text-buddy-purple" />
        About This Activity
      </h3>

      <div className="space-y-5">
        {/* Description */}
        <div>
          <p className="text-sm text-buddy-gray-600 leading-relaxed text-justify">
            {description}
          </p>
        </div>

        {/* Join/Quit Button or Creator Badge */}
        {id && (
          <div className="w-full flex justify-center">
            {isCreator ? (
              <div className="w-full flex justify-center">
                <Badge className="flex w-full items-center justify-center bg-gradient-to-r from-buddy-purple to-buddy-blue text-white px-4 py-2 text-sm font-medium">
                  <Shield className="w-4 h-4 mr-2" />
                  ACTIVITY CREATOR
                </Badge>
              </div>
            ) : isActivityEnded ? (
              <div className="w-full flex justify-center">
                <Badge className="flex w-full items-center justify-center bg-red-100 text-red-700 border border-red-200 px-4 py-2 text-sm font-medium">
                  Activity Ended
                </Badge>
              </div>
            ) : (
              <Button
                onClick={handleJoinQuit}
                disabled={isJoining || isLoading}
                className={`w-full rounded-full ${
                  isParticipant
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-buddy-purple hover:bg-buddy-purple/90 text-white"
                }`}
              >
                {isParticipant ? (
                  <>
                    <UserMinus className="w-4 h-4 mr-2" />
                    {isJoining ? "Leaving..." : "Quit Activity"}
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    {isJoining ? "Joining..." : "Join Activity"}
                  </>
                )}
              </Button>
            )}
          </div>
        )}

        {/* Key Details */}
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Calendar className="h-4 w-4 text-buddy-purple mt-0.5" />
            <div>
              <h4 className="text-xs font-medium text-buddy-gray-500 mb-1">
                Date Range
              </h4>
              <p className="text-sm text-buddy-gray-800 font-medium">
                {formattedStartDate} - {formattedEndDate}
              </p>
              <p className="text-xs text-buddy-gray-500">
                {duration} ({frequency})
              </p>
            </div>
          </div>

          {/* <div className="flex items-start space-x-3">
            <MapPin className="h-4 w-4 text-buddy-green mt-0.5" />
            <div>
              <h4 className="text-xs font-medium text-buddy-gray-500 mb-1">Location</h4>
              <p className="text-sm text-buddy-gray-800">{location}</p>
            </div>
          </div> */}
        </div>

        {/* Goals */}
        {goals && goals.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-buddy-gray-500 mb-2 flex items-center">
              <Target className="h-4 w-4 text-buddy-green mr-1" />
              Activity Goals
            </h4>
            <div className="space-y-2">
              {goals.map((goal, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 rounded-full bg-buddy-green mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-buddy-gray-700 leading-relaxed">
                    {goal}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        <div>
          <h4 className="text-xs font-medium text-buddy-gray-500 mb-2 flex items-center">
            <Tag className="h-4 w-4 text-buddy-blue mr-1" />
            Tags
          </h4>
          <div className="flex flex-wrap gap-2">
            {tags?.map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-buddy-purple/10 text-buddy-purple border-buddy-purple/20 text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Rules */}
        <div>
          <h4 className="text-xs font-medium text-buddy-gray-500 mb-2 flex items-center">
            <FileText className="h-4 w-4 text-buddy-purple mr-1" />
            Rules & Guidelines
          </h4>
          <Accordion type="multiple" className="w-full">
            {rules?.map((rule) => (
              <AccordionItem
                key={rule._id}
                value={rule._id}
                className="border-b border-buddy-gray-100"
              >
                <AccordionTrigger className="py-2 text-sm hover:no-underline">
                  <div className="flex items-start text-left">
                    <CheckCircle2
                      className={`h-3 w-3 mt-1 mr-2 ${rule.isDefault ? "text-buddy-gray-500" : "text-buddy-purple"}`}
                    />
                    <span className="text-sm text-buddy-gray-700 font-medium">
                      {rule.title}
                      {rule.isDefault && (
                        <Badge
                          variant="outline"
                          className="ml-2 text-xs bg-buddy-gray-100 text-buddy-gray-700 border-buddy-gray-200"
                        >
                          Default
                        </Badge>
                      )}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="ml-5 text-sm text-buddy-gray-600">
                  {rule.description ||
                    "No additional details provided for this rule."}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Activity Creator */}
        {admin && (
          <div className="pt-4 border-t border-buddy-gray-100">
            <h4 className="text-xs font-medium text-buddy-gray-500 mb-3 flex items-center">
              <Users className="h-4 w-4 text-buddy-purple mr-1" />
              Activity Creator
            </h4>
            <div className="flex items-center space-x-3">
              <Avatar
                size="sm"
                src={admin.avatar}
                className="rounded-full border-2 border-buddy-purple/20"
              />
              <div>
                <p className="text-sm font-medium text-buddy-gray-800">
                  {admin.name}
                </p>
                <p className="text-xs text-buddy-gray-500">
                  Activity Administrator
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quit Activity Confirmation Modal */}
      <Dialog open={showQuitModal} onOpenChange={setShowQuitModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Confirm Quit Activity
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to quit this activity?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-buddy-gray-700">
              If you quit this activity, <strong>all your progress will be lost</strong>, including:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-buddy-gray-600 list-disc list-inside">
              <li>All check-ins you've completed</li>
              <li>Your current streak</li>
              <li>Your progress percentage</li>
              <li>All activity statistics</li>
            </ul>
            <p className="mt-4 text-sm font-medium text-buddy-gray-800">
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowQuitModal(false)}
              disabled={isJoining}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmQuit}
              disabled={isJoining}
              className="bg-red-500 hover:bg-red-600"
            >
              {isJoining ? "Leaving..." : "Yes, Quit Activity"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ActivityInfo;
