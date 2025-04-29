import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsArray,
  IsBoolean,
  ValidateNested,
  IsDate,
  Min,
  ArrayMinSize,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ActivityType,
  CheckinFrequencyUnit,
  DayOfWeek,
  CheckInType,
} from '../schemas/activity.schema';
import { InterestCategory } from '../../users/enums/interests.enum';
import { User } from '@/users/schemas/user.schema';

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
  @IsNotEmpty()
  category: InterestCategory;

  @IsEnum(ActivityType)
  type: ActivityType;

  @IsNumber()
  proposedDuration: number;

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

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  checkinDatesOfMonth?: number[];

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
  admin?: User;

  @ValidateNested({ each: true })
  @Type(() => CheckInTypeConfigDto)
  allowedCheckInTypes: CheckInTypeConfigDto[];

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  goals: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categories?: string[];
}
