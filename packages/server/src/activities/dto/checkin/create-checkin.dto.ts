import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsEnum,
  ValidateNested,
  IsDate,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { CheckInType } from '../../interfaces/checkin-type.interface';
import {
  PhotoContentDto,
  ChecklistContentDto,
  HoursContentDto,
} from './checkin-content.dto';

export class CreateCheckInDto {
  @ApiProperty({
    description: 'The activity ID this check-in belongs to',
  })
  @IsString()
  activityId: string;

  @ApiProperty({
    description: 'Date of the check-in',
    type: Date,
  })
  @Type(() => Date)
  @IsDate()
  date: Date;

  @ApiProperty({
    enum: CheckInType,
    description: 'Type of check-in',
  })
  @IsEnum(CheckInType)
  type: CheckInType;

  @ApiProperty({
    description: 'Content of the check-in',
    oneOf: [
      { $ref: getSchemaPath(PhotoContentDto) },
      { $ref: getSchemaPath(ChecklistContentDto) },
      { $ref: getSchemaPath(HoursContentDto) },
    ],
  })
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
  content: PhotoContentDto | ChecklistContentDto | HoursContentDto;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @ApiProperty({ required: false })
  status?: string;
}
