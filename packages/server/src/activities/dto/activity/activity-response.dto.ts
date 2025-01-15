/* Serves for consistent response formatting and Swagger documentation. */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserResponseDto } from '../../../users/dto/user-response.dto';
import {
  ActivityType,
  JoinType,
  CheckinFrequency,
  DurationUnit,
  ActivityRole,
} from '../../schemas/activity.schema';

@Exclude()
export class ParticipantDto {
  @Expose()
  @ApiProperty({ type: () => UserResponseDto })
  user: UserResponseDto;

  @Expose()
  @ApiProperty({ enum: ActivityRole })
  role: ActivityRole;
}

@Exclude()
export class ActivityResponseDto {
  /**
   * Unique identifier for the activity
   * @example "507f1f77bcf86cd799439011"
   */
  @Expose()
  @ApiProperty()
  _id: string;

  /**
   * Title of the activity
   * @example "Learn Spanish Together"
   */
  @Expose()
  @ApiProperty()
  title: string;

  /**
   * Description of the activity
   * @example "Weekly Spanish learning sessions for beginners"
   */
  @Expose()
  @ApiProperty()
  description: string;

  /**
   * Activity admin/host
   */
  @Expose()
  @ApiProperty({ type: () => UserResponseDto })
  admin: UserResponseDto;

  /**
   * Duration of the activity in days
   * @example 30
   */
  @Expose()
  @ApiProperty()
  proposedDuration: number;

  /**
   * Banner image URL for the activity
   * @example "https://example.com/images/banner.jpg"
   */
  @Expose()
  @ApiPropertyOptional()
  bannerImage?: string;

  /**
   * Frequency of contact between participants
   * @example "WEEKLY"
   */
  @Expose()
  @ApiProperty({ enum: CheckinFrequency })
  contactFrequency: CheckinFrequency;

  /**
   * Type of activity (public/private)
   * @example "PUBLIC"
   */
  @Expose()
  @ApiProperty({ enum: ActivityType })
  type: ActivityType;

  /**
   * Start date of the activity
   * @example "2024-01-01T00:00:00Z"
   */
  @Expose()
  @ApiPropertyOptional()
  startDate?: Date;

  /**
   * Join type (flexible/fixed)
   * @example "FLEXIBLE"
   */
  @Expose()
  @ApiProperty({ enum: JoinType })
  joinType: JoinType;

  /**
   * Maximum number of participants
   * @example 10
   */
  @Expose()
  @ApiProperty()
  maxSize: number;

  /**
   * Current number of participants
   * @example 3
   */
  @Expose()
  @ApiProperty()
  currentSize: number;

  /**
   * Activity tags
   * @example ["language", "spanish", "learning"]
   */
  @Expose()
  @ApiPropertyOptional({ type: [String] })
  tags: string[];

  /**
   * Activity rules
   */
  @Expose()
  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        rule: { type: 'string' },
        isDefault: { type: 'boolean' },
      },
    },
  })
  rules: Array<{ rule: string; isDefault: boolean }>;

  /**
   * List of participants
   */
  @Expose()
  @ApiProperty({ type: [ParticipantDto] })
  participants: ParticipantDto[];

  /**
   * Activity status
   * @example true
   */
  @Expose()
  @ApiProperty()
  isActive: boolean;

  /**
   * Available seats in the activity
   * @example 7
   */
  @Expose()
  @ApiProperty()
  get availableSeats(): number {
    return this.maxSize - this.currentSize;
  }

  /**
   * Creation timestamp
   * @example "2024-01-01T00:00:00Z"
   */
  @Expose()
  @ApiProperty()
  createdAt: Date;

  /**
   * Last update timestamp
   * @example "2024-01-01T00:00:00Z"
   */
  @Expose()
  @ApiProperty()
  updatedAt: Date;

  /**
   * Duration unit of the activity
   * @example "DAYS"
   */
  @Expose()
  @ApiProperty({ enum: DurationUnit })
  durationUnit: DurationUnit;

  @Expose()
  @ApiPropertyOptional()
  proposedDurationInDays?: number;

  @Expose()
  @ApiPropertyOptional()
  endedAt?: Date;
}
