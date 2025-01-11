import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  Request,
  ForbiddenException,
  BadRequestException,
  Query,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../users/auth/guards/jwt-auth.guard';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/activity/create-activity.dto';
import { UpdateActivityDto } from './dto/activity/update-activity.dto';
import { ActivityResponseDto } from './dto/activity/activity-response.dto';
import { CreateCheckInDto } from './dto/checkin/create-checkin.dto';
import { CheckInResponseDto } from './dto/checkin/checkin-response.dto';
import { ActivityServiceResponse } from './interfaces/common.interface';
import { ICheckInQueryParams } from './interfaces/checkin.interface';
import { isValidCheckInType } from './validators/checkin.validators';
import { UpdateCheckInDto } from './dto/checkin/update-checkin.dto';
import {
  IStatsQueryParams,
  IActivityStats,
} from './interfaces/activity-stats.interface';

@ApiTags('Activities')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new activity' })
  @ApiResponse({
    status: 201,
    description: 'Activity created successfully',
    type: ActivityResponseDto,
  })
  async createActivity(
    @Request() req,
    @Body() createActivityDto: CreateActivityDto,
  ): Promise<ActivityServiceResponse<ActivityResponseDto>> {
    return this.activitiesService.create(req.user.id, createActivityDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get activity by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the activity',
    type: ActivityResponseDto,
  })
  async getActivity(
    @Param('id') id: string,
  ): Promise<ActivityServiceResponse<ActivityResponseDto>> {
    return this.activitiesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update activity by ID' })
  @ApiResponse({
    status: 200,
    description: 'Activity updated successfully',
    type: ActivityResponseDto,
  })
  async updateActivity(
    @Request() req,
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateActivityDto,
  ): Promise<ActivityServiceResponse<ActivityResponseDto>> {
    const activity = await this.activitiesService.findOne(id);

    if (activity.data.admin.id.toString() !== req.user.id) {
      throw new ForbiddenException(
        'You are not authorized to update this activity',
      );
    }

    return this.activitiesService.update(id, updateActivityDto);
  }

  @Post(':activityId/checkins')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a check-in for an activity' })
  @ApiResponse({
    status: 201,
    description: 'Check-in created successfully',
    type: CheckInResponseDto,
  })
  async createCheckIn(
    @Request() req,
    @Param('activityId') activityId: string,
    @Body() createCheckInDto: CreateCheckInDto,
  ): Promise<ActivityServiceResponse<CheckInResponseDto>> {
    // Validate check-in types
    if (!createCheckInDto.types.every((type) => isValidCheckInType(type))) {
      throw new BadRequestException('Invalid check-in type');
    }

    // Validate that user is a participant
    const activity = await this.activitiesService.findOne(activityId);
    const isParticipant = activity.data.participants.some(
      (p) => p.id.toString() === req.user.id,
    );

    if (!isParticipant) {
      throw new ForbiddenException('You must be a participant to check in');
    }

    return this.activitiesService.createCheckIn(
      req.user.id,
      activityId,
      createCheckInDto,
    );
  }

  @Get(':activityId/checkins')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all check-ins for an activity' })
  @ApiResponse({
    status: 200,
    description: 'Returns all check-ins for the activity',
    type: [CheckInResponseDto],
  })
  async getActivityCheckIns(
    @Request() req,
    @Param('activityId') activityId: string,
    @Query() query: ICheckInQueryParams,
  ): Promise<ActivityServiceResponse<CheckInResponseDto[]>> {
    // Validate that user has access to the activity
    const activity = await this.activitiesService.findOne(activityId);
    const isParticipantOrAdmin =
      activity.data.participants.some((p) => p.id.toString() === req.user.id) ||
      activity.data.admin.id.toString() === req.user.id;

    if (!isParticipantOrAdmin) {
      throw new ForbiddenException('You do not have access to these check-ins');
    }

    return this.activitiesService.getActivityCheckIns(activityId);
  }

  @Get(':activityId/checkins/:checkInId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific check-in' })
  @ApiResponse({
    status: 200,
    description: 'Returns the specified check-in',
    type: CheckInResponseDto,
  })
  async getCheckIn(
    @Request() req,
    @Param('activityId') activityId: string,
    @Param('checkInId') checkInId: string,
  ): Promise<ActivityServiceResponse<CheckInResponseDto>> {
    const checkIn = await this.activitiesService.getCheckIn(checkInId);

    // Validate user has access to the check-in
    if (
      checkIn.data.user.id.toString() !== req.user.id &&
      checkIn.data.activity.admin.id.toString() !== req.user.id
    ) {
      throw new ForbiddenException('You do not have access to this check-in');
    }

    return checkIn;
  }

  @Put(':activityId/checkins/:checkInId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a check-in' })
  @ApiResponse({
    status: 200,
    description: 'Check-in updated successfully',
    type: CheckInResponseDto,
  })
  async updateCheckIn(
    @Request() req,
    @Param('activityId') activityId: string,
    @Param('checkInId') checkInId: string,
    @Body() updateCheckInDto: UpdateCheckInDto,
  ): Promise<ActivityServiceResponse<CheckInResponseDto>> {
    const checkIn = await this.activitiesService.getCheckIn(checkInId);

    // Only the check-in creator can update it
    if (checkIn.data.user.id.toString() !== req.user.id) {
      throw new ForbiddenException('You can only update your own check-ins');
    }

    return this.activitiesService.updateCheckIn(checkInId, updateCheckInDto);
  }

  @Delete(':activityId/checkins/:checkInId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a check-in' })
  @ApiResponse({
    status: 200,
    description: 'Check-in deleted successfully',
  })
  async deleteCheckIn(
    @Request() req,
    @Param('activityId') activityId: string,
    @Param('checkInId') checkInId: string,
  ): Promise<ActivityServiceResponse<void>> {
    const checkIn = await this.activitiesService.getCheckIn(checkInId);

    // Only the check-in creator or activity admin can delete it
    if (
      checkIn.data.user.id.toString() !== req.user.id &&
      checkIn.data.activity.admin.id.toString() !== req.user.id
    ) {
      throw new ForbiddenException('You cannot delete this check-in');
    }

    return this.activitiesService.deleteCheckIn(checkInId);
  }

  @Get(':activityId/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get activity statistics' })
  @ApiResponse({
    status: 200,
    description: 'Activity statistics retrieved successfully',
    type: ActivityResponseDto,
  })
  async getActivityStats(
    @Request() req,
    @Param('activityId') activityId: string,
    @Query() query: IStatsQueryParams,
  ): Promise<ActivityServiceResponse<IActivityStats>> {
    const activity = await this.activitiesService.findOne(activityId);

    const isParticipantOrAdmin =
      activity.data.participants.some((p) => p.id.toString() === req.user.id) ||
      activity.data.admin.id.toString() === req.user.id;

    if (!isParticipantOrAdmin) {
      throw new ForbiddenException(
        'You do not have access to these statistics',
      );
    }

    return this.activitiesService.getActivityStats(activityId, query);
  }
}
