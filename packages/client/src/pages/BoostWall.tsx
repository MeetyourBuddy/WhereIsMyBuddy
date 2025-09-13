import React, { useState, useEffect } from "react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import Container from "@/components/ui/layout/Container";
import {
  Zap,
  Trophy,
  Star,
  Heart,
  Target,
  ArrowLeft,
  MessageCircle,
  UserPlus,
  Gift,
  Rocket,
  Flame,
  Sparkles,
  Crown,
  Shield,
  Compass,
  Lightbulb,
  Rainbow,
  Users,
  Clock,
  Award,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  boostService,
  BoostMessage,
  BoostStats,
  BoostBadge,
} from "@/services/boost.service";

const BoostWall: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("received");
  const [receivedBoosts, setReceivedBoosts] = useState<BoostMessage[]>([]);
  const [sentBoosts, setSentBoosts] = useState<BoostMessage[]>([]);
  const [boostStats, setBoostStats] = useState<BoostStats | null>(null);
  const [boostBadges, setBoostBadges] = useState<BoostBadge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="min-h-screen bg-buddy-gray-100">
      <div className="pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-10 md:pb-12 bg-gradient-to-b from-[#F8F4FF] to-buddy-gray-100">
        <Container>
          <div className="flex flex-col space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-buddy-gray-900 flex items-center gap-3">
                  Boost Wall
                </h1>
              </div>
            </div>
            <p className="text-sm sm:text-base text-buddy-gray-600 max-w-3xl">
              Spread positivity and build connections through encouraging
              messages. The Boost system helps create a supportive community
              where members motivate each other and celebrate achievements
              together.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-4 sm:py-6 md:py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full mb-6 sm:mb-8"
        >
          <TabsList className="mb-4 sm:mb-6 bg-buddy-gray-200/50">
            <div className="flex min-w-max">
              <TabsTrigger
                value="received"
                className="rounded-full text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
              >
                <Gift className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Received Boosts</span>
                <span className="sm:hidden">Received</span>
              </TabsTrigger>
              <TabsTrigger
                value="sent"
                className="rounded-full text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
              >
                <Rocket className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Sent Boosts</span>
                <span className="sm:hidden">Sent</span>
              </TabsTrigger>
              <TabsTrigger
                value="stats"
                className="rounded-full text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
              >
                <Trophy className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Statistics</span>
                <span className="sm:hidden">Stats</span>
              </TabsTrigger>
              <TabsTrigger
                value="badges"
                className="rounded-full text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
              >
                <Award className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Badges</span>
                <span className="sm:hidden">Badges</span>
              </TabsTrigger>
            </div>
          </TabsList>

          <TabsContent value="received" className="space-y-4 sm:space-y-6">
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <Gift className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-700 font-medium mb-2">
                No boosts received yet
              </p>
              <p className="text-gray-600 mb-4 max-w-md mx-auto">
                When someone sends you a boost, it will appear here to brighten
                your day!
              </p>
            </div>
          </TabsContent>

          <TabsContent value="sent" className="space-y-4 sm:space-y-6">
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <Rocket className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-700 font-medium mb-2">
                No boosts sent yet
              </p>
              <p className="text-gray-600 mb-4 max-w-md mx-auto">
                Start spreading positivity by sending boosts to others in your
                community!
              </p>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4 sm:space-y-6">
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <Trophy className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-700 font-medium mb-2">
                No statistics available
              </p>
              <p className="text-gray-600">
                Start sending and receiving boosts to see your statistics!
              </p>
            </div>
          </TabsContent>

          <TabsContent value="badges" className="space-y-4 sm:space-y-6">
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <Award className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-700 font-medium mb-2">
                No badges earned yet
              </p>
              <p className="text-gray-600 mb-4 max-w-md mx-auto">
                Keep sending and receiving boosts to unlock achievement badges!
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </Container>
    </div>
  );
};

export default BoostWall;
