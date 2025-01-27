import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Activity,
  ActivityDocument,
  ActivityType,
  ActivityRole,
  CheckinFrequencyUnit,
  DayOfWeek,
  DurationUnit,
} from './schemas/activity.schema';
import {
  CheckIn,
  CheckInDocument,
  CheckInType,
} from './schemas/checkin.schema';
import { CreateActivityDto } from './dto/activity/create-activity.dto';
import { UpdateActivityDto } from './dto/activity/update-activity.dto';
import { ActivityResponseDto } from './dto/activity/activity-response.dto';
import { ActivityServiceResponse } from './interfaces/common.interface';
import { plainToClass } from 'class-transformer';
import { CreateCheckInDto } from './dto/checkin/create-checkin.dto';
import { UpdateCheckInDto } from './dto/checkin/update-checkin.dto';
import { CheckInResponseDto } from './dto/checkin/checkin-response.dto';
import { isCheckInComplete } from './validators/checkin.validators';
import {
  IActivityStats,
  IStatsQueryParams,
  IParticipantStats,
} from './interfaces/activity-stats.interface';
import {
  PopulatedUser,
  PopulatedActivity,
  PopulatedCheckIn,
} from './interfaces/populated-documents.interface';
import { UpdateParticipantRoleDto } from './dto/activity/update-participant.dto';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
    @InjectModel(CheckIn.name) private checkInModel: Model<CheckInDocument>,
  ) {}

  private transformToDto<T>(document: any, dto: new () => T): T {
    if (!document) {
      return null;
    }
    const plainObj = document.toJSON ? document.toJSON() : document;
    if (document.id) {
      plainObj.id = document.id.toString();
    }
    return plainToClass(dto, plainObj, {
      excludeExtraneousValues: true,
    });
  }

  private calculateDurationInDays(
    duration: number,
    unit: DurationUnit,
  ): number {
    switch (unit) {
      case DurationUnit.MONTHS:
        return duration * 30;
      case DurationUnit.DAYS:
      default:
        return duration;
    }
  }

  private calculateEndDate(startDate: Date, durationInDays: number): Date {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + durationInDays);
    return endDate;
  }

  private validateCheckinFrequencySettings(
    createActivityDto: CreateActivityDto | UpdateActivityDto,
  ): void {
    const {
      checkinFrequencyUnit,
      checkinDays,
      checkinDateOfMonth,
      checkinDayOfWeek,
      checkinWeekOfMonth,
    } = createActivityDto;

    switch (checkinFrequencyUnit) {
      case CheckinFrequencyUnit.WEEKLY:
      case CheckinFrequencyUnit.BIWEEKLY:
        if (!checkinDays?.length) {
          throw new BadRequestException(
            `${checkinFrequencyUnit} frequency requires specifying check-in days`,
          );
        }
        break;

      case CheckinFrequencyUnit.MONTHLY:
        const hasDateOfMonth = typeof checkinDateOfMonth === 'number';
        const hasDayOfWeek = checkinDayOfWeek && checkinWeekOfMonth;

        if (!hasDateOfMonth && !hasDayOfWeek) {
          throw new BadRequestException(
            'Monthly frequency requires either a date of month or a day of week with week of month',
          );
        }

        if (hasDateOfMonth && hasDayOfWeek) {
          throw new BadRequestException(
            'Cannot specify both date of month and day of week for monthly frequency',
          );
        }
        break;
    }
  }

  // Helper method to prepare activity response
  private async prepareActivityResponse(
    activity: ActivityDocument,
    message: string,
  ): Promise<ActivityServiceResponse<ActivityResponseDto>> {
    const nextCheckInDue = this.calculateNextCheckInDate(activity);
    const responseData = this.transformToDto(activity, ActivityResponseDto);
    (responseData as any).nextCheckInDue = nextCheckInDue;

    return {
      success: true,
      message,
      data: responseData,
      metadata: {
        availableSeats: activity.maxSize - activity.currentSize,
        isJoinable:
          activity.isActive && activity.currentSize < activity.maxSize,
      },
    };
  }

  async create(
    userId: string,
    createActivityDto: CreateActivityDto,
  ): Promise<ActivityServiceResponse<ActivityResponseDto>> {
    // Validate check-in frequency settings
    this.validateCheckinFrequencySettings(createActivityDto);

    const durationInDays = this.calculateDurationInDays(
      createActivityDto.proposedDuration,
      createActivityDto.durationUnit,
    );

    const startDate = createActivityDto.startDate || new Date();
    const endDate = this.calculateEndDate(startDate, durationInDays);

    const createdActivity = new this.activityModel({
      ...createActivityDto,
      participants: [
        {
          user: new Types.ObjectId(userId),
          role: ActivityRole.ADMIN,
        },
      ],
      currentSize: 1,
      admin: new Types.ObjectId(userId),
      proposedDurationInDays: durationInDays,
      startDate,
      endDate,
    });

    const activity = await createdActivity.save();
    return this.prepareActivityResponse(
      activity,
      'Activity created successfully',
    );
  }

  private calculateNextCheckInDate(activity: Activity): Date | null {
    const now = new Date();
    const nextDate = new Date(now);
    nextDate.setHours(0, 0, 0, 0); // Start of day

    switch (activity.checkinFrequencyUnit) {
      case CheckinFrequencyUnit.DAILY:
        nextDate.setDate(nextDate.getDate() + 1);
        return nextDate;

      case CheckinFrequencyUnit.WEEKLY:
      case CheckinFrequencyUnit.BIWEEKLY:
        if (!activity.checkinDays?.length) return null;

        // Convert day names to numbers (0-6)
        const dayNumbers = activity.checkinDays.map((day) =>
          [
            'sunday',
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
          ].indexOf(day.toLowerCase()),
        );

        // Find the next allowed day
        let daysToAdd = 1;
        while (!dayNumbers.includes((nextDate.getDay() + daysToAdd) % 7)) {
          daysToAdd++;
        }
        nextDate.setDate(nextDate.getDate() + daysToAdd);
        return nextDate;

      case CheckinFrequencyUnit.MONTHLY:
        if (activity.checkinDateOfMonth) {
          nextDate.setDate(activity.checkinDateOfMonth);
          if (nextDate < now) {
            nextDate.setMonth(nextDate.getMonth() + 1);
          }
          return nextDate;
        }

        if (activity.checkinDayOfWeek && activity.checkinWeekOfMonth) {
          // Implementation for "last Thursday" type patterns
          // This is a simplified version
          nextDate.setDate(1); // Start of month
          nextDate.setMonth(nextDate.getMonth() + 1); // Next month
          return nextDate;
        }
        return null;

      default:
        return null;
    }
  }

  async findOne(
    id: string,
  ): Promise<ActivityServiceResponse<ActivityResponseDto>> {
    const activity = await this.activityModel
      .findById(id)
      .exec();

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    return this.prepareActivityResponse(
      activity,
      'Activity retrieved successfully',
    );
  }

  async update(
    activityId: string,
    updateActivityDto: UpdateActivityDto,
  ): Promise<ActivityServiceResponse<ActivityResponseDto>> {
    const activity = await this.activityModel.findById(activityId);

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    const relevantFields = {
      checkinFrequencyUnit: activity.checkinFrequencyUnit,
      checkinDays: activity.checkinDays,
      checkinDateOfMonth: activity.checkinDateOfMonth,
      checkinDayOfWeek: activity.checkinDayOfWeek,
      checkinWeekOfMonth: activity.checkinWeekOfMonth,
      ...updateActivityDto,
    };

    this.validateCheckinFrequencySettings(relevantFields);

    // Simplified update without unnecessary population
    const updatedActivity = await this.activityModel
      .findByIdAndUpdate(
        activityId,
        { $set: updateActivityDto },
        { new: true }
      )
      .exec();

    if (!updatedActivity) {
      throw new NotFoundException('Activity not found');
    }

    return this.prepareActivityResponse(
      updatedActivity,
      'Activity updated successfully',
    );
  }

  async createCheckIn(
    userId: string,
    activityId: string,
    createCheckInDto: CreateCheckInDto,
  ): Promise<ActivityServiceResponse<CheckInResponseDto>> {
    const activity = await this.activityModel.findById(activityId);
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    if (!this.isCheckInAllowedForDate(activity, createCheckInDto.date)) {
      throw new BadRequestException(
        'Check-in is not allowed for this date based on activity schedule',
      );
    }

    // Validate activity is still active
    if (!activity.isActive) {
      throw new BadRequestException('Cannot check in to an inactive activity');
    }

    // Validate activity hasn't ended
    if (activity.endedAt && new Date(activity.endedAt) < new Date()) {
      throw new BadRequestException('Cannot check in to an ended activity');
    }

    // Validate check-in date
    if (createCheckInDto.date > new Date()) {
      throw new BadRequestException('Check-in date cannot be in the future');
    }

    // Validate user is a participant
    const isParticipant = activity.participants.some(
      (p) => p.user.toString() === userId,
    );
    if (!isParticipant) {
      throw new BadRequestException(
        'Only participants can check in to an activity',
      );
    }

    const checkIn = new this.checkInModel({
      user: userId,
      activity: activityId,
      type: createCheckInDto.type,
      content: createCheckInDto.content,
      date: createCheckInDto.date,
      comment: createCheckInDto.comment,
      ...(createCheckInDto.type === CheckInType.PHOTO && {
        photo: createCheckInDto.photo,
      }),
      ...(createCheckInDto.type === CheckInType.CHECKLIST && {
        checklist: createCheckInDto.checklist,
      }),
      ...(createCheckInDto.type === CheckInType.HOURS && {
        hours: createCheckInDto.hours,
      }),
      ...(createCheckInDto.type === CheckInType.OTHER && {
        other: createCheckInDto.other,
      }),
    });

    const savedCheckIn = await checkIn.save();
    const populatedCheckIn = await savedCheckIn.populate([
      { path: 'user', select: 'name email profilePicture' },
      { path: 'activity' },
    ]);

    const responseData = this.transformToDto(
      populatedCheckIn,
      CheckInResponseDto,
    );

    return {
      success: true,
      message: 'Check-in created successfully',
      data: responseData,
    };
  }

  async getActivityCheckIns(
    activityId: string,
  ): Promise<ActivityServiceResponse<CheckInResponseDto[]>> {
    const activity = await this.activityModel.findById(activityId);
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    const checkIns = await this.checkInModel
      .find({ activity: activityId })
      .populate('user', 'name email profilePicture')
      .populate('activity')
      .sort({ createdAt: -1 })
      .exec();

    const responseData = checkIns.map((checkIn) =>
      this.transformToDto(checkIn, CheckInResponseDto),
    );

    const { metadata } = await this.prepareActivityResponse(activity, '');

    return {
      success: true,
      message: 'Check-ins retrieved successfully',
      data: responseData,
      metadata,
    };
  }

  async getCheckIn(
    checkInId: string,
  ): Promise<ActivityServiceResponse<CheckInResponseDto>> {
    const checkIn = await this.checkInModel
      .findById(checkInId)
      .populate('user', 'name email profilePicture')
      .populate({
        path: 'activity',
        populate: {
          path: 'admin',
          select: 'name email profilePicture',
        },
      })
      .exec();

    if (!checkIn) {
      throw new NotFoundException('Check-in not found');
    }

    const responseData = this.transformToDto(checkIn, CheckInResponseDto);

    return {
      success: true,
      message: 'Check-in retrieved successfully',
      data: responseData,
    };
  }

  async updateCheckIn(
    userId: string,
    checkInId: string,
    updateCheckInDto: UpdateCheckInDto,
  ): Promise<ActivityServiceResponse<CheckInResponseDto>> {
    // First get the check-in to validate ownership and get activity info
    const existingCheckIn = await this.checkInModel
      .findById(checkInId)
      .populate('activity')
      .exec();

    if (!existingCheckIn) {
      throw new NotFoundException('Check-in not found');
    }

    // Validate check-in ownership
    if (existingCheckIn.user.toString() !== userId) {
      throw new BadRequestException('You can only update your own check-ins');
    }

    // Get activity from populated check-in
    const activity = existingCheckIn.activity as Activity;

    // Validate activity is still active
    if (!activity.isActive) {
      throw new BadRequestException(
        'Cannot update check-in for an inactive activity',
      );
    }

    // Validate activity hasn't ended
    if (activity.endedAt && new Date(activity.endedAt) < new Date()) {
      throw new BadRequestException(
        'Cannot update check-in for an ended activity',
      );
    }

    // Validate check-in date if it's being updated
    if (updateCheckInDto.date && updateCheckInDto.date > new Date()) {
      throw new BadRequestException('Check-in date cannot be in the future');
    }

    // Validate check-in date against activity schedule
    if (!this.isCheckInAllowedForDate(activity, updateCheckInDto.date)) {
      throw new BadRequestException(
        'Check-in date is not allowed for this activity',
      );
    }

    const checkIn = await this.checkInModel
      .findByIdAndUpdate(
        checkInId,
        {
          ...updateCheckInDto,
          ...(updateCheckInDto.content && {
            isCompleted: isCheckInComplete({
              ...existingCheckIn.toObject(),
              ...updateCheckInDto,
            }),
          }),
        },
        { new: true },
      )
      .populate('user', 'name email profilePicture')
      .populate('activity')
      .exec();

    const responseData = this.transformToDto(checkIn, CheckInResponseDto);

    return {
      success: true,
      message: 'Check-in updated successfully',
      data: responseData,
    };
  }

  async deleteCheckIn(
    checkInId: string,
  ): Promise<ActivityServiceResponse<void>> {
    const result = await this.checkInModel.findByIdAndDelete(checkInId);

    if (!result) {
      throw new NotFoundException('Check-in not found');
    }

    return {
      success: true,
      message: 'Check-in deleted successfully',
      data: null,
    };
  }

  async getActivityStats(
    activityId: string,
    query: IStatsQueryParams,
  ): Promise<ActivityServiceResponse<IActivityStats>> {
    const activity = await this.activityModel
      .findById(activityId)
      .populate<{ participants: PopulatedUser[] }>('participants', 'name')
      .lean()
      .exec();

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    const populatedActivity = activity as unknown as PopulatedActivity;

    const checkInQuery: Record<string, any> = { activity: activityId };

    if (query.startDate) {
      checkInQuery.date = { $gte: new Date(query.startDate) };
    }

    if (query.endDate) {
      checkInQuery.date = {
        ...checkInQuery.date,
        $lte: new Date(query.endDate),
      };
    }

    if (query.participantId) {
      checkInQuery.user = query.participantId;
    }

    if (query.checkInType) {
      checkInQuery.types = query.checkInType;
    }

    if (query.isCompleted !== undefined) {
      checkInQuery.isCompleted = query.isCompleted;
    }

    const checkIns = await this.checkInModel
      .find(checkInQuery)
      .populate<{ user: PopulatedUser }>('user', 'name')
      .lean()
      .exec();

    const populatedCheckIns = checkIns as unknown as PopulatedCheckIn[];

    const totalCheckIns = checkIns.length;
    const completedCheckIns = checkIns.filter((c) => c.isCompleted).length;
    const completionRate =
      totalCheckIns > 0 ? (completedCheckIns / totalCheckIns) * 100 : 0;

    let participantStats: IParticipantStats[] = await Promise.all(
      populatedActivity.participants.map(async (participant: PopulatedUser) => {
        const userCheckIns = populatedCheckIns.filter(
          (c) => c.user._id.toString() === participant._id.toString(),
        );

        const userCompletedCheckIns = userCheckIns.filter((c) => c.isCompleted);

        const sortedCheckIns = [...userCheckIns].sort((a, b) => {
          const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
          const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
          return dateB - dateA;
        });

        let streak = 0;
        for (const checkIn of sortedCheckIns) {
          if (checkIn.isCompleted) streak++;
          else break;
        }

        const completionTimes = userCheckIns
          .filter(
            (c) =>
              c.isCompleted &&
              c.createdAt instanceof Date &&
              c.updatedAt instanceof Date,
          )
          .map((c) => c.updatedAt.getTime() - c.createdAt.getTime());

        const avgCompletionTime =
          completionTimes.length > 0
            ? completionTimes.reduce((a, b) => a + b, 0) /
              completionTimes.length
            : 0;

        return {
          userId: participant._id?.toString() || '',
          name: (participant as any).name || 'Unknown',
          checkInCount: userCheckIns.length,
          completionRate:
            userCheckIns.length > 0
              ? (userCompletedCheckIns.length / userCheckIns.length) * 100
              : 0,
          streak,
          lastCheckIn:
            sortedCheckIns[0]?.createdAt instanceof Date
              ? sortedCheckIns[0].createdAt
              : undefined,
          averageCompletionTime: avgCompletionTime,
        };
      }),
    );

    if (query.sortBy) {
      participantStats = participantStats.sort((a, b) => {
        const order = query.sortOrder === 'desc' ? -1 : 1;
        return (a[query.sortBy] - b[query.sortBy]) * order;
      });
    }

    const checkInsByType = populatedCheckIns.reduce(
      (acc, checkIn) => {
        const type = checkIn.type;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      {} as Record<CheckInType, number>,
    );

    const mostPopularCheckInType = Object.entries(checkInsByType).reduce(
      (a, b) => (a[1] > b[1] ? a : b),
    )[0] as CheckInType;

    const checkInsByDay = populatedCheckIns.reduce(
      (acc, checkIn) => {
        if (checkIn.createdAt instanceof Date) {
          const day = checkIn.createdAt.toLocaleDateString('en-US', {
            weekday: 'long',
          });
          acc[day] = (acc[day] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    const mostActiveDay = Object.entries(checkInsByDay).reduce(
      (a, b) => (a[1] > b[1] ? a : b),
      ['Unknown', 0],
    )[0];

    const longestStreak = Math.max(0, ...participantStats.map((p) => p.streak));

    const completionTimes = populatedCheckIns
      .filter(
        (c) =>
          c.isCompleted &&
          c.createdAt instanceof Date &&
          c.updatedAt instanceof Date,
      )
      .map((c) => c.updatedAt.getTime() - c.createdAt.getTime());

    const averageCompletionTime =
      completionTimes.length > 0
        ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
        : 0;

    const totalDurationInDays =
      populatedActivity.proposedDurationInDays ||
      this.calculateDurationInDays(
        populatedActivity.proposedDuration,
        populatedActivity.durationUnit,
      );

    const averageDurationInDays =
      totalDurationInDays / (populatedActivity.participants.length || 1);

    return {
      success: true,
      message: 'Activity statistics retrieved successfully',
      data: {
        totalCheckIns,
        completionRate,
        participantStats,
        checkInsByType,
        averageCompletionTime,
        mostActiveDay,
        mostPopularCheckInType,
        longestStreak,
        totalDurationInDays,
        averageDurationInDays,
        availableSeats: activity.maxSize - activity.currentSize,
        isJoinable: activity.currentSize < activity.maxSize,
      },
    };
  }

  async updateParticipantRole(
    activityId: string,
    updateRoleDto: UpdateParticipantRoleDto,
  ): Promise<ActivityServiceResponse<ActivityResponseDto>> {
    const activity = await this.activityModel.findById(activityId);

    const participantIndex = activity.participants.findIndex(
      (p) => p.user.toString() === updateRoleDto.userId,
    );

    if (participantIndex === -1) {
      throw new NotFoundException('Participant not found');
    }

    activity.participants[participantIndex].role = updateRoleDto.role;
    const updatedActivity = await activity.save();

    const responseData = this.transformToDto(
      updatedActivity,
      ActivityResponseDto,
    );
    return {
      success: true,
      message: 'Participant role updated successfully',
      data: responseData,
    };
  }

  async endActivity(
    activityId: string,
  ): Promise<ActivityServiceResponse<ActivityResponseDto>> {
    const activity = await this.activityModel.findByIdAndUpdate(
      activityId,
      {
        isActive: false,
        endedAt: new Date(),
      },
      { new: true },
    );

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    const responseData = this.transformToDto(activity, ActivityResponseDto);
    return {
      success: true,
      message: 'Activity ended successfully',
      data: responseData,
    };
  }

  private validateCheckInDate(date: Date): boolean {
    const now = new Date();
    return date <= now;
  }

  private isCheckInAllowedForDate(
    activity: Activity,
    checkInDate: Date,
  ): boolean {
    const days = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    const dayOfWeek = days[checkInDate.getDay()] as DayOfWeek;
    const dateOfMonth = checkInDate.getDate();
    const weekOfMonth = Math.ceil(dateOfMonth / 7);

    switch (activity.checkinFrequencyUnit) {
      case CheckinFrequencyUnit.DAILY:
        return true;

      case CheckinFrequencyUnit.WEEKLY:
      case CheckinFrequencyUnit.BIWEEKLY:
        return activity.checkinDays?.includes(dayOfWeek) ?? false;

      case CheckinFrequencyUnit.MONTHLY:
        if (activity.checkinDateOfMonth) {
          return dateOfMonth === activity.checkinDateOfMonth;
        }
        if (activity.checkinDayOfWeek && activity.checkinWeekOfMonth) {
          return (
            dayOfWeek === activity.checkinDayOfWeek &&
            weekOfMonth === activity.checkinWeekOfMonth
          );
        }
        return false;

      default:
        return true;
    }
  }

  async getActivityCalendar(
    activityId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<ActivityServiceResponse<any>> {
    const activity = await this.activityModel.findById(activityId);
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    const query: any = { activity: activityId };
    if (startDate) {
      query.date = { $gte: new Date(startDate) };
    }
    if (endDate) {
      query.date = { ...query.date, $lte: new Date(endDate) };
    }

    const checkIns = await this.checkInModel
      .find(query)
      .populate('user', 'name email profilePicture')
      .sort({ date: 1 })
      .lean();

    // Group check-ins by date
    const checkInsByDate = checkIns.reduce((acc, checkIn) => {
      const date = checkIn.date.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(checkIn);
      return acc;
    }, {});

    // Calculate allowed check-in dates based on frequency settings
    const allowedDates = this.calculateAllowedCheckInDates(
      activity,
      new Date(startDate || activity.startDate),
      new Date(endDate || activity.endedAt || new Date()),
    );

    return {
      success: true,
      message: 'Calendar data retrieved successfully',
      data: {
        checkIns: checkInsByDate,
        allowedDates,
        frequency: {
          unit: activity.checkinFrequencyUnit,
          days: activity.checkinDays,
          dateOfMonth: activity.checkinDateOfMonth,
          dayOfWeek: activity.checkinDayOfWeek,
          weekOfMonth: activity.checkinWeekOfMonth,
        },
      },
    };
  }

  private calculateAllowedCheckInDates(
    activity: Activity,
    startDate: Date,
    endDate: Date,
  ): string[] {
    const allowedDates: string[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      if (this.isCheckInAllowedForDate(activity, currentDate)) {
        allowedDates.push(currentDate.toISOString().split('T')[0]);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return allowedDates;
  }

  async leaveActivity(
    activityId: string,
    userId: string,
  ): Promise<ActivityServiceResponse<ActivityResponseDto>> {
    const activity = await this.activityModel.findById(activityId);

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    // Remove participant
    activity.participants = activity.participants.filter(
      (p) => p.user.toString() !== userId,
    );

    // Update current size
    activity.currentSize = activity.participants.length;

    const updatedActivity = await activity.save();

    return this.prepareActivityResponse(
      updatedActivity,
      'Successfully left the activity',
    );
  }

  async joinActivity(
    activityId: string,
    userId: string,
  ): Promise<ActivityServiceResponse<ActivityResponseDto>> {
    const activity = await this.activityModel.findById(activityId);

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    if (activity.currentSize >= activity.maxSize) {
      throw new BadRequestException('Activity is full');
    }

    if (!activity.isActive) {
      throw new BadRequestException('Activity is no longer active');
    }

    // For public activities, add user directly
    if (activity.type === ActivityType.PUBLIC) {
      activity.participants.push({
        user: new Types.ObjectId(userId),
        role: ActivityRole.MEMBER,
      } as any);
      activity.currentSize = activity.participants.length;

      const updatedActivity = await activity.save();
      return this.prepareActivityResponse(
        updatedActivity,
        'Successfully joined the activity',
      );
    }

    // For private activities, add to join requests
    const existingRequest = activity.joinRequests.find(
      (request) => request.user.toString() === userId,
    );

    if (existingRequest) {
      throw new BadRequestException('Join request already pending');
    }

    activity.joinRequests.push({
      user: new Types.ObjectId(userId),
      requestedAt: new Date(),
    } as any);

    const updatedActivity = await activity.save();
    return this.prepareActivityResponse(
      updatedActivity,
      'Join request sent successfully',
    );
  }

  async approveJoinRequest(
    activityId: string,
    userId: string,
  ): Promise<ActivityServiceResponse<ActivityResponseDto>> {
    const activity = await this.activityModel.findById(activityId);

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    if (activity.currentSize >= activity.maxSize) {
      throw new BadRequestException('Activity is full');
    }

    // Find and remove the join request
    const requestIndex = activity.joinRequests.findIndex(
      (request) => request.user.toString() === userId,
    );

    if (requestIndex === -1) {
      throw new NotFoundException('Join request not found');
    }

    activity.joinRequests.splice(requestIndex, 1);

    // Add user as participant
    activity.participants.push({
      user: new Types.ObjectId(userId),
      role: ActivityRole.MEMBER,
    } as any);
    activity.currentSize = activity.participants.length;

    const updatedActivity = await activity.save();
    return this.prepareActivityResponse(
      updatedActivity,
      'Successfully approved join request',
    );
  }
}
