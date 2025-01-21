/* Serves for consistent response formatting and Swagger documentation. */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserResponseDto } from '../../../users/dto/user-response.dto';
import {
  ActivityType,
  JoinType,
  DurationUnit,
  ActivityRole,
  CheckInType,
  CheckinFrequencyUnit,
  DayOfWeek,
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
  id: string;

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
   * Duration value of the activity
   * @example 30
   */
  @Expose()
  @ApiProperty()
  proposedDuration: number;

  /**
   * Unit of duration (days or months)
   * @example "days"
   */
  @Expose()
  @ApiProperty({ enum: DurationUnit })
  durationUnit: DurationUnit;

  /**
   * Calculated duration in days
   * @example 30
   */
  @Expose()
  @ApiPropertyOptional()
  proposedDurationInDays?: number;

  /**
   * Banner image URL for the activity
   * @example "https://example.com/images/banner.jpg"
   */
  @Expose()
  @ApiPropertyOptional()
  bannerImage?: string;

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
  @ApiProperty({ type: Date })
  startDate: Date;

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
   * Activity tags for categorization and search
   * @example ["language", "spanish", "learning"]
   */
  @Expose()
  @ApiProperty({ type: [String] })
  tags: string[];

  /**
  
   * Activity rules and guidelines

   */
  @Expose()
  @ApiProperty({ type: [Object] })
  rules: Array<{ rule: string; isDefault: boolean }>;

  /**
   * List of participants with their roles
   */
  @Expose()
  @ApiProperty({ type: [ParticipantDto] })
  participants: ParticipantDto[];

  /**
   * Whether the activity is currently active
   * @example true
   */
  @Expose()
  @ApiProperty()
  isActive: boolean;

  /**
   * Date when the activity was ended (if applicable)
   * @example "2024-12-31T23:59:59Z"
   */
  @Expose()
  @ApiPropertyOptional({ type: Date })
  endedAt?: Date;

  /**
   * Types of check-ins allowed for this activity
   * @example ["photo", "checklist", "hours"]
   */
  @Expose()
  @ApiProperty({ type: [String], enum: CheckInType })
  allowedCheckInTypes: CheckInType[];

  /**
   * Number of times check-ins should occur within the frequency unit
   * @example 2
   */
  @Expose()
  @ApiProperty()
  checkinFrequency: number;

  /**
   * Unit of check-in frequency (daily, weekly, biweekly, monthly)
   * @example "weekly"
   */
  @Expose()
  @ApiProperty({ enum: CheckinFrequencyUnit })
  checkinFrequencyUnit: CheckinFrequencyUnit;

  /**
   * Days of the week for check-ins (for weekly/biweekly frequency)
   * @example ["monday", "thursday"]
   */
  @Expose()
  @ApiPropertyOptional({ enum: DayOfWeek, isArray: true })
  checkinDays?: DayOfWeek[];

  /**
   * Date of the month for check-ins (for monthly frequency)
   * @example 15
   */
  @Expose()
  @ApiPropertyOptional()
  checkinDateOfMonth?: number;

  /**
   * Day of the week for monthly check-ins
   * @example "thursday"
   */
  @Expose()
  @ApiPropertyOptional({ enum: DayOfWeek })
  checkinDayOfWeek?: DayOfWeek;

  /**
   * Week of the month for check-ins (1-4)
   * @example 4
   * @description Used with checkinDayOfWeek for "last Thursday of month" type patterns
   */
  @Expose()
  @ApiPropertyOptional()
  checkinWeekOfMonth?: number;

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
   * Number of available seats in the activity
   * @example 7
   */
  @Expose()
  @ApiProperty()
  get availableSeats(): number {
    return this.maxSize - this.currentSize;
  }

  /**
   * Next due check-in date based on frequency settings
   * @example "2024-01-15T00:00:00Z"
   */
  @Expose()
  @ApiPropertyOptional()
  nextCheckInDue?: Date;
}
