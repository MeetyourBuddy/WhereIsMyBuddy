import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsArray,
  IsOptional,
  IsString,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CheckInType } from '../../schemas/checkin.schema';

export class PhotoDto {
  @ApiProperty()
  @IsString()
  imageUrl: string;

  @ApiProperty()
  @IsString()
  guidelines: string;
}

export class ChecklistItemDto {
  @ApiProperty()
  @IsString()
  item: string;

  @ApiProperty()
  @IsOptional()
  completed?: boolean;
}

export class HoursDto {
  @ApiProperty()
  @IsNumber()
  hours: number;

  @ApiProperty()
  @IsNumber()
  min: number;

  @ApiProperty()
  @IsNumber()
  max: number;
}

export class OtherDto {
  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  value: string;
}

export class CreateCheckInDto {
  @ApiProperty({ enum: CheckInType, isArray: true })
  @IsArray()
  @IsEnum(CheckInType, { each: true })
  types: CheckInType[];

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => PhotoDto)
  photo?: PhotoDto;

  @ApiPropertyOptional({ type: [ChecklistItemDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ChecklistItemDto)
  checklist?: ChecklistItemDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => HoursDto)
  hours?: HoursDto;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => OtherDto)
  other?: OtherDto;
}
