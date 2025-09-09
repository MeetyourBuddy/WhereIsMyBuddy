import React, { useState, useEffect } from "react";
import {
  Heart,
  Zap,
  PartyPopper,
  HandMetal,
  ThumbsUp,
  HandHeart,
} from "lucide-react";
import {
  ReactionService,
  ReactionStats,
  UserReaction,
  ReactionType,
} from "@/services/api/activity/reaction.service";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ReactionButtonProps {
  checkInId: string;
  initialStats?: ReactionStats;
  initialUserReaction?: UserReaction | null;
  onStatsUpdate?: (stats: ReactionStats) => void;
}

const reactionConfig = {
  like: { icon: ThumbsUp, label: "Like", color: "text-blue-500" },
  love: { icon: Heart, label: "Love", color: "text-red-500" },
  fire: { icon: Zap, label: "Fire", color: "text-orange-500" },
  rock: { icon: HandMetal, label: "Rock-on", color: "text-purple-500" },
  celebrate: {
    icon: PartyPopper,
    label: "Celebrate",
    color: "text-yellow-500",
  },
  support: { icon: HandHeart, label: "Support", color: "text-green-500" },
};

const ReactionButton: React.FC<ReactionButtonProps> = ({
  checkInId,
  initialStats,
  initialUserReaction,
  onStatsUpdate,
}) => {
  const [stats, setStats] = useState<ReactionStats>(
    initialStats || {
      like: 0,
      love: 0,
      fire: 0,
      rock: 0,
      celebrate: 0,
      support: 0,
      total: 0,
    }
  );
  const [userReaction, setUserReaction] = useState<UserReaction | null>(
    initialUserReaction || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  useEffect(() => {
    // Load initial data if not provided
    if (!initialStats || !initialUserReaction) {
      loadReactionData();
    }
  }, [checkInId]);

  const loadReactionData = async () => {
    try {
      const [statsResponse, userReactionResponse] = await Promise.all([
        ReactionService.getReactionStats(checkInId),
        ReactionService.getUserReaction(checkInId),
      ]);

      setStats(statsResponse.data);
      setUserReaction(userReactionResponse.data);
      onStatsUpdate?.(statsResponse.data);
    } catch (error) {
      console.error("Failed to load reaction data:", error);
    }
  };

  const handleReaction = async (reactionType: ReactionType) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      let newStats: ReactionStats;

      if (userReaction?.type === reactionType) {
        // Remove reaction if it's the same type
        const response = await ReactionService.removeReaction(checkInId);
        newStats = response.data;
        setUserReaction(null);
      } else {
        // Add new reaction
        const response = await ReactionService.addReaction(
          checkInId,
          reactionType
        );
        newStats = response.data;
        setUserReaction({ type: reactionType, hasReacted: true });
      }

      setStats(newStats);
      onStatsUpdate?.(newStats);
      setShowReactions(false); // Hide reactions after selection
    } catch (error) {
      console.error("Failed to update reaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleReactions = () => {
    setShowReactions(!showReactions);
  };

  const getTotalReactions = () => {
    return stats.total;
  };

  const getPrimaryReaction = () => {
    // Find the reaction type with the highest count
    const reactions = Object.entries(stats).filter(
      ([key, value]) => key !== "total" && value > 0
    );

    if (reactions.length === 0) return null;

    const [type, count] = reactions.reduce((max, current) =>
      current[1] > max[1] ? current : max
    );

    return { type: type as ReactionType, count };
  };

  const primaryReaction = getPrimaryReaction();
  const totalReactions = getTotalReactions();

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Horizontal reaction buttons - only show when clicked */}
      {showReactions && (
        <div className="flex items-center gap-1 bg-white rounded-full p-2 shadow-lg border border-buddy-gray-200 animate-fade-in">
          {Object.entries(reactionConfig).map(([type, config]) => {
            const Icon = config.icon;
            const count = stats[type as keyof ReactionStats] as number;
            const isUserReaction = userReaction?.type === type;

            return (
              <button
                key={type}
                onClick={() => handleReaction(type as ReactionType)}
                disabled={isLoading}
                className={`
                  relative p-2 rounded-full transition-all duration-200 hover:scale-110
                  ${
                    isUserReaction
                      ? `${config.color} bg-opacity-20`
                      : "text-buddy-gray-600 hover:bg-buddy-gray-100"
                  }
                  ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}
                title={config.label}
              >
                <Icon
                  className={`w-5 h-5 ${isUserReaction ? "fill-current" : ""}`}
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Main reaction button */}
      <button
        onClick={toggleReactions}
        disabled={isLoading}
        className={`
          relative w-8 h-8 rounded-full border-2 border-transparent 
          hover:border-buddy-gray-200 hover:bg-buddy-gray-200
          transition-all duration-200 flex items-center justify-center
          ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        {userReaction ? (
          React.createElement(reactionConfig[userReaction.type].icon, {
            className: `w-4 h-4 ${reactionConfig[userReaction.type].color} fill-current`,
          })
        ) : (
          <Heart className="w-4 h-4 text-buddy-gray-400" />
        )}

        {/* Show count if user has reacted */}
        {userReaction &&
          stats[userReaction.type as keyof ReactionStats] > 0 && (
            <span className="absolute -top-1 -right-1 bg-buddy-purple text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
              {stats[userReaction.type as keyof ReactionStats]}
            </span>
          )}
      </button>
    </div>
  );
};

export default ReactionButton;
