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
// import { NotificationController } from './notification.controller';
// import { NotificationService } from './notification.service';
import { NotificationManagerController } from './controllers/notification-manager.controller';
import { NotificationManagerService } from './services/notification-manager.service';
import { ActivityMessageController } from './activity-message.controller';
import { ActivityMessageService } from './activity-message.service';
import {
  PartnerController,
  PartnerInvitationController,
} from './partner.controller';
import { PartnerService } from './partner.service';
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
import {
  ActivityMessage,
  ActivityMessageSchema,
} from './schemas/activity-message.schema';
import { Partner, PartnerSchema } from './schemas/partner.schema';
import {
  PartnerInvitation,
  PartnerInvitationSchema,
} from './schemas/partner-invitation.schema';
import {
  ActivityInvitation,
  ActivityInvitationSchema,
} from './schemas/activity-invitation.schema';
import {
  BuddyConnection,
  BuddyConnectionSchema,
} from '../users/schemas/buddy-connection.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UsersModule } from '../users/users.module';
import {
  ActivityInvitationController,
  ActivityInvitationUserController,
  ActivityInvitePublicController,
} from './activity-invitation.controller';
import { ActivityInvitationService } from './activity-invitation.service';

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
      { name: ActivityMessage.name, schema: ActivityMessageSchema },
      { name: Partner.name, schema: PartnerSchema },
      { name: PartnerInvitation.name, schema: PartnerInvitationSchema },
      { name: ActivityInvitation.name, schema: ActivityInvitationSchema },
      { name: BuddyConnection.name, schema: BuddyConnectionSchema },
      { name: User.name, schema: UserSchema },
    ]),
    UsersModule,
  ],
  controllers: [
    // More specific routes first
    PartnerController,
    PartnerInvitationController,
    ActivityInvitationController,
    ActivityInvitationUserController,
    ActivityInvitePublicController,
    ActivityMessageController,
    // General routes last
    ActivityController,
    CheckInController,
    BadgeController,
    ReactionController,
    CheckInCommentController,
    MilestoneController,
    ExportController,
    // NotificationController, // Removed - using NotificationManagerController instead
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
    ActivityMessageService,
    PartnerService,
    ActivityInvitationService,
    // NotificationService, // Removed - using NotificationManagerService instead
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
    ActivityMessageService,
    PartnerService,
    ActivityInvitationService,
    // NotificationService, // Removed - using NotificationManagerService instead
    NotificationManagerService,
  ],
})
export class ActivityModule {}
