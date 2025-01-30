import { ApiProperty } from '@nestjs/swagger';
import { CheckInType } from '../../schemas/activity.schema';

export class CheckInResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  activityId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  date: Date;

  @ApiProperty({ enum: CheckInType })
  type: CheckInType;

  @ApiProperty()
  content: any; // Will be typed based on check-in type

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty({ required: false })
  verifiedBy?: string;

  @ApiProperty({ required: false })
  verifiedAt?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ required: false })
  status?: string;
}
