import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsBoolean,
  IsNumber,
  IsEnum,
  Min,
  Max,
} from 'class-validator';

export class UpdateAccountDto {
  @ApiPropertyOptional({ description: 'Enable two-factor authentication' })
  @IsOptional()
  @IsBoolean()
  twoFactorAuth?: boolean;

  @ApiPropertyOptional({ description: 'Enable login notifications' })
  @IsOptional()
  @IsBoolean()
  loginNotifications?: boolean;

  @ApiPropertyOptional({
    description: 'Session timeout in minutes',
    minimum: 5,
    maximum: 1440,
  })
  @IsOptional()
  @IsNumber()
  @Min(5)
  @Max(1440)
  sessionTimeout?: number;

  @ApiPropertyOptional({
    description: 'Data retention period',
    enum: ['30days', '90days', '1year', 'indefinite'],
  })
  @IsOptional()
  @IsEnum(['30days', '90days', '1year', 'indefinite'])
  dataRetention?: string;
}
