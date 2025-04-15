
import React, { useState } from "react";
import { format, isToday, isSameDay, parseISO, addDays } from "date-fns";
import { Calendar as CalendarIcon, Info, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/common/Card";
import Avatar from "@/components/common/Avatar";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";

interface ActivityScheduleProps {
  activityId: string;
}

interface CheckIn {
  id: string;
  date: string;
  status: "completed" | "missed" | "upcoming";
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  notes?: string;
  time?: string;
  title?: string;
  category?: string;
  color?: string;
}

const ActivitySchedule: React.FC<ActivityScheduleProps> = ({ activityId }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const checkIns: CheckIn[] = [
    ...Array.from({ length: 10 }).map((_, i) => ({
      id: `past-${i}`,
      date: format(addDays(new Date(), -i - 1), "yyyy-MM-dd"),
      status: Math.random() > 0.3 ? "completed" as const : "missed" as const,
      user: {
        id: "1",
        name: "Sophia Kim",
        avatar: "/placeholder.svg"
      },
      notes: Math.random() > 0.5 ? "Great morning session!" : undefined,
      time: "08:30 AM",
      title: ["Morning Yoga", "Daily Meditation", "Fitness Check", "Coding Practice"][Math.floor(Math.random() * 4)],
      category: ["Personal", "Fitness", "Work", "Learning"][Math.floor(Math.random() * 4)],
      color: ["#4f46e5", "#0ea5e9", "#10b981", "#f97316"][Math.floor(Math.random() * 4)]
    })),
    
    {
      id: "today",
      date: format(new Date(), "yyyy-MM-dd"),
      status: "upcoming" as const,
      user: {
        id: "1",
        name: "Sophia Kim",
        avatar: "/placeholder.svg"
      },
      time: "08:30 AM",
      title: "Morning Yoga",
      category: "Fitness",
      color: "#4f46e5"
    },
    
    ...Array.from({ length: 14 }).map((_, i) => ({
      id: `future-${i}`,
      date: format(addDays(new Date(), i + 1), "yyyy-MM-dd"),
      status: "upcoming" as const,
      user: {
        id: "1",
        name: "Sophia Kim",
        avatar: "/placeholder.svg"
      },
      time: "08:30 AM",
      title: ["Morning Yoga", "Daily Meditation", "Fitness Check", "Coding Practice"][Math.floor(Math.random() * 4)],
      category: ["Personal", "Fitness", "Work", "Learning"][Math.floor(Math.random() * 4)],
      color: ["#4f46e5", "#0ea5e9", "#10b981", "#f97316"][Math.floor(Math.random() * 4)]
    })),
  ];
  
  const getCheckInsForDate = (date: Date | undefined) => {
    if (!date) return [];
    
    return checkIns.filter(checkIn => {
      const checkInDate = parseISO(checkIn.date);
      return isSameDay(checkInDate, date);
    });
  };
  
  const selectedDateCheckIns = getCheckInsForDate(selectedDate);
  
  const getDateClassNames = (date: Date) => {
    const checkInsOnDate = checkIns.filter(checkIn => {
      const checkInDate = parseISO(checkIn.date);
      return isSameDay(checkInDate, date);
    });
    
    if (checkInsOnDate.length === 0) return "";
    
    const status = checkInsOnDate[0].status;
    
    if (status === "completed") {
      return "bg-buddy-green/20 text-buddy-green-dark rounded-full";
    } else if (status === "missed") {
      return "bg-buddy-gray-300/30 text-buddy-gray-600 rounded-full";
    } else if (status === "upcoming") {
      return "bg-buddy-blue/10 text-buddy-blue-dark rounded-full";
    }
    
    return "";
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 order-2 lg:order-1">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Activity Calendar</h3>
            
            <div className="overflow-x-auto pb-4">
              <div className="min-w-[900px]">
                <div className="grid grid-cols-7 gap-1">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center py-2 font-medium text-buddy-gray-600">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1 mt-1">
                  {Array.from({ length: 35 }).map((_, i) => {
                    const date = addDays(new Date(2023, 2, 1), i - 5);
                    const dateCheckIns = getCheckInsForDate(date);
                    const isCurrentDate = isToday(date);
                    
                    return (
                      <div 
                        key={i}
                        className={`
                          min-h-[100px] border border-buddy-gray-200 rounded-md p-1
                          ${isCurrentDate ? 'ring-2 ring-buddy-purple ring-opacity-50' : ''}
                        `}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className={`
                            text-xs rounded-full w-5 h-5 flex items-center justify-center
                            ${isCurrentDate ? 'bg-buddy-purple text-white' : 'text-buddy-gray-600'}
                          `}>
                            {format(date, "d")}
                          </span>
                          {dateCheckIns.length > 0 && (
                            <span className="text-xs px-1 rounded-full bg-buddy-gray-100">
                              {dateCheckIns.length}
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          {dateCheckIns.slice(0, 3).map((checkIn) => (
                            <div 
                              key={checkIn.id}
                              className="text-xs p-1 rounded truncate"
                              style={{ backgroundColor: `${checkIn.color}20`, color: checkIn.color }}
                            >
                              {checkIn.title}
                            </div>
                          ))}
                          
                          {dateCheckIns.length > 3 && (
                            <div className="text-xs text-buddy-gray-500 text-center">
                              +{dateCheckIns.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {selectedDateCheckIns.length > 0 ? (
              <div className="space-y-4 mt-6">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-medium text-buddy-gray-800">
                    {selectedDate && format(selectedDate, "MMMM d, yyyy")}
                    {isToday(selectedDate!) && (
                      <Badge className="ml-2 bg-buddy-purple/10 text-buddy-purple">Today</Badge>
                    )}
                  </h4>
                  
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <button className="text-buddy-gray-400 hover:text-buddy-gray-600">
                        <Info className="h-5 w-5" />
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 p-4">
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm">Check-in Status Colors</h5>
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-buddy-green mr-2"></div>
                            <span className="text-sm">Completed check-ins</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-buddy-gray-300 mr-2"></div>
                            <span className="text-sm">Missed check-ins</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-buddy-blue mr-2"></div>
                            <span className="text-sm">Upcoming check-ins</span>
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                
                {selectedDateCheckIns.map((checkIn) => (
                  <div 
                    key={checkIn.id}
                    className="flex items-start p-4 rounded-lg border border-buddy-gray-200 hover:border-buddy-gray-300 transition-colors animate-fade-in"
                  >
                    <div className="mr-4 mt-1">
                      {checkIn.status === "completed" && (
                        <CheckCircle2 className="h-6 w-6 text-buddy-green" />
                      )}
                      {checkIn.status === "missed" && (
                        <XCircle className="h-6 w-6 text-buddy-gray-400" />
                      )}
                      {checkIn.status === "upcoming" && (
                        <AlertCircle className="h-6 w-6 text-buddy-blue" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <Avatar 
                            src={checkIn.user.avatar} 
                            alt={checkIn.user.name}
                            size="sm"
                            className="mr-2"
                          />
                          <span className="font-medium text-buddy-gray-800">{checkIn.user.name}</span>
                        </div>
                        
                        <span className="text-sm text-buddy-gray-500">{checkIn.time}</span>
                      </div>
                      
                      <div className="flex items-center mt-1">
                        <Badge 
                          variant="outline" 
                          className={`
                            ${checkIn.status === "completed" ? "bg-buddy-green/10 text-buddy-green border-buddy-green/20" : ""}
                            ${checkIn.status === "missed" ? "bg-buddy-gray-200/80 text-buddy-gray-600 border-buddy-gray-300" : ""}
                            ${checkIn.status === "upcoming" ? "bg-buddy-blue/10 text-buddy-blue border-buddy-blue/20" : ""}
                          `}
                        >
                          {checkIn.status === "completed" && "Completed"}
                          {checkIn.status === "missed" && "Missed"}
                          {checkIn.status === "upcoming" && "Upcoming"}
                        </Badge>
                        
                        {checkIn.category && (
                          <Badge 
                            variant="outline" 
                            className="ml-2"
                            style={{ backgroundColor: `${checkIn.color}10`, color: checkIn.color, borderColor: `${checkIn.color}30` }}
                          >
                            {checkIn.category}
                          </Badge>
                        )}
                      </div>
                      
                      {checkIn.notes && (
                        <p className="mt-2 text-sm text-buddy-gray-600">{checkIn.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-buddy-gray-500">No check-ins scheduled for this date.</p>
                <p className="text-sm text-buddy-gray-400 mt-1">Select a date with activity on the calendar.</p>
              </div>
            )}
          </Card>
        </div>
        
        <div className="lg:col-span-4 order-1 lg:order-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Calendar</h3>
              <CalendarIcon className="h-5 w-5 text-buddy-gray-400" />
            </div>
            
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border shadow-sm"
              classNames={{
                day_today: "bg-buddy-purple/10 text-buddy-purple font-semibold",
              }}
              modifiers={{
                completed: checkIns
                  .filter(checkIn => checkIn.status === "completed")
                  .map(checkIn => parseISO(checkIn.date)),
                missed: checkIns
                  .filter(checkIn => checkIn.status === "missed")
                  .map(checkIn => parseISO(checkIn.date)),
                upcoming: checkIns
                  .filter(checkIn => checkIn.status === "upcoming")
                  .map(checkIn => parseISO(checkIn.date)),
              }}
              modifiersClassNames={{
                completed: "bg-buddy-green/20 text-buddy-green-dark rounded-full",
                missed: "bg-buddy-gray-300/30 text-buddy-gray-600 rounded-full",
                upcoming: "bg-buddy-blue/10 text-buddy-blue-dark rounded-full"
              }}
            />
            
            <div className="mt-4 pt-4 border-t border-buddy-gray-100">
              <h4 className="text-sm font-medium mb-2">Legend</h4>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-buddy-green mr-2"></div>
                  <span className="text-sm text-buddy-gray-600">Completed</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-buddy-gray-300 mr-2"></div>
                  <span className="text-sm text-buddy-gray-600">Missed</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-buddy-blue mr-2"></div>
                  <span className="text-sm text-buddy-gray-600">Upcoming</span>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 mt-6">
            <h3 className="text-lg font-semibold mb-3">Activity Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-buddy-gray-600">Completion Rate</span>
                <span className="font-medium text-buddy-gray-800">64%</span>
              </div>
              <div className="w-full bg-buddy-gray-200 rounded-full h-2">
                <div className="bg-buddy-green h-2 rounded-full" style={{ width: "64%" }}></div>
              </div>
              
              <div className="flex justify-between pt-2">
                <span className="text-buddy-gray-600">Current Streak</span>
                <span className="font-medium text-buddy-gray-800">5 days</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-buddy-gray-600">Longest Streak</span>
                <span className="font-medium text-buddy-gray-800">14 days</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-buddy-gray-600">Days Remaining</span>
                <span className="font-medium text-buddy-gray-800">16 days</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ActivitySchedule;
