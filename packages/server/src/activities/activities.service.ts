import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
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
import { CheckIn, CheckInDocument } from './schemas/checkin.schema';
import { CreateActivityDto } from './dto/activity/create-activity.dto';
import { UpdateActivityDto } from './dto/activity/update-activity.dto';
import { ActivityResponseDto } from './dto/activity/activity-response.dto';
import { ActivityServiceResponse } from './interfaces/common.interface';
import { plainToClass } from 'class-transformer';
import { CreateCheckInDto } from './dto/checkin/create-checkin.dto';
import { UpdateCheckInDto } from './dto/checkin/update-checkin.dto';
import { CheckInResponseDto } from './dto/checkin/checkin-response.dto';
import { validateCheckInContent } from './validators/checkin.validators';
import {
  IActivityStats,
  IStatsQueryParams,
  IParticipantStats,
} from './interfaces/activity-stats.interface';
import {
  PopulatedUser,
  PopulatedCheckIn,
} from './interfaces/populated-documents.interface';
import { UpdateParticipantRoleDto } from './dto/activity/update-participant.dto';
import { HandleJoinRequestDto } from './dto/activity/join-request.dto';
import { JoinRequestAction } from './dto/activity/join-request.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { ParticipantDto } from './dto/activity/participant.dto';
import { CheckInType } from './interfaces/checkin-type.interface';
import { CheckInContent } from './interfaces/checkin-content.interface';
import { ActivityCalendarResponse } from './interfaces/activity-calendar.interface';
import { JoinRequestResponseDto } from './dto/activity/join-request-response.dto';

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
      checkinFrequency,
      checkinDays,
      checkinDatesOfMonth,
      checkinDaysOfWeek,
      checkinWeeksOfMonth,
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
        const hasDateOfMonth = checkinDatesOfMonth?.length > 0;
        const hasDayOfWeek =
          checkinDaysOfWeek?.length > 0 && checkinWeeksOfMonth?.length > 0;

        if (!hasDateOfMonth && !hasDayOfWeek) {
          throw new BadRequestException(
            'Monthly frequency requires either dates of month or days of week with weeks of month',
          );
        }

        if (hasDateOfMonth && hasDayOfWeek) {
          throw new BadRequestException(
            'Cannot specify both dates of month and days of week patterns for monthly frequency',
          );
        }

        // Validate array length matches checkinFrequency
        if (hasDateOfMonth && checkinDatesOfMonth.length !== checkinFrequency) {
          throw new BadRequestException(
            `Number of check-in dates (${checkinDatesOfMonth.length}) must match check-in frequency (${checkinFrequency})`,
          );
        }

        if (hasDayOfWeek) {
          const totalCheckIns =
            checkinDaysOfWeek.length * checkinWeeksOfMonth.length;
          if (totalCheckIns !== checkinFrequency) {
            throw new BadRequestException(
              `Total number of check-ins (${totalCheckIns}) must match check-in frequency (${checkinFrequency})`,
            );
          }
        }
        break;
    }
  }

  private validateAndTransformRules(
    rules: string[],
  ): Array<{ rule: string; isDefault: boolean }> {
    if (!rules?.length) return [];

    // Validate each rule
    const validatedRules = rules.map((rule) => {
      if (typeof rule !== 'string') {
        throw new BadRequestException('Each rule must be a string');
      }
      if (rule.trim().length === 0) {
        throw new BadRequestException('Rules cannot be empty strings');
      }
      if (rule.length > 500) {
        // You can adjust this limit
        throw new BadRequestException(
          'Rule text is too long (max 500 characters)',
        );
      }
      return {
        rule: rule.trim(),
        isDefault: false,
      };
    });

    // Check for duplicates
    const ruleTexts = validatedRules.map((r) => r.rule.toLowerCase());
    if (new Set(ruleTexts).size !== ruleTexts.length) {
      throw new BadRequestException('Duplicate rules are not allowed');
    }

    return validatedRules;
  }

  // Helper method to prepare activity response
  private prepareActivityResponse(
    activity: ActivityDocument,
    message: string,
  ): ActivityServiceResponse<ActivityResponseDto> {
    const responseData = this.transformToDto(activity, ActivityResponseDto);
    return {
      success: true,
      message,
      data: responseData,
    };
  }

  async create(
    userId: string,
    createActivityDto: CreateActivityDto,
  ): Promise<ActivityServiceResponse<ActivityResponseDto>> {
    // Add debug logging
    console.log('Create Activity Debug:', {
      userId,
      createActivityDto,
    });

    // Validate check-in frequency settings
    this.validateCheckinFrequencySettings(createActivityDto);

    // Transform and validate rules
    const customRules = this.validateAndTransformRules(createActivityDto.rules);

    const defaultRules = [
      { rule: 'Be respectful to all participants', isDefault: true },
      { rule: 'Maintain regular communication', isDefault: true },
      { rule: 'Inform in advance if unable to attend', isDefault: true },
    ];

    const durationInDays = this.calculateDurationInDays(
      createActivityDto.proposedDuration,
      createActivityDto.durationUnit,
    );

    const startDate = createActivityDto.startDate || new Date();
    const endDate = this.calculateEndDate(startDate, durationInDays);

    const createdActivity = new this.activityModel({
      ...createActivityDto,
      rules: [...defaultRules, ...customRules],
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

    // Add debug logging
    console.log('Created Activity Debug:', {
      userId,
      admin: createdActivity.admin,
      participants: createdActivity.participants,
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
        if (activity.checkinDatesOfMonth) {
          nextDate.setDate(activity.checkinDatesOfMonth[0]);
          if (nextDate < now) {
            nextDate.setMonth(nextDate.getMonth() + 1);
          }
          return nextDate;
        }

        if (activity.checkinDaysOfWeek && activity.checkinWeeksOfMonth) {
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
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid activity ID');
    }

    const activity = await this.activityModel
      .findById(id)
      .populate('participants.user', 'name email profilePicture')
      .exec();

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    const responseData = this.transformToDto(activity, ActivityResponseDto);
    return {
      success: true,
      data: responseData,
    };
  }

  async update(
    activityId: string,
    userId: string,
    updateActivityDto: UpdateActivityDto,
  ): Promise<ActivityServiceResponse<ActivityResponseDto>> {
    const activity = await this.activityModel.findById(activityId).exec();

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    // Add debug logging
    console.log('Update Activity Debug:', {
      userId,
      activityId,
      participants: activity.participants.map((p) => ({
        userId: this.getUserId(p.user),
        role: p.role,
        rawUser: p.user,
      })),
    });

    // Check if user is an admin of the activity
    const isAdmin = activity.participants.some((p) => {
      const participantId = this.getUserId(p.user);
      const isMatch = participantId === userId && p.role === ActivityRole.ADMIN;

      // Add debug logging
      console.log('Participant Check:', {
        participantId,
        userId,
        role: p.role,
        isMatch,
        rawUser: p.user,
      });

      return isMatch;
    });

    if (!isAdmin) {
      throw new ForbiddenException('Only admins can update this activity');
    }

    const relevantFields = {
      checkinFrequencyUnit: activity.checkinFrequencyUnit,
      checkinDays: activity.checkinDays,
      checkinDatesOfMonth: activity.checkinDatesOfMonth,
      checkinDaysOfWeek: activity.checkinDaysOfWeek,
      checkinWeeksOfMonth: activity.checkinWeeksOfMonth,
      ...updateActivityDto,
    };

    this.validateCheckinFrequencySettings(relevantFields);

    // Simplified update without unnecessary population
    const updatedActivity = await this.activityModel
      .findByIdAndUpdate(activityId, { $set: updateActivityDto }, { new: true })
      .exec();

    if (!updatedActivity) {
      throw new NotFoundException('Activity not found');
    }

    return this.prepareActivityResponse(
      updatedActivity,
      'Activity updated successfully',
    );
  }

  // Helper method to safely get user ID from either ObjectId or User object
  private getUserId(user: Types.ObjectId | any): string {
    if (!user) return null;

    if (typeof user === 'string') return user;

    if (user instanceof Types.ObjectId) {
      return user.toString();
    }

    if (typeof user === 'object') {
      if (user._id) return user._id.toString();
      if (user.id) return user.id;
    }

    return user.toString();
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

    // Validate user is participant
    if (!this.isUserParticipant(activity, userId)) {
      throw new ForbiddenException('Only participants can create check-ins');
    }

    // Validate all required check-in types are provided
    validateCheckInContent(createCheckInDto, activity);

    // Create check-in document with all provided content
    const checkIn = new this.checkInModel({
      user: userId,
      activity: activityId,
      date: new Date(),
      content: {
        photo: createCheckInDto.photo,
        checklist: createCheckInDto.checklist,
        hours: createCheckInDto.hours,
      }
    });

    const savedCheckIn = await checkIn.save();
    
    return {
      success: true,
      message: 'Check-in completed successfully with all required types',
      data: this.transformToDto(savedCheckIn, CheckInResponseDto),
    };
  }

  async getCheckIns(
    userId: string,
    activityId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<ActivityServiceResponse<CheckInResponseDto[]>> {
    const query: Record<string, any> = {
      activity: Types.ObjectId.isValid(activityId)
        ? new Types.ObjectId(activityId)
        : activityId,
    };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }

    const checkIns = await this.checkInModel
      .find(query)
      .populate('user')
      .sort({ date: -1 });

    return {
      success: true,
      data: checkIns.map((checkIn) => this.mapToCheckInResponse(checkIn)),
    };
  }

  private validateObjectId(id: string, entityName: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ${entityName} ID`);
    }
  }

  async getCheckIn(
    userId: string,
    activityId: string,
    checkInId: string,
  ): Promise<ActivityServiceResponse<CheckInResponseDto>> {
    this.validateObjectId(activityId, 'activity');
    this.validateObjectId(checkInId, 'check-in');

    const checkIn = await this.checkInModel
      .findOne({
        _id: checkInId,
        activity: activityId,
      })
      .populate('user');

    if (!checkIn) {
      throw new NotFoundException('Check-in not found');
    }

    return {
      success: true,
      data: this.mapToCheckInResponse(checkIn),
    };
  }

  async updateCheckIn(
    userId: string,
    activityId: string,
    checkInId: string,
    updateCheckInDto: UpdateCheckInDto,
  ): Promise<ActivityServiceResponse<CheckInResponseDto>> {
    const checkIn = await this.checkInModel.findOne({
      _id: checkInId,
      activity: activityId,
      user: userId,
    });

    if (!checkIn) {
      throw new NotFoundException('Check-in not found');
    }

    const activity = await this.activityModel.findById(activityId);
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    // If type or content is being updated, validate the new content
    if (updateCheckInDto.type || updateCheckInDto.content) {
      const type = updateCheckInDto.type || checkIn.type;
      const content = updateCheckInDto.content || checkIn.content;
      validateCheckInContent(type, content as CheckInContent, activity);
    }

    Object.assign(checkIn, updateCheckInDto);
    const updatedCheckIn = await checkIn.save();

    return {
      success: true,
      data: this.mapToCheckInResponse(updatedCheckIn),
    };
  }

  async deleteCheckIn(
    userId: string,
    activityId: string,
    checkInId: string,
  ): Promise<ActivityServiceResponse<void>> {
    const checkIn = await this.checkInModel.findOne({
      _id: checkInId,
      activity: activityId,
      user: userId,
    });

    if (!checkIn) {
      throw new NotFoundException('Check-in not found');
    }

    await this.checkInModel.deleteOne({ _id: checkInId });

    return {
      success: true,
    };
  }

  private mapToCheckInResponse(checkIn: CheckInDocument): CheckInResponseDto {
    return {
      id: checkIn._id.toString(),
      activityId: checkIn.activity.toString(),
      userId: checkIn.user.toString(),
      date: checkIn.date,
      type: checkIn.type,
      content: checkIn.content,
      status: checkIn.status,
      isVerified: checkIn.isVerified,
      verifiedBy: checkIn.verifiedBy?.toString(),
      verifiedAt: checkIn.verifiedAt,
      createdAt: checkIn.get('createdAt'),
      updatedAt: checkIn.get('updatedAt'),
    };
  }

  async getActivityStats(
    activityId: string,
    query: IStatsQueryParams,
  ): Promise<ActivityServiceResponse<IActivityStats>> {
    const activity = await this.activityModel
      .findById(activityId)
      .populate({
        path: 'participants.user',
        select: 'name email profilePicture',
      })
      .lean()
      .exec();

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    const checkIns = await this.getFilteredCheckIns(activityId, query);
    const stats = await this.calculateActivityStats(
      activity as unknown as ActivityDocument & {
        participants: Array<{ user: PopulatedUser }>;
      },
      checkIns,
      query,
    );

    return {
      success: true,
      data: stats,
    };
  }

  private async getFilteredCheckIns(
    activityId: string,
    query: IStatsQueryParams,
  ): Promise<PopulatedCheckIn[]> {
    const checkInQuery: Record<string, any> = {
      activity: new Types.ObjectId(activityId),
    };

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
      checkInQuery.user = new Types.ObjectId(query.participantId);
    }

    if (query.checkInType) {
      checkInQuery.type = query.checkInType;
    }

    const checkIns = await this.checkInModel
      .find(checkInQuery)
      .populate<{ user: PopulatedUser }>({
        path: 'user',
        select: 'name email profilePicture',
      })
      .lean()
      .exec();

    return checkIns as unknown as PopulatedCheckIn[];
  }

  private async calculateActivityStats(
    activity: ActivityDocument & {
      participants: Array<{ user: PopulatedUser }>;
    },
    checkIns: PopulatedCheckIn[],
    query: IStatsQueryParams,
  ): Promise<IActivityStats> {
    const participantStats = await this.calculateParticipantStats(
      activity as unknown as Activity, // Type assertion since we know the structure matches
      checkIns,
    );
    const checkInsByType = this.calculateCheckInsByType(checkIns);
    const mostPopularCheckInType =
      this.getMostPopularCheckInType(checkInsByType);
    const checkInsByDay = this.calculateCheckInsByDay(checkIns);
    const mostActiveDay = this.getMostActiveDay(checkInsByDay);

    if (query.sortBy) {
      participantStats.sort((a, b) => {
        const order = query.sortOrder === 'desc' ? -1 : 1;
        const aValue = a[query.sortBy];
        const bValue = b[query.sortBy];

        if (aValue === undefined || bValue === undefined) {
          return 0;
        }

        if (aValue instanceof Date && bValue instanceof Date) {
          return (aValue.getTime() - bValue.getTime()) * order;
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return (aValue - bValue) * order;
        }

        const aStr = String(aValue);
        const bStr = String(bValue);
        return aStr.localeCompare(bStr) * order;
      });
    }

    const totalDurationInDays = this.calculateDurationInDays(
      activity.proposedDuration,
      activity.durationUnit,
    );

    return {
      totalCheckIns: checkIns.length,
      completionRate: this.calculateOverallCompletionRate(checkIns, activity),
      participantStats,
      checkInsByType,
      averageCompletionTime: this.calculateAverageCompletionTime(checkIns),
      mostActiveDay,
      mostPopularCheckInType,
      longestStreak: Math.max(0, ...participantStats.map((p) => p.streak)),
      totalDurationInDays,
      averageDurationInDays: totalDurationInDays / activity.participants.length,
      availableSeats: activity.maxSize - activity.currentSize,
      isJoinable: activity.isActive && activity.maxSize > activity.currentSize,
    };
  }

  private calculateStreak(checkIns: PopulatedCheckIn[]): number {
    if (!checkIns.length) return 0;

    const sortedCheckIns = [...checkIns].sort(
      (a, b) => b.date.getTime() - a.date.getTime(),
    );

    let streak = 1;
    for (let i = 1; i < sortedCheckIns.length; i++) {
      const dayDiff = Math.floor(
        (sortedCheckIns[i - 1].date.getTime() -
          sortedCheckIns[i].date.getTime()) /
          (1000 * 60 * 60 * 24),
      );
      if (dayDiff === 1) streak++;
      else break;
    }
    return streak;
  }

  private calculateAverageCompletionTime(checkIns: PopulatedCheckIn[]): number {
    const validCheckIns = checkIns.filter(
      (c) => c.createdAt instanceof Date && c.updatedAt instanceof Date,
    );

    if (!validCheckIns.length) return 0;

    const totalTime = validCheckIns.reduce(
      (sum, c) => sum + (c.updatedAt.getTime() - c.createdAt.getTime()),
      0,
    );

    return totalTime / validCheckIns.length;
  }

  private calculateCheckInsByDay(
    checkIns: PopulatedCheckIn[],
  ): Record<string, number> {
    return checkIns.reduce(
      (acc, checkIn) => {
        const day = checkIn.date.toLocaleDateString('en-US', {
          weekday: 'long',
        });
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  private getMostActiveDay(checkInsByDay: Record<string, number>): string {
    if (!Object.keys(checkInsByDay).length) return 'None';
    return Object.entries(checkInsByDay).reduce((a, b) =>
      a[1] > b[1] ? a : b,
    )[0];
  }

  private calculateCheckInsByType(
    checkIns: PopulatedCheckIn[],
  ): Record<CheckInType, number> {
    return Object.values(CheckInType).reduce(
      (acc, type) => {
        acc[type] = checkIns.filter((checkIn) => checkIn.type === type).length;
        return acc;
      },
      {} as Record<CheckInType, number>,
    );
  }

  private getMostPopularCheckInType(
    checkInsByType: Record<CheckInType, number>,
  ): CheckInType | null {
    if (!Object.keys(checkInsByType).length) return null;
    return Object.entries(checkInsByType).reduce((a, b) =>
      a[1] > b[1] ? a : b,
    )[0] as CheckInType;
  }

  async updateParticipantRole(
    activityId: string,
    adminUserId: string,
    { userId: targetUserId, role }: UpdateParticipantRoleDto,
  ): Promise<ActivityServiceResponse<ActivityResponseDto>> {
    const activity = await this.activityModel
      .findById(activityId)
      .populate('participants.user', 'id name email')
      .exec();

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    // Check if user is admin
    const isAdmin = await this.isUserActivityAdmin(activity, adminUserId);
    if (!isAdmin) {
      throw new ForbiddenException('Only admins can update participant roles');
    }

    // Find the target participant
    const participantIndex = activity.participants.findIndex((p) => {
      if (typeof p.user === 'object' && p.user) {
        return (p.user as any).id === targetUserId;
      }
      return p.user?.toString() === targetUserId;
    });

    if (participantIndex === -1) {
      throw new NotFoundException('Participant not found');
    }

    // Prevent changing own role
    if (targetUserId === adminUserId) {
      throw new BadRequestException('Cannot change your own role');
    }

    // Update the role
    activity.participants[participantIndex].role = role;
    const updatedActivity = await activity.save();

    return this.prepareActivityResponse(
      updatedActivity,
      'Successfully updated participant role',
    );
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
        if (activity.checkinDatesOfMonth) {
          return activity.checkinDatesOfMonth.includes(dateOfMonth);
        }
        if (activity.checkinDaysOfWeek && activity.checkinWeeksOfMonth) {
          return (
            dayOfWeek === activity.checkinDaysOfWeek[0] &&
            weekOfMonth === activity.checkinWeeksOfMonth[0]
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
  ): Promise<ActivityServiceResponse<ActivityCalendarResponse>> {
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
          days: activity.checkinDays || [],
          datesOfMonth: activity.checkinDatesOfMonth || [],
          dayOfWeek: activity.checkinDaysOfWeek || [],
          weeksOfMonth: activity.checkinWeeksOfMonth || [],
        },
      },
    };
  }

  private calculateAllowedCheckInDates(
    activity: Activity,
    startDate: Date,
    endDate: Date,
  ): Date[] {
    const allowedDates: Date[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      if (this.isCheckInAllowedForDate(activity, currentDate)) {
        allowedDates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return allowedDates;
  }

  async leaveActivity(
    activityId: string,
    userId: string,
  ): Promise<ActivityServiceResponse<ActivityResponseDto>> {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    const activity = await this.activityModel.findById(activityId).exec();

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    // Check if user is a participant
    const participantIndex = activity.participants.findIndex(
      (p) => p.user.toString() === userId,
    );

    if (participantIndex === -1) {
      throw new BadRequestException(
        'You are not a participant in this activity',
      );
    }

    // Check if user is admin
    if (activity.participants[participantIndex].role === ActivityRole.ADMIN) {
      throw new BadRequestException(
        'Activity admin cannot leave. Transfer admin role first or end the activity',
      );
    }

    // Remove participant and update size
    activity.participants.splice(participantIndex, 1);
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
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    const activity = await this.activityModel.findById(activityId).exec();

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    // Check if user is already a participant or admin
    const isParticipant = activity.participants.some((p) => {
      const participantId = this.getUserId(p.user);
      return participantId === userId;
    });

    if (isParticipant) {
      throw new BadRequestException(
        'You are already a participant in this activity',
      );
    }

    if (activity.currentSize >= activity.maxSize) {
      throw new BadRequestException('Activity is full');
    }

    if (!activity.isActive) {
      throw new BadRequestException('Activity is no longer active');
    }

    // For public activities, add user directly
    if (activity.type === ActivityType.PUBLIC) {
      const newParticipant = {
        user: new Types.ObjectId(userId),
        role: ActivityRole.MEMBER,
      };

      activity.participants.push(newParticipant as any);
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

  // Helper method to check admin status
  private async isUserActivityAdmin(
    activity: ActivityDocument | Activity,
    userId: string,
  ): Promise<boolean> {
    return activity.participants.some((p) => {
      if (typeof p.user === 'object' && p.user) {
        return (p.user as any).id === userId && p.role === ActivityRole.ADMIN;
      }
      return p.user?.toString() === userId && p.role === ActivityRole.ADMIN;
    });
  }

  async handleJoinRequest(
    activityId: string,
    userId: string,
    { userId: targetUserId, action }: HandleJoinRequestDto,
  ): Promise<ActivityServiceResponse<ActivityResponseDto>> {
    const activity = await this.activityModel
      .findById(activityId)
      .populate('participants.user', 'id name email')
      .exec();

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    // Check if user is admin
    const isAdmin = await this.isUserActivityAdmin(activity, userId);
    if (!isAdmin) {
      throw new ForbiddenException('Only admins can handle join requests');
    }

    // Find the join request
    const requestIndex = activity.joinRequests.findIndex(
      (request) => request.user.toString() === targetUserId,
    );

    if (requestIndex === -1) {
      throw new NotFoundException('Join request not found');
    }

    // Check if user is already a participant using proper type checking
    const isAlreadyParticipant = activity.participants.some((p) => {
      if (typeof p.user === 'object' && p.user) {
        return (p.user as any).id === targetUserId;
      }
      return p.user?.toString() === targetUserId;
    });

    if (isAlreadyParticipant) {
      // Remove the request since user is already a participant
      activity.joinRequests.splice(requestIndex, 1);
      await activity.save();
      throw new BadRequestException(
        'User is already a participant in this activity',
      );
    }

    // Remove the request regardless of action
    activity.joinRequests.splice(requestIndex, 1);

    if (action === JoinRequestAction.APPROVE) {
      if (activity.currentSize >= activity.maxSize) {
        throw new BadRequestException(
          'Activity is full. Increase activity size before approving join requests',
        );
      }

      // Add user as participant
      activity.participants.push({
        user: new Types.ObjectId(targetUserId),
        role: ActivityRole.MEMBER,
      } as any);
      activity.currentSize = activity.participants.length;
    }

    const updatedActivity = await activity.save();
    const actionText =
      action === JoinRequestAction.APPROVE ? 'approved' : 'rejected';

    return this.prepareActivityResponse(
      updatedActivity,
      `Successfully ${actionText} join request`,
    );
  }

  // Add helper method for participant or admin check
  private async isUserParticipantOrAdmin(
    activity: ActivityDocument,
    userId: string,
  ): Promise<boolean> {
    const isAdmin = await this.isUserActivityAdmin(activity, userId);
    const isParticipant = activity.participants.some((p) => {
      if (typeof p.user === 'object' && p.user) {
        return (p.user as any).id === userId;
      }
      return p.user?.toString() === userId;
    });

    return isAdmin || isParticipant;
  }

  async getActivityParticipants(
    activityId: string,
    userId?: string,
  ): Promise<ActivityServiceResponse<ParticipantDto[]>> {
    const activity = await this.activityModel
      .findById(activityId)
      .populate('participants.user', 'id name email profilePicture')
      .exec();

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    // For private activities, check if user is a participant
    if (activity.type === ActivityType.PRIVATE) {
      if (!userId) {
        throw new ForbiddenException(
          'Authentication required for private activities',
        );
      }

      const isParticipant = activity.participants.some(
        (p) => this.getUserId(p.user) === userId,
      );

      if (!isParticipant) {
        throw new ForbiddenException(
          'Only participants can view private activity details',
        );
      }
    }

    // Add proper type casting
    const participants: ParticipantDto[] = activity.participants.map(
      (participant) => ({
        user: this.transformToDto(
          participant.user,
          UserResponseDto,
        ) as UserResponseDto,
        role: participant.role,
      }),
    );

    return {
      success: true,
      message: 'Participants retrieved successfully',
      data: participants,
    };
  }

  private calculateOverallCompletionRate(
    checkIns: PopulatedCheckIn[],
    activity: Activity,
  ): number {
    if (!checkIns.length) return 0;

    const completedCheckIns = checkIns.filter((c) => {
      try {
        validateCheckInContent(c.type, c.content as CheckInContent, activity);
        return true;
      } catch {
        return false;
      }
    }).length;

    return (completedCheckIns / checkIns.length) * 100;
  }

  private async calculateParticipantStats(
    activity: Activity,
    checkIns: PopulatedCheckIn[],
  ): Promise<IParticipantStats[]> {
    return Promise.all(
      activity.participants.map(async (participant) => {
        const participantCheckIns = checkIns.filter(
          (c) => c.user._id.toString() === this.getUserId(participant.user),
        );

        const totalParticipantCheckIns = participantCheckIns.length;
        const completedParticipantCheckIns = participantCheckIns.filter((c) => {
          try {
            validateCheckInContent(
              c.type,
              c.content as CheckInContent,
              activity,
            );
            return true;
          } catch {
            return false;
          }
        }).length;

        const participantCompletionRate =
          totalParticipantCheckIns > 0
            ? (completedParticipantCheckIns / totalParticipantCheckIns) * 100
            : 0;

        const lastCheckIn = participantCheckIns.sort(
          (a, b) => b.date.getTime() - a.date.getTime(),
        )[0];

        return {
          userId: this.getUserId(participant.user),
          name: (participant.user as PopulatedUser).name,
          checkInCount: totalParticipantCheckIns,
          completionRate: participantCompletionRate,
          streak: this.calculateStreak(participantCheckIns),
          lastCheckIn: lastCheckIn?.date,
          averageCompletionTime:
            this.calculateAverageCompletionTime(participantCheckIns),
        };
      }),
    );
  }

  private validateCheckInType(type: CheckInType): void {
    const validTypes = [
      CheckInType.PHOTO,
      CheckInType.CHECKLIST,
      CheckInType.HOURS,
    ];

    if (!validTypes.includes(type)) {
      throw new BadRequestException(`Invalid check-in type: ${type}`);
    }
  }

  async getJoinRequests(
    activityId: string,
    userId: string,
  ): Promise<ActivityServiceResponse<JoinRequestResponseDto[]>> {
    const activity = await this.activityModel
      .findById(activityId)
      .populate('joinRequests.user', 'name email profilePicture')
      .exec();

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    // Check if user is admin
    const userParticipant = activity.participants.find(
      (p) => p.user.toString() === userId && p.role === ActivityRole.ADMIN,
    );

    if (!userParticipant) {
      throw new ForbiddenException(
        'Only activity admins can view join requests',
      );
    }

    const joinRequests = activity.joinRequests.map((request) => {
      const user = request.user as PopulatedUser;
      return {
        userId: user._id.toString(),
        userName: user.name,
        userProfilePicture: user.profilePicture,
        requestedAt: request.requestedAt,
      };
    });

    return {
      success: true,
      data: joinRequests,
    };
  }

  private isUserParticipant(activity: ActivityDocument, userId: string): boolean {
    // Add debug logging
    console.log('Checking participant status:', {
      userId,
      participants: activity.participants.map(p => ({
        participantId: this.getUserId(p.user),
        role: p.role
      }))
    });

    return activity.participants.some((p) => {
      const participantId = this.getUserId(p.user);
      const isMatch = participantId === userId;
      
      // Add debug logging
      console.log('Participant comparison:', {
        participantId,
        userId,
        isMatch
      });
      
      return isMatch;
    });
  }
}
