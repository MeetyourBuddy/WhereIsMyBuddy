import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
  ValidateNested,
  IsNotEmpty,
  IsDate,
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
  @ApiProperty({ enum: CheckInType })
  @IsEnum(CheckInType)
  type: CheckInType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ type: Date })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  date: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  comment?: string;

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
