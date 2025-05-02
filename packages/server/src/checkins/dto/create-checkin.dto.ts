import { IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCheckInDto {
  @IsMongoId()
  @IsNotEmpty()
  activityId: string;

  @IsEnum(['text', 'image'])
  @IsNotEmpty()
  type: 'text' | 'image';

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  mediaUrl?: string;
} 