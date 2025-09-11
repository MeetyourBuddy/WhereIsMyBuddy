import { Controller, Get, Post, Param, UseGuards, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../users/auth/guards/jwt-auth.guard';
import { NotificationService, NotificationData } from './notification.service';
import { GetUser } from '../users/decorators/get-user.decorator';
import { User } from '../users/schemas/user.schema';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('check/:activityId?')
  async checkProgressNotifications(
    @GetUser() user: User,
    @Param('activityId') activityId?: string,
  ): Promise<{
    success: boolean;
    notifications: NotificationData[];
  }> {
    const notifications =
      await this.notificationService.checkAndSendProgressNotifications(
        user._id.toString(),
        activityId,
      );

    return {
      success: true,
      notifications,
    };
  }
}
