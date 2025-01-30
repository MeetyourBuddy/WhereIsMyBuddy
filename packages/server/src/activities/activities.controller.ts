import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiProperty,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../users/auth/guards/jwt-auth.guard';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/activity/create-activity.dto';
import { UpdateActivityDto } from './dto/activity/update-activity.dto';
import { ActivityResponseDto } from './dto/activity/activity-response.dto';
import { CreateCheckInDto } from './dto/checkin/create-checkin.dto';
import { UpdateCheckInDto } from './dto/checkin/update-checkin.dto';
import { CheckInResponseDto } from './dto/checkin/checkin-response.dto';
import { ActivityServiceResponse } from './interfaces/common.interface';
import { UpdateParticipantRoleDto } from './dto/activity/update-participant.dto';
import { HandleJoinRequestDto } from './dto/activity/join-request.dto';
import { ParticipantDto } from './dto/activity/participant.dto';
import { CheckInType } from './interfaces/checkin-type.interface';
import {
  PhotoContent,
  ChecklistContent,
  HoursContent,
} from './interfaces/checkin-content.interface';
import {
  IActivityStats,
  IStatsQueryParams,
} from './interfaces/activity-stats.interface';
import { ActivityStatsDto } from './dto/activity/activity-stats.dto';
import { ActivityCalendarResponseDto } from './dto/activity/activity-calendar-response.dto';
import { ActivityCalendarResponse } from './interfaces/activity-calendar.interface';
import { IsDateString, IsOptional } from 'class-validator';
import { JoinRequestResponseDto } from './dto/activity/join-request-response.dto';

export class GetCheckInsQueryDto {
  @IsOptional()
  @IsDateString()
  @ApiProperty({ required: false })
  startDate?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ required: false })
  endDate?: string;
}

@ApiTags('Activities')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new activity',
    description:
      'Create a new activity with optional custom rules. Default rules will be automatically added.',
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
        summary: 'Minimum required fields plus common optional fields',
        value: {
          title: 'Learn English Together',
          description: 'Weekly English learning sessions for beginners',
          proposedDuration: 30,
          durationUnit: 'days',
          maxSize: 10,
          type: 'public',
          checkinFrequency: 2,
          checkinFrequencyUnit: 'weekly',
          allowedCheckInTypes: [
            {
              type: 'photo',
              validation: {
                guidelines: 'Take a clear photo of your completed workbook page',
                requiredElements: ['timestamp', 'workbook page number']
              }
            },
            {
              type: 'checklist',
              validation: {
                items: [
                  {
                    text: 'Complete vocabulary exercises',
                    required: true
                  },
                  {
                    text: 'Watch English video content',
                    required: false
                  }
                ]
              }
            },
            {
              type: 'hours',
              validation: {
                description: 'Log your English study hours',
                minHours: 1
              }
            }
          ],
          startDate: '2025-01-28T05:42:33.570Z',
          joinType: 'flexible',
          checkinDays: ['monday', 'wednesday'],
          rules: [
            'Complete homework before sessions',
            'Practice speaking daily'
          ],
          tags: ['language', 'english', 'learning']
        },
      },
      'Monthly Activity with Multiple Check-ins': {
        summary: 'Example with multiple monthly check-in dates',
        value: {
          title: 'Monthly Book Club',
          description: 'Read and discuss multiple books per month',
          proposedDuration: 6,
          durationUnit: 'months',
          maxSize: 15,
          type: 'public',
          checkinFrequency: 1,
          checkinFrequencyUnit: 'monthly',
          allowedCheckInTypes: [
            {
              type: 'checklist',
              validation: {
                items: [
                  {
                    text: 'Finished reading assigned chapters',
                    required: true
                  },
                  {
                    text: 'Made chapter notes',
                    required: true
                  },
                  {
                    text: 'Wrote chapter summary',
                    required: false
                  }
                ]
              }
            },
            {
              type: 'hours',
              validation: {
                description: 'Time spent reading the book',
                minHours: 2,
                maxHours: 10
              }
            }
          ],
          checkinDatesOfMonth: [1, 15],
          checkinDaysOfWeek: ['saturday'],
          checkinWeeksOfMonth: [2, 4],
          tags: ['reading', 'books', 'discussion']
        },
      },
      'Activity with Detailed Check-in Types': {
        summary:
          'Example with various check-in types and their validation rules',
        value: {
          title: 'Learn Spanish',
          description: 'Weekly Spanish learning sessions',
          // ... other basic fields ...
          allowedCheckInTypes: [
            {
              type: 'photo',
              validation: {
                guidelines: 'Take a photo of your completed workbook page',
                requiredElements: ['timestamp', 'workbook page number'],
              },
            },
            {
              type: 'checklist',
              validation: {
                items: [
                  {
                    text: 'Complete vocabulary exercises',
                    required: true,
                  },
                  {
                    text: 'Watch Spanish video content',
                    required: false,
                  },
                  {
                    text: 'Practice with language partner',
                    required: true,
                  },
                ],
              },
            },
            {
              type: 'hours',
              validation: {
                description: 'Enter the number of hours spent studying Spanish',
              },
            },
          ],
        },
      },
    },
  })
  async createActivity(
    @Request() req,
    @Body() createActivityDto: CreateActivityDto,
  ): Promise<ActivityServiceResponse<ActivityResponseDto>> {
    // Add debug logging
    console.log('Create Activity Request:', {
      userId: req.user.userId,
      createActivityDto,
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
      activityId: id,
    });

    return this.activitiesService.update(
      id,
      req.user.userId,
      updateActivityDto,
    );
  }

  @Post(':id/checkin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a check-in for an activity' })
  @ApiResponse({
    status: 201,
    description: 'Check-in created successfully',
    type: CheckInResponseDto,
  })
  @ApiBody({
    type: CreateCheckInDto,
    examples: {
      'Photo Check-in': {
        value: {
          type: CheckInType.PHOTO,
          content: {
            imageUrl: 'https://example.com/photo.jpg',
            caption: 'My progress photo',
          } as PhotoContent,
          date: new Date().toISOString(),
        },
      },
      'Checklist Check-in': {
        value: {
          type: CheckInType.CHECKLIST,
          content: {
            items: [
              { text: 'Task 1', completed: true },
              { text: 'Task 2', completed: false },
            ],
          } as ChecklistContent,
          date: new Date().toISOString(),
        },
      },
      'Hours Check-in': {
        value: {
          type: CheckInType.HOURS,
          content: {
            hours: 2.5,
            notes: 'Studied Spanish',
          } as HoursContent,
          date: new Date().toISOString(),
        },
      },
    },
  })
  async createCheckIn(
    @Request() req,
    @Param('id') activityId: string,
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
  @ApiOperation({ summary: 'Get check-ins for an activity' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of check-ins',
    type: [CheckInResponseDto],
  })
  async getCheckIns(
    @Request() req,
    @Param('activityId') activityId: string,
    @Query() query: GetCheckInsQueryDto,
  ): Promise<ActivityServiceResponse<CheckInResponseDto[]>> {
    return this.activitiesService.getCheckIns(
      req.user.userId,
      activityId,
      query.startDate ? new Date(query.startDate) : undefined,
      query.endDate ? new Date(query.endDate) : undefined,
    );
  }

  @Get(':activityId/checkins/:checkInId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a specific check-in' })
  @ApiResponse({
    status: 200,
    description: 'Returns check-in details',
    type: CheckInResponseDto,
  })
  async getCheckIn(
    @Request() req,
    @Param('activityId') activityId: string,
    @Param('checkInId') checkInId: string,
  ): Promise<ActivityServiceResponse<CheckInResponseDto>> {
    return this.activitiesService.getCheckIn(
      req.user.userId,
      activityId,
      checkInId,
    );
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
  @ApiBody({
    type: UpdateCheckInDto,
    examples: {
      'Update Photo Caption': {
        value: {
          content: {
            caption: 'Updated progress photo caption',
          } as Partial<PhotoContent>,
        },
      },
      'Update Checklist Items': {
        value: {
          content: {
            items: [
              { text: 'Task 1', completed: true },
              { text: 'Task 2', completed: true },
            ],
          } as ChecklistContent,
        },
      },
    },
  })
  async updateCheckIn(
    @Request() req,
    @Param('activityId') activityId: string,
    @Param('checkInId') checkInId: string,
    @Body() updateCheckInDto: UpdateCheckInDto,
  ): Promise<ActivityServiceResponse<CheckInResponseDto>> {
    return this.activitiesService.updateCheckIn(
      req.user.userId,
      activityId,
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
    return this.activitiesService.deleteCheckIn(
      req.user.userId,
      activityId,
      checkInId,
    );
  }

  @Get(':activityId/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get activity statistics' })
  @ApiResponse({
    status: 200,
    description: 'Activity statistics retrieved successfully',
    type: ActivityStatsDto,
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
    type: ActivityCalendarResponseDto,
  })
  async getActivityCalendar(
    @Request() req,
    @Param('activityId') activityId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<ActivityServiceResponse<ActivityCalendarResponse>> {
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
  @Get(':id/requests')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get activity join requests (admin only)',
    description: 'Retrieve all pending join requests for an activity'
  })
  @ApiResponse({
    status: 200,
    description: 'List of join requests retrieved successfully',
    type: [JoinRequestResponseDto],
  })
  @ApiResponse({
    status: 403,
    description: 'User is not an admin of this activity',
  })
  @ApiResponse({
    status: 404,
    description: 'Activity not found',
  })
  async getJoinRequests(
    @Request() req,
    @Param('id') activityId: string,
  ): Promise<ActivityServiceResponse<JoinRequestResponseDto[]>> {
    return this.activitiesService.getJoinRequests(activityId, req.user.userId);
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

  @Get(':activityId/participants')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all participants of an activity',
    description:
      'For public activities, any authenticated user can access. For private activities, only participants can access.',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all participants with their roles',
    type: [ParticipantDto],
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden - User is not a participant of this private activity',
  })
  async getActivityParticipants(
    @Request() req,
    @Param('activityId') activityId: string,
  ): Promise<ActivityServiceResponse<ParticipantDto[]>> {
    return this.activitiesService.getActivityParticipants(
      activityId,
      req.user.userId,
    );
  }

 
}
