import { IsString, IsOptional, IsMongoId } from 'class-validator';

export class SendBoostDto {
  @IsMongoId()
  recipientId: string;

  @IsString()
  messageId: string;

  @IsOptional()
  @IsMongoId()
  activityId?: string;
}
