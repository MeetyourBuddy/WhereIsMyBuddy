import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ActivityRole } from '../../schemas/activity.schema';

export class UpdateParticipantRoleDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty({ enum: ActivityRole })
  @IsEnum(ActivityRole)
  role: ActivityRole;
}
