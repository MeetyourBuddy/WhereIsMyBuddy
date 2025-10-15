import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class CreatePartnerInvitationDto {
  @ValidateIf((o) => !o.toEmail && !o.isLinkInvitation)
  @IsString()
  @IsNotEmpty()
  toUserId?: string;

  @ValidateIf((o) => !o.toUserId && !o.isLinkInvitation)
  @IsEmail()
  @IsNotEmpty()
  toEmail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Message cannot exceed 500 characters' })
  message?: string;

  @IsOptional()
  @IsString()
  isLinkInvitation?: string; // Flag to indicate this is a link invitation
}
