import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { CheckInController } from './checkin.controller';
import { CheckInService } from './checkin.service';
import { Activity, ActivitySchema } from './schemas/activity.schema';
import { CheckIn, CheckInSchema } from './schemas/checkin.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Activity.name, schema: ActivitySchema },
      { name: CheckIn.name, schema: CheckInSchema },
    ]),
    UsersModule,
  ],
  controllers: [ActivityController, CheckInController],
  providers: [ActivityService, CheckInService],
  exports: [ActivityService, CheckInService],
})
export class ActivityModule {}
