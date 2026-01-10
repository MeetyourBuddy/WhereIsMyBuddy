import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ExportService,
  ActivityReportData,
  UserProgressReportData,
} from "@/services/api/export.service";
import { useToast } from "@/hooks/use-toast";
import {
  Download,
  FileText,
  BarChart3,
  Trophy,
  Calendar,
  Target,
  Users,
  TrendingUp,
} from "lucide-react";

interface DataExportProps {
  activityId?: string;
  activityTitle?: string;
}

const DataExport: React.FC<DataExportProps> = ({
  activityId,
  activityTitle,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const generatePDF = async (data: any, type: "activity" | "user") => {
    // This would integrate with a PDF generation library like jsPDF or react-pdf
    // For now, we'll create a simple HTML export that can be printed as PDF

    const htmlContent = generateHTMLReport(data, type);

    // Create a new window with the HTML content
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const generateHTMLReport = (data: any, type: "activity" | "user"): string => {
    const currentDate = new Date().toLocaleDateString();

    if (type === "activity") {
      return generateActivityHTML(data, currentDate);
    } else {
      return generateUserProgressHTML(data, currentDate);
    }
  };

  const generateActivityHTML = (
    data: ActivityReportData,
    date: string
  ): string => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Activity Report - ${data.activity.title}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background: #f8fafc; }
          .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
          .header p { margin: 10px 0 0 0; opacity: 0.9; }
          .content { padding: 30px; }
          .section { margin-bottom: 30px; }
          .section h2 { color: #374151; font-size: 20px; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; }
          .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px; }
          .stat-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; text-align: center; }
          .stat-value { font-size: 24px; font-weight: 700; color: #8b5cf6; margin-bottom: 5px; }
          .stat-label { color: #6b7280; font-size: 14px; }
          .milestone { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 10px; border-radius: 0 8px 8px 0; }
          .milestone h4 { margin: 0 0 5px 0; color: #92400e; }
          .milestone p { margin: 0; color: #78350f; font-size: 14px; }
          .checkin-item { border-bottom: 1px solid #e5e7eb; padding: 10px 0; }
          .checkin-date { font-weight: 600; color: #374151; }
          .checkin-status { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 500; }
          .on-time { background: #d1fae5; color: #065f46; }
          .late { background: #fee2e2; color: #991b1b; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 Activity Progress Report</h1>
            <p>${data.activity.title} • Generated on ${date}</p>
          </div>
          
          <div class="content">
            <div class="section">
              <h2>📊 Summary Statistics</h2>
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-value">${data.summary.totalCheckIns}</div>
                  <div class="stat-label">Total Check-ins</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">${data.summary.currentStreak}</div>
                  <div class="stat-label">Current Streak</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">${data.summary.completionRate}%</div>
                  <div class="stat-label">Completion Rate</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">${data.summary.milestonesAchieved}</div>
                  <div class="stat-label">Milestones Achieved</div>
                </div>
              </div>
            </div>

            <div class="section">
              <h2>🏆 Achievements</h2>
              ${data.milestones
                .map(
                  (milestone) => `
                <div class="milestone">
                  <h4>${milestone.name}</h4>
                  <p>${milestone.description} • ${milestone.points} points • Achieved on ${new Date(milestone.achievedAt).toLocaleDateString()}</p>
                </div>
              `
                )
                .join("")}
            </div>

            <div class="section">
              <h2>📅 Check-in History</h2>
              ${data.checkIns
                .map(
                  (checkin) => `
                <div class="checkin-item">
                  <div class="checkin-date">${new Date(checkin.checkInDate).toLocaleDateString()}</div>
                  <span class="checkin-status ${checkin.isOnTime ? "on-time" : "late"}">
                    ${checkin.isOnTime ? "On Time" : "Late"}
                  </span>
                  ${checkin.message ? `<p style="margin: 5px 0 0 0; color: #6b7280;">${checkin.message}</p>` : ""}
                </div>
              `
                )
                .join("")}
            </div>
          </div>
          
          <div class="footer">
            <p>Generated by BuddyFinder • Your journey to better habits starts here</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const generateUserProgressHTML = (
    data: UserProgressReportData,
    date: string
  ): string => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>User Progress Report - ${data.user.name}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background: #f8fafc; }
          .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
          .header p { margin: 10px 0 0 0; opacity: 0.9; }
          .content { padding: 30px; }
          .section { margin-bottom: 30px; }
          .section h2 { color: #374151; font-size: 20px; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; }
          .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px; }
          .stat-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; text-align: center; }
          .stat-value { font-size: 24px; font-weight: 700; color: #8b5cf6; margin-bottom: 5px; }
          .stat-label { color: #6b7280; font-size: 14px; }
          .activity-item { border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin-bottom: 10px; }
          .activity-title { font-weight: 600; color: #374151; margin-bottom: 5px; }
          .activity-stats { display: flex; gap: 20px; font-size: 14px; color: #6b7280; }
          .milestone { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 10px; border-radius: 0 8px 8px 0; }
          .milestone h4 { margin: 0 0 5px 0; color: #92400e; }
          .milestone p { margin: 0; color: #78350f; font-size: 14px; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 Personal Progress Report</h1>
            <p>${data.user.name} • Generated on ${date}</p>
          </div>
          
          <div class="content">
            <div class="section">
              <h2>📊 Overall Statistics</h2>
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-value">${data.overallStats.totalActivities}</div>
                  <div class="stat-label">Activities Joined</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">${data.overallStats.totalCheckIns}</div>
                  <div class="stat-label">Total Check-ins</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">${data.overallStats.totalMilestones}</div>
                  <div class="stat-label">Milestones Achieved</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">${data.overallStats.totalPoints}</div>
                  <div class="stat-label">Total Points</div>
                </div>
              </div>
            </div>

            <div class="section">
              <h2>🎯 Activity Performance</h2>
              ${data.activities
                .map(
                  (activity) => `
                <div class="activity-item">
                  <div class="activity-title">${activity.title}</div>
                  <div class="activity-stats">
                    <span>Check-ins: ${activity.checkIns}</span>
                    <span>Milestones: ${activity.milestones}</span>
                    <span>Completion: ${activity.stats.completionRate}%</span>
                    <span>${activity.isAdmin ? "👑 Admin" : "👤 Participant"}</span>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>

            <div class="section">
              <h2>🏆 All Achievements</h2>
              ${data.milestones
                .map(
                  (milestone) => `
                <div class="milestone">
                  <h4>${milestone.name}</h4>
                  <p>${milestone.description} • ${milestone.points} points • ${milestone.activityTitle} • ${new Date(milestone.achievedAt).toLocaleDateString()}</p>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
          
          <div class="footer">
            <p>Generated by BuddyFinder • Your journey to better habits starts here</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const handleExportActivity = async () => {
    if (!activityId) return;

    setIsExporting(true);
    try {
      const response = await ExportService.exportActivityReport(activityId);
      if (response.data?.success) {
        await generatePDF(response.data.data, "activity");
        toast({
          title: "Export Successful!",
          description:
            "Your activity report has been generated and is ready to print/save as PDF.",
        });
      }
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Export Failed",
        description: "Failed to generate activity report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportUserProgress = async () => {
    setIsExporting(true);
    try {
      const response = await ExportService.exportUserProgressReport();
      if (response.data?.success) {
        await generatePDF(response.data.data, "user");
        toast({
          title: "Export Successful!",
          description:
            "Your personal progress report has been generated and is ready to print/save as PDF.",
        });
      }
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        title: "Export Failed",
        description: "Failed to generate progress report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-buddy-gray-800 flex items-center">
          <Download className="h-5 w-5 mr-2 text-buddy-purple" />
          Export Your Data
        </h3>
      </div>

      <div className="space-y-4">
        <div className="bg-gradient-to-r from-buddy-purple/10 to-buddy-blue/10 rounded-lg p-4 border border-buddy-purple/20">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-buddy-purple/20 flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-buddy-purple" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-buddy-gray-800 mb-1">
                Activity Report
              </h4>
              <p className="text-sm text-buddy-gray-600 mb-3">
                Export detailed progress report for{" "}
                {activityTitle || "this activity"} including check-ins,
                milestones, and statistics.
              </p>
              <Button
                onClick={handleExportActivity}
                disabled={isExporting || !activityId}
                className="rounded-full bg-buddy-purple hover:bg-buddy-purple/90"
              >
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? "Generating..." : "Export Activity Report"}
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-buddy-green/10 to-buddy-blue/10 rounded-lg p-4 border border-buddy-green/20">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-buddy-green/20 flex items-center justify-center flex-shrink-0">
              <BarChart3 className="h-5 w-5 text-buddy-green" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-buddy-gray-800 mb-1">
                Personal Progress Report
              </h4>
              <p className="text-sm text-buddy-gray-600 mb-3">
                Export comprehensive report of all your activities,
                achievements, and progress across the platform.
              </p>
              <Button
                onClick={handleExportUserProgress}
                disabled={isExporting}
                className="rounded-full bg-buddy-green hover:bg-buddy-green/90"
              >
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? "Generating..." : "Export Personal Report"}
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-buddy-gray-50 rounded-lg p-4 border border-buddy-gray-200">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-full bg-buddy-gray-200 flex items-center justify-center flex-shrink-0">
              <Trophy className="h-5 w-5 text-buddy-gray-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-buddy-gray-800 mb-1">
                Professional Reports
              </h4>
              <p className="text-sm text-buddy-gray-600 mb-3">
                Beautiful, branded reports perfect for sharing your achievements
                or tracking personal growth.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  PDF Format
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Print Ready
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Branded Design
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Comprehensive Data
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DataExport;
