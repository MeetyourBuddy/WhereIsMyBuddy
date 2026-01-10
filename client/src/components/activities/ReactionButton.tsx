import React, { useState, useEffect } from "react";
import {
  ReactionService,
  ReactionStats,
  UserReaction,
  ReactionType,
} from "@/services/api/activity/reaction.service";

interface ReactionButtonProps {
  checkInId: string;
  initialStats?: ReactionStats;
  initialUserReaction?: UserReaction | null;
  onStatsUpdate?: (stats: ReactionStats) => void;
}

const reactionConfig = {
  like: { emoji: "👍", label: "Like", color: "text-blue-500" },
  love: { emoji: "❤️", label: "Love", color: "text-red-500" },
  fire: { emoji: "🔥", label: "Fire", color: "text-orange-500" },
  celebrate: { emoji: "🎉", label: "Celebrate", color: "text-yellow-500" },
  star: { emoji: "⭐", label: "Star", color: "text-yellow-400" },
  rocket: { emoji: "🚀", label: "Rocket", color: "text-purple-500" },
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
      celebrate: 0,
      star: 0,
      rocket: 0,
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
      {/* Horizontal emoji reaction buttons - only show when clicked */}
      {showReactions && (
        <div className="flex items-center gap-1 bg-white rounded-full p-2 shadow-lg border border-buddy-gray-200 animate-fade-in">
          {Object.entries(reactionConfig).map(([type, config]) => {
            const count = stats[type as keyof ReactionStats] as number;
            const isUserReaction = userReaction?.type === type;

            return (
              <button
                key={type}
                onClick={() => handleReaction(type as ReactionType)}
                disabled={isLoading}
                className={`
                  relative w-10 h-10 rounded-full transition-all duration-200 hover:scale-110 flex items-center justify-center
                  ${
                    isUserReaction
                      ? "bg-buddy-purple/20 border-2 border-buddy-purple shadow-md"
                      : "bg-buddy-gray-100 hover:bg-buddy-gray-200 border border-buddy-gray-200"
                  }
                  ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}
                title={config.label}
              >
                <span className="text-lg">{config.emoji}</span>
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-buddy-purple text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                    {count}
                  </span>
                )}
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
          <span className="text-lg">
            {reactionConfig[userReaction.type].emoji}
          </span>
        ) : (
          <span className="text-lg">❤️</span>
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
