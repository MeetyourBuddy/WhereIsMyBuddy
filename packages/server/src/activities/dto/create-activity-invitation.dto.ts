import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  ValidateIf,
  IsArray,
} from 'class-validator';

export class CreateActivityInvitationDto {
  @ValidateIf((o) => !o.toEmail && !o.isLinkInvitation && (!o.emails || o.emails.length === 0))
  @IsString()
  @IsNotEmpty()
  toUserId?: string;

  @ValidateIf((o) => !o.toUserId && !o.isLinkInvitation && (!o.emails || o.emails.length === 0))
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

  // For bulk invitations
  @ValidateIf((o) => !o.toUserId && !o.toEmail && !o.isLinkInvitation)
  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  emails?: string[];
}

