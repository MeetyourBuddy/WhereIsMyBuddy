
import React, { useState } from "react";
import { CheckCircle, Info, Flame, Award, PlusCircle } from "lucide-react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { CheckInDialog } from "./CheckInDialog";
import CheckInCard from "./CheckInCard";

interface ActivityCheckinProps {
  activityId: string;
  streakCount: number;
  totalDays: number;
  daysCompleted: number;
}

const ActivityCheckin: React.FC<ActivityCheckinProps> = ({ 
  activityId, 
  streakCount, 
  totalDays, 
  daysCompleted 
}) => {
  const [lastCheckIn, setLastCheckIn] = useState<Date | null>(null);

  // Calculate if user missed yesterday's check-in
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const missedYesterday = !lastCheckIn || lastCheckIn.getDate() !== yesterdayDate.getDate();

  // Mock badges data
  const badges = [
    { id: 1, name: "First Check-in", icon: <CheckCircle className="w-6 h-6 text-buddy-green" />, earned: true },
    { id: 2, name: "3-Day Streak", icon: <Flame className="w-6 h-6 text-amber-500" />, earned: true },
    { id: 3, name: "7-Day Streak", icon: <Flame className="w-6 h-6 text-amber-500" />, earned: false },
    { id: 4, name: "Half-way Hero", icon: <Award className="w-6 h-6 text-buddy-purple" />, earned: false },
    { id: 5, name: "Completion Star", icon: <Award className="w-6 h-6 text-buddy-blue" />, earned: false },
  ];

  // Mock check-in period data
  const checkInPeriods = [
    {
      date: new Date(),
      title: "Day 15: Focus on Breathing",
      description: "Today we focus on deep breathing techniques to enhance your yoga practice.",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80",
      totalParticipants: 12,
      checkedInParticipants: 8,
      comments: 5,
      likes: 12,
      isCheckedIn: false
    },
    {
      date: new Date(new Date().setDate(new Date().getDate() - 1)),
      title: "Day 14: Balance Poses",
      description: "Practice balance poses to improve stability and focus.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
      totalParticipants: 12,
      checkedInParticipants: 10,
      comments: 3,
      likes: 15,
      isCheckedIn: true
    },
    {
      date: new Date(new Date().setDate(new Date().getDate() - 2)),
      title: "Day 13: Core Strength",
      description: "Build core strength with these foundational poses.",
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80",
      totalParticipants: 12,
      checkedInParticipants: 7,
      comments: 8,
      likes: 9,
      isCheckedIn: true
    }
  ];

  return (
    <div className="p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        <div className="lg:col-span-8">
          <Card className="p-4 md:p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Check-in History</h3>
              <Badge variant="outline" className="bg-buddy-purple/10 text-buddy-purple border-buddy-purple/20">
                Day {daysCompleted + 1} of {totalDays}
              </Badge>
            </div>
            
            {missedYesterday && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start">
                  <Info className="text-amber-500 w-5 h-5 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800">Oops! You missed yesterday's check-in</h4>
                    <p className="text-amber-700 text-sm mt-1">
                      Don't give up! Keep going with your activity today. Consistency builds habits!
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              {checkInPeriods.map((period, index) => (
                <CheckInCard
                  key={index}
                  activityId={activityId}
                  date={period.date}
                  title={period.title}
                  description={period.description}
                  image={period.image}
                  totalParticipants={period.totalParticipants}
                  checkedInParticipants={period.checkedInParticipants}
                  comments={period.comments}
                  likes={period.likes}
                  isCheckedIn={period.isCheckedIn}
                />
              ))}
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-4">
          <Card className="p-4 md:p-6">
            <h3 className="text-lg font-semibold mb-4">Your Progress</h3>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-buddy-gray-600">Days Completed</span>
                <span className="text-sm font-medium">{daysCompleted} of {totalDays}</span>
              </div>
              <Progress value={(daysCompleted / totalDays) * 100} className="h-2 bg-buddy-gray-200">
                <div className="h-full bg-gradient-to-r from-buddy-purple to-buddy-blue rounded-full" />
              </Progress>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-5 h-5 text-amber-500" />
                <span className="font-semibold text-buddy-gray-800">Current Streak</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="w-full bg-buddy-gray-100 h-8 rounded-full overflow-hidden relative">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-700"
                    style={{ width: `${(streakCount / 7) * 100}%` }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                    {streakCount} day{streakCount !== 1 ? 's' : ''}
                  </div>
                </div>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <button className="text-buddy-gray-400 hover:text-buddy-gray-600 ml-2">
                      <Info className="h-5 w-5" />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 p-4">
                    <h5 className="font-medium mb-2">Streak Information</h5>
                    <p className="text-sm text-buddy-gray-600 mb-3">
                      Your streak increases by 1 each day you check in. If you miss a day, your streak will reset to 0.
                    </p>
                    <div className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span>Current streak:</span>
                        <span className="font-medium">{streakCount} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Best streak:</span>
                        <span className="font-medium">14 days</span>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <div className="flex justify-between mt-1 text-xs text-buddy-gray-500 px-1">
                <span>0</span>
                <span>7 days</span>
              </div>
            </div>
            
            <Separator className="my-5" />
            
            <div className="pt-2 mb-6">
              <CheckInDialog activityId={activityId}>
                <Button 
                  className="w-full py-2 bg-gradient-to-r from-buddy-purple to-buddy-blue text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Check-in for Today
                </Button>
              </CheckInDialog>
            </div>
            
            {/* Badges section moved here */}
            <h3 className="text-lg font-semibold mb-4">Your Badges</h3>
            <div className="grid grid-cols-2 gap-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3 border rounded-lg text-center transition-all ${
                    badge.earned
                      ? "border-buddy-purple/30 bg-buddy-purple/5"
                      : "border-buddy-gray-200 bg-buddy-gray-50 opacity-60"
                  }`}
                >
                  <div className={`w-10 h-10 mx-auto mb-2 flex items-center justify-center rounded-full ${
                    badge.earned ? "bg-buddy-purple/10" : "bg-buddy-gray-200"
                  }`}>
                    {badge.icon}
                  </div>
                  <p className={`text-xs font-medium ${
                    badge.earned ? "text-buddy-gray-800" : "text-buddy-gray-500"
                  }`}>
                    {badge.name}
                  </p>
                  <p className="text-xs text-buddy-gray-500 mt-1">
                    {badge.earned ? "Earned" : "Locked"}
                  </p>
                </div>
              ))}
              <div className="p-3 border border-dashed border-buddy-gray-300 rounded-lg text-center bg-buddy-gray-50 flex flex-col items-center justify-center">
                <PlusCircle className="w-10 h-10 text-buddy-gray-400 mb-1" />
                <p className="text-xs font-medium text-buddy-gray-500">More to unlock!</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ActivityCheckin;
