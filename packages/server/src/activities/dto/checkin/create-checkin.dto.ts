import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  ValidateNested,
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
  IsOptional,
  IsObject,
} from 'class-validator';
import { CheckInType } from '../../interfaces/checkin-type.interface';

// Define specific content DTOs
class PhotoContentDto {
  @ApiProperty({
    description: 'URL of the uploaded photo',
    example: 'https://example.com/photo.jpg',
  })
  @IsString()
  imageUrl: string;

  @ApiProperty({
    description: 'Optional caption for the photo',
    required: false,
    example: 'My progress photo',
  })
  @IsOptional()
  @IsString()
  caption?: string;
}

class ChecklistItemDto {
  @ApiProperty({
    description: 'Text description of the item',
    example: 'Complete daily exercise',
  })
  @IsString()
  text: string;

  @ApiProperty({
    description: 'Whether the item is completed',
    example: true,
  })
  @IsBoolean()
  completed: boolean;
}

class ChecklistContentDto {
  @ApiProperty({
    type: [ChecklistItemDto],
    description: 'List of checklist items',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChecklistItemDto)
  items: ChecklistItemDto[];
}

class HoursContentDto {
  @ApiProperty({
    description: 'Number of hours completed',
    example: 2.5,
  })
  @IsNumber()
  hours: number;

  @ApiProperty({
    description: 'Optional notes about the hours',
    required: false,
    example: 'Studied Spanish',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateCheckInDto {
  @ApiProperty({
    enum: CheckInType,
    description: 'Type of check-in',
    example: CheckInType.PHOTO,
  })
  @IsEnum(CheckInType)
  type: CheckInType;

  @ApiProperty({
    description: 'Content of the check-in based on type',
    oneOf: [
      { $ref: '#/components/schemas/PhotoContentDto' },
      { $ref: '#/components/schemas/ChecklistContentDto' },
      { $ref: '#/components/schemas/HoursContentDto' },
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

  @ApiProperty({
    description: 'Photo check-in content if required',
    required: false,
    type: PhotoContentDto,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PhotoContentDto)
  photo?: PhotoContentDto;

  @ApiProperty({
    description: 'Checklist check-in content if required',
    required: false,
    type: ChecklistContentDto,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ChecklistContentDto)
  checklist?: ChecklistContentDto;

  @ApiProperty({
    description: 'Hours check-in content if required',
    required: false,
    type: HoursContentDto,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => HoursContentDto)
  hours?: HoursContentDto;
}
