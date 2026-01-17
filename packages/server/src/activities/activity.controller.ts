import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { JwtAuthGuard } from '../users/auth/guards/jwt-auth.guard';
import { Activity } from './schemas/activity.schema';
import { GetUser } from '@/users/decorators/get-user.decorator';
import { GetOptionalUser } from '@/users/decorators/get-optional-user.decorator';
import { ActivityResponseDto } from './dto/activity-response.dto';

@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createActivityDto: CreateActivityDto,
    @GetUser('userId') userId: string,
  ): Promise<ActivityResponseDto> {
    return await this.activityService.create(createActivityDto, userId);
  }

  @Get()
  async findAll(
    @GetOptionalUser('userId') userId?: string,
  ): Promise<Activity[]> {
    return await this.activityService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @GetOptionalUser('userId') userId?: string,
  ): Promise<ActivityResponseDto> {
    return await this.activityService.findOne(id, userId);
  }

  @Get(':id/statistics')
  @UseGuards(JwtAuthGuard)
  async getActivityStatistics(@Param('id') id: string): Promise<{
    longestStreak: number;
    highestCheckIns: number;
    averageProgress: number;
    totalParticipants: number;
    totalCheckIns: number;
  }> {
    return await this.activityService.getActivityStatistics(id);
  }

  @Get(':id/leaderboard')
  @UseGuards(JwtAuthGuard)
  async getActivityLeaderboard(@Param('id') id: string): Promise<{
    participants: Array<{
      id: string;
      name: string;
      email: string;
      avatar?: string;
      checkIns: number;
      streak: number;
      points: number;
      role: string;
      joinDate: Date;
      lastCheckIn?: Date;
    }>;
  }> {
    return await this.activityService.getActivityLeaderboard(id);
  }

  @Get(':id/weekly-activity')
  @UseGuards(JwtAuthGuard)
  async getWeeklyActivity(@Param('id') id: string): Promise<{
    weeklyData: Array<{
      name: string;
      checkins: number;
      date: string;
    }>;
  }> {
    return await this.activityService.getWeeklyActivity(id);
  }

  @Get(':id/participant-history')
  @UseGuards(JwtAuthGuard)
  async getParticipantHistory(@Param('id') id: string): Promise<{
    participants: Array<{
      id: string;
      name: string;
      avatar?: string;
      checkIns: number;
      streak: number;
      last7Days: Array<{
        date: string;
        checkedIn: boolean;
      }>;
    }>;
  }> {
    return await this.activityService.getParticipantHistory(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateActivityDto,
    @GetUser('userId') userId: string,
  ): Promise<Activity> {
    console.log('updateActivityDto in controller', updateActivityDto);
    return await this.activityService.update(id, updateActivityDto, userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
  ): Promise<void> {
    await this.activityService.delete(id, userId);
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  async joinActivity(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
  ): Promise<ActivityResponseDto> {
    return await this.activityService.joinActivity(id, userId);
  }

  @Post(':id/quit')
  @UseGuards(JwtAuthGuard)
  async quitActivity(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
  ): Promise<ActivityResponseDto> {
    return await this.activityService.quitActivity(id, userId);
  }
}
