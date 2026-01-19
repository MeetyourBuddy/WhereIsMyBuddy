import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoostController } from './boost.controller';
import { BoostService } from './boost.service';
import {
  BoostMessage,
  BoostMessageSchema,
} from './schemas/boost-message.schema';
import { BoostStats, BoostStatsSchema } from './schemas/boost-stats.schema';
import { BoostBadge, BoostBadgeSchema } from './schemas/boost-badge.schema';
import { ActivityModule } from '../activities/activity.module';
import { User, UserSchema } from '../users/schemas/user.schema';
import { AuthModule } from '../users/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BoostMessage.name, schema: BoostMessageSchema },
      { name: BoostStats.name, schema: BoostStatsSchema },
      { name: BoostBadge.name, schema: BoostBadgeSchema },
      { name: User.name, schema: UserSchema },
    ]),
    forwardRef(() => ActivityModule),
    AuthModule,
  ],
  controllers: [BoostController],
  providers: [BoostService],
  exports: [BoostService],
})
export class BoostModule {}
