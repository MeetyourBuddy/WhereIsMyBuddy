import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserResponseDto } from '../../../users/dto/user-response.dto';
import { ActivityResponseDto } from '../activity/activity-response.dto';
import { CheckInType } from '../../schemas/checkin.schema';

@Exclude()
export class CheckInResponseDto {
  /**
   * Unique identifier for the check-in
   * @example "507f1f77bcf86cd799439011"
   */
  @Expose()
  @ApiProperty()
  id: string;

  /**
   * User who created the check-in
   */
  @Expose()
  @ApiProperty({ type: () => UserResponseDto })
  user: UserResponseDto;

  /**
   * Activity this check-in belongs to
   */
  @Expose()
  @ApiProperty({ type: () => ActivityResponseDto })
  activity: ActivityResponseDto;

  /**
   * Type of check-in (photo, checklist, hours, etc.)
   * @example "photo"
   */
  @Expose()
  @ApiProperty({ enum: CheckInType })
  type: CheckInType;

  /**
   * Main content of the check-in
   * @example "Completed today's Spanish vocabulary practice"
   */
  @Expose()
  @ApiProperty()
  content: string;

  /**
   * Date of the check-in activity
   * @example "2024-01-15T14:30:00Z"
   */
  @Expose()
  @ApiProperty({ type: Date })
  date: Date;

  /**
   * Optional comment providing additional context
   * @example "Found the pronunciation exercises particularly helpful"
   */
  @Expose()
  @ApiPropertyOptional()
  comment?: string;

  /**
   * Photo details if check-in type is PHOTO
   */
  @Expose()
  @ApiPropertyOptional()
  photo?: {
    /**
     * URL of the uploaded image
     * @example "https://example.com/uploads/photo.jpg"
     */
    imageUrl: string;
    /**
     * Guidelines or requirements for the photo
     * @example "Show your completed workbook page"
     */
    guidelines: string;
  };

  /**
   * Checklist items if check-in type is CHECKLIST
   */
  @Expose()
  @ApiPropertyOptional({ type: [Object] })
  checklist?: Array<{
    /**
     * Checklist item description
     * @example "Complete vocabulary exercises"
     */
    item: string;
    /**
     * Whether the item is completed
     * @example true
     */
    completed: boolean;
  }>;

  /**
   * Hours tracking if check-in type is HOURS
   */
  @Expose()
  @ApiPropertyOptional()
  hours?: {
    /**
     * Number of hours spent
     * @example 2
     */
    hours: number;
    /**
     * Minimum required hours
     * @example 1
     */
    min: number;
    /**
     * Maximum allowed hours
     * @example 4
     */
    max: number;
  };

  /**
   * Additional details if check-in type is OTHER
   */
  @Expose()
  @ApiPropertyOptional()
  other?: {
    /**
     * Description of the custom check-in type
     * @example "Group practice session"
     */
    description: string;
    /**
     * Value or measurement for the custom type
     * @example "90 minutes"
     */
    value: string;
  };

  /**
   * Whether all required elements are completed
   * @example true
   */
  @Expose()
  @ApiProperty()
  isCompleted: boolean;

  /**
   * Whether the check-in has been verified by an admin
   * @example false
   */
  @Expose()
  @ApiProperty()
  isVerified: boolean;

  /**
   * Admin who verified the check-in (if applicable)
   */
  @Expose()
  @ApiPropertyOptional({ type: () => UserResponseDto })
  verifiedBy?: UserResponseDto;

  /**
   * Creation timestamp
   * @example "2024-01-15T14:30:00Z"
   */
  @Expose()
  @ApiProperty()
  createdAt: Date;

  /**
   * Last update timestamp
   * @example "2024-01-15T14:35:00Z"
   */
  @Expose()
  @ApiProperty()
  updatedAt: Date;
}
