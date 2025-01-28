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
  ApiBody,
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
import { HandleJoinRequestDto } from './dto/activity/join-request.dto';

@ApiTags('Activities')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Create a new activity',
    description: 'Create a new activity with optional custom rules. Default rules will be automatically added.'
  })
  @ApiResponse({
    status: 201,
    description: 'Activity created successfully',
    type: ActivityResponseDto,
  })
  @ApiBody({
    type: CreateActivityDto,
    examples: {
      'Basic Activity': {
        value: {
          title: 'Learn English Together',
          description: 'Weekly English learning sessions for beginners',
          proposedDuration: 30,
          durationUnit: 'days',
          maxSize: 10,
          type: 'public',
          checkinFrequency: 1,
          checkinFrequencyUnit: 'weekly',
          rules: ['Complete homework before sessions', 'Practice speaking daily']
        }
      }
    }
  })
  async createActivity(
    @Request() req,
    @Body() createActivityDto: CreateActivityDto,
  ): Promise<ActivityServiceResponse<ActivityResponseDto>> {
    // Add debug logging
    console.log('Create Activity Request:', {
      userId: req.user.userId,
      createActivityDto
    });

    return this.activitiesService.create(req.user.userId, createActivityDto);
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

  @Put(':id/update')
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
    // Add debug logging
    console.log('Update Activity Request:', {
      userId: req.user.userId,
      activityId: id
    });

    return this.activitiesService.update(id, req.user.userId, updateActivityDto);
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
    return this.activitiesService.createCheckIn(
      req.user.userId,
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
    return this.activitiesService.getActivityCheckIns(activityId, req.user.userId);
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
    return this.activitiesService.getCheckIn(checkInId);
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
    return this.activitiesService.getActivityStats(activityId, query);
  }

  @Put(':id/participants/role')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update participant role (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated participant role',
    type: ActivityResponseDto,
  })
  async updateParticipantRole(
    @Request() req,
    @Param('id') activityId: string,
    @Body() updateRoleDto: UpdateParticipantRoleDto,
  ): Promise<ActivityServiceResponse<ActivityResponseDto>> {
    return this.activitiesService.updateParticipantRole(
      activityId,
      req.user.userId,
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
    return this.activitiesService.endActivity(activityId);
  }

  @Get(':activityId/calendar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get activity check-ins in calendar format' })
  @ApiResponse({
    status: 200,
    description:
      'Returns check-ins grouped by date with activity schedule info',
  })
  async getActivityCalendar(
    @Request() req,
    @Param('activityId') activityId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<ActivityServiceResponse<any>> {
    return this.activitiesService.getActivityCalendar(
      activityId,
      startDate,
      endDate,
    );
  }

  @Post(':id/leave')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Leave an activity' })
  @ApiResponse({
    status: 200,
    description: 'Successfully left the activity',
    type: ActivityResponseDto,
  })
  async leaveActivity(
    @Request() req,
    @Param('id') activityId: string,
  ): Promise<ActivityServiceResponse<ActivityResponseDto>> {
    return this.activitiesService.leaveActivity(activityId, req.user.userId);
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Join or request to join an activity' })
  @ApiResponse({
    status: 200,
    description: 'Successfully joined or requested to join the activity',
    type: ActivityResponseDto,
  })
  async joinActivity(
    @Request() req,
    @Param('id') activityId: string,
  ): Promise<ActivityServiceResponse<ActivityResponseDto>> {
    return this.activitiesService.joinActivity(activityId, req.user.userId);
  }

  @Post(':id/requests')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Handle join request (admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Successfully handled join request',
    type: ActivityResponseDto,
  })
  async handleJoinRequest(
    @Request() req,
    @Param('id') activityId: string,
    @Body() handleJoinRequestDto: HandleJoinRequestDto,
  ): Promise<ActivityServiceResponse<ActivityResponseDto>> {
    return this.activitiesService.handleJoinRequest(
      activityId,
      req.user.userId,
      handleJoinRequestDto,
    );
  }
}
