import { ApiProperty } from '@nestjs/swagger';
import { CheckInType } from '../../interfaces/checkin-type.interface';
import {
  IActivityStats,
  IParticipantStats,
} from '../../interfaces/activity-stats.interface';

export class ParticipantStatsDto implements IParticipantStats {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  checkInCount: number;

  @ApiProperty()
  completionRate: number;

  @ApiProperty()
  streak: number;

  @ApiProperty({ required: false })
  lastCheckIn?: Date;

  @ApiProperty({ required: false })
  averageCompletionTime?: number;
}

export class ActivityStatsDto implements IActivityStats {
  @ApiProperty()
  totalCheckIns: number;

  @ApiProperty()
  completionRate: number;

  @ApiProperty({ type: [ParticipantStatsDto] })
  participantStats: ParticipantStatsDto[];

  @ApiProperty({ type: 'object', additionalProperties: { type: 'number' } })
  checkInsByType: Record<CheckInType, number>;

  @ApiProperty()
  averageCompletionTime: number;

  @ApiProperty()
  mostActiveDay: string;

  @ApiProperty({ enum: CheckInType, nullable: true })
  mostPopularCheckInType: CheckInType | null;

  @ApiProperty()
  longestStreak: number;

  @ApiProperty()
  totalDurationInDays: number;

  @ApiProperty()
  averageDurationInDays: number;

  @ApiProperty()
  availableSeats: number;

  @ApiProperty()
  isJoinable: boolean;
}
