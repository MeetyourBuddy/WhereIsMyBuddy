import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CheckInService } from './checkin.service';
import { CreateCheckInDto } from './dto/create-checkin.dto';
import {
  CheckInResponseDto,
  CheckInStatsDto,
} from './dto/checkin-response.dto';
import { JwtAuthGuard } from '../users/auth/guards/jwt-auth.guard';
import { GetUser } from '../users/decorators/get-user.decorator';

@Controller('checkins')
@UseGuards(JwtAuthGuard)
export class CheckInController {
  constructor(private readonly checkInService: CheckInService) {}

  @Post()
  async createCheckIn(
    @Body() createCheckInDto: CreateCheckInDto,
    @GetUser('userId') userId: string,
  ): Promise<CheckInResponseDto> {
    return this.checkInService.createCheckIn(createCheckInDto, userId);
  }

  @Get('activity/:activityId')
  async getCheckInsByActivity(
    @Param('activityId') activityId: string,
    @GetUser('userId') userId: string,
  ): Promise<CheckInResponseDto[]> {
    return this.checkInService.getCheckInsByActivity(activityId, userId);
  }

  @Get('user')
  async getCheckInsByUser(
    @GetUser('userId') userId: string,
    @Query('activityId') activityId?: string,
  ): Promise<CheckInResponseDto[]> {
    return this.checkInService.getCheckInsByUser(userId, activityId);
  }

  @Get(':id')
  async getCheckInById(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
  ): Promise<CheckInResponseDto> {
    return this.checkInService.getCheckInById(id, userId);
  }

  @Post(':id/like')
  async toggleLike(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
  ): Promise<CheckInResponseDto> {
    return this.checkInService.toggleLike(id, userId);
  }

  @Delete(':id')
  async deleteCheckIn(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
  ): Promise<{ message: string }> {
    await this.checkInService.deleteCheckIn(id, userId);
    return { message: 'Check-in deleted successfully' };
  }

  @Get('stats/:activityId')
  async getCheckInStats(
    @Param('activityId') activityId: string,
    @GetUser('userId') userId: string,
  ): Promise<CheckInStatsDto> {
    return this.checkInService.getCheckInStats(userId, activityId);
  }

  @Get('activity/:activityId/current-period-status')
  async getCurrentPeriodStatus(
    @Param('activityId') activityId: string,
    @GetUser('userId') userId: string,
  ): Promise<{ hasCheckedIn: boolean }> {
    const hasCheckedIn =
      await this.checkInService.hasUserCheckedInForCurrentPeriod(
        activityId,
        userId,
      );
    return { hasCheckedIn };
  }

  @Get('activity/:activityId/user-progress')
  async getUserProgress(
    @Param('activityId') activityId: string,
    @GetUser('userId') userId: string,
  ): Promise<{
    progress: number;
    completedCheckIns: number;
    totalAvailableCheckIns: number;
  }> {
    return this.checkInService.getUserProgress(activityId, userId);
  }

  @Post('user-progress/batch')
  async getUserProgressForActivities(
    @Body() body: { activityIds: string[] },
    @GetUser('userId') userId: string,
  ) {
    const data = await this.checkInService.getUserProgressForActivities(
      body.activityIds,
      userId,
    );

    return {
      success: true,
      message: 'User progress retrieved successfully',
      data,
      timestamp: new Date().toISOString(),
      path: '/api/checkins/user-progress/batch',
    };
  }
}
