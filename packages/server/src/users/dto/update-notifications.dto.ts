import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsString, Matches } from 'class-validator';

export class UpdateNotificationsDto {
  @ApiPropertyOptional({ description: 'Enable email notifications' })
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @ApiPropertyOptional({ description: 'Enable push notifications' })
  @IsOptional()
  @IsBoolean()
  pushNotifications?: boolean;

  @ApiPropertyOptional({ description: 'Enable buddy request notifications' })
  @IsOptional()
  @IsBoolean()
  buddyRequestNotifications?: boolean;

  @ApiPropertyOptional({
    description: 'Enable activity reminder notifications',
  })
  @IsOptional()
  @IsBoolean()
  activityReminderNotifications?: boolean;

  @ApiPropertyOptional({ description: 'Enable milestone notifications' })
  @IsOptional()
  @IsBoolean()
  milestoneNotifications?: boolean;

  @ApiPropertyOptional({ description: 'Enable newsletter notifications' })
  @IsOptional()
  @IsBoolean()
  newsletterNotifications?: boolean;

  @ApiPropertyOptional({ description: 'Enable quiet hours' })
  @IsOptional()
  @IsBoolean()
  quietHours?: boolean;

  @ApiPropertyOptional({
    description: 'Quiet hours start time (HH:MM format)',
    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
  })
  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Quiet hours start must be in HH:MM format',
  })
  quietHoursStart?: string;

  @ApiPropertyOptional({
    description: 'Quiet hours end time (HH:MM format)',
    pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
  })
  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Quiet hours end must be in HH:MM format',
  })
  quietHoursEnd?: string;
}
