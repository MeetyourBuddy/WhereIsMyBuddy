import { getSchemaPath, ApiProperty, ApiBody } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  ValidateNested,
  IsDate,
  IsString,
  MaxLength,
} from 'class-validator';
import { CheckInType } from '../../interfaces/checkin-type.interface';
import {
  PhotoContentDto,
  ChecklistContentDto,
  HoursContentDto,
} from './checkin-content.dto';

export class UpdateCheckInDto {
  @ApiProperty({
    enum: CheckInType,
    description: 'Type of check-in',
    required: false,
  })
  @IsOptional()
  @IsEnum(CheckInType)
  type?: CheckInType;

  @ApiProperty({
    description: 'Updated content of the check-in',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  content?: any;

  @ApiProperty({
    description: 'Updated date of the check-in',
    type: Date,
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @ApiProperty({ required: false })
  status?: string;
}
