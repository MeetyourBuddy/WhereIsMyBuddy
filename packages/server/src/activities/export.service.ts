import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Activity, ActivityDocument } from './schemas/activity.schema';
import { CheckIn, CheckInDocument } from './schemas/checkin.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import {
  UserMilestone,
  UserMilestoneDocument,
} from './schemas/milestone.schema';

@Injectable()
export class ExportService {
  constructor(
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
    @InjectModel(CheckIn.name) private checkInModel: Model<CheckInDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserMilestone.name)
    private userMilestoneModel: Model<UserMilestoneDocument>,
  ) {}

  async generateActivityReport(
    activityId: string,
    userId: string,
  ): Promise<{
    activity: any;
    userStats: any;
    checkIns: any[];
    milestones: any[];
    summary: any;
  }> {
    // Get activity details
    const activity = await this.activityModel
      .findById(activityId)
      .populate('admin', 'name email avatar picture')
      .populate('participants', 'name email avatar picture')
      .exec();

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    // Get user's check-ins for this activity
    const checkIns = await this.checkInModel
      .find({
        activity: activityId,
        user: userId,
        isDeleted: false,
      })
      .sort({ checkInDate: -1 })
      .exec();

    // Get user's milestones for this activity
    const milestones = await this.userMilestoneModel
      .find({
        user: userId,
        activity: activityId,
      })
      .populate('milestone')
      .sort({ achievedAt: -1 })
      .exec();

    // Calculate user statistics
    const userStats = await this.calculateUserStats(
      userId,
      activityId,
      checkIns,
    );

    // Generate summary
    const summary = {
      totalCheckIns: checkIns.length,
      currentStreak: userStats.currentStreak,
      longestStreak: userStats.longestStreak,
      completionRate: userStats.completionRate,
      milestonesAchieved: milestones.length,
      totalPoints: milestones.reduce(
        (sum, m) => sum + ((m.milestone as any)?.points || 0),
        0,
      ),
      activityDuration: this.calculateActivityDuration(activity),
      participationRate: this.calculateParticipationRate(checkIns, activity),
    };

    return {
      activity: {
        id: activity._id,
        title: activity.title,
        description: activity.description,
        category: activity.category,
        startDate: activity.startDate,
        endDate: activity.endDate,
        proposedDuration: activity.proposedDuration,
        checkinFrequency: activity.checkinFrequency,
        checkinFrequencyUnit: activity.checkinFrequencyUnit,
        goals: activity.goals,
        tags: activity.tags,
        admin: activity.admin,
        participants: activity.participants,
      },
      userStats,
      checkIns: checkIns.map((ci) => ({
        id: ci._id,
        checkInDate: ci.checkInDate,
        scheduledDate: ci.scheduledDate,
        isOnTime: ci.isOnTime,
        message: (ci as any).message,
        imageUrl: ci.imageUrl,
        type: ci.type,
      })),
      milestones: milestones.map((m) => ({
        id: m._id,
        name: (m.milestone as any)?.name,
        description: (m.milestone as any)?.description,
        tier: (m.milestone as any)?.tier,
        reward: (m.milestone as any)?.reward,
        points: (m.milestone as any)?.points,
        achievedAt: m.achievedAt,
        isClaimed: m.isClaimed,
      })),
      summary,
    };
  }

  async generateUserProgressReport(userId: string): Promise<{
    user: any;
    activities: any[];
    overallStats: any;
    milestones: any[];
  }> {
    // Get user details
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get all activities user has participated in
    const activities = await this.activityModel
      .find({
        $or: [{ participants: userId }, { admin: userId }],
      })
      .populate('admin', 'name email avatar picture')
      .exec();

    // Get all user's check-ins
    const allCheckIns = await this.checkInModel
      .find({
        user: userId,
        isDeleted: false,
      })
      .populate('activity', 'title category')
      .sort({ checkInDate: -1 })
      .exec();

    // Get all user's milestones
    const allMilestones = await this.userMilestoneModel
      .find({
        user: userId,
      })
      .populate('milestone')
      .populate('activity', 'title')
      .sort({ achievedAt: -1 })
      .exec();

    // Calculate overall statistics
    const overallStats = {
      totalActivities: activities.length,
      totalCheckIns: allCheckIns.length,
      totalMilestones: allMilestones.length,
      totalPoints: allMilestones.reduce(
        (sum, m) => sum + ((m.milestone as any)?.points || 0),
        0,
      ),
      averageCompletionRate: 0,
      longestStreak: 0,
      currentStreak: 0,
    };

    // Calculate activity-specific stats
    const activitiesWithStats = await Promise.all(
      activities.map(async (activity) => {
        const activityCheckIns = allCheckIns.filter(
          (ci) => ci.activity._id.toString() === activity._id.toString(),
        );
        const activityMilestones = allMilestones.filter(
          (m) =>
            m.activity && m.activity._id.toString() === activity._id.toString(),
        );
        const stats = await this.calculateUserStats(
          userId,
          activity._id.toString(),
          activityCheckIns,
        );

        return {
          id: activity._id,
          title: activity.title,
          category: activity.category,
          startDate: activity.startDate,
          endDate: activity.endDate,
          isAdmin: activity.admin._id.toString() === userId,
          stats,
          checkIns: activityCheckIns.length,
          milestones: activityMilestones.length,
        };
      }),
    );

    // Calculate overall averages
    if (activitiesWithStats.length > 0) {
      overallStats.averageCompletionRate = Math.round(
        activitiesWithStats.reduce(
          (sum, a) => sum + a.stats.completionRate,
          0,
        ) / activitiesWithStats.length,
      );
      overallStats.longestStreak = Math.max(
        ...activitiesWithStats.map((a) => a.stats.longestStreak),
      );
      overallStats.currentStreak = Math.max(
        ...activitiesWithStats.map((a) => a.stats.currentStreak),
      );
    }

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || (user as any).picture,
        createdAt: user.createdAt,
      },
      activities: activitiesWithStats,
      overallStats,
      milestones: allMilestones.map((m) => ({
        id: m._id,
        name: (m.milestone as any)?.name,
        description: (m.milestone as any)?.description,
        tier: (m.milestone as any)?.tier,
        reward: (m.milestone as any)?.reward,
        points: (m.milestone as any)?.points,
        achievedAt: m.achievedAt,
        isClaimed: m.isClaimed,
        activityTitle: (m.activity as any)?.title,
      })),
    };
  }

  private async calculateUserStats(
    userId: string,
    activityId: string,
    checkIns: any[],
  ): Promise<{
    currentStreak: number;
    longestStreak: number;
    completionRate: number;
    onTimeRate: number;
    totalCheckIns: number;
  }> {
    if (checkIns.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        completionRate: 0,
        onTimeRate: 0,
        totalCheckIns: 0,
      };
    }

    // Calculate streaks
    const checkInsByDate = new Map<string, any[]>();
    checkIns.forEach((checkIn) => {
      const dateKey = new Date(checkIn.checkInDate).toDateString();
      if (!checkInsByDate.has(dateKey)) {
        checkInsByDate.set(dateKey, []);
      }
      checkInsByDate.get(dateKey)!.push(checkIn);
    });

    const sortedDates = Array.from(checkInsByDate.keys()).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime(),
    );

    // Current streak
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedDates.length; i++) {
      const checkInDate = new Date(sortedDates[i]);
      checkInDate.setHours(0, 0, 0, 0);

      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);

      if (checkInDate.getTime() === expectedDate.getTime()) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    const allDates = sortedDates.reverse();

    for (let i = 0; i < allDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prevDate = new Date(allDates[i - 1]);
        const currDate = new Date(allDates[i]);
        const daysDiff = Math.floor(
          (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (daysDiff === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    // Get activity for completion rate calculation
    const activity = await this.activityModel.findById(activityId);
    const totalAvailableCheckIns = activity
      ? this.calculateTotalAvailableCheckIns(activity)
      : 0;
    const completionRate =
      totalAvailableCheckIns > 0
        ? Math.round((checkIns.length / totalAvailableCheckIns) * 100)
        : 0;

    // On-time rate
    const onTimeCheckIns = checkIns.filter((ci) => ci.isOnTime).length;
    const onTimeRate =
      checkIns.length > 0
        ? Math.round((onTimeCheckIns / checkIns.length) * 100)
        : 0;

    return {
      currentStreak,
      longestStreak,
      completionRate,
      onTimeRate,
      totalCheckIns: checkIns.length,
    };
  }

  private calculateTotalAvailableCheckIns(activity: any): number {
    if (!activity.startDate || !activity.proposedDuration) return 0;

    const startDate = new Date(activity.startDate);
    const endDate = activity.endDate ? new Date(activity.endDate) : new Date();

    let periodDuration: number;
    switch (activity.checkinFrequencyUnit) {
      case 'daily':
        periodDuration = 1;
        break;
      case 'weekly':
        periodDuration = 7;
        break;
      case 'monthly':
        periodDuration = 30;
        break;
      default:
        periodDuration = 1;
    }

    const totalDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    return Math.floor(totalDays / (periodDuration * activity.checkinFrequency));
  }

  private calculateActivityDuration(activity: any): number {
    if (!activity.startDate) return 0;

    const startDate = new Date(activity.startDate);
    const endDate = activity.endDate ? new Date(activity.endDate) : new Date();

    return Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
  }

  private calculateParticipationRate(checkIns: any[], activity: any): number {
    const totalAvailable = this.calculateTotalAvailableCheckIns(activity);
    return totalAvailable > 0
      ? Math.round((checkIns.length / totalAvailable) * 100)
      : 0;
  }
}
