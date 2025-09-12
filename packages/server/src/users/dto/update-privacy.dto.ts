import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsEnum } from 'class-validator';

export class UpdatePrivacyDto {
  @ApiPropertyOptional({ description: 'Make profile public' })
  @IsOptional()
  @IsBoolean()
  publicProfile?: boolean;

  @ApiPropertyOptional({ description: 'Show activity to others' })
  @IsOptional()
  @IsBoolean()
  showActivity?: boolean;

  @ApiPropertyOptional({ description: 'Show location to others' })
  @IsOptional()
  @IsBoolean()
  showLocation?: boolean;

  @ApiPropertyOptional({ description: 'Show interests to others' })
  @IsOptional()
  @IsBoolean()
  showInterests?: boolean;

  @ApiPropertyOptional({
    description: 'Profile visibility level',
    enum: ['public', 'friends', 'private'],
  })
  @IsOptional()
  @IsEnum(['public', 'friends', 'private'])
  profileVisibility?: string;

  @ApiPropertyOptional({
    description: 'Location sharing level',
    enum: ['country', 'city', 'none'],
  })
  @IsOptional()
  @IsEnum(['country', 'city', 'none'])
  locationSharing?: string;
}
