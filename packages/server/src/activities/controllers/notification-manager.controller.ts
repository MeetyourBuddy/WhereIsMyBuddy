import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../users/auth/guards/jwt-auth.guard';
import { GetUser } from '../../users/decorators/get-user.decorator';
import {
  NotificationManagerService,
  CreateNotificationDto,
} from '../services/notification-manager.service';
import { NotificationType } from '../schemas/notification.schema';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationManagerController {
  constructor(
    private readonly notificationManagerService: NotificationManagerService,
  ) {}

  @Get()
  async getUserNotifications(
    @GetUser('userId') userId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
    @Query('type') type?: NotificationType,
    @Query('unreadOnly') unreadOnly: string = 'false',
  ) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const unreadOnlyBool = unreadOnly === 'true';

    return this.notificationManagerService.getUserNotifications(
      userId,
      pageNum,
      limitNum,
      type,
      unreadOnlyBool,
    );
  }

  @Get('unread-count')
  async getUnreadCount(@GetUser('userId') userId: string) {
    const count = await this.notificationManagerService.getUnreadCount(userId);
    return { unreadCount: count };
  }

  @Put(':id/read')
  async markAsRead(
    @Param('id') notificationId: string,
    @GetUser('userId') userId: string,
  ) {
    return this.notificationManagerService.markAsRead(notificationId, userId);
  }

  @Put('mark-all-read')
  async markAllAsRead(@GetUser('userId') userId: string) {
    return this.notificationManagerService.markAllAsRead(userId);
  }

  @Delete(':id')
  async deleteNotification(
    @Param('id') notificationId: string,
    @GetUser('userId') userId: string,
  ) {
    await this.notificationManagerService.deleteNotification(
      notificationId,
      userId,
    );
    return { success: true, message: 'Notification deleted successfully' };
  }

  @Post()
  async createNotification(
    @Body() createNotificationDto: CreateNotificationDto,
    @GetUser('userId') userId: string,
  ) {
    // Only allow users to create notifications for themselves or if they're an admin
    // For now, we'll allow users to create notifications for themselves
    if (createNotificationDto.recipientId !== userId) {
      throw new Error('You can only create notifications for yourself');
    }

    return this.notificationManagerService.createNotification(
      createNotificationDto,
    );
  }

  @Post('progress')
  async createProgressNotification(
    @Body()
    body: {
      activityId: string;
      progressData: {
        progress: number;
        completedCheckIns: number;
        totalAvailableCheckIns: number;
        currentStreak?: number;
        lastCheckInDate?: string;
      };
    },
    @GetUser('userId') userId: string,
  ) {
    return this.notificationManagerService.createProgressNotification(
      userId,
      body.activityId,
      body.progressData,
    );
  }

  @Post('streak')
  async createStreakNotification(
    @Body()
    body: {
      activityId: string;
      streakData: {
        currentStreak: number;
        progress: number;
        completedCheckIns: number;
      };
    },
    @GetUser('userId') userId: string,
  ) {
    return this.notificationManagerService.createStreakNotification(
      userId,
      body.activityId,
      body.streakData,
    );
  }
}
