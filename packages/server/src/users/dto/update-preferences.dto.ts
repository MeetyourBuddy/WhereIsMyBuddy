import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class UpdatePreferencesDto {
  @ApiPropertyOptional({
    description: 'Dashboard layout preference',
    enum: ['detailed', 'compact'],
  })
  @IsOptional()
  @IsEnum(['detailed', 'compact'])
  dashboardLayout?: string;

  @ApiPropertyOptional({
    description: 'Activity display preference',
    enum: ['cards', 'list'],
  })
  @IsOptional()
  @IsEnum(['cards', 'list'])
  activityDisplay?: string;

  @ApiPropertyOptional({
    description: 'Buddy connection radius in miles',
    minimum: 5,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(5)
  @Max(100)
  buddyRadius?: number;

  @ApiPropertyOptional({ description: 'Auto-accept buddy requests' })
  @IsOptional()
  @IsBoolean()
  autoAcceptBuddies?: boolean;
}
