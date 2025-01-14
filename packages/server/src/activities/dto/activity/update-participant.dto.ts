import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId } from 'class-validator';
import { ActivityRole } from '../../schemas/activity.schema';

export class UpdateParticipantRoleDto {
  @ApiProperty()
  @IsMongoId()
  userId: string;

  @ApiProperty({ enum: ActivityRole })
  @IsEnum(ActivityRole)
  role: ActivityRole;
}
