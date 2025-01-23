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
import { isValidCheckInType } from './validators/checkin.validators';
import { UpdateCheckInDto } from './dto/checkin/update-checkin.dto';
import {
  IStatsQueryParams,
  IActivityStats,
} from './interfaces/activity-stats.interface';
import { UpdateParticipantRoleDto } from './dto/activity/update-participant.dto';
import { ActivityRole } from './schemas/activity.schema';

@ApiTags('Activities')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post('create')
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

    // Check if user is an admin of the activity
    const isAdmin = activity.data.participants.some(
      (p) => p.user.id === req.user.id && p.role === ActivityRole.ADMIN,
    );

    if (!isAdmin) {
      throw new ForbiddenException('Only admins can update this activity');
    }

    // If activity is being ended, add endedAt date
    if (updateActivityDto.isActive === false) {
      updateActivityDto.endedAt = new Date();
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
    // Validate check-in type
    if (!isValidCheckInType(createCheckInDto.type)) {
      throw new BadRequestException('Invalid check-in type');
    }

    // Validate that user is a participant
    const activity = await this.activitiesService.findOne(activityId);
    const isParticipant = activity.data.participants.some(
      (p) => p.user.id === req.user.id,
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
  ): Promise<ActivityServiceResponse<CheckInResponseDto[]>> {
    // Validate that user has access to the activity
    const activity = await this.activitiesService.findOne(activityId);
    const isParticipantOrAdmin =
      activity.data.participants.some((p) => p.user.id === req.user.id) ||
      activity.data.admin.id === req.user.id;

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
      checkIn.data.user.id !== req.user.id &&
      checkIn.data.activity.admin.id !== req.user.id
    ) {
      throw new ForbiddenException('You do not have access to this check-in');
    }

    return checkIn;
  }

  @Put('checkins/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateCheckIn(
    @Request() req,
    @Param('id') checkInId: string,
    @Body() updateCheckInDto: UpdateCheckInDto,
  ): Promise<ActivityServiceResponse<CheckInResponseDto>> {
    return this.activitiesService.updateCheckIn(
      req.user.userId,
      checkInId,
      updateCheckInDto,
    );
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
      activity.data.participants.some((p) => p.user.id === req.user.id) ||
      activity.data.admin.id === req.user.id;

    if (!isParticipantOrAdmin) {
      throw new ForbiddenException(
        'You do not have access to these statistics',
      );
    }

    return this.activitiesService.getActivityStats(activityId, query);
  }

  @Put(':id/participants/:userId/role')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateParticipantRole(
    @Request() req,
    @Param('id') activityId: string,
    @Param('userId') userId: string,
    @Body() updateRoleDto: UpdateParticipantRoleDto,
  ): Promise<ActivityServiceResponse<ActivityResponseDto>> {
    const activity = await this.activitiesService.findOne(activityId);
    const isAdmin = activity.data.participants.some(
      (p) => p.user.id === req.user.id && p.role === ActivityRole.ADMIN,
    );

    if (!isAdmin) {
      throw new ForbiddenException('Only admins can update participant roles');
    }

    return this.activitiesService.updateParticipantRole(
      activityId,
      updateRoleDto,
    );
  }

  @Put(':id/end')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async endActivity(
    @Request() req,
    @Param('id') activityId: string,
  ): Promise<ActivityServiceResponse<ActivityResponseDto>> {
    const activity = await this.activitiesService.findOne(activityId);
    const isAdmin = activity.data.participants.some(
      (p) => p.user.id === req.user.id && p.role === ActivityRole.ADMIN,
    );

    if (!isAdmin) {
      throw new ForbiddenException('Only admins can end the activity');
    }

    return this.activitiesService.endActivity(activityId);
  }

  @Get(':activityId/calendar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get activity check-ins in calendar format' })
  @ApiResponse({
    status: 200,
    description: 'Returns check-ins grouped by date with activity schedule info',
  })
  async getActivityCalendar(
    @Request() req,
    @Param('activityId') activityId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<ActivityServiceResponse<any>> {
    // Validate that user has access to the activity
    const activity = await this.activitiesService.findOne(activityId);
    const isParticipantOrAdmin =
      activity.data.participants.some((p) => p.user.id === req.user.id) ||
      activity.data.admin.id === req.user.id;

    if (!isParticipantOrAdmin) {
      throw new ForbiddenException('You do not have access to this activity');
    }

    return this.activitiesService.getActivityCalendar(activityId, startDate, endDate);
  }
}
