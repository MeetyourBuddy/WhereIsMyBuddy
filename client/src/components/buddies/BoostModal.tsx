import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  Zap,
  Heart,
  Trophy,
  Star,
  Target,
  Check,
  Flame,
  Rocket,
  Sparkles,
  Crown,
  Shield,
  Compass,
  Lightbulb,
  Gift,
  Rainbow,
} from "lucide-react";
import { boostService } from "@/services/boost.service";

interface BoostModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  recipientId: string;
  onBoostSent: () => void;
}

interface BoostMessage {
  id: string;
  text: string;
  icon: React.ReactNode;
  category: string;
  color: string;
}

const BOOST_MESSAGES: BoostMessage[] = [
  {
    id: "energy-1",
    text: "You're crushing it! 🔥",
    icon: <Flame className="w-8 h-8" />,
    category: "Energy & Motivation",
    color: "bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100",
  },
  {
    id: "energy-2",
    text: "Keep that energy up! ⚡",
    icon: <Zap className="w-8 h-8" />,
    category: "Energy & Motivation",
    color: "bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100",
  },
  {
    id: "energy-3",
    text: "You inspire me every day! ✨",
    icon: <Sparkles className="w-8 h-8" />,
    category: "Energy & Motivation",
    color: "bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100",
  },
  {
    id: "strength-1",
    text: "You're stronger than you know! 💪",
    icon: <Shield className="w-8 h-8" />,
    category: "Strength & Persistence",
    color: "bg-red-50 border-red-200 text-red-800 hover:bg-red-100",
  },
  {
    id: "strength-2",
    text: "Every step counts! Keep going! 🚀",
    icon: <Rocket className="w-8 h-8" />,
    category: "Strength & Persistence",
    color: "bg-red-50 border-red-200 text-red-800 hover:bg-red-100",
  },
  {
    id: "strength-3",
    text: "Your dedication is incredible! 🎯",
    icon: <Heart className="w-8 h-8" />,
    category: "Strength & Persistence",
    color: "bg-red-50 border-red-200 text-red-800 hover:bg-red-100",
  },
  {
    id: "celebration-1",
    text: "Amazing progress! 🎉",
    icon: <Trophy className="w-8 h-8" />,
    category: "Celebration & Achievement",
    color: "bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100",
  },
  {
    id: "celebration-2",
    text: "You're doing fantastic! 🏆",
    icon: <Crown className="w-8 h-8" />,
    category: "Celebration & Achievement",
    color: "bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100",
  },
  {
    id: "celebration-3",
    text: "So proud of your journey! 👏",
    icon: <Gift className="w-8 h-8" />,
    category: "Celebration & Achievement",
    color: "bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100",
  },
  {
    id: "support-1",
    text: "We're in this together! 🤝",
    icon: <Star className="w-8 h-8" />,
    category: "Support & Community",
    color: "bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100",
  },
  {
    id: "support-2",
    text: "You've got a whole team behind you! 💫",
    icon: <Rainbow className="w-8 h-8" />,
    category: "Support & Community",
    color: "bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100",
  },
  {
    id: "support-3",
    text: "Your journey motivates us all! 🌟",
    icon: <Lightbulb className="w-8 h-8" />,
    category: "Support & Community",
    color: "bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100",
  },
  {
    id: "focus-1",
    text: "Stay focused, you're doing incredible! 🎯",
    icon: <Target className="w-8 h-8" />,
    category: "Focus & Goals",
    color: "bg-green-50 border-green-200 text-green-800 hover:bg-green-100",
  },
  {
    id: "focus-2",
    text: "Your goals are within reach! 🏁",
    icon: <Compass className="w-8 h-8" />,
    category: "Focus & Goals",
    color: "bg-green-50 border-green-200 text-green-800 hover:bg-green-100",
  },
  {
    id: "focus-3",
    text: "Keep pushing toward your dreams! ✨",
    icon: <Sparkles className="w-8 h-8" />,
    category: "Focus & Goals",
    color: "bg-green-50 border-green-200 text-green-800 hover:bg-green-100",
  },
];

const BoostModal: React.FC<BoostModalProps> = ({
  isOpen,
  onClose,
  recipientName,
  recipientId,
  onBoostSent,
}) => {
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [boostStats, setBoostStats] = useState<{
    dailyLimit: number;
    dailyUsed: number;
  } | null>(null);
  const { toast } = useToast();

  // Load boost stats when modal opens
  React.useEffect(() => {
    if (isOpen) {
      loadBoostStats();
    }
  }, [isOpen]);

  const loadBoostStats = async () => {
    try {
      const stats = await boostService.getBoostStats();
      console.log("Boost stats received:", stats); // Debug log
      setBoostStats({
        dailyLimit: Number(stats?.dailyLimit) || 3,
        dailyUsed: Number(stats?.dailyUsed) || 0,
      });
    } catch (error) {
      console.error("Failed to load boost stats:", error);
      // Fallback to default values
      setBoostStats({
        dailyLimit: 3,
        dailyUsed: 0,
      });
    }
  };

  const remaining = boostStats
    ? boostStats.dailyLimit - boostStats.dailyUsed
    : 0;

  const maxSelectable = Math.min(remaining, 3); // Allow up to 3 messages or remaining limit

  const handleMessageToggle = (messageId: string) => {
    setSelectedMessages((prev) => {
      if (prev.includes(messageId)) {
        return prev.filter((id) => id !== messageId);
      } else if (prev.length < maxSelectable) {
        return [...prev, messageId];
      }
      return prev;
    });
  };

  const handleSendBoost = async () => {
    if (selectedMessages.length === 0) return;

    setIsSending(true);
    try {
      // Send all selected messages using batch endpoint
      const boostRequests = selectedMessages.map((messageId) => ({
        recipientId,
        messageId,
      }));

      const result = await boostService.sendBoostBatch(boostRequests);

      if (result.successful > 0) {
        toast({
          title: "Boosts sent! 🚀",
          description: `${result.successful} boost${result.successful > 1 ? "s" : ""} sent to ${recipientName}.${result.failed > 0 ? ` ${result.failed} boost${result.failed > 1 ? "s" : ""} failed due to daily limit.` : ""}`,
        });
      }

      if (result.failed > 0 && result.successful === 0) {
        toast({
          title: "Failed to send boosts",
          description: result.errors[0]?.error || "Daily boost limit reached.",
          variant: "destructive",
        });
      }

      if (result.successful > 0) {
        onBoostSent();
        onClose();
        setSelectedMessages([]);

        // Refresh boost stats
        await loadBoostStats();
      }
    } catch (error: any) {
      toast({
        title: "Failed to send boosts",
        description: error.response?.data?.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    setSelectedMessages([]);
    onClose();
  };

  // Group messages by category
  const groupedMessages = BOOST_MESSAGES.reduce(
    (acc, message) => {
      if (!acc[message.category]) {
        acc[message.category] = [];
      }
      acc[message.category].push(message);
      return acc;
    },
    {} as Record<string, BoostMessage[]>
  );

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-lg h-[800px] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Zap className="w-6 h-6 text-buddy-purple" />
              Boost {recipientName}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
            {/* Daily Limit Info */}
            <div className="bg-buddy-purple/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-buddy-purple">
                    Daily Boost Limit
                  </h3>
                  <p className="text-sm text-buddy-gray-600">
                    Select up to {maxSelectable} message
                    {maxSelectable > 1 ? "s" : ""} to send
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-buddy-purple">
                    {remaining}
                  </div>
                  <div className="text-xs text-buddy-gray-500">
                    remaining today
                  </div>
                </div>
              </div>
              <div className="mt-2 w-full bg-buddy-gray-200 rounded-full h-2">
                <div
                  className="bg-buddy-purple h-2 rounded-full transition-all duration-300"
                  style={{
                    width: boostStats
                      ? `${(boostStats.dailyUsed / boostStats.dailyLimit) * 100}%`
                      : "0%",
                  }}
                />
              </div>
            </div>

            {/* Selection Counter */}
            {selectedMessages.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-buddy-purple flex-shrink-0">
                <Check className="w-4 h-4" />
                <span>
                  {selectedMessages.length} of {maxSelectable} selected
                </span>
              </div>
            )}

            {/* Boost Messages Grid - Scrollable */}
            <div className="flex-1 flex flex-col space-y-3 min-h-0">
              <h3 className="text-sm font-medium text-buddy-gray-700 flex-shrink-0">
                Choose boost messages:
              </h3>

              <ScrollArea className="flex-1 pr-4">
                <div className="grid grid-cols-3 gap-4 p-4">
                  {BOOST_MESSAGES.map((message) => {
                    const isSelected = selectedMessages.includes(message.id);
                    const isDisabled =
                      !isSelected && selectedMessages.length >= maxSelectable;

                    return (
                      <Tooltip key={message.id}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => handleMessageToggle(message.id)}
                            disabled={isDisabled}
                            className={`
                              relative aspect-square rounded-xl border-2 transition-all duration-200 
                              flex items-center justify-center group
                              ${
                                isSelected
                                  ? "border-buddy-purple bg-buddy-purple/20 scale-105"
                                  : isDisabled
                                    ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-50"
                                    : "border-gray-200 bg-white hover:border-buddy-purple/50 hover:bg-buddy-purple/5 hover:scale-105"
                              }
                              min-h-[60px] sm:min-h-[70px] md:min-h-[80px]
                            `}
                          >
                            <div
                              className={`${isSelected ? "text-buddy-purple" : "text-gray-600 group-hover:text-buddy-purple"}`}
                            >
                              {message.icon}
                            </div>
                            {isSelected && (
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-buddy-purple rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <div className="text-center">
                            <p className="font-medium">{message.text}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {message.category}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>

            {/* Action Buttons - Fixed at bottom */}
            <div className="flex gap-3 flex-shrink-0 border-t border-gray-200 pt-4">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1 rounded-full"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendBoost}
                disabled={
                  selectedMessages.length === 0 || isSending || remaining <= 0
                }
                className="flex-1 rounded-full bg-buddy-purple hover:bg-buddy-purple-dark"
              >
                {isSending ? (
                  "Sending..."
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Send{" "}
                    {selectedMessages.length > 0
                      ? `${selectedMessages.length} Boost${selectedMessages.length > 1 ? "s" : ""}`
                      : "Boost"}
                  </>
                )}
              </Button>
            </div>

            {/* No Boosts Remaining */}
            {remaining <= 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-yellow-800">
                  <Zap className="w-5 h-5" />
                  <span className="font-medium">No boosts remaining today</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  Your daily boost limit has been reached. Come back tomorrow to
                  send more boosts!
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default BoostModal;
