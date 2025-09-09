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
import { Activity, ActivitySchema } from './schemas/activity.schema';
import { CheckIn, CheckInSchema } from './schemas/checkin.schema';
import { Badge, BadgeSchema } from './schemas/badge.schema';
import { UserBadge, UserBadgeSchema } from './schemas/user-badge.schema';
import { Reaction, ReactionSchema } from './schemas/reaction.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Activity.name, schema: ActivitySchema },
      { name: CheckIn.name, schema: CheckInSchema },
      { name: Badge.name, schema: BadgeSchema },
      { name: UserBadge.name, schema: UserBadgeSchema },
      { name: Reaction.name, schema: ReactionSchema },
    ]),
    UsersModule,
  ],
  controllers: [
    ActivityController,
    CheckInController,
    BadgeController,
    ReactionController,
  ],
  providers: [ActivityService, CheckInService, BadgeService, ReactionService],
  exports: [ActivityService, CheckInService, BadgeService, ReactionService],
})
export class ActivityModule {}
