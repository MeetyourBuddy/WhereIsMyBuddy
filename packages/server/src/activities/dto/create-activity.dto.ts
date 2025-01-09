import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsOptional, IsDate, IsArray, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ActivityType, JoinType, ContactFrequency } from '../schemas/activity.schema';

export class CreateActivityDto {
  @ApiProperty({ example: 'Learn Spanish Together' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Weekly Spanish learning sessions for beginners' })
  @IsString()
  description: string;

  @ApiProperty({ example: 30, description: 'Duration in days' })
  @IsNumber()
  @Min(1)
  proposedDuration: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bannerImage?: string;

  @ApiPropertyOptional({ enum: ContactFrequency })
  @IsOptional()
  @IsEnum(ContactFrequency)
  contactFrequency?: ContactFrequency;

  @ApiProperty({ enum: ActivityType })
  @IsEnum(ActivityType)
  type: ActivityType;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiPropertyOptional({ enum: JoinType })
  @IsOptional()
  @IsEnum(JoinType)
  joinType?: JoinType;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(1)
  maxSize: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  rules?: string[];
} 