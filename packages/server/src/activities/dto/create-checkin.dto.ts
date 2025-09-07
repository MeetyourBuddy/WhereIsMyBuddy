import {
  IsString,
  IsEnum,
  IsDateString,
  IsOptional,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';

export class CreateCheckInDto {
  @IsString()
  @IsNotEmpty()
  activityId: string;

  @IsEnum(['text', 'image'])
  type: 'text' | 'image';

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000, { message: 'Content cannot exceed 1000 characters' })
  content: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  fileId?: string;

  @IsDateString()
  scheduledDate: string;
}
