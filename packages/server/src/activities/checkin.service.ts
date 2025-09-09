import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CheckIn, CheckInDocument } from './schemas/checkin.schema';
import { Activity, ActivityDocument } from './schemas/activity.schema';
import { CreateCheckInDto } from './dto/create-checkin.dto';
import {
  CheckInResponseDto,
  CheckInStatsDto,
} from './dto/checkin-response.dto';
import { BadgeService } from './badge.service';

@Injectable()
export class CheckInService {
  constructor(
    @InjectModel(CheckIn.name) private checkInModel: Model<CheckInDocument>,
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
    private badgeService: BadgeService,
  ) {}

  async createCheckIn(
    createCheckInDto: CreateCheckInDto,
    userId: string,
  ): Promise<CheckInResponseDto> {
    const { activityId, type, content, imageUrl, fileId, scheduledDate } =
      createCheckInDto;

    // Validate activity exists and user is participant
    const activity = await this.activityModel.findById(activityId).exec();
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    // Check if user is a participant
    const isParticipant = activity.participants.some(
      (participant) => participant.toString() === userId,
    );
    if (!isParticipant) {
      throw new ForbiddenException(
        'You are not a participant of this activity',
      );
    }

    // Calculate the requested check-in period based on activity frequency
    const requestedPeriod = this.calculateCheckInPeriod(
      activity,
      new Date(scheduledDate),
    );

    // Check if user already checked in for this check-in period
    const existingCheckIn = await this.checkInModel
      .findOne({
        activity: activityId,
        user: userId,
        scheduledDate: {
          $gte: requestedPeriod.start,
          $lt: requestedPeriod.end,
        },
        isDeleted: false,
      })
      .exec();

    if (existingCheckIn) {
      throw new BadRequestException(
        'You have already checked in for this check-in period',
      );
    }

    // Determine if check-in is on time (within 24 hours of scheduled date)
    const scheduledDateTime = new Date(scheduledDate);
    const now = new Date();
    const timeDiff = Math.abs(now.getTime() - scheduledDateTime.getTime());
    const hoursDiff = timeDiff / (1000 * 3600);
    const isOnTime = hoursDiff <= 24;

    // Create check-in
    const checkIn = new this.checkInModel({
      activity: activityId,
      user: userId,
      type,
      content,
      imageUrl,
      fileId,
      scheduledDate: scheduledDateTime,
      checkInDate: now,
      isOnTime,
    });

    const savedCheckIn = await checkIn.save();

    // Update activity check-ins count
    await this.activityModel.findByIdAndUpdate(activityId, {
      $inc: { checkins: 1 },
    });

    // Check and award badges
    try {
      await this.badgeService.checkAndAwardBadges(userId, activityId);
    } catch (error) {
      console.error('Error awarding badges:', error);
      // Don't fail the check-in if badge awarding fails
    }

    return this.populateCheckIn(savedCheckIn._id.toString(), userId);
  }

  async getCheckInsByActivity(
    activityId: string,
    userId: string,
  ): Promise<CheckInResponseDto[]> {
    if (!Types.ObjectId.isValid(activityId)) {
      throw new BadRequestException('Invalid activity ID');
    }

    const checkIns = await this.checkInModel
      .find({
        activity: activityId,
        isDeleted: false,
      })
      .populate('user', '_id name email avatar profileImage')
      .sort({ checkInDate: -1 })
      .lean()
      .exec();

    return checkIns.map((checkIn) => ({
      ...checkIn,
      // Note: hasUserLiked is now handled by the ReactionService
      hasUserLiked: false, // This will be populated by the frontend using reaction data
    })) as unknown as CheckInResponseDto[];
  }

  async getCheckInsByUser(
    userId: string,
    activityId?: string,
  ): Promise<CheckInResponseDto[]> {
    const filter: any = {
      user: userId,
      isDeleted: false,
    };

    if (activityId) {
      filter.activity = activityId;
    }

    const checkIns = await this.checkInModel
      .find(filter)
      .populate('user', '_id name email avatar profileImage')
      .sort({ checkInDate: -1 })
      .lean()
      .exec();

    return checkIns.map((checkIn) => ({
      ...checkIn,
      // Note: hasUserLiked is now handled by the ReactionService
      hasUserLiked: false, // This will be populated by the frontend using reaction data
    })) as unknown as CheckInResponseDto[];
  }

  async getCheckInById(
    id: string,
    userId: string,
  ): Promise<CheckInResponseDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid check-in ID');
    }

    const checkIn = await this.checkInModel
      .findById(id)
      .populate('user', '_id name email avatar profileImage')
      .lean()
      .exec();

    if (!checkIn || checkIn.isDeleted) {
      throw new NotFoundException('Check-in not found');
    }

    return {
      ...checkIn,
      // Note: hasUserLiked is now handled by the ReactionService
      hasUserLiked: false, // This will be populated by the frontend using reaction data
    } as unknown as CheckInResponseDto;
  }

  // Note: Like functionality has been moved to the ReactionService
  // This method is kept for backward compatibility but should be deprecated
  async toggleLike(
    checkInId: string,
    userId: string,
  ): Promise<CheckInResponseDto> {
    // This method is deprecated - use ReactionService instead
    throw new BadRequestException(
      'Use the reaction system instead of toggleLike',
    );
  }

  async deleteCheckIn(checkInId: string, userId: string): Promise<void> {
    if (!Types.ObjectId.isValid(checkInId)) {
      throw new BadRequestException('Invalid check-in ID');
    }

    const checkIn = await this.checkInModel.findById(checkInId).exec();
    if (!checkIn || checkIn.isDeleted) {
      throw new NotFoundException('Check-in not found');
    }

    // Only allow user to delete their own check-ins
    if (checkIn.user.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own check-ins');
    }

    checkIn.isDeleted = true;
    checkIn.deletedAt = new Date();
    await checkIn.save();
  }

  async getActivityStreak(activityId: string): Promise<number> {
    // Get activity to understand the check-in frequency
    const activity = await this.activityModel.findById(activityId).exec();
    if (!activity) return 0;

    const checkIns = await this.checkInModel
      .find({
        activity: activityId,
        isDeleted: false,
      })
      .sort({ checkInDate: 1 })
      .lean()
      .exec();

    if (checkIns.length === 0) return 0;

    // Group check-ins by check-in period
    const checkInsByPeriod = new Map<string, any[]>();
    checkIns.forEach((checkIn) => {
      const period = this.calculateCheckInPeriod(
        activity,
        new Date(checkIn.checkInDate),
      );
      const periodKey = period.start.toISOString();
      if (!checkInsByPeriod.has(periodKey)) {
        checkInsByPeriod.set(periodKey, []);
      }
      checkInsByPeriod.get(periodKey)!.push(checkIn);
    });

    // Calculate current streak from the most recent period
    const sortedPeriods = Array.from(checkInsByPeriod.keys()).sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime(),
    );

    let currentStreak = 0;
    const now = new Date();
    const currentPeriod = this.calculateCheckInPeriod(activity, now);

    for (let i = 0; i < sortedPeriods.length; i++) {
      const periodStart = new Date(sortedPeriods[i]);
      const expectedPeriod = this.calculateCheckInPeriod(activity, periodStart);

      // Check if this period is consecutive with the previous one
      if (i === 0) {
        // For the most recent period, check if it's the current or previous period
        const timeDiff = Math.abs(
          currentPeriod.start.getTime() - expectedPeriod.start.getTime(),
        );
        const periodDuration =
          currentPeriod.end.getTime() - currentPeriod.start.getTime();

        if (timeDiff <= periodDuration * 2) {
          // Allow for current or previous period
          currentStreak++;
        } else {
          break;
        }
      } else {
        // For other periods, check if they are consecutive
        const prevPeriodStart = new Date(sortedPeriods[i - 1]);
        const prevExpectedPeriod = this.calculateCheckInPeriod(
          activity,
          prevPeriodStart,
        );
        const periodDuration =
          expectedPeriod.end.getTime() - expectedPeriod.start.getTime();

        const timeDiff = Math.abs(
          prevExpectedPeriod.start.getTime() - expectedPeriod.start.getTime(),
        );

        if (timeDiff <= periodDuration * 1.5) {
          // Allow for consecutive periods
          currentStreak++;
        } else {
          break;
        }
      }
    }

    return currentStreak;
  }

  async getCheckInStats(
    userId: string,
    activityId: string,
  ): Promise<CheckInStatsDto> {
    const checkIns = await this.checkInModel
      .find({
        user: userId,
        activity: activityId,
        isDeleted: false,
      })
      .sort({ checkInDate: 1 })
      .lean()
      .exec();

    if (checkIns.length === 0) {
      return {
        totalCheckIns: 0,
        currentStreak: 0,
        longestStreak: 0,
        onTimePercentage: 0,
      };
    }

    const totalCheckIns = checkIns.length;
    const onTimeCheckIns = checkIns.filter((ci) => ci.isOnTime).length;
    const onTimePercentage = Math.round((onTimeCheckIns / totalCheckIns) * 100);

    // Calculate streaks
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Sort by scheduled date for streak calculation
    const sortedCheckIns = [...checkIns].sort(
      (a, b) =>
        new Date(a.scheduledDate).getTime() -
        new Date(b.scheduledDate).getTime(),
    );

    for (let i = 0; i < sortedCheckIns.length; i++) {
      if (
        i === 0 ||
        this.isConsecutiveDay(
          sortedCheckIns[i - 1].scheduledDate,
          sortedCheckIns[i].scheduledDate,
        )
      ) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    // Calculate current streak from the end
    currentStreak = 0;
    const now = new Date();
    const lastCheckIn = sortedCheckIns[sortedCheckIns.length - 1];

    if (lastCheckIn && this.isConsecutiveDay(lastCheckIn.scheduledDate, now)) {
      currentStreak = 1;
      for (let i = sortedCheckIns.length - 2; i >= 0; i--) {
        if (
          this.isConsecutiveDay(
            sortedCheckIns[i].scheduledDate,
            sortedCheckIns[i + 1].scheduledDate,
          )
        ) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    const lastCheckInDate = checkIns[checkIns.length - 1]?.checkInDate;
    const nextScheduledDate = await this.getNextScheduledDate(activityId);

    return {
      totalCheckIns,
      currentStreak,
      longestStreak,
      onTimePercentage,
      lastCheckInDate,
      nextScheduledDate,
    };
  }

  private async populateCheckIn(
    checkInId: string,
    userId: string,
  ): Promise<CheckInResponseDto> {
    const checkIn = await this.checkInModel
      .findById(checkInId)
      .populate('user', '_id name email avatar profileImage')
      .lean()
      .exec();

    if (!checkIn) {
      throw new NotFoundException('Check-in not found');
    }

    return {
      ...checkIn,
      // Note: hasUserLiked is now handled by the ReactionService
      hasUserLiked: false, // This will be populated by the frontend using reaction data
    } as unknown as CheckInResponseDto;
  }

  private isConsecutiveDay(date1: Date, date2: Date): boolean {
    const day1 = new Date(date1);
    const day2 = new Date(date2);
    day1.setHours(0, 0, 0, 0);
    day2.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(day2.getTime() - day1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= 1;
  }

  private async getNextScheduledDate(
    activityId: string,
  ): Promise<Date | undefined> {
    // This would need to be implemented based on activity's check-in frequency
    // For now, return undefined
    return undefined;
  }

  private calculateCheckInPeriod(
    activity: any,
    date: Date,
  ): { start: Date; end: Date } {
    const { checkinFrequency, checkinFrequencyUnit, startDate } = activity;
    const activityStart = new Date(startDate);

    // Calculate the period based on frequency unit
    let periodDuration: number;
    switch (checkinFrequencyUnit) {
      case 'daily':
        periodDuration = 24 * 60 * 60 * 1000; // 1 day in milliseconds
        break;
      case 'weekly':
        periodDuration = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
        break;
      case 'monthly':
        periodDuration = 30 * 24 * 60 * 60 * 1000; // 1 month in milliseconds
        break;
      default:
        periodDuration = 24 * 60 * 60 * 1000; // Default to daily
    }

    // Calculate how many periods have passed since activity start
    const timeSinceStart = date.getTime() - activityStart.getTime();
    const periodsPassed = Math.floor(
      timeSinceStart / (periodDuration * checkinFrequency),
    );

    // Calculate the start and end of the current period
    const periodStart = new Date(
      activityStart.getTime() +
        periodsPassed * periodDuration * checkinFrequency,
    );
    const periodEnd = new Date(
      periodStart.getTime() + periodDuration * checkinFrequency,
    );

    return { start: periodStart, end: periodEnd };
  }

  async hasUserCheckedInForCurrentPeriod(
    activityId: string,
    userId: string,
  ): Promise<boolean> {
    const activity = await this.activityModel.findById(activityId).exec();
    if (!activity) return false;

    const currentPeriod = this.calculateCheckInPeriod(activity, new Date());

    const existingCheckIn = await this.checkInModel
      .findOne({
        activity: activityId,
        user: userId,
        scheduledDate: {
          $gte: currentPeriod.start,
          $lt: currentPeriod.end,
        },
        isDeleted: false,
      })
      .exec();

    return !!existingCheckIn;
  }

  async getUserProgress(
    activityId: string,
    userId: string,
  ): Promise<{
    progress: number;
    completedCheckIns: number;
    totalAvailableCheckIns: number;
  }> {
    const activity = await this.activityModel.findById(activityId).exec();
    if (!activity) {
      console.log('❌ Activity not found:', activityId);
      return { progress: 0, completedCheckIns: 0, totalAvailableCheckIns: 0 };
    }

    // Debug activity data
    console.log('🔍 Activity data:', {
      id: activity._id,
      title: activity.title,
      proposedDuration: activity.proposedDuration,
      startDate: activity.startDate,
      endDate: activity.endDate,
      checkinFrequency: activity.checkinFrequency,
      checkinFrequencyUnit: activity.checkinFrequencyUnit,
    });

    // Count user's completed check-ins
    const completedCheckIns = await this.checkInModel.countDocuments({
      user: userId,
      activity: activityId,
      isDeleted: false,
    });

    console.log('📊 User check-ins count:', completedCheckIns);

    // Calculate total available check-ins based on activity duration and frequency
    const totalAvailableCheckIns =
      this.calculateTotalAvailableCheckIns(activity);

    console.log('📈 Total available check-ins:', totalAvailableCheckIns);

    // Calculate progress percentage
    const progress =
      totalAvailableCheckIns > 0
        ? Math.round((completedCheckIns / totalAvailableCheckIns) * 100)
        : 0;

    console.log('🎯 Final progress calculation:', {
      completedCheckIns,
      totalAvailableCheckIns,
      progress,
    });

    return { progress, completedCheckIns, totalAvailableCheckIns };
  }

  private calculateTotalAvailableCheckIns(activity: any): number {
    console.log('🔧 calculateTotalAvailableCheckIns called with:', {
      proposedDuration: activity.proposedDuration,
      checkinFrequency: activity.checkinFrequency,
      checkinFrequencyUnit: activity.checkinFrequencyUnit,
      startDate: activity.startDate,
      endDate: activity.endDate,
    });

    if (
      !activity.proposedDuration ||
      !activity.checkinFrequency ||
      !activity.checkinFrequencyUnit
    ) {
      console.log('❌ Missing required fields for calculation');
      return 0;
    }

    const startDate = new Date(activity.startDate);
    const endDate = activity.endDate
      ? new Date(activity.endDate)
      : new Date(
          startDate.getTime() +
            activity.proposedDuration * 30 * 24 * 60 * 60 * 1000,
        ); // Convert months to milliseconds

    const totalDuration = endDate.getTime() - startDate.getTime();

    console.log('📅 Date calculations:', {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      totalDurationMs: totalDuration,
      totalDurationDays: totalDuration / (24 * 60 * 60 * 1000),
    });

    // Calculate period duration based on frequency unit
    let periodDuration: number;
    switch (activity.checkinFrequencyUnit) {
      case 'daily':
        periodDuration = 24 * 60 * 60 * 1000; // 1 day in milliseconds
        break;
      case 'weekly':
        periodDuration = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
        break;
      case 'monthly':
        periodDuration = 30 * 24 * 60 * 60 * 1000; // 1 month in milliseconds
        break;
      default:
        periodDuration = 24 * 60 * 60 * 1000; // Default to daily
    }

    console.log('⏰ Period calculations:', {
      periodDurationMs: periodDuration,
      periodDurationDays: periodDuration / (24 * 60 * 60 * 1000),
      checkinFrequency: activity.checkinFrequency,
      frequencyUnit: activity.checkinFrequencyUnit,
    });

    // Calculate total number of check-in periods
    const totalPeriods = Math.floor(
      totalDuration / (periodDuration * activity.checkinFrequency),
    );

    console.log('🎯 Final calculation:', {
      totalDuration,
      periodDuration,
      checkinFrequency: activity.checkinFrequency,
      division: totalDuration / (periodDuration * activity.checkinFrequency),
      totalPeriods,
    });

    return totalPeriods;
  }
}
