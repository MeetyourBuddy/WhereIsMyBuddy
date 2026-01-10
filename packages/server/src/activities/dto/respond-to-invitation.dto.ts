import { IsString, IsIn } from 'class-validator';

export class RespondToInvitationDto {
  @IsString()
  @IsIn(['accept', 'decline'], {
    message: 'Response must be either accept or decline',
  })
  action: 'accept' | 'decline';
}
