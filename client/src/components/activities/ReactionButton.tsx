import React, { useState, useEffect, useMemo } from "react";
import { SmilePlus } from "lucide-react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import {
  ReactionService,
  ReactionStats,
  UserReaction,
  ReactionType,
  ReactionWithUser,
} from "@/services/api/activity/reaction.service";
import { useAuth } from "@/store/auth.store";

interface ReactionButtonProps {
  checkInId: string;
  initialStats?: ReactionStats;
  initialUserReaction?: UserReaction | null;
  onStatsUpdate?: (stats: ReactionStats) => void;
}

const REACTION_ORDER: ReactionType[] = [
  "like",
  "love",
  "fire",
  "celebrate",
  "star",
  "rocket",
];

const reactionConfig: Record<
  ReactionType,
  { emoji: string; label: string; shortcode: string; color: string }
> = {
  like: { emoji: "👍", label: "Like", shortcode: "thumbs up", color: "text-blue-500" },
  love: { emoji: "❤️", label: "Love", shortcode: "heart", color: "text-red-500" },
  fire: { emoji: "🔥", label: "Fire", shortcode: "fire", color: "text-orange-500" },
  celebrate: { emoji: "🎉", label: "Celebrate", shortcode: "party", color: "text-yellow-500" },
  star: { emoji: "⭐", label: "Star", shortcode: "star", color: "text-yellow-400" },
  rocket: { emoji: "🚀", label: "Rocket", shortcode: "rocket", color: "text-purple-500" },
};

const ReactionButton: React.FC<ReactionButtonProps> = ({
  checkInId,
  initialStats,
  initialUserReaction,
  onStatsUpdate,
}) => {
  const { user } = useAuth();
  const currentUserId = user?._id ?? user?.id ?? null;

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
  const [reactionsWithUsers, setReactionsWithUsers] = useState<
    ReactionWithUser[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  useEffect(() => {
    if (!initialStats || !initialUserReaction) {
      loadReactionData();
    }
  }, [checkInId]);

  useEffect(() => {
    if (stats.total > 0) {
      ReactionService.getReactionsForCheckIn(checkInId)
        .then((res) => setReactionsWithUsers(res.data ?? []))
        .catch(() => setReactionsWithUsers(null));
    } else {
      setReactionsWithUsers(null);
    }
  }, [checkInId, stats.total]);

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

  /** Group who reacted by reaction type: "you" for logged-in user, names for others */
  const whoReactedByType = useMemo(() => {
    if (!reactionsWithUsers?.length) return {} as Record<ReactionType, string[]>;
    const map: Record<string, string[]> = {};
    for (const r of reactionsWithUsers) {
      const name =
        currentUserId && String(r.user._id) === String(currentUserId)
          ? "you"
          : r.user.name ?? "Unknown";
      if (!map[r.type]) map[r.type] = [];
      map[r.type].push(name);
    }
    return map as Record<ReactionType, string[]>;
  }, [reactionsWithUsers, currentUserId]);

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
      setShowReactions(false);

      // Revalidate who-reacted list so tooltip shows current user immediately
      ReactionService.getReactionsForCheckIn(checkInId)
        .then((res) => setReactionsWithUsers(res.data ?? []))
        .catch(() => {});
    } catch (error) {
      console.error("Failed to update reaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleReactions = () => {
    setShowReactions(!showReactions);
  };

  const totalReactions = stats.total;

  /** Reaction types that have count > 0, in display order */
  const activeReactionTypes = useMemo(
    () =>
      REACTION_ORDER.filter(
        (type) => (stats[type as keyof ReactionStats] as number) > 0
      ),
    [stats]
  );

  return (
    <div className="flex flex-col items-start gap-2">
      {/* Single row, left-aligned: selected reactions (left) + smiley selector (right) */}
      <div className="flex items-center gap-1.5 text-xs text-buddy-gray-600">
        {/* Selected reaction pills with who-reacted tooltip - left */}
        {activeReactionTypes.map((type) => {
          const config = reactionConfig[type];
          const count = stats[type as keyof ReactionStats] as number;
          const names = whoReactedByType[type] ?? [];
          const reactedByText =
            names.length === 0
              ? `${count} reaction${count !== 1 ? "s" : ""}`
              : names.length === 1
                ? names[0]
                : names.length === 2
                  ? `${names[0]} and ${names[1]}`
                  : names.slice(0, -1).join(", ") + " and " + names[names.length - 1];

          return (
            <HoverCard key={type} openDelay={200} closeDelay={100}>
              <HoverCardTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-full px-2 py-1 bg-buddy-gray-50 border border-buddy-gray-200 transition-colors hover:bg-buddy-gray-100 focus:outline-none focus:ring-2 focus:ring-buddy-purple/30"
                >
                  <span>{config.emoji}</span>
                  <span>{count}</span>
                </button>
              </HoverCardTrigger>
              <HoverCardContent
                side="top"
                align="start"
                className="w-auto min-w-[200px] rounded-xl border-0 bg-gray-900 p-3 text-gray-100 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl" aria-hidden>
                    {config.emoji}
                  </span>
                  <div className="text-sm">
                    <span className="font-medium">
                      Reacted by {reactedByText}
                    </span>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          );
        })}
        {/* Smiley button to open reaction popover - always visible, right of selected emojis */}
        <button
          onClick={toggleReactions}
          disabled={isLoading}
          className={`
            relative w-8 h-8 flex-shrink-0 rounded-full border-2 border-transparent 
            hover:border-buddy-gray-200 hover:bg-buddy-gray-200
            transition-all duration-200 flex items-center justify-center
            ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          `}
          title="Add or change reaction"
        >
          <SmilePlus className="h-5 w-5 text-buddy-gray-500" aria-hidden />
        </button>
      </div>

      {/* Emoji selector row - below, left-aligned */}
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
    </div>
  );
};

export default ReactionButton;
