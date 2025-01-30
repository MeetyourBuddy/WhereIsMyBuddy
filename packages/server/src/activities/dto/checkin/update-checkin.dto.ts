import { getSchemaPath, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  ValidateNested,
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
    description: 'Content of the check-in',
    required: false,
    oneOf: [
      { $ref: getSchemaPath(PhotoContentDto) },
      { $ref: getSchemaPath(ChecklistContentDto) },
      { $ref: getSchemaPath(HoursContentDto) },
    ],
  })
  @IsOptional()
  @ValidateNested()
  @Type((opts) => {
    switch (opts.object?.type) {
      case CheckInType.PHOTO:
        return PhotoContentDto;
      case CheckInType.CHECKLIST:
        return ChecklistContentDto;
      case CheckInType.HOURS:
        return HoursContentDto;
      default:
        return PhotoContentDto;
    }
  })
  content?: PhotoContentDto | ChecklistContentDto | HoursContentDto;

  @ApiProperty({
    description: 'Date of the check-in',
    type: Date,
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  date?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @ApiProperty({ required: false })
  status?: string;
}
