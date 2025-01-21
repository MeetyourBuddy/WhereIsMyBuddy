import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateCheckInDto } from './create-checkin.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDate, IsString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCheckInDto extends PartialType(
  OmitType(CreateCheckInDto, ['type']),
) {
  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;
}
