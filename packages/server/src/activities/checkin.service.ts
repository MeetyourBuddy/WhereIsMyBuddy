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

@Injectable()
export class CheckInService {
  constructor(
    @InjectModel(CheckIn.name) private checkInModel: Model<CheckInDocument>,
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
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

    // Check if user already checked in for this scheduled date
    const existingCheckIn = await this.checkInModel
      .findOne({
        activity: activityId,
        user: userId,
        scheduledDate: new Date(scheduledDate),
        isDeleted: false,
      })
      .exec();

    if (existingCheckIn) {
      throw new BadRequestException(
        'You have already checked in for this scheduled date',
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
      hasUserLiked:
        checkIn.likedBy?.some((id) => id.toString() === userId) || false,
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
      hasUserLiked:
        checkIn.likedBy?.some((id) => id.toString() === userId) || false,
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
      hasUserLiked:
        checkIn.likedBy?.some((id) => id.toString() === userId) || false,
    } as unknown as CheckInResponseDto;
  }

  async toggleLike(
    checkInId: string,
    userId: string,
  ): Promise<CheckInResponseDto> {
    if (!Types.ObjectId.isValid(checkInId)) {
      throw new BadRequestException('Invalid check-in ID');
    }

    const checkIn = await this.checkInModel.findById(checkInId).exec();
    if (!checkIn || checkIn.isDeleted) {
      throw new NotFoundException('Check-in not found');
    }

    const userObjectId = new Types.ObjectId(userId);
    const hasLiked = checkIn.likedBy.includes(userObjectId);

    if (hasLiked) {
      // Remove like
      checkIn.likedBy = checkIn.likedBy.filter(
        (id) => id.toString() !== userId,
      );
      checkIn.likes = Math.max(0, checkIn.likes - 1);
    } else {
      // Add like
      checkIn.likedBy.push(userObjectId);
      checkIn.likes += 1;
    }

    await checkIn.save();
    return this.populateCheckIn(checkInId, userId);
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
      hasUserLiked:
        checkIn.likedBy?.some((id) => id.toString() === userId) || false,
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
}
