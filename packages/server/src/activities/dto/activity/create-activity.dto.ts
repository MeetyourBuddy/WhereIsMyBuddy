import {
  ApiProperty,
  ApiPropertyOptional,
  getSchemaPath,
} from '@nestjs/swagger';
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
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ActivityType,
  JoinType,
  CheckinFrequencyUnit,
  DurationUnit,
  DayOfWeek,
} from '../../schemas/activity.schema';
import { CheckInType } from '../../interfaces/checkin-type.interface';

class PhotoValidationDto {
  @ApiProperty({
    description: 'Guidelines for what qualifies as a valid photo',
    example: 'Photo must clearly show your completed work for the day',
  })
  @IsString()
  guidelines: string;

  @ApiPropertyOptional({
    description: 'Specific elements that must be in the photo',
    example: ['timestamp', 'workbook page number'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requiredElements?: string[];
}

class ChecklistItemValidationDto {
  @ApiProperty({
    description: 'Text description of the checklist item',
    example: 'Complete daily exercises',
  })
  @IsString()
  text: string;

  @ApiProperty({
    description: 'Whether this item is required',
    example: true,
  })
  @IsBoolean()
  required: boolean;
}

class ChecklistValidationDto {
  @ApiProperty({
    description: 'List of checklist items',
    type: [ChecklistItemValidationDto],
  })
  @ValidateNested({ each: true })
  @Type(() => ChecklistItemValidationDto)
  items: ChecklistItemValidationDto[];
}

class HoursValidationDto {
  @ApiProperty({
    description: 'Description of what counts as valid hours',
    example: 'Time spent actively studying or practicing',
  })
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: 'Minimum hours required per check-in',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minHours?: number;
}

export class CheckInTypeConfigDto {
  @ApiProperty({
    enum: CheckInType,
    description: 'Type of check-in',
    example: CheckInType.PHOTO,
  })
  @IsEnum(CheckInType)
  type: CheckInType;

  @ApiProperty({
    description: 'Validation rules for this check-in type',
    oneOf: [
      { $ref: getSchemaPath(PhotoValidationDto) },
      { $ref: getSchemaPath(ChecklistValidationDto) },
      { $ref: getSchemaPath(HoursValidationDto) },
    ],
  })
  @ValidateNested()
  @Type((opts) => {
    switch (opts.object?.type) {
      case CheckInType.PHOTO:
        return PhotoValidationDto;
      case CheckInType.CHECKLIST:
        return ChecklistValidationDto;
      case CheckInType.HOURS:
        return HoursValidationDto;
      default:
        return PhotoValidationDto;
    }
  })
  validation: PhotoValidationDto | ChecklistValidationDto | HoursValidationDto;
}

export class CreateActivityDto {
  @ApiProperty({
    description: 'Title of the activity',
    example: 'Daily Fitness Challenge',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Detailed description of the activity',
    example: 'A 30-day fitness challenge with daily workouts and progress tracking',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Duration of the activity',
    minimum: 1,
    example: 30,
  })
  @IsNumber()
  @Min(1)
  proposedDuration: number;

  @ApiProperty({
    enum: DurationUnit,
    description: 'Unit of duration (days/months)',
    example: DurationUnit.DAYS,
  })
  @IsEnum(DurationUnit)
  durationUnit: DurationUnit;

  @ApiProperty({
    description: 'Maximum number of participants',
    minimum: 1,
    example: 20,
  })
  @IsNumber()
  @Min(1)
  maxSize: number;

  @ApiProperty({
    enum: ActivityType,
    description: 'Type of activity (public/private)',
    example: ActivityType.PUBLIC,
  })
  @IsEnum(ActivityType)
  type: ActivityType;

  @ApiPropertyOptional({
    enum: JoinType,
    description: 'Join type (flexible/fixed)',
    example: JoinType.FLEXIBLE,
  })
  @IsOptional()
  @IsEnum(JoinType)
  joinType?: JoinType;

  @ApiPropertyOptional({
    description: 'Start date of the activity',
    example: '2024-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'Activity rules',
    example: ['Complete daily workouts', 'Log progress photos'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  rules?: string[];

  @ApiPropertyOptional({
    description: 'Activity tags for categorization',
    example: ['fitness', 'health', 'workout'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    type: [CheckInTypeConfigDto],
    description: 'Types of check-ins allowed with their validation rules',
  })
  @ValidateNested({ each: true })
  @Type(() => CheckInTypeConfigDto)
  allowedCheckInTypes: CheckInTypeConfigDto[];

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

  @ApiPropertyOptional({
    type: [Number],
    minimum: 1,
    maximum: 31,
    description: 'Array of dates for monthly check-ins (1-31)',
    example: [5, 15, 25],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  @Max(31, { each: true })
  @ValidateIf((o) => o.checkinFrequencyUnit === CheckinFrequencyUnit.MONTHLY)
  checkinDatesOfMonth?: number[];

  @ApiPropertyOptional({
    enum: DayOfWeek,
    isArray: true,
    description: 'Array of days for monthly check-ins',
    example: ['monday', 'thursday'],
  })
  @IsOptional()
  @IsEnum(DayOfWeek, { each: true })
  @ValidateIf((o) => o.checkinFrequencyUnit === CheckinFrequencyUnit.MONTHLY)
  checkinDaysOfWeek?: DayOfWeek[];

  @ApiPropertyOptional({
    type: [Number],
    minimum: 1,
    maximum: 4,
    description: 'Array of week numbers for monthly check-ins (1-4)',
    example: [1, 3],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(1, { each: true })
  @Max(4, { each: true })
  @ValidateIf(
    (o) =>
      o.checkinFrequencyUnit === CheckinFrequencyUnit.MONTHLY &&
      o.checkinDaysOfWeek?.length > 0,
  )
  checkinWeeksOfMonth?: number[];
}
