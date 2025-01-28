import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../../users/dto/user-response.dto';
import { ActivityRole } from '../../schemas/activity.schema';

export class ParticipantDto {
  @ApiProperty({
    description: 'User information',
    type: () => UserResponseDto,
  })
  user: UserResponseDto;

  @ApiProperty({
    description: 'Role in the activity',
    enum: ActivityRole,
    example: ActivityRole.MEMBER,
  })
  role: ActivityRole;
}
