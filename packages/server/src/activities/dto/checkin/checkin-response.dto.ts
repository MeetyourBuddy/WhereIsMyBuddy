import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserResponseDto } from '../../../users/dto/user-response.dto';
import { ActivityResponseDto } from '../activity/activity-response.dto';
import { CheckInType } from '../../schemas/checkin.schema';

@Exclude()
export class CheckInResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty({ type: () => UserResponseDto })
  user: UserResponseDto;

  @Expose()
  @ApiProperty({ type: () => ActivityResponseDto })
  activity: ActivityResponseDto;

  @Expose()
  @ApiProperty({ enum: CheckInType, isArray: true })
  types: CheckInType[];

  @Expose()
  @ApiPropertyOptional()
  photo?: {
    imageUrl: string;
    guidelines: string;
  };

  @Expose()
  @ApiPropertyOptional()
  checklist?: Array<{
    item: string;
    completed: boolean;
  }>;

  @Expose()
  @ApiPropertyOptional()
  hours?: {
    hours: number;
    min: number;
    max: number;
  };

  @Expose()
  @ApiPropertyOptional()
  other?: {
    description: string;
    value: string;
  };

  @Expose()
  @ApiProperty({ type: Date })
  date: Date;

  @Expose()
  @ApiPropertyOptional()
  comment?: string;

  @Expose()
  @ApiProperty()
  type: CheckInType;

  @Expose()
  @ApiProperty()
  content: string;

  @Expose()
  @ApiProperty()
  isCompleted: boolean;

  @Expose()
  @ApiProperty()
  isVerified: boolean;

  @Expose()
  @ApiPropertyOptional({ type: () => UserResponseDto })
  verifiedBy?: UserResponseDto;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}
