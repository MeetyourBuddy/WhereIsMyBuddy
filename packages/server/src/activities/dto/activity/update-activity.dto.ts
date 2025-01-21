import { PartialType } from '@nestjs/swagger';
import { CreateActivityDto } from './create-activity.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
  IsBoolean,
  IsArray,
  IsMongoId,
  IsDate,
  IsNumber,
  Min,
  Max,
  ValidateIf,
} from 'class-validator';
import {
  DurationUnit,
  CheckinFrequencyUnit,
  DayOfWeek,
} from '../../schemas/activity.schema';
import { Type } from 'class-transformer';

export class UpdateActivityDto extends PartialType(CreateActivityDto) {
  @ApiPropertyOptional()
  @IsOptional()
  proposedDuration?: number;

  @ApiPropertyOptional({ enum: DurationUnit })
  @IsOptional()
  @IsEnum(DurationUnit)
  durationUnit?: DurationUnit;

  @ApiPropertyOptional()
  @IsOptional()
  proposedDurationInDays?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endedAt?: Date;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  participants?: string[];

  @ApiPropertyOptional({ minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  checkinFrequency?: number;

  @ApiPropertyOptional({ enum: CheckinFrequencyUnit })
  @IsOptional()
  @IsEnum(CheckinFrequencyUnit)
  checkinFrequencyUnit?: CheckinFrequencyUnit;

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
