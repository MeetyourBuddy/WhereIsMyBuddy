import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityInvitationService } from './activity-invitation.service';
import { ActivityJoinRequestService } from './activity-join-request.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { JwtAuthGuard } from '../users/auth/guards/jwt-auth.guard';
import { Activity } from './schemas/activity.schema';
import { GetUser } from '@/users/decorators/get-user.decorator';
import { GetOptionalUser } from '@/users/decorators/get-optional-user.decorator';
import { ActivityResponseDto } from './dto/activity-response.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';

@Controller('activities')
export class ActivityController {
  constructor(
    private readonly activityService: ActivityService,
    private readonly activityInvitationService: ActivityInvitationService,
    private readonly activityJoinRequestService: ActivityJoinRequestService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

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
    const activities = await this.activityService.findAll();
    if (userId) {
      const statusByActivity =
        await this.activityJoinRequestService.getJoinRequestStatusByActivityForUser(
          userId,
        );
      // Return plain objects so currentUserJoinRequestStatus is included (Mongoose toJSON strips non-schema fields)
      return activities.map((a) => {
        const id = (a as any)._id?.toString();
        const status = id ? statusByActivity.get(id) : undefined;
        return Object.assign({}, (a as any).toObject?.() ?? a, {
          currentUserJoinRequestStatus: status,
        });
      });
    }
    return activities;
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
    longestStreakParticipantId: string | null;
    longestStreakParticipantName: string | null;
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
    // Check if activity is private and user has invitation
    const activity = await this.activityService.findOne(id, userId);
    if (activity.type === 'private') {
      const adminId = activity.admin?._id || activity.admin?.id;
      const isAdmin = adminId?.toString() === userId;
      
      if (!isAdmin) {
        // Check if user has a pending invitation by userId
        let invitation = await this.activityInvitationService.checkInvitation(
          id,
          userId,
        );
        
        // If no invitation by userId, try checking by email
        if (!invitation) {
          const user = await this.userModel.findById(userId).exec();
          if (user?.email) {
            invitation = await this.activityInvitationService.checkInvitation(
              id,
              user.email,
            );
          }
        }
        
        if (!invitation) {
          // Allow join if user has an accepted join request
          const hasAcceptedRequest =
            await this.activityJoinRequestService.hasAcceptedJoinRequest(
              id,
              userId,
            );
          if (!hasAcceptedRequest) {
            throw new ForbiddenException(
              'This is a private activity. You need an invitation or an accepted join request to join.',
            );
          }
        }
      }
    }

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
