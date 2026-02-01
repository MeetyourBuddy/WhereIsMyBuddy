import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Notification,
  NotificationDocument,
  NotificationType,
  NotificationPriority,
} from '../schemas/notification.schema';
import { User, UserDocument } from '../../users/schemas/user.schema';
import { Activity, ActivityDocument } from '../schemas/activity.schema';
import { CheckIn, CheckInDocument } from '../schemas/checkin.schema';
import {
  BuddyConnection,
  BuddyConnectionDocument,
} from '../../users/schemas/buddy-connection.schema';

export interface CreateNotificationDto {
  recipientId: string;
  senderId?: string;
  type: NotificationType;
  title: string;
  message: string;
  priority?: NotificationPriority;
  activityId?: string;
  checkInId?: string;
  buddyConnectionId?: string;
  metadata?: any;
}

export interface NotificationResponse {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
  activity?: {
    id: string;
    title: string;
  };
  metadata?: any;
}

@Injectable()
export class NotificationManagerService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
    @InjectModel(CheckIn.name) private checkInModel: Model<CheckInDocument>,
    @InjectModel(BuddyConnection.name)
    private buddyConnectionModel: Model<BuddyConnectionDocument>,
  ) {}

  /**
   * Always creates a new notification entry. Never finds or updates an existing one.
   * Each call produces a distinct document so similar events (e.g. second "join request declined")
   * appear as separate entries in the feed.
   */
  async createNotification(
    dto: CreateNotificationDto,
  ): Promise<NotificationResponse> {
    const eventId = new Types.ObjectId().toString();
    const metadata = {
      ...(dto.metadata || {}),
      eventId,
    };

    const notification = new this.notificationModel({
      recipient: dto.recipientId,
      sender: dto.senderId,
      type: dto.type,
      title: dto.title,
      message: dto.message,
      priority: dto.priority || NotificationPriority.MEDIUM,
      activityId: dto.activityId,
      checkInId: dto.checkInId,
      buddyConnectionId: dto.buddyConnectionId,
      metadata,
    });

    const savedNotification = await notification.save();
    return this.formatNotificationResponse(savedNotification);
  }

  async getUserNotifications(
    userId: string,
    page: number = 1,
    limit: number = 20,
    type?: NotificationType,
    unreadOnly: boolean = false,
  ): Promise<{
    notifications: NotificationResponse[];
    total: number;
    hasMore: boolean;
  }> {
    const filter: any = { recipient: userId };

    if (type) {
      filter.type = type;
    }

    if (unreadOnly) {
      filter.isRead = false;
    }

    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      this.notificationModel
        .find(filter)
        .populate('sender', 'name profilePicture')
        .populate('activityId', 'title')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.notificationModel.countDocuments(filter),
    ]);

    const formattedNotifications = await Promise.all(
      notifications.map((notification) =>
        this.formatNotificationResponse(notification),
      ),
    );

    return {
      notifications: formattedNotifications,
      total,
      hasMore: skip + notifications.length < total,
    };
  }

  async markAsRead(
    notificationId: string,
    userId: string,
  ): Promise<NotificationResponse> {
    const notification = await this.notificationModel
      .findOneAndUpdate(
        { _id: notificationId, recipient: userId, isRead: false },
        { isRead: true, readAt: new Date() },
        { new: true },
      )
      .populate('sender', 'name profilePicture')
      .populate('activityId', 'title');

    if (!notification) {
      throw new Error('Notification not found or already read');
    }

    return this.formatNotificationResponse(notification);
  }

  async markAllAsRead(userId: string): Promise<{ updatedCount: number }> {
    const result = await this.notificationModel.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true, readAt: new Date() },
    );

    return { updatedCount: result.modifiedCount };
  }

  async deleteNotification(
    notificationId: string,
    userId: string,
  ): Promise<void> {
    const result = await this.notificationModel.deleteOne({
      _id: notificationId,
      recipient: userId,
    });

    if (result.deletedCount === 0) {
      throw new Error('Notification not found');
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationModel.countDocuments({
      recipient: userId,
      isRead: false,
    });
  }

  // Helper methods for creating specific notification types
  async createBuddyRequestNotification(
    recipientId: string,
    senderId: string,
    buddyConnectionId: string,
  ): Promise<NotificationResponse> {
    const sender = await this.userModel.findById(senderId);
    if (!sender) throw new Error('Sender not found');

    return this.createNotification({
      recipientId,
      senderId,
      type: NotificationType.BUDDY_REQUEST,
      title: 'New Buddy Request',
      message: `${sender.name} sent you a buddy request`,
      priority: NotificationPriority.MEDIUM,
      buddyConnectionId,
      metadata: { senderName: sender.name },
    });
  }

  async createBuddyAcceptedNotification(
    recipientId: string,
    senderId: string,
  ): Promise<NotificationResponse> {
    const sender = await this.userModel.findById(senderId);
    if (!sender) throw new Error('Sender not found');

    return this.createNotification({
      recipientId,
      senderId,
      type: NotificationType.BUDDY_ACCEPTED,
      title: 'Buddy Request Accepted',
      message: `${sender.name} accepted your buddy request`,
      priority: NotificationPriority.MEDIUM,
      metadata: { senderName: sender.name },
    });
  }

  async createBuddyDeclinedNotification(
    recipientId: string,
    senderId: string,
  ): Promise<NotificationResponse> {
    const sender = await this.userModel.findById(senderId);
    if (!sender) throw new Error('Sender not found');

    return this.createNotification({
      recipientId,
      senderId,
      type: NotificationType.BUDDY_DECLINED,
      title: 'Buddy Request Declined',
      message: `${sender.name} declined your buddy request`,
      priority: NotificationPriority.LOW,
      metadata: { senderName: sender.name },
    });
  }

  async createActivityCommentNotification(
    recipientId: string,
    senderId: string,
    activityId: string,
    comment: string,
  ): Promise<NotificationResponse> {
    const [sender, activity] = await Promise.all([
      this.userModel.findById(senderId),
      this.activityModel.findById(activityId),
    ]);

    if (!sender) throw new Error('Sender not found');
    if (!activity) throw new Error('Activity not found');

    return this.createNotification({
      recipientId,
      senderId,
      type: NotificationType.ACTIVITY_COMMENT,
      title: 'New Comment',
      message: `${sender.name} commented on your activity "${activity.title}"`,
      priority: NotificationPriority.LOW,
      activityId,
      metadata: {
        senderName: sender.name,
        activityTitle: activity.title,
        comment,
      },
    });
  }

  async createCheckInCommentNotification(
    recipientId: string,
    senderId: string,
    checkInId: string,
    comment: string,
  ): Promise<NotificationResponse> {
    const [sender, checkIn] = await Promise.all([
      this.userModel.findById(senderId),
      this.checkInModel.findById(checkInId).populate('activity'),
    ]);

    if (!sender) throw new Error('Sender not found');
    if (!checkIn) throw new Error('Check-in not found');

    const activity = checkIn.activity as any;

    return this.createNotification({
      recipientId,
      senderId,
      type: NotificationType.CHECKIN_COMMENT,
      title: 'New Check-in Comment',
      message: `${sender.name} commented on your check-in for "${activity.title}"`,
      priority: NotificationPriority.LOW,
      checkInId,
      activityId: activity._id,
      metadata: {
        senderName: sender.name,
        activityTitle: activity.title,
        comment,
      },
    });
  }

  async createMilestoneNotification(
    recipientId: string,
    activityId: string,
    milestone: string,
    streak?: number,
  ): Promise<NotificationResponse> {
    const activity = await this.activityModel.findById(activityId);
    if (!activity) throw new Error('Activity not found');

    return this.createNotification({
      recipientId,
      type: NotificationType.MILESTONE_ACHIEVED,
      title: 'Milestone Achieved! 🎉',
      message: `You've achieved the "${milestone}" milestone in "${activity.title}"${streak ? ` with a ${streak}-day streak!` : '!'}`,
      priority: NotificationPriority.HIGH,
      activityId,
      metadata: { milestone, streak, activityTitle: activity.title },
    });
  }

  async createActivityReminderNotification(
    recipientId: string,
    activityId: string,
    reminderType: string,
  ): Promise<NotificationResponse> {
    const activity = await this.activityModel.findById(activityId);
    if (!activity) throw new Error('Activity not found');

    return this.createNotification({
      recipientId,
      type: NotificationType.ACTIVITY_REMINDER,
      title: 'Activity Reminder',
      message: `Don't forget about your "${activity.title}" activity! ${reminderType}`,
      priority: NotificationPriority.MEDIUM,
      activityId,
      metadata: { reminderType, activityTitle: activity.title },
    });
  }

  async createProgressNotification(
    recipientId: string,
    activityId: string,
    progressData: {
      progress: number;
      completedCheckIns: number;
      totalAvailableCheckIns: number;
      currentStreak?: number;
      lastCheckInDate?: string;
    },
  ): Promise<NotificationResponse> {
    const activity = await this.activityModel.findById(activityId);
    if (!activity) throw new Error('Activity not found');

    const {
      progress,
      completedCheckIns,
      totalAvailableCheckIns,
      currentStreak,
    } = progressData;

    // Determine notification type and message based on progress
    let title: string;
    let message: string;
    let priority: NotificationPriority = NotificationPriority.MEDIUM;

    if (progress === 100) {
      title = 'Activity Completed! 🎉';
      message = `Congratulations! You've completed "${activity.title}" with ${completedCheckIns} check-ins!`;
      priority = NotificationPriority.HIGH;
    } else if (progress >= 75) {
      title = 'Almost There! 🚀';
      message = `You're ${progress}% complete with "${activity.title}". Just ${totalAvailableCheckIns - completedCheckIns} more check-ins to go!`;
      priority = NotificationPriority.MEDIUM;
    } else if (progress >= 50) {
      title = 'Halfway There! 💪';
      message = `Great progress on "${activity.title}"! You're ${progress}% complete with ${completedCheckIns} check-ins.`;
      priority = NotificationPriority.MEDIUM;
    } else if (progress >= 25) {
      title = 'Making Progress! 📈';
      message = `You're ${progress}% complete with "${activity.title}". Keep up the great work!`;
      priority = NotificationPriority.LOW;
    } else {
      title = 'Getting Started! 🌟';
      message = `You've started "${activity.title}" with ${completedCheckIns} check-ins. Every step counts!`;
      priority = NotificationPriority.LOW;
    }

    // Add streak information if available
    if (currentStreak && currentStreak > 0) {
      message += ` You're on a ${currentStreak}-day streak! 🔥`;
    }

    return this.createNotification({
      recipientId,
      type: NotificationType.MILESTONE_ACHIEVED,
      title,
      message,
      priority,
      activityId,
      metadata: {
        progress,
        completedCheckIns,
        totalAvailableCheckIns,
        currentStreak,
        activityTitle: activity.title,
        progressType: 'activity_progress',
      },
    });
  }

  async createStreakNotification(
    recipientId: string,
    activityId: string,
    streakData: {
      currentStreak: number;
      progress: number;
      completedCheckIns: number;
    },
  ): Promise<NotificationResponse> {
    const activity = await this.activityModel.findById(activityId);
    if (!activity) throw new Error('Activity not found');

    const { currentStreak, progress, completedCheckIns } = streakData;

    // Create streak milestone notifications
    const streakMilestones = [3, 7, 14, 30, 50, 100];
    let title: string;
    let message: string;
    let priority: NotificationPriority = NotificationPriority.MEDIUM;

    if (streakMilestones.includes(currentStreak)) {
      title = `🔥 ${currentStreak}-Day Streak!`;
      message = `Amazing! You've maintained a ${currentStreak}-day streak in "${activity.title}"!`;

      if (currentStreak >= 30) {
        priority = NotificationPriority.HIGH;
      } else if (currentStreak >= 7) {
        priority = NotificationPriority.MEDIUM;
      } else {
        priority = NotificationPriority.LOW;
      }
    } else {
      // General streak encouragement
      title = 'Streak Update! 🔥';
      message = `You're on a ${currentStreak}-day streak in "${activity.title}"! Keep it going!`;
      priority = NotificationPriority.LOW;
    }

    return this.createNotification({
      recipientId,
      type: NotificationType.STREAK_MILESTONE,
      title,
      message,
      priority,
      activityId,
      metadata: {
        currentStreak,
        progress,
        completedCheckIns,
        activityTitle: activity.title,
        streakType: 'milestone',
      },
    });
  }

  private async formatNotificationResponse(
    notification: NotificationDocument,
  ): Promise<NotificationResponse> {
    const response: NotificationResponse = {
      id: notification._id.toString(),
      type: notification.type,
      title: notification.title,
      message: notification.message,
      priority: notification.priority,
      isRead: notification.isRead,
      readAt: notification.readAt,
      createdAt: notification.createdAt,
      metadata: notification.metadata,
    };

    // Add sender information if available
    if (notification.sender) {
      const sender = notification.sender as any;
      response.sender = {
        id: sender._id.toString(),
        name: sender.name,
        avatar: sender.profilePicture,
      };
    }

    // Add activity information if available
    if (notification.activityId) {
      const activity = notification.activityId as any;
      response.activity = {
        id: activity._id.toString(),
        title: activity.title,
      };
    }

    return response;
  }
}
