import React, { useState, useEffect } from "react";
import {
  Zap,
  Trophy,
  Star,
  Heart,
  Target,
  Gift,
  Rocket,
  Flame,
  Sparkles,
  Crown,
  Shield,
  Compass,
  Lightbulb,
  Rainbow,
  Sun,
  Moon,
  Info,
  X,
  Users,
  Send,
  MessageCircle,
  TrendingUp,
  Award,
  Loader2,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/store/auth.store";
import { AuthWall } from "@/components/auth/AuthWall";
import { useScrollToTopImmediate } from "@/hooks/use-scroll-to-top";
import { boostService } from "@/services/boost.service";

// Boost message type definitions
interface BoostMessageType {
  id: string;
  text: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  category: string;
  fullMessage: string;
}

// Mock user data interfaces
interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface CardInteraction {
  user: User;
  sentCount: number;
  receivedCount: number;
}

interface UserCardData {
  cardId: string;
  interactions: CardInteraction[];
  totalSent: number;
  totalReceived: number;
}

const BOOST_MESSAGE_TYPES: BoostMessageType[] = [
  // Energy & Motivation
  {
    id: "energy-1",
    text: "You're crushing it! 🔥",
    icon: <Flame className="w-8 h-8" />,
    color: "text-orange-500",
    description: "Encourage others to keep going and stay motivated",
    category: "Energy & Motivation",
    fullMessage:
      "Your dedication and hard work are absolutely inspiring! You're crushing every goal you set and showing everyone what's possible when you put your mind to it. Keep that incredible energy flowing! 🔥",
  },
  {
    id: "energy-2",
    text: "Keep that energy up! ⚡",
    icon: <Zap className="w-8 h-8" />,
    color: "text-yellow-500",
    description: "Motivate others to maintain their momentum",
    category: "Energy & Motivation",
    fullMessage:
      "Your energy is contagious and absolutely electrifying! You have this amazing ability to light up any room and motivate everyone around you. Keep that spark alive and continue being the incredible force of positivity you are! ⚡",
  },
  {
    id: "energy-3",
    text: "You inspire me every day! ✨",
    icon: <Sparkles className="w-8 h-8" />,
    color: "text-purple-500",
    description: "Express how someone's dedication inspires you",
    category: "Energy & Motivation",
    fullMessage:
      "Every single day, you show up with such grace, determination, and kindness that it genuinely inspires me to be a better person. Your journey and your spirit are like a beautiful constellation of hope and possibility! ✨",
  },
  // Strength & Persistence
  {
    id: "strength-1",
    text: "You're stronger than you know! 💪",
    icon: <Shield className="w-8 h-8" />,
    color: "text-blue-500",
    description: "Remind others of their inner strength",
    category: "Strength & Persistence",
    fullMessage:
      "You possess an inner strength that's absolutely remarkable! Even when challenges seem overwhelming, you find a way to rise above them. Your resilience is like an unbreakable shield that protects your dreams and goals! 💪",
  },
  {
    id: "strength-2",
    text: "Every step counts! Keep going! 🚀",
    icon: <Rocket className="w-8 h-8" />,
    color: "text-red-500",
    description: "Encourage persistence and forward movement",
    category: "Strength & Persistence",
    fullMessage:
      "Every single step you take, no matter how small it seems, is propelling you forward like a rocket toward your dreams! Your persistence is your superpower, and it's taking you places you never imagined possible! 🚀",
  },
  {
    id: "strength-3",
    text: "Your dedication is incredible! 🎯",
    icon: <Heart className="w-8 h-8" />,
    color: "text-pink-500",
    description: "Acknowledge someone's commitment and hard work",
    category: "Strength & Persistence",
    fullMessage:
      "Your dedication is absolutely heartwarming and inspiring! You approach everything with such love, care, and commitment that it's impossible not to be moved by your passion. You're hitting every target with precision and heart! 🎯",
  },
  // Celebration & Achievement
  {
    id: "celebration-1",
    text: "Amazing progress! 🎉",
    icon: <Trophy className="w-8 h-8" />,
    color: "text-yellow-600",
    description: "Celebrate achievements and milestones",
    category: "Celebration & Achievement",
    fullMessage:
      "This is absolutely amazing progress! You've worked so hard and it's paying off in the most beautiful ways. You deserve to celebrate this incredible milestone - you've earned every bit of this success! 🎉",
  },
  {
    id: "celebration-2",
    text: "You're doing fantastic! 🏆",
    icon: <Crown className="w-8 h-8" />,
    color: "text-amber-500",
    description: "Recognize excellent performance and effort",
    category: "Celebration & Achievement",
    fullMessage:
      "You're absolutely fantastic and deserve to wear a crown! Your performance has been nothing short of royal - you're setting the gold standard for excellence and showing everyone what true dedication looks like! 🏆",
  },
  {
    id: "celebration-3",
    text: "So proud of your journey! 👏",
    icon: <Gift className="w-8 h-8" />,
    color: "text-green-500",
    description: "Express pride in someone's personal growth",
    category: "Celebration & Achievement",
    fullMessage:
      "I'm so incredibly proud of your journey! You've grown and evolved in such beautiful ways, and it's been a gift to witness your transformation. Your personal growth is inspiring everyone around you! 👏",
  },
  // Support & Community
  {
    id: "support-1",
    text: "We're in this together! 🤝",
    icon: <Star className="w-8 h-8" />,
    color: "text-indigo-500",
    description: "Show solidarity and community support",
    category: "Support & Community",
    fullMessage:
      "We're absolutely in this together, and that's what makes our community so special! Your support and solidarity shine like a bright star, guiding and uplifting everyone around you! 🤝",
  },
  {
    id: "support-2",
    text: "You've got a whole team behind you! 💫",
    icon: <Rainbow className="w-8 h-8" />,
    color: "text-cyan-500",
    description: "Remind others they're not alone in their journey",
    category: "Support & Community",
    fullMessage:
      "You've got an incredible team of supporters behind you, cheering you on every step of the way! Like a beautiful rainbow after the storm, we're here to remind you that you're never alone in this journey! 💫",
  },
  {
    id: "support-3",
    text: "Your journey motivates us all! 🌟",
    icon: <Lightbulb className="w-8 h-8" />,
    color: "text-yellow-400",
    description: "Acknowledge how someone's story inspires others",
    category: "Support & Community",
    fullMessage:
      "Your journey is like a brilliant lightbulb that illuminates the path for all of us! Your story, your struggles, and your triumphs motivate and inspire everyone in our community to keep pushing forward! 🌟",
  },
  // Focus & Goals
  {
    id: "focus-1",
    text: "Stay focused, you're doing incredible! 🎯",
    icon: <Target className="w-8 h-8" />,
    color: "text-red-600",
    description: "Encourage focus and goal-oriented thinking",
    category: "Focus & Goals",
    fullMessage:
      "Your focus is absolutely laser-sharp and it's incredible to watch! You're hitting every target with precision and determination. Keep that amazing focus - it's taking you exactly where you want to go! 🎯",
  },
  {
    id: "focus-2",
    text: "Your goals are within reach! 🏁",
    icon: <Compass className="w-8 h-8" />,
    color: "text-emerald-500",
    description: "Motivate others to keep pursuing their objectives",
    category: "Focus & Goals",
    fullMessage:
      "Your goals are so close you can almost touch them! Like a reliable compass, you've stayed true to your direction and now you're approaching the finish line. The finish line is right there - you've got this! 🏁",
  },
  {
    id: "focus-3",
    text: "Keep pushing toward your dreams! ✨",
    icon: <Sparkles className="w-8 h-8" />,
    color: "text-violet-500",
    description: "Inspire others to chase their aspirations",
    category: "Focus & Goals",
    fullMessage:
      "Keep pushing toward those beautiful dreams of yours! Your determination is like magical sparkles that light up the path to your aspirations. Every step you take brings you closer to making those dreams a reality! ✨",
  },
];

// Mock user data
const MOCK_USERS: User[] = [
  { id: "1", name: "Alex Chen", avatar: "AC" },
  { id: "2", name: "Sarah Johnson", avatar: "SJ" },
  { id: "3", name: "Mike Rodriguez", avatar: "MR" },
  { id: "4", name: "Emma Wilson", avatar: "EW" },
  { id: "5", name: "David Kim", avatar: "DK" },
  { id: "6", name: "Lisa Thompson", avatar: "LT" },
];

// Helper function to process boost data into card data
const processBoostData = (
  receivedBoosts: any[],
  sentBoosts: any[]
): UserCardData[] => {
  const cardDataMap: Record<string, {
    sent: Map<string, number>; // userId -> count
    received: Map<string, number>; // userId -> count
    totalSent: number;
    totalReceived: number;
  }> = {};

  // Process received boosts
  receivedBoosts.forEach((boost) => {
    const messageId = boost.messageId;
    if (!messageId) {
      console.warn("Received boost missing messageId:", boost);
      return;
    }

    if (!cardDataMap[messageId]) {
      cardDataMap[messageId] = {
        sent: new Map(),
        received: new Map(),
        totalSent: 0,
        totalReceived: 0,
      };
    }

    // Extract senderId - handle both populated object and string/ObjectId
    let senderId: string | null = null;
    if (boost.senderId) {
      if (typeof boost.senderId === 'object' && boost.senderId._id) {
        senderId = boost.senderId._id.toString();
      } else if (typeof boost.senderId === 'object' && boost.senderId.id) {
        senderId = boost.senderId.id.toString();
      } else if (typeof boost.senderId === 'string') {
        senderId = boost.senderId;
      } else {
        senderId = String(boost.senderId);
      }
    }

    if (senderId) {
      const currentCount = cardDataMap[messageId].received.get(senderId) || 0;
      cardDataMap[messageId].received.set(senderId, currentCount + 1);
      cardDataMap[messageId].totalReceived++;
    }
  });

  // Process sent boosts
  sentBoosts.forEach((boost) => {
    const messageId = boost.messageId;
    if (!messageId) {
      console.warn("Sent boost missing messageId:", boost);
      return;
    }

    if (!cardDataMap[messageId]) {
      cardDataMap[messageId] = {
        sent: new Map(),
        received: new Map(),
        totalSent: 0,
        totalReceived: 0,
      };
    }

    // Extract recipientId - handle both populated object and string/ObjectId
    let recipientId: string | null = null;
    if (boost.recipientId) {
      if (typeof boost.recipientId === 'object' && boost.recipientId._id) {
        recipientId = boost.recipientId._id.toString();
      } else if (typeof boost.recipientId === 'object' && boost.recipientId.id) {
        recipientId = boost.recipientId.id.toString();
      } else if (typeof boost.recipientId === 'string') {
        recipientId = boost.recipientId;
      } else {
        recipientId = String(boost.recipientId);
      }
    }

    if (recipientId) {
      const currentCount = cardDataMap[messageId].sent.get(recipientId) || 0;
      cardDataMap[messageId].sent.set(recipientId, currentCount + 1);
      cardDataMap[messageId].totalSent++;
    }
  });

  // Convert to UserCardData format
  const userCards: UserCardData[] = Object.entries(cardDataMap).map(([cardId, data]) => {
    // Combine all unique user IDs from sent and received
    const allUserIds = new Set([
      ...Array.from(data.sent.keys()),
      ...Array.from(data.received.keys()),
    ]);

    const interactions: CardInteraction[] = Array.from(allUserIds).map((userId) => {
      // Get user info from boosts
      const sentBoost = sentBoosts.find(
        (b) => (b.recipientId?._id || b.recipientId?.id || b.recipientId) === userId
      );
      const receivedBoost = receivedBoosts.find(
        (b) => (b.senderId?._id || b.senderId?.id || b.senderId) === userId
      );

      const user = sentBoost?.recipientId || receivedBoost?.senderId || {
        id: userId,
        name: "Unknown User",
      };

      return {
        user: {
          id: user._id || user.id || userId,
          name: user.name || "Unknown User",
          avatar: user.avatar,
        },
        sentCount: data.sent.get(userId) || 0,
        receivedCount: data.received.get(userId) || 0,
      };
    });

    return {
      cardId,
      interactions,
      totalSent: data.totalSent,
      totalReceived: data.totalReceived,
    };
  });

  return userCards;
};

// Info Modal Component
const InfoModal = ({ card, isOpen, onClose, isDarkMode, userCardData }) => {
  console.log("InfoModal render:", { isOpen, card: card?.id });
  if (!isOpen || !card) return null;

  const interactions = userCardData?.interactions || [];

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl ${
          isDarkMode
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border border-gray-200"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Motivational Header */}
        <div
          className={`rounded-t-2xl bg-gradient-to-r from-buddy-purple via-buddy-blue to-buddy-green p-6 text-white relative overflow-hidden ${
            isDarkMode ? "from-gray-700 via-gray-600 to-gray-500" : ""
          }`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 rounded-full">
                  {React.cloneElement(card.icon, {
                    className: "w-8 h-8 text-white",
                  })}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{card.category} ✨</h2>
                  <p className="text-white/90 text-sm">{card.description}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/20 transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Send className="w-4 h-4" />
                  <span className="font-semibold">
                    {userCardData?.totalSent || 0}
                  </span>
                </div>
                <p className="text-xs text-white/80">Sent</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <Users className="w-4 h-4" />
                  <span className="font-semibold">
                    {userCardData?.totalReceived || 0}
                  </span>
                </div>
                <p className="text-xs text-white/80">Received</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-semibold">{interactions.length}</span>
                </div>
                <p className="text-xs text-white/80">Connections</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Full Message */}
          <div
            className={`mb-6 p-4 rounded-xl border ${
              isDarkMode
                ? "bg-gradient-to-r from-gray-700/50 to-gray-600/50 border-gray-600"
                : "bg-gradient-to-r from-green-50 to-blue-50 border-green-200"
            }`}
          >
            <div className="flex items-start space-x-3">
              <MessageCircle className={`w-5 h-5 mt-0.5 ${card.color}`} />
              <div>
                <p
                  className={`text-sm leading-relaxed ${
                    isDarkMode ? "text-gray-300" : "text-green-700"
                  }`}
                >
                  {card.fullMessage}
                </p>
              </div>
            </div>
          </div>

          {/* Community Interactions */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="w-5 h-5 text-pink-500" />
              <h3
                className={`font-semibold text-lg ${
                  isDarkMode ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Community Love 💕
              </h3>
            </div>

            <ScrollArea className="h-64 w-full">
              <div className="space-y-3 pr-4">
                {interactions.map((interaction, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border hover:shadow-md transition-all duration-200 ${
                      isDarkMode
                        ? "bg-gradient-to-r from-gray-700/50 to-gray-600/50 border-gray-600"
                        : "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12 border-2 border-white shadow-lg">
                          <AvatarImage 
                            src={interaction.user.avatar} 
                            alt={interaction.user.name || "User"} 
                          />
                          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-bold text-sm">
                            {interaction.user.name?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div
                            className={`font-semibold ${
                              isDarkMode ? "text-gray-200" : "text-gray-800"
                            }`}
                          >
                            {interaction.user.name}
                          </div>
                          <div
                            className={`text-xs ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Boost Buddy
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="flex items-center space-x-1">
                            <Send className="w-4 h-4 text-blue-500" />
                            <span className="text-lg font-bold text-blue-600">
                              {interaction.sentCount}
                            </span>
                          </div>
                          <div
                            className={`text-xs ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Sent to you
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4 text-pink-500" />
                            <span className="text-lg font-bold text-pink-600">
                              {interaction.receivedCount}
                            </span>
                          </div>
                          <div
                            className={`text-xs ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            You sent
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`p-6 pt-0 rounded-b-2xl ${
            isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
          }`}
        >
          <div
            className={`flex items-center justify-center space-x-2 text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span>Keep spreading the positive energy!</span>
            <Sparkles className="w-4 h-4 text-yellow-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

const CardDeck = ({ category, cards, isDarkMode, categoryIcon, isGuest, userCardsData }) => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getUserCards = () => {
    const userCardIds = userCardsData.map((data) => data.cardId);
    return cards.filter((card) => userCardIds.includes(card.id));
  };

  const userCards = getUserCards();
  const hasCards = userCards.length > 0;

  const handleInfoClick = (card) => {
    console.log("Info clicked for card:", card.id);
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  if (isGuest || !hasCards) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="relative w-48 h-64">
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`w-full h-full rounded-xl flex flex-col items-center justify-center text-center border-2 border-dashed transition-all duration-300 ${
                isDarkMode
                  ? "bg-gray-800/30 border-gray-600/50"
                  : "bg-gray-100/50 border-gray-300/50"
              }`}
            >
              <div className="mb-3">{categoryIcon}</div>
              <h4
                className={`text-sm font-medium mb-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {category}
              </h4>
              <p
                className={`text-xs ${
                  isDarkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {isGuest ? "Sign in to collect" : "No cards collected yet"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="relative w-48 h-64">
          {userCards.slice(0, 3).map((card, index) => {
            const userCardData = userCardsData.find(
              (data) => data.cardId === card.id
            );
            const totalCards = Math.min(userCards.length, 3);
            const centerIndex = Math.floor(totalCards / 2);

            // Calculate positioning similar to the reference image
            const offsetX = (index - centerIndex) * 25;
            const offsetY = Math.abs(index - centerIndex) * 5;
            const rotation = (index - centerIndex) * 15;
            const zIndex = totalCards - Math.abs(index - centerIndex);
            const scale = 1 - Math.abs(index - centerIndex) * 0.05;

            const isHovered = hoveredCard === card.id;

            return (
              <div
                key={card.id}
                className="absolute inset-0 transition-all duration-500 ease-out cursor-pointer"
                style={{
                  transform: isHovered
                    ? `translateX(${offsetX}px) translateY(${offsetY - 20}px) rotate(${rotation * 0.3}deg) scale(1.05)`
                    : `translateX(${offsetX}px) translateY(${offsetY}px) rotate(${rotation}deg) scale(${scale})`,
                  zIndex: isHovered ? 10 : zIndex,
                  transformOrigin: "center center",
                }}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  className={`w-full h-full rounded-xl shadow-lg transition-shadow duration-300 ${
                    isHovered ? "shadow-2xl" : "shadow-lg"
                  } ${
                    isDarkMode
                      ? "bg-gray-800 border border-gray-700"
                      : "bg-white border border-gray-200"
                  }`}
                  style={{
                    background: isDarkMode
                      ? "linear-gradient(135deg, rgb(31, 41, 55) 0%, rgb(17, 24, 39) 100%)"
                      : "linear-gradient(135deg, rgb(255, 255, 255) 0%, rgb(249, 250, 251) 100%)",
                  }}
                >
                  {/* Watermark Icon - Big and behind content */}
                  <div className="absolute inset-0 flex items-start justify-center pointer-events-none">
                    <div className={`opacity-30 ${card.color}`}>
                      {React.cloneElement(card.icon, {
                        className: "w-[140px] h-[140px] mt-6",
                      })}
                    </div>
                  </div>

                  {/* Card number indicator */}
                  <div className="absolute top-3 left-3 z-10">
                    <div
                      className={`text-xs font-bold px-2 py-1 rounded-full ${
                        isDarkMode
                          ? "bg-gray-700/50 text-gray-300"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>
                  </div>

                  {/* Info icon */}
                  <div className="absolute top-3 right-3 z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleInfoClick(card);
                      }}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-110 ${
                        isDarkMode
                          ? "bg-gray-700/70 hover:bg-gray-600/70 border border-gray-600/50"
                          : "bg-gray-100/80 hover:bg-gray-200/80 border border-gray-300/50"
                      }`}
                      title={`View details for ${card.text}`}
                    >
                      <Info
                        className={`w-3 h-3 ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-4 h-full flex flex-col items-center justify-end text-center relative z-10">
                    {/* Stats */}
                    <div className="mb-3">
                      <div
                        className={`text-lg font-bold ${
                          isDarkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {userCardData?.totalSent || 0}/
                        {userCardData?.totalReceived || 0}
                      </div>
                      <div
                        className={`text-xs ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Sent/Received
                      </div>
                    </div>

                    {/* Message */}
                    <p
                      className={`text-xs leading-relaxed px-2 ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {card.text}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Modal */}
      <InfoModal
        card={selectedCard}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isDarkMode={isDarkMode}
        userCardData={userCardsData.find((data) => data.cardId === selectedCard?.id)}
      />
    </>
  );
};

const BoostWall = () => {
  useScrollToTopImmediate();
  const { isAuthenticated, user } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userCardsData, setUserCardsData] = useState<UserCardData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's boost data
  useEffect(() => {
    const fetchBoostData = async () => {
      if (!isAuthenticated || !user?._id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch all received and sent boosts (with high limit to get all)
        const [receivedResponse, sentResponse] = await Promise.all([
          boostService.getReceivedBoosts(1, 1000),
          boostService.getSentBoosts(1, 1000),
        ]);

        console.log("Received boosts response:", receivedResponse);
        console.log("Sent boosts response:", sentResponse);

        const receivedBoosts = receivedResponse?.boosts || [];
        const sentBoosts = sentResponse?.boosts || [];

        console.log("Received boosts:", receivedBoosts);
        console.log("Sent boosts:", sentBoosts);

        // Process the data into card format
        const processedCards = processBoostData(receivedBoosts, sentBoosts);
        console.log("Processed cards:", processedCards);
        setUserCardsData(processedCards);
      } catch (err: any) {
        console.error("Failed to fetch boost data:", err);
        setError(err.message || "Failed to load boost data");
        setUserCardsData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBoostData();
  }, [isAuthenticated, user?._id]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const categories = [
    {
      name: "Energy & Motivation",
      icon: (
        <Flame
          className={`w-6 h-6 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
        />
      ),
      cards: BOOST_MESSAGE_TYPES.filter(
        (type) => type.category === "Energy & Motivation"
      ),
    },
    {
      name: "Strength & Persistence",
      icon: (
        <Shield
          className={`w-6 h-6 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
        />
      ),
      cards: BOOST_MESSAGE_TYPES.filter(
        (type) => type.category === "Strength & Persistence"
      ),
    },
    {
      name: "Celebration & Achievement",
      icon: (
        <Trophy
          className={`w-6 h-6 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
        />
      ),
      cards: BOOST_MESSAGE_TYPES.filter(
        (type) => type.category === "Celebration & Achievement"
      ),
    },
    {
      name: "Support & Community",
      icon: (
        <Star
          className={`w-6 h-6 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
        />
      ),
      cards: BOOST_MESSAGE_TYPES.filter(
        (type) => type.category === "Support & Community"
      ),
    },
    {
      name: "Focus & Goals",
      icon: (
        <Target
          className={`w-6 h-6 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}
        />
      ),
      cards: BOOST_MESSAGE_TYPES.filter(
        (type) => type.category === "Focus & Goals"
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pastel-purple/30 via-white to-pastel-blue/40 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-buddy-purple mx-auto mb-4" />
          <p className="text-buddy-gray-600">Loading your boost collection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pastel-purple/30 via-white to-pastel-blue/40 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-buddy-purple text-white rounded-full"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${
          isDarkMode
            ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
            : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
        }`}
      >
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-pulse mx-auto"></div>
          </div>
          <h3
            className={`text-xl font-semibold mb-2 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Loading Boost Collection
          </h3>
          <p className={`${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            Preparing your card collection...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
      }`}
    >
      {/* Header */}
      <div
        className={`pt-8 pb-12 transition-colors duration-500 ${
          isDarkMode
            ? "bg-gradient-to-b from-gray-800/50 to-transparent"
            : "bg-gradient-to-b from-purple-50/50 to-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <h1
                  className={`text-3xl md:text-4xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Boost Collection
                </h1>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                  isDarkMode
                    ? "text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="max-w-4xl">
              <p
                className={`max-w-3xl ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Track your boost journey! This collection shows how you're doing
                with boosting others and being boosted. Each category represents
                a different type of encouragement you can give and receive.
                Build your collection and watch your community impact grow!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Card Decks */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {categories.map((category) => (
            <div key={category.name} className="space-y-4">
              <div className="text-center">
                <h3
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {category.name}
                </h3>
              </div>
              <CardDeck
                category={category.name}
                cards={category.cards}
                isDarkMode={isDarkMode}
                categoryIcon={category.icon}
                isGuest={!isAuthenticated}
                userCardsData={userCardsData}
              />
            </div>
          ))}
        </div>

        {/* Guest CTA */}
        {!isAuthenticated && (
          <div className="mt-12 mx-auto">
            <AuthWall
              title="Sign in to build your boost collection"
              description="Send and receive motivational boosts, track your community impact, and collect unique boost cards as you encourage others."
              benefits={[
                "Send unlimited motivational boosts",
                "Collect boost cards as you engage",
                "Track your community impact",
              ]}
              returnToAfterAuth="/boost-wall"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BoostWall;
