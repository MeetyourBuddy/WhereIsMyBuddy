import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoostController } from './boost.controller';
import { BoostService } from './boost.service';
import {
  BoostMessage,
  BoostMessageSchema,
} from './schemas/boost-message.schema';
import { BoostStats, BoostStatsSchema } from './schemas/boost-stats.schema';
import { BoostBadge, BoostBadgeSchema } from './schemas/boost-badge.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BoostMessage.name, schema: BoostMessageSchema },
      { name: BoostStats.name, schema: BoostStatsSchema },
      { name: BoostBadge.name, schema: BoostBadgeSchema },
    ]),
  ],
  controllers: [BoostController],
  providers: [BoostService],
  exports: [BoostService],
})
export class BoostModule {}
