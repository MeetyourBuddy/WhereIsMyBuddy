import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, IsEnum, IsBoolean, IsArray } from 'class-validator';
import { Language } from '../enums/language.enum';
import { Country } from '../enums/location.enum';
import { InterestCategory } from '../enums/interests.enum';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  profilePicture?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(Language)
  preferredLanguage?: Language;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(Country)
  country?: Country;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsEnum(InterestCategory, { each: true })
  interestsCategories?: InterestCategory[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interestsCommodities?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(['open', 'occupied', 'undecided'])
  collaborationStatus?: 'open' | 'occupied' | 'undecided';

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  linkedInUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  twitterUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  instagramUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
