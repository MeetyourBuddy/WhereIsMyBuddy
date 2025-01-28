import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum JoinRequestAction {
  APPROVE = 'approve',
  REJECT = 'reject'
}

export class HandleJoinRequestDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty({ enum: JoinRequestAction })
  @IsEnum(JoinRequestAction)
  action: JoinRequestAction;
} 