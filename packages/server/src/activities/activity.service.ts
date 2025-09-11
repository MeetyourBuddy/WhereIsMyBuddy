import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Activity, ActivityDocument } from './schemas/activity.schema';
import { CheckIn, CheckInDocument } from './schemas/checkin.schema';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { PopulatedActivity } from './entities/activity.entities';
import { ActivityResponseDto } from './dto/activity-response.dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
    @InjectModel(CheckIn.name) private checkInModel: Model<CheckInDocument>,
  ) {}

  async create(
    createActivityDto: CreateActivityDto,
    userId: string,
  ): Promise<ActivityResponseDto> {
    try {
      const activity = new this.activityModel({
        ...createActivityDto,
        admin: userId,
        participants: [userId],
      });

      const savedActivity = await activity.save();

      if (!savedActivity?._id) {
        throw new BadRequestException('Failed to create activity');
      }

      return await this.findOne(savedActivity._id.toString(), userId);
    } catch (error) {
      console.error('Error in create:', error);
      if (error instanceof HttpException) throw error;
      throw new BadRequestException('Failed to create activity');
    }
  }

  async findAll(): Promise<Activity[]> {
    try {
      const activities = await this.activityModel
        .find({
          $or: [{ type: 'public' }],
        })
        .populate({
          path: 'admin',
          model: 'User',
        })
        .populate({
          path: 'participants',
          model: 'User',
        })
        .exec();

      if (!activities) {
        throw new NotFoundException('No activities found');
      }

      return activities;
    } catch (error) {
      throw new BadRequestException(
        'Failed to fetch activities: ' + error.message,
      );
    }
  }

  async findOne(id: string, userId?: string): Promise<ActivityResponseDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid activity ID');
    }

    try {
      const activity = await this.activityModel
        .findById(id)
        .populate({
          path: 'admin',
          select:
            '_id name email avatar country preferredLanguage profileLink profileQR',
        })
        .populate({
          path: 'participants',
          select:
            '_id name email avatar country preferredLanguage profileLink profileQR',
        })
        .lean<PopulatedActivity>()
        .exec();

      if (!activity) {
        throw new NotFoundException('Activity not found');
      }

      // For guest users (no userId), only allow access to public activities
      if (!userId) {
        if (activity.type !== 'public') {
          throw new NotFoundException('Activity not found or unauthorized');
        }
        return activity;
      }

      // For authenticated users, check ownership and participation
      const isOwner = activity.admin?._id?.toString() === userId.toString();
      const isParticipant = activity.participants?.some(
        (p) => p._id?.toString() === userId.toString(),
      );

      const canAccess = activity.type === 'public' || isOwner || isParticipant;

      if (!canAccess) {
        throw new NotFoundException('Activity not found or unauthorized');
      }

      return activity;
    } catch (error) {
      console.error('Error in findOne:', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Failed to fetch activity');
    }
  }

  async update(
    id: string,
    updateActivityDto: UpdateActivityDto,
    userId: string,
  ): Promise<Activity> {
    try {
      const activity = await this.activityModel.findOne({
        _id: id,
        admin: userId, // Only admin can update
      });

      if (!activity) {
        throw new NotFoundException('Activity not found or unauthorized');
      }

      Object.assign(activity, updateActivityDto);
      return await activity.save();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        'Failed to update activity: ' + error.message,
      );
    }
  }

  async delete(id: string, userId: string): Promise<void> {
    try {
      const result = await this.activityModel.deleteOne({
        _id: id,
        admin: userId, // Only admin can delete
      });

      if (result.deletedCount === 0) {
        throw new NotFoundException('Activity not found or unauthorized');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        'Failed to delete activity: ' + error.message,
      );
    }
  }

  async joinActivity(id: string, userId: string): Promise<ActivityResponseDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid activity ID');
    }

    try {
      const activity = await this.activityModel.findById(id);
      if (!activity) {
        throw new NotFoundException('Activity not found');
      }

      // Check if user is already a participant
      if (activity.participants.includes(new Types.ObjectId(userId))) {
        throw new BadRequestException(
          'You are already a participant of this activity',
        );
      }

      // Check if activity is full
      if (activity.participants.length >= activity.maxParticipants) {
        throw new BadRequestException('Activity is full');
      }

      // Add user to participants
      await this.activityModel.findByIdAndUpdate(id, {
        $push: { participants: userId },
      });

      // Return updated activity
      return await this.findOne(id, userId);
    } catch (error) {
      console.error('Error in joinActivity:', error);
      if (error instanceof HttpException) throw error;
      throw new BadRequestException('Failed to join activity');
    }
  }

  async quitActivity(id: string, userId: string): Promise<ActivityResponseDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid activity ID');
    }

    try {
      const activity = await this.activityModel.findById(id);
      if (!activity) {
        throw new NotFoundException('Activity not found');
      }

      // Check if user is a participant
      if (!activity.participants.includes(new Types.ObjectId(userId))) {
        throw new BadRequestException(
          'You are not a participant of this activity',
        );
      }

      // Check if user is the admin (admin cannot quit)
      if (activity.admin.toString() === userId) {
        throw new BadRequestException(
          'Activity admin cannot quit the activity',
        );
      }

      // Remove user from participants
      await this.activityModel.findByIdAndUpdate(id, {
        $pull: { participants: userId },
      });

      // Return updated activity
      return await this.findOne(id, userId);
    } catch (error) {
      console.error('Error in quitActivity:', error);
      if (error instanceof HttpException) throw error;
      throw new BadRequestException('Failed to quit activity');
    }
  }

  async getActivityStatistics(activityId: string): Promise<{
    longestStreak: number;
    highestCheckIns: number;
    averageProgress: number;
    totalParticipants: number;
    totalCheckIns: number;
  }> {
    try {
      const activity = await this.activityModel.findById(activityId).exec();
      if (!activity) {
        throw new NotFoundException('Activity not found');
      }

      // Get all participants
      const participants = activity.participants || [];
      const totalParticipants = participants.length;

      // Get all check-ins for this activity
      const checkIns = await this.checkInModel
        .find({ activity: activityId, isDeleted: false })
        .populate('user', 'name email')
        .exec();

      const totalCheckIns = checkIns.length;

      // Calculate statistics for each participant
      let longestStreak = 0;
      let highestCheckIns = 0;
      let totalProgress = 0;
      let participantCount = 0;

      for (const participant of participants) {
        const participantId = participant._id || participant;
        const participantCheckIns = checkIns.filter(
          (ci) => ci.user._id.toString() === participantId.toString(),
        );

        const participantCheckInCount = participantCheckIns.length;
        highestCheckIns = Math.max(highestCheckIns, participantCheckInCount);

        // Calculate progress for this participant
        const totalAvailableCheckIns =
          this.calculateTotalAvailableCheckIns(activity);
        const progress =
          totalAvailableCheckIns > 0
            ? Math.round(
                (participantCheckInCount / totalAvailableCheckIns) * 100,
              )
            : 0;

        totalProgress += progress;
        participantCount++;

        // Calculate streak for this participant
        if (participantCheckIns.length > 0) {
          const sortedCheckIns = participantCheckIns.sort(
            (a, b) =>
              new Date(a.scheduledDate).getTime() -
              new Date(b.scheduledDate).getTime(),
          );

          let currentStreak = 0;
          let tempStreak = 0;

          for (let i = 0; i < sortedCheckIns.length; i++) {
            if (
              i === 0 ||
              this.isConsecutiveDay(
                sortedCheckIns[i - 1].scheduledDate,
                sortedCheckIns[i].scheduledDate,
              )
            ) {
              tempStreak++;
              currentStreak = Math.max(currentStreak, tempStreak);
            } else {
              tempStreak = 1;
            }
          }

          longestStreak = Math.max(longestStreak, currentStreak);
        }
      }

      const averageProgress =
        participantCount > 0 ? Math.round(totalProgress / participantCount) : 0;

      return {
        longestStreak,
        highestCheckIns,
        averageProgress,
        totalParticipants,
        totalCheckIns,
      };
    } catch (error) {
      console.error('Error getting activity statistics:', error);
      if (error instanceof HttpException) throw error;
      throw new BadRequestException('Failed to get activity statistics');
    }
  }

  private calculateTotalAvailableCheckIns(activity: any): number {
    if (
      !activity.proposedDuration ||
      !activity.checkinFrequency ||
      !activity.checkinFrequencyUnit
    ) {
      return 0;
    }

    const durationInDays = activity.proposedDuration * 30; // Assuming months
    const frequencyPerDay =
      activity.checkinFrequencyUnit === 'daily'
        ? activity.checkinFrequency
        : activity.checkinFrequencyUnit === 'weekly'
          ? activity.checkinFrequency / 7
          : activity.checkinFrequencyUnit === 'monthly'
            ? activity.checkinFrequency / 30
            : 0;

    return Math.round(durationInDays * frequencyPerDay);
  }

  private isConsecutiveDay(date1: Date, date2: Date): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays === 1;
  }

  async getActivityLeaderboard(activityId: string): Promise<{
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
    try {
      const activity = await this.activityModel
        .findById(activityId)
        .populate('participants', 'name email avatar picture')
        .populate('admin', 'name email avatar picture')
        .exec();

      if (!activity) {
        throw new NotFoundException('Activity not found');
      }

      // Get all check-ins for this activity
      const checkIns = await this.checkInModel
        .find({ activity: activityId, isDeleted: false })
        .populate('user', 'name email avatar picture')
        .sort({ checkInDate: -1 })
        .exec();

      // Calculate statistics for each participant
      const participants = [];
      // Create a Set to track unique participant IDs to avoid duplicates
      const participantIds = new Set();

      // Add admin first
      participantIds.add(activity.admin._id.toString());

      // Add regular participants (excluding admin if they're also a participant)
      const regularParticipants = activity.participants.filter(
        (participant) =>
          participant._id.toString() !== activity.admin._id.toString(),
      );

      const allParticipants = [activity.admin, ...regularParticipants];

      for (const participant of allParticipants) {
        const participantId = participant._id.toString();
        const participantCheckIns = checkIns.filter(
          (ci) => ci.user._id.toString() === participantId,
        );

        // Calculate streak using the same logic as CheckInService
        let streak = 0;
        if (participantCheckIns.length > 0) {
          // Sort check-ins by checkInDate (not scheduledDate) for consistency
          const sortedCheckIns = participantCheckIns.sort(
            (a, b) =>
              new Date(b.checkInDate).getTime() -
              new Date(a.checkInDate).getTime(),
          );

          // Group check-ins by date to avoid counting multiple check-ins on same day
          const checkInsByDate = new Map<string, any[]>();
          sortedCheckIns.forEach((checkIn) => {
            const dateKey = new Date(checkIn.checkInDate).toDateString();
            if (!checkInsByDate.has(dateKey)) {
              checkInsByDate.set(dateKey, []);
            }
            checkInsByDate.get(dateKey)!.push(checkIn);
          });

          // Calculate current streak from the most recent date
          const sortedDates = Array.from(checkInsByDate.keys()).sort(
            (a, b) => new Date(b).getTime() - new Date(a).getTime(),
          );

          let currentStreak = 0;
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          for (let i = 0; i < sortedDates.length; i++) {
            const checkInDate = new Date(sortedDates[i]);
            checkInDate.setHours(0, 0, 0, 0);

            const expectedDate = new Date(today);
            expectedDate.setDate(today.getDate() - i);

            if (checkInDate.getTime() === expectedDate.getTime()) {
              currentStreak++;
            } else {
              break;
            }
          }

          streak = currentStreak;
        }

        // Calculate points (simple formula: check-ins * 10 + streak * 5)
        const points = participantCheckIns.length * 10 + streak * 5;

        // Determine role
        const role =
          participantId === activity.admin._id.toString() ? 'admin' : 'member';

        participants.push({
          id: participantId,
          name: (participant as any).name || 'Unknown User',
          email: (participant as any).email || '',
          avatar: (participant as any).avatar || (participant as any).picture,
          checkIns: participantCheckIns.length,
          streak,
          points,
          role,
          joinDate: (activity as any).createdAt,
          lastCheckIn: participantCheckIns[0]?.checkInDate,
        });
      }

      // Sort by points (descending), then by check-ins, then by streak
      participants.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.checkIns !== a.checkIns) return b.checkIns - a.checkIns;
        return b.streak - a.streak;
      });

      return { participants };
    } catch (error) {
      console.error('Error getting activity leaderboard:', error);
      if (error instanceof HttpException) throw error;
      throw new BadRequestException('Failed to get activity leaderboard');
    }
  }

  async getWeeklyActivity(activityId: string): Promise<{
    weeklyData: Array<{
      name: string;
      checkins: number;
      date: string;
    }>;
  }> {
    try {
      const activity = await this.activityModel.findById(activityId).exec();
      if (!activity) {
        throw new NotFoundException('Activity not found');
      }

      // Get check-ins from the last 7 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);

      const checkIns = await this.checkInModel
        .find({
          activity: activityId,
          isDeleted: false,
          checkInDate: {
            $gte: startDate,
            $lte: endDate,
          },
        })
        .exec();

      // Group check-ins by actual date (not day of week)
      const dailyCheckIns = new Map();
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      // Initialize all days with 0 check-ins using actual dates
      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
        const dayName = dayNames[date.getDay()];
        dailyCheckIns.set(dateKey, {
          name: dayName,
          checkins: 0,
          date: dateKey,
        });
      }

      // Count check-ins for each actual date
      checkIns.forEach((checkIn) => {
        const checkInDate = new Date(checkIn.checkInDate);
        const dateKey = checkInDate.toISOString().split('T')[0];
        if (dailyCheckIns.has(dateKey)) {
          dailyCheckIns.get(dateKey).checkins += 1;
        }
      });

      // Convert to array format, sorted by date
      const weeklyData = Array.from(dailyCheckIns.values()).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );

      return { weeklyData };
    } catch (error) {
      console.error('Error getting weekly activity:', error);
      if (error instanceof HttpException) throw error;
      throw new BadRequestException('Failed to get weekly activity');
    }
  }

  async getParticipantHistory(activityId: string): Promise<{
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
    try {
      const activity = await this.activityModel
        .findById(activityId)
        .populate('participants', 'name email avatar picture')
        .populate('admin', 'name email avatar picture')
        .exec();

      if (!activity) {
        throw new NotFoundException('Activity not found');
      }

      // Get check-ins from the last 7 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);

      const checkIns = await this.checkInModel
        .find({
          activity: activityId,
          isDeleted: false,
          checkInDate: {
            $gte: startDate,
            $lte: endDate,
          },
        })
        .populate('user', 'name email avatar picture')
        .exec();

      // Create a map of dates for the last 7 days
      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        last7Days.push({
          date: date.toISOString().split('T')[0], // YYYY-MM-DD format
          checkedIn: false,
        });
      }

      // Get all participants (admin + regular participants, no duplicates)
      const regularParticipants = activity.participants.filter(
        (participant) =>
          participant._id.toString() !== activity.admin._id.toString(),
      );
      const allParticipants = [activity.admin, ...regularParticipants];

      const participants = [];

      for (const participant of allParticipants) {
        const participantId = participant._id.toString();
        const participantCheckIns = checkIns.filter(
          (ci) => ci.user._id.toString() === participantId,
        );

        // Calculate streak using the same logic as CheckInService
        let streak = 0;
        if (participantCheckIns.length > 0) {
          // Sort check-ins by checkInDate (not scheduledDate) for consistency
          const sortedCheckIns = participantCheckIns.sort(
            (a, b) =>
              new Date(b.checkInDate).getTime() -
              new Date(a.checkInDate).getTime(),
          );

          // Group check-ins by date to avoid counting multiple check-ins on same day
          const checkInsByDate = new Map<string, any[]>();
          sortedCheckIns.forEach((checkIn) => {
            const dateKey = new Date(checkIn.checkInDate).toDateString();
            if (!checkInsByDate.has(dateKey)) {
              checkInsByDate.set(dateKey, []);
            }
            checkInsByDate.get(dateKey)!.push(checkIn);
          });

          // Calculate current streak from the most recent date
          const sortedDates = Array.from(checkInsByDate.keys()).sort(
            (a, b) => new Date(b).getTime() - new Date(a).getTime(),
          );

          let currentStreak = 0;
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          for (let i = 0; i < sortedDates.length; i++) {
            const checkInDate = new Date(sortedDates[i]);
            checkInDate.setHours(0, 0, 0, 0);

            const expectedDate = new Date(today);
            expectedDate.setDate(today.getDate() - i);

            if (checkInDate.getTime() === expectedDate.getTime()) {
              currentStreak++;
            } else {
              break;
            }
          }

          streak = currentStreak;
        }

        // Create last 7 days data for this participant
        const participantLast7Days = last7Days.map((day) => {
          const hasCheckedIn = participantCheckIns.some((checkIn) => {
            const checkInDate = new Date(checkIn.checkInDate);
            const checkInDateStr = checkInDate.toISOString().split('T')[0];
            return checkInDateStr === day.date;
          });

          return {
            ...day,
            checkedIn: hasCheckedIn,
          };
        });

        participants.push({
          id: participantId,
          name: (participant as any).name || 'Unknown User',
          avatar: (participant as any).avatar || (participant as any).picture,
          checkIns: participantCheckIns.length,
          streak,
          last7Days: participantLast7Days,
        });
      }

      return { participants };
    } catch (error) {
      console.error('Error getting participant history:', error);
      if (error instanceof HttpException) throw error;
      throw new BadRequestException('Failed to get participant history');
    }
  }
}
