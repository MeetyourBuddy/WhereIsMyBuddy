import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Activity, ActivityDocument } from './schemas/activity.schema';
import { CreateActivityDto } from './dto/activity/create-activity.dto';
import { UpdateActivityDto } from './dto/activity/update-activity.dto';
import { ActivityResponseDto } from './dto/activity/activity-response.dto';
import { ActivityServiceResponse } from './interfaces/common.interface';
import { plainToClass } from 'class-transformer';
import { CheckIn, CheckInDocument } from './schemas/checkin.schema';
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
import { CheckInType } from './schemas/checkin.schema';
import { DurationUnit } from './schemas/activity.schema';
import { UpdateParticipantRoleDto } from './dto/activity/update-participant.dto';
import { ActivityRole } from './schemas/activity.schema';

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

  async create(
    userId: string,
    createActivityDto: CreateActivityDto,
  ): Promise<ActivityServiceResponse<ActivityResponseDto>> {
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
          user: userId,
          role: ActivityRole.ADMIN,
        },
      ],
      currentSize: 1,
      admin: userId,
      proposedDurationInDays: durationInDays,
      startDate,
      endDate,
    });

    const activity = await createdActivity.save();
    const responseData = this.transformToDto(activity, ActivityResponseDto);

    return {
      success: true,
      message: 'Activity created successfully',
      data: responseData,
      metadata: {
        availableSeats: activity.maxSize - activity.currentSize,
        isJoinable: true,
      },
    };
  }

  async findOne(
    id: string,
  ): Promise<ActivityServiceResponse<ActivityResponseDto>> {
    const activity = await this.activityModel
      .findById(id)
      .populate({
        path: 'admin',
        select: 'name email profilePicture',
      })
      .populate({
        path: 'participants.user',
        select: 'name email profilePicture',
      })
      .exec();

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    const responseData = this.transformToDto(activity, ActivityResponseDto);

    return {
      success: true,
      message: 'Activity retrieved successfully',
      data: responseData,
      metadata: {
        availableSeats: activity.maxSize - activity.currentSize,
        isJoinable: activity.currentSize < activity.maxSize,
      },
    };
  }

  async update(
    id: string,
    updateActivityDto: UpdateActivityDto,
  ): Promise<ActivityServiceResponse<ActivityResponseDto>> {
    const activity = await this.activityModel.findById(id);

    if (updateActivityDto.proposedDuration || updateActivityDto.durationUnit) {
      const durationInDays = this.calculateDurationInDays(
        updateActivityDto.proposedDuration || activity.proposedDuration,
        updateActivityDto.durationUnit || activity.durationUnit,
      );
      updateActivityDto.proposedDurationInDays = durationInDays;
    }

    const updatedActivity = await this.activityModel
      .findByIdAndUpdate(
        id,
        {
          ...updateActivityDto,
          ...(updateActivityDto.isActive === false &&
            !updateActivityDto.endedAt && {
              endedAt: new Date(),
            }),
        },
        { new: true },
      )
      .populate('admin', 'name email profilePicture')
      .populate('participants', 'name email profilePicture')
      .exec();

    if (!updatedActivity) {
      throw new NotFoundException('Activity not found');
    }

    const responseData = this.transformToDto(
      updatedActivity,
      ActivityResponseDto,
    );

    return {
      success: true,
      message: 'Activity updated successfully',
      data: responseData,
      metadata: {
        availableSeats: updatedActivity.maxSize - updatedActivity.currentSize,
        isJoinable:
          updatedActivity.isActive &&
          updatedActivity.currentSize < updatedActivity.maxSize,
      },
    };
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
    const checkIns = await this.checkInModel
      .find({ activity: activityId })
      .populate('user', 'name email profilePicture')
      .populate('activity')
      .sort({ createdAt: -1 })
      .exec();

    const responseData = checkIns.map((checkIn) =>
      this.transformToDto(checkIn, CheckInResponseDto),
    );

    return {
      success: true,
      message: 'Check-ins retrieved successfully',
      data: responseData,
      metadata: {
        availableSeats: 0,
        isJoinable: true,
        durationInDays: 0,
        remainingDays: 0,
      },
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
        checkIn.types.forEach((type) => {
          acc[type as CheckInType] = (acc[type as CheckInType] || 0) + 1;
        });
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
    await activity.save();

    return this.findOne(activityId);
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

    return this.findOne(activityId);
  }

  private validateCheckInDate(date: Date): boolean {
    const now = new Date();
    return date <= now;
  }
}
