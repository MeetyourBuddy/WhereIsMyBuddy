import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { CheckInController } from './checkin.controller';
import { CheckInService } from './checkin.service';
import { BadgeController } from './badge.controller';
import { BadgeService } from './badge.service';
import { ReactionController } from './reaction.controller';
import { ReactionService } from './reaction.service';
import { CheckInCommentController } from './checkin-comment.controller';
import { CheckInCommentService } from './checkin-comment.service';
import { MilestoneController } from './milestone.controller';
import { MilestoneService } from './milestone.service';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationManagerController } from './controllers/notification-manager.controller';
import { NotificationManagerService } from './services/notification-manager.service';
import { Activity, ActivitySchema } from './schemas/activity.schema';
import { CheckIn, CheckInSchema } from './schemas/checkin.schema';
import { Badge, BadgeSchema } from './schemas/badge.schema';
import { UserBadge, UserBadgeSchema } from './schemas/user-badge.schema';
import { Reaction, ReactionSchema } from './schemas/reaction.schema';
import {
  CheckInComment,
  CheckInCommentSchema,
} from './schemas/checkin-comment.schema';
import {
  Milestone,
  MilestoneSchema,
  UserMilestone,
  UserMilestoneSchema,
} from './schemas/milestone.schema';
import {
  Notification,
  NotificationSchema,
} from './schemas/notification.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Activity.name, schema: ActivitySchema },
      { name: CheckIn.name, schema: CheckInSchema },
      { name: Badge.name, schema: BadgeSchema },
      { name: UserBadge.name, schema: UserBadgeSchema },
      { name: Reaction.name, schema: ReactionSchema },
      { name: CheckInComment.name, schema: CheckInCommentSchema },
      { name: Milestone.name, schema: MilestoneSchema },
      { name: UserMilestone.name, schema: UserMilestoneSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
    UsersModule,
  ],
  controllers: [
    ActivityController,
    CheckInController,
    BadgeController,
    ReactionController,
    CheckInCommentController,
    MilestoneController,
    ExportController,
    NotificationController,
    NotificationManagerController,
  ],
  providers: [
    ActivityService,
    CheckInService,
    BadgeService,
    ReactionService,
    CheckInCommentService,
    MilestoneService,
    ExportService,
    NotificationService,
    NotificationManagerService,
  ],
  exports: [
    ActivityService,
    CheckInService,
    BadgeService,
    ReactionService,
    CheckInCommentService,
    MilestoneService,
    ExportService,
    NotificationService,
    NotificationManagerService,
  ],
})
export class ActivityModule {}
