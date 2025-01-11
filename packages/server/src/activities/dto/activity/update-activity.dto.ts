import { PartialType } from '@nestjs/swagger';
import { CreateActivityDto } from './create-activity.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { DurationUnit } from '../../schemas/activity.schema';

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
}
