import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { BadgeService } from './badge.service';
import {
  CreateBadgeDto,
  BadgeResponseDto,
  UserBadgeResponseDto,
} from './dto/badge.dto';
import { JwtAuthGuard } from '../users/auth/guards/jwt-auth.guard';
import { GetUser } from '../users/decorators/get-user.decorator';

@Controller('badges')
@UseGuards(JwtAuthGuard)
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  @Post()
  async createBadge(
    @Body() createBadgeDto: CreateBadgeDto,
  ): Promise<BadgeResponseDto> {
    return this.badgeService.createBadge(createBadgeDto);
  }

  @Get()
  async getAllBadges(): Promise<BadgeResponseDto[]> {
    return this.badgeService.getAllBadges();
  }

  @Get('user')
  async getUserBadges(
    @GetUser('userId') userId: string,
    @Query('activityId') activityId?: string,
  ): Promise<UserBadgeResponseDto[]> {
    return this.badgeService.getUserBadges(userId, activityId);
  }

  @Post('seed')
  async seedDefaultBadges(): Promise<{ message: string }> {
    await this.badgeService.seedDefaultBadges();
    return { message: 'Default badges seeded successfully' };
  }
}
