import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Activity, ActivityDocument } from './schemas/activity.schema';
import { CheckIn, CheckInDocument } from './schemas/checkin.schema';

export interface NotificationData {
  type: 'milestone' | 'streak' | 'goal' | 'reminder' | 'achievement';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  userId: string;
  activityId?: string;
  data?: any;
}

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
    @InjectModel(CheckIn.name) private checkInModel: Model<CheckInDocument>,
  ) {}

  async checkAndSendProgressNotifications(
    userId: string,
    activityId?: string,
  ): Promise<NotificationData[]> {
    const notifications: NotificationData[] = [];

    // Get user's recent activity
    const user = await this.userModel.findById(userId);
    if (!user) return notifications;

    // Check for streak milestones
    const streakNotifications = await this.checkStreakNotifications(
      userId,
      activityId,
    );
    notifications.push(...streakNotifications);

    // Check for check-in milestones
    const checkInNotifications = await this.checkCheckInNotifications(
      userId,
      activityId,
    );
    notifications.push(...checkInNotifications);

    // Check for goal progress
    const goalNotifications = await this.checkGoalNotifications(
      userId,
      activityId,
    );
    notifications.push(...goalNotifications);

    // Check for reminder notifications
    const reminderNotifications = await this.checkReminderNotifications(
      userId,
      activityId,
    );
    notifications.push(...reminderNotifications);

    return notifications;
  }

  private async checkStreakNotifications(
    userId: string,
    activityId?: string,
  ): Promise<NotificationData[]> {
    const notifications: NotificationData[] = [];

    // Get user's check-ins
    const checkInFilter: any = {
      user: userId,
      isDeleted: false,
    };

    if (activityId) {
      checkInFilter.activity = activityId;
    }

    const checkIns = await this.checkInModel
      .find(checkInFilter)
      .sort({ checkInDate: -1 })
      .exec();

    if (checkIns.length === 0) return notifications;

    // Calculate current streak
    const currentStreak = this.calculateCurrentStreak(checkIns);

    // Check for streak milestones
    const streakMilestones = [3, 7, 14, 30, 50, 100];

    for (const milestone of streakMilestones) {
      if (currentStreak === milestone) {
        notifications.push({
          type: 'milestone',
          title: `🔥 ${milestone}-Day Streak Achieved!`,
          message: `Congratulations! You've maintained a ${milestone}-day streak. Keep up the amazing work!`,
          priority:
            milestone >= 30 ? 'high' : milestone >= 7 ? 'medium' : 'low',
          userId,
          activityId,
          data: { streak: currentStreak, milestone },
        });
      }
    }

    // Check for streak warnings
    if (currentStreak > 0 && currentStreak < 3) {
      notifications.push({
        type: 'reminder',
        title: 'Keep Your Streak Going!',
        message: `You're on a ${currentStreak}-day streak. Don't break it now!`,
        priority: 'medium',
        userId,
        activityId,
        data: { streak: currentStreak },
      });
    }

    return notifications;
  }

  private async checkCheckInNotifications(
    userId: string,
    activityId?: string,
  ): Promise<NotificationData[]> {
    const notifications: NotificationData[] = [];

    // Get user's check-ins
    const checkInFilter: any = {
      user: userId,
      isDeleted: false,
    };

    if (activityId) {
      checkInFilter.activity = activityId;
    }

    const checkIns = await this.checkInModel.find(checkInFilter).exec();

    const totalCheckIns = checkIns.length;

    // Check for check-in milestones
    const checkInMilestones = [5, 10, 25, 50, 100, 250, 500];

    for (const milestone of checkInMilestones) {
      if (totalCheckIns === milestone) {
        notifications.push({
          type: 'achievement',
          title: `🎯 ${milestone} Check-ins Completed!`,
          message: `Amazing! You've completed ${milestone} check-ins. You're building incredible habits!`,
          priority:
            milestone >= 100 ? 'high' : milestone >= 25 ? 'medium' : 'low',
          userId,
          activityId,
          data: { totalCheckIns, milestone },
        });
      }
    }

    return notifications;
  }

  private async checkGoalNotifications(
    userId: string,
    activityId?: string,
  ): Promise<NotificationData[]> {
    const notifications: NotificationData[] = [];

    if (!activityId) return notifications;

    // Get activity details
    const activity = await this.activityModel.findById(activityId);
    if (!activity) return notifications;

    // Get user's check-ins for this activity
    const checkIns = await this.checkInModel
      .find({
        user: userId,
        activity: activityId,
        isDeleted: false,
      })
      .exec();

    // Calculate completion rate
    const totalAvailableCheckIns =
      this.calculateTotalAvailableCheckIns(activity);
    const completionRate =
      totalAvailableCheckIns > 0
        ? Math.round((checkIns.length / totalAvailableCheckIns) * 100)
        : 0;

    // Check for completion milestones
    const completionMilestones = [25, 50, 75, 90, 100];

    for (const milestone of completionMilestones) {
      if (completionRate === milestone) {
        notifications.push({
          type: 'goal',
          title: `🎉 ${milestone}% Activity Complete!`,
          message: `Fantastic! You've completed ${milestone}% of "${activity.title}". You're almost there!`,
          priority: milestone >= 75 ? 'high' : 'medium',
          userId,
          activityId,
          data: { completionRate, milestone, activityTitle: activity.title },
        });
      }
    }

    return notifications;
  }

  private async checkReminderNotifications(
    userId: string,
    activityId?: string,
  ): Promise<NotificationData[]> {
    const notifications: NotificationData[] = [];

    if (!activityId) return notifications;

    // Get activity details
    const activity = await this.activityModel.findById(activityId);
    if (!activity) return notifications;

    // Check if user is a participant
    const isParticipant = activity.participants.some(
      (p) => p.toString() === userId,
    );
    if (!isParticipant) return notifications;

    // Get user's last check-in
    const lastCheckIn = await this.checkInModel
      .findOne({
        user: userId,
        activity: activityId,
        isDeleted: false,
      })
      .sort({ checkInDate: -1 })
      .exec();

    if (!lastCheckIn) {
      // User hasn't checked in yet
      notifications.push({
        type: 'reminder',
        title: 'Ready to Start?',
        message: `Welcome to "${activity.title}"! Ready to begin your journey?`,
        priority: 'medium',
        userId,
        activityId,
        data: { activityTitle: activity.title },
      });
      return notifications;
    }

    // Check if user missed a check-in period
    const lastCheckInDate = new Date(lastCheckIn.checkInDate);
    const now = new Date();
    const daysSinceLastCheckIn = Math.floor(
      (now.getTime() - lastCheckInDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Calculate expected check-in frequency
    let expectedFrequency: number;
    switch (activity.checkinFrequencyUnit) {
      case 'daily':
        expectedFrequency = 1;
        break;
      case 'weekly':
        expectedFrequency = 7;
        break;
      case 'monthly':
        expectedFrequency = 30;
        break;
      default:
        expectedFrequency = 1;
    }

    const expectedDays = expectedFrequency * activity.checkinFrequency;

    if (daysSinceLastCheckIn >= expectedDays) {
      notifications.push({
        type: 'reminder',
        title: 'Time to Check In!',
        message: `It's been ${daysSinceLastCheckIn} days since your last check-in for "${activity.title}". Don't break your momentum!`,
        priority: 'high',
        userId,
        activityId,
        data: {
          daysSinceLastCheckIn,
          activityTitle: activity.title,
          expectedDays,
        },
      });
    }

    return notifications;
  }

  private calculateCurrentStreak(checkIns: any[]): number {
    if (checkIns.length === 0) return 0;

    // Group check-ins by date
    const checkInsByDate = new Map<string, any[]>();
    checkIns.forEach((checkIn) => {
      const dateKey = new Date(checkIn.checkInDate).toDateString();
      if (!checkInsByDate.has(dateKey)) {
        checkInsByDate.set(dateKey, []);
      }
      checkInsByDate.get(dateKey)!.push(checkIn);
    });

    // Calculate current streak from the most recent date
    const sortedDates = Array.from(checkInsByDate.keys()).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime(),
    );

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

    return currentStreak;
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
}
