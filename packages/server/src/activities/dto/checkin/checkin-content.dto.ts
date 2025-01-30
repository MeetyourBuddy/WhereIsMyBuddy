import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  ValidateNested,
  Min,
} from 'class-validator';

export class PhotoContentDto {
  @ApiProperty({
    description: 'URL of the uploaded image',
    example: 'https://storage.example.com/photos/abc123.jpg',
  })
  @IsString()
  imageUrl: string;

  @ApiPropertyOptional({
    description: 'Optional caption for the photo',
    example: "Completed today's workout routine",
  })
  @IsOptional()
  @IsString()
  caption?: string;
}

export class ChecklistItemDto {
  @ApiProperty({
    description: 'Text description of the checklist item',
    example: 'Complete daily exercises',
  })
  @IsString()
  text: string;

  @ApiProperty({
    description: 'Whether this item was completed',
    example: true,
  })
  @IsBoolean()
  completed: boolean;

  @ApiProperty({
    description: 'Whether this item was required',
    example: true,
  })
  @IsBoolean()
  required: boolean;
}

export class ChecklistContentDto {
  @ApiProperty({
    description: 'List of completed checklist items',
    type: [ChecklistItemDto],
  })
  @ValidateNested({ each: true })
  @Type(() => ChecklistItemDto)
  items: ChecklistItemDto[];
}

export class HoursContentDto {
  @ApiProperty({
    description: 'Number of hours completed',
    example: 2.5,
  })
  @IsNumber()
  @Min(0)
  hours: number;

  @ApiPropertyOptional({
    description: 'Optional notes about the hours logged',
    example: 'Studied Spanish vocabulary and grammar',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
