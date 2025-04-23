import { IsString, IsNumber, IsEnum, IsOptional, IsArray, IsBoolean, ValidateNested, IsDate, Min, Max, ArrayMinSize, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ActivityType, JoinType, DurationUnit, CheckinFrequencyUnit, DayOfWeek, CheckInType } from '../schemas/activity.schema';
import { InterestCategory } from '../../users/enums/interests.enum';

class ActivityRuleDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsBoolean()
  isDefault: boolean;
}

class ValidationConfigDto {
  @IsString()
  guidelines: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  requiredElements?: string[];

  @IsNumber()
  @IsOptional()
  @Min(0)
  minLength?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  maxLength?: number;
}

class CheckInTypeConfigDto {
  @IsEnum(CheckInType)
  type: CheckInType;

  @ValidateNested()
  @Type(() => ValidationConfigDto)
  validation: ValidationConfigDto;

  @IsBoolean()
  isEnabled: boolean;

  @IsString()
  description: string;
}

export class CreateActivityDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(InterestCategory)
  category: InterestCategory;

  @IsEnum(ActivityType)
  type: ActivityType;

  @IsNumber()
  proposedDuration: number;

  @IsEnum(DurationUnit)
  durationUnit: DurationUnit;

  @IsNumber()
  maxSize: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ValidateNested({ each: true })
  @Type(() => ActivityRuleDto)
  rules: ActivityRuleDto[];

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsEnum(CheckinFrequencyUnit)
  checkinFrequencyUnit: CheckinFrequencyUnit;

  @IsNumber()
  checkinFrequency: number;

  @IsArray()
  @IsEnum(DayOfWeek, { each: true })
  @IsOptional()
  checkinDays?: DayOfWeek[];

  @IsString()
  @IsOptional()
  admin?: string;

  @ValidateNested({ each: true })
  @Type(() => CheckInTypeConfigDto)
  allowedCheckInTypes: CheckInTypeConfigDto[];
} 