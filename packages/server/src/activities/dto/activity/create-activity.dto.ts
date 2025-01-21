import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsDate,
  IsArray,
  Min,
  Max,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ActivityType,
  JoinType,
  CheckinFrequencyUnit,
  DurationUnit,
  CheckInType,
  DayOfWeek,
} from '../../schemas/activity.schema';

export class CreateActivityDto {
  @ApiProperty({ example: 'Learn Spanish Together' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Weekly Spanish learning sessions for beginners' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Duration value' })
  @IsNumber()
  @Min(1)
  proposedDuration: number;

  @ApiProperty({
    enum: DurationUnit,
    description: 'Unit of duration (days or months)',
    example: DurationUnit.DAYS,
  })
  @IsEnum(DurationUnit)
  durationUnit: DurationUnit;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bannerImage?: string;

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
  categories?: string[];

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

  @ApiProperty({
    type: [String],
    enum: CheckInType,
    description: 'Types of check-ins allowed for this activity',
    example: ['photo', 'hours', 'text'],
  })
  @IsArray()
  @IsEnum(CheckInType, { each: true })
  @IsOptional()
  allowedCheckInTypes?: CheckInType[];

  @ApiProperty({ minimum: 1 })
  @IsNumber()
  @Min(1)
  checkinFrequency: number;

  @ApiProperty({ enum: CheckinFrequencyUnit })
  @IsEnum(CheckinFrequencyUnit)
  checkinFrequencyUnit: CheckinFrequencyUnit;

  @ApiPropertyOptional({ enum: DayOfWeek, isArray: true })
  @IsOptional()
  @IsEnum(DayOfWeek, { each: true })
  @ValidateIf(
    (o) =>
      o.checkinFrequencyUnit === CheckinFrequencyUnit.WEEKLY ||
      o.checkinFrequencyUnit === CheckinFrequencyUnit.BIWEEKLY,
  )
  checkinDays?: DayOfWeek[];

  @ApiPropertyOptional({ minimum: 1, maximum: 31 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(31)
  @ValidateIf((o) => o.checkinFrequencyUnit === CheckinFrequencyUnit.MONTHLY)
  checkinDateOfMonth?: number;

  @ApiPropertyOptional({ enum: DayOfWeek })
  @IsOptional()
  @IsEnum(DayOfWeek)
  @ValidateIf((o) => o.checkinFrequencyUnit === CheckinFrequencyUnit.MONTHLY)
  checkinDayOfWeek?: DayOfWeek;

  @ApiPropertyOptional({ minimum: 1, maximum: 4 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(4)
  @ValidateIf(
    (o) =>
      o.checkinFrequencyUnit === CheckinFrequencyUnit.MONTHLY &&
      o.checkinDayOfWeek,
  )
  checkinWeekOfMonth?: number;
}
