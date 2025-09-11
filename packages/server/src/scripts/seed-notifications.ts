import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { NotificationManagerService } from '../activities/services/notification-manager.service';
import { User, UserDocument } from '../users/schemas/user.schema';
import {
  Activity,
  ActivityDocument,
} from '../activities/schemas/activity.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

async function seedNotifications() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const notificationService = app.get(NotificationManagerService);
  const userModel = app.get<Model<UserDocument>>(getModelToken(User.name));
  const activityModel = app.get<Model<ActivityDocument>>(
    getModelToken(Activity.name),
  );

  try {
    // Get a sample user and activity
    const user = await userModel.findOne();
    const activity = await activityModel.findOne();

    if (!user) {
      console.log('No users found. Please create a user first.');
      return;
    }

    if (!activity) {
      console.log('No activities found. Please create an activity first.');
      return;
    }

    // Create sample notifications
    const sampleNotifications = [
      {
        recipientId: user._id.toString(),
        type: 'system_welcome' as const,
        title: 'Welcome to Buddy! 🎉',
        message:
          'Thanks for joining Buddy. Complete your profile to get started and find your perfect activity buddies!',
        priority: 'high' as const,
      },
      {
        recipientId: user._id.toString(),
        type: 'milestone_achieved' as const,
        title: 'Halfway There! 💪',
        message: `Great progress on "${activity.title}"! You're 50% complete with 5 check-ins.`,
        priority: 'medium' as const,
        activityId: activity._id.toString(),
        metadata: {
          progress: 50,
          completedCheckIns: 5,
          totalAvailableCheckIns: 10,
          currentStreak: 3,
          activityTitle: activity.title,
          progressType: 'activity_progress',
        },
      },
      {
        recipientId: user._id.toString(),
        type: 'streak_milestone' as const,
        title: '🔥 7-Day Streak!',
        message: `Amazing! You've maintained a 7-day streak in "${activity.title}"!`,
        priority: 'medium' as const,
        activityId: activity._id.toString(),
        metadata: {
          currentStreak: 7,
          progress: 60,
          completedCheckIns: 6,
          activityTitle: activity.title,
          streakType: 'milestone',
        },
      },
      {
        recipientId: user._id.toString(),
        type: 'activity_reminder' as const,
        title: 'Activity Reminder ⏰',
        message: `Don't forget about your "${activity.title}" session today! You're doing great!`,
        priority: 'medium' as const,
        activityId: activity._id.toString(),
        metadata: { reminderType: 'daily check-in' },
      },
    ];

    console.log('Creating sample notifications...');

    for (const notificationData of sampleNotifications) {
      try {
        const notification =
          await notificationService.createNotification(notificationData);
        console.log(`✅ Created notification: ${notification.title}`);
      } catch (error) {
        console.error(
          `❌ Failed to create notification: ${notificationData.title}`,
          error,
        );
      }
    }

    console.log('✅ Sample notifications created successfully!');
  } catch (error) {
    console.error('❌ Error seeding notifications:', error);
  } finally {
    await app.close();
  }
}

seedNotifications();
