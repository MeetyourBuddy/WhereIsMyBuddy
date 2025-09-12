import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isSameDay,
  getDay,
} from "date-fns";

interface CalendarData {
  date: string;
  checkins: number;
}

interface ActivityCalendarGridProps {
  activityId: string;
  weeklyData?: Array<{
    name: string;
    checkins: number;
    date: string;
  }>;
  className?: string;
}

const ActivityCalendarGrid: React.FC<ActivityCalendarGridProps> = ({
  activityId,
  weeklyData = [],
  className = "",
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const [calendarData, setCalendarData] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Convert weekly data to calendar format
  useEffect(() => {
    const dataMap: Record<string, number> = {};
    weeklyData.forEach((day) => {
      if (day.date) {
        const date = new Date(day.date);
        const dateKey = format(date, "yyyy-MM-dd");
        dataMap[dateKey] = day.checkins;
      }
    });
    setCalendarData(dataMap);
    setIsLoading(false);
  }, [weeklyData]);

  // Generate calendar days based on view mode
  const calendarDays = useMemo(() => {
    if (viewMode === "week") {
      const start = startOfWeek(currentDate);
      const end = endOfWeek(currentDate);
      return eachDayOfInterval({ start, end });
    } else {
      const start = startOfWeek(startOfMonth(currentDate));
      const end = endOfWeek(endOfMonth(currentDate));
      return eachDayOfInterval({ start, end });
    }
  }, [currentDate, viewMode]);

  // Get color intensity based on check-in count
  const getColorIntensity = (checkins: number) => {
    if (checkins === 0) return "bg-gray-100";
    if (checkins === 1) return "bg-green-200";
    if (checkins === 2) return "bg-green-300";
    if (checkins === 3) return "bg-green-400";
    return "bg-green-500";
  };

  // Get check-ins for a specific date
  const getCheckInsForDate = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return calendarData[dateKey] || 0;
  };

  // Navigation functions
  const goToPrevious = () => {
    if (viewMode === "week") {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const goToNext = () => {
    if (viewMode === "week") {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get week labels for month view
  const weekLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (isLoading) {
    return (
      <Card
        className={`p-6 border border-white/80 rounded-2xl shadow-sm bg-white/90 backdrop-blur-sm ${className}`}
      >
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={`p-6 border border-white/80 rounded-2xl shadow-sm bg-white/90 backdrop-blur-sm hover:shadow-md transition-all duration-300 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-buddy-purple to-buddy-blue bg-clip-text text-transparent">
            Activity Calendar
          </h3>
          <Badge variant="outline" className="text-xs">
            {viewMode === "month" ? "Month View" : "Week View"}
          </Badge>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-full p-1">
            <Button
              variant={viewMode === "month" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("month")}
              className={`rounded-full px-3 py-1 text-xs ${
                viewMode === "month"
                  ? "bg-buddy-purple text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Calendar className="w-3 h-3 mr-1" />
              Month
            </Button>
            <Button
              variant={viewMode === "week" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("week")}
              className={`rounded-full px-3 py-1 text-xs ${
                viewMode === "week"
                  ? "bg-buddy-purple text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Clock className="w-3 h-3 mr-1" />
              Week
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevious}
              className="rounded-full p-2 h-8 w-8"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              className="rounded-full px-3 py-1 text-xs"
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNext}
              className="rounded-full p-2 h-8 w-8"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">
        {/* Week Labels (Both Month and Week View) */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekLabels.map((label) => (
            <div
              key={label}
              className="text-center text-xs font-medium text-gray-500 py-2"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <TooltipProvider>
          <div
            className={`grid gap-1 ${viewMode === "month" ? "grid-cols-7" : "grid-cols-7"}`}
          >
            {calendarDays.map((day, index) => {
              const checkins = getCheckInsForDate(day);
              const isCurrentMonth =
                viewMode === "week" || isSameMonth(day, currentDate);
              const isCurrentDay = isToday(day);
              const dateKey = format(day, "yyyy-MM-dd");

              return (
                <Tooltip key={dateKey}>
                  <TooltipTrigger asChild>
                    <div
                      className={`
                        relative aspect-square rounded-lg border transition-all duration-200 cursor-pointer
                        ${isCurrentMonth ? "opacity-100" : "opacity-30"}
                        ${isCurrentDay ? "ring-2 ring-buddy-purple ring-offset-1" : ""}
                        ${checkins > 0 ? "hover:scale-105 hover:shadow-md" : "hover:bg-gray-50"}
                        ${getColorIntensity(checkins)}
                        min-h-[32px] sm:min-h-[40px] md:min-h-[48px]
                      `}
                    >
                      {/* Day Number */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className={`
                          text-xs font-medium
                          ${isCurrentDay ? "text-buddy-purple font-bold" : "text-gray-700"}
                          ${!isCurrentMonth ? "text-gray-400" : ""}
                        `}
                        >
                          {format(day, "d")}
                        </span>
                      </div>

                      {/* Check-in Indicator */}
                      {checkins > 0 && (
                        <div className="absolute top-1 right-1">
                          <CheckCircle className="w-3 h-3 text-white drop-shadow-sm" />
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-gray-900 text-white border-0 rounded-lg"
                  >
                    <div className="text-center">
                      <div className="font-medium">
                        {format(day, "EEEE, MMMM d, yyyy")}
                      </div>
                      <div className="text-sm text-gray-300 mt-1">
                        {checkins === 0
                          ? "No check-ins"
                          : `${checkins} check-in${checkins > 1 ? "s" : ""}`}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded ${getColorIntensity(level)}`}
              />
            ))}
          </div>
          <span>More</span>
        </div>

        <div className="text-xs text-gray-500">
          {viewMode === "month"
            ? format(currentDate, "MMMM yyyy")
            : `Week of ${format(startOfWeek(currentDate), "MMM d")}`}
        </div>
      </div>
    </Card>
  );
};

export default ActivityCalendarGrid;
