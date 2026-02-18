import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsArray,
  ValidateIf,
  MaxLength,
} from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ description: 'User name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'User bio/description', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Bio cannot exceed 500 characters' })
  bio?: string;

  @ApiPropertyOptional({ description: 'User phone number' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ description: 'User avatar URL or data URL' })
  @IsOptional()
  @ValidateIf((o, value) => value !== '' && value != null)
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({ description: 'User country' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'User city' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'User interests categories',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interestsCategories?: string[];

  @ApiPropertyOptional({
    description: 'User interests commodities',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interestsCommodities?: string[];
}
