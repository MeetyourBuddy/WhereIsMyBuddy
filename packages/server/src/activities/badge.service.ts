import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Badge, BadgeDocument } from './schemas/badge.schema';
import { UserBadge, UserBadgeDocument } from './schemas/user-badge.schema';
import { CheckIn, CheckInDocument } from './schemas/checkin.schema';
import { Activity, ActivityDocument } from './schemas/activity.schema';
import {
  CreateBadgeDto,
  BadgeResponseDto,
  UserBadgeResponseDto,
} from './dto/badge.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class BadgeService {
  constructor(
    @InjectModel(Badge.name) private badgeModel: Model<BadgeDocument>,
    @InjectModel(UserBadge.name)
    private userBadgeModel: Model<UserBadgeDocument>,
    @InjectModel(CheckIn.name) private checkInModel: Model<CheckInDocument>,
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
  ) {}

  async createBadge(createBadgeDto: CreateBadgeDto): Promise<BadgeResponseDto> {
    const badge = new this.badgeModel(createBadgeDto);
    const savedBadge = await badge.save();
    return plainToClass(BadgeResponseDto, savedBadge.toObject(), {
      excludeExtraneousValues: true,
    });
  }

  async getAllBadges(): Promise<BadgeResponseDto[]> {
    const badges = await this.badgeModel.find({ isActive: true }).exec();
    return badges.map((badge) =>
      plainToClass(BadgeResponseDto, badge.toObject(), {
        excludeExtraneousValues: true,
      }),
    );
  }

  async getUserBadges(
    userId: string,
    activityId?: string,
  ): Promise<UserBadgeResponseDto[]> {
    const query: any = { user: userId };
    if (activityId) {
      query.activity = activityId;
    }

    const userBadges = await this.userBadgeModel
      .find(query)
      .populate('badge')
      .populate('activity')
      .sort({ earnedAt: -1 })
      .exec();

    return userBadges.map((userBadge) =>
      plainToClass(UserBadgeResponseDto, userBadge.toObject(), {
        excludeExtraneousValues: true,
      }),
    );
  }

  async checkAndAwardBadges(
    userId: string,
    activityId: string,
  ): Promise<UserBadgeResponseDto[]> {
    const awardedBadges: UserBadgeResponseDto[] = [];

    // Get all active badges
    const badges = await this.badgeModel.find({ isActive: true }).exec();

    for (const badge of badges) {
      // Check if user already has this badge for this activity
      const existingUserBadge = await this.userBadgeModel
        .findOne({
          user: userId,
          badge: badge._id,
          activity: activityId,
        })
        .exec();

      if (existingUserBadge) continue;

      // Check if user meets the criteria
      const meetsCriteria = await this.checkBadgeCriteria(
        userId,
        activityId,
        badge.criteria,
      );

      if (meetsCriteria) {
        // Award the badge
        const userBadge = new this.userBadgeModel({
          user: userId,
          badge: badge._id,
          activity: activityId,
          earnedAt: new Date(),
        });

        const savedUserBadge = await userBadge.save();
        await savedUserBadge.populate('badge');

        const userBadgeResponse = plainToClass(
          UserBadgeResponseDto,
          savedUserBadge.toObject(),
          { excludeExtraneousValues: true },
        );

        awardedBadges.push(userBadgeResponse);
      }
    }

    return awardedBadges;
  }

  private async checkBadgeCriteria(
    userId: string,
    activityId: string,
    criteria: any,
  ): Promise<boolean> {
    switch (criteria.type) {
      case 'checkins':
        const checkInCount = await this.checkInModel.countDocuments({
          user: userId,
          activity: activityId,
          isDeleted: false,
        });
        return checkInCount >= criteria.value;

      case 'streak':
        const userCheckIns = await this.checkInModel
          .find({
            user: userId,
            activity: activityId,
            isDeleted: false,
          })
          .sort({ checkInDate: 1 })
          .exec();

        const currentStreak = this.calculateUserStreak(userCheckIns);
        return currentStreak >= criteria.value;

      case 'progress':
        const activity = await this.activityModel.findById(activityId).exec();
        if (!activity) return false;

        const progress = this.calculateActivityProgress(activity);
        return progress >= criteria.value;

      case 'onTime':
        const onTimeCheckIns = await this.checkInModel.countDocuments({
          user: userId,
          activity: activityId,
          isDeleted: false,
          isOnTime: true,
        });
        return onTimeCheckIns >= criteria.value;

      case 'activity_completion':
        const activity2 = await this.activityModel.findById(activityId).exec();
        if (!activity2) return false;

        const progress2 = this.calculateActivityProgress(activity2);
        return progress2 >= 100;

      default:
        return false;
    }
  }

  private calculateUserStreak(checkIns: any[]): number {
    if (checkIns.length === 0) return 0;

    // Group check-ins by date
    const checkInsByDate = new Map<string, any[]>();
    checkIns.forEach((checkIn) => {
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

    return currentStreak;
  }

  private calculateActivityProgress(activity: any): number {
    if (!activity.proposedDuration || !activity.startDate) return 0;

    const now = new Date();
    const startDate = new Date(activity.startDate);
    const endDate = activity.endDate
      ? new Date(activity.endDate)
      : new Date(
          startDate.getTime() +
            activity.proposedDuration * 30 * 24 * 60 * 60 * 1000,
        );

    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsedTime = now.getTime() - startDate.getTime();

    if (elapsedTime <= 0) return 0;
    if (elapsedTime >= totalDuration) return 100;

    return Math.round((elapsedTime / totalDuration) * 100);
  }

  async seedDefaultBadges(): Promise<void> {
    const defaultBadges = [
      {
        name: 'First Check-in',
        description: 'Complete your first check-in',
        icon: 'CheckCircle',
        color: '#10B981',
        criteria: {
          type: 'checkins',
          value: 1,
          description: 'Complete 1 check-in',
        },
        rarity: 1,
        tags: ['beginner', 'milestone'],
      },
      {
        name: '3-Day Streak',
        description: 'Maintain a 3-day check-in streak',
        icon: 'Flame',
        color: '#F59E0B',
        criteria: {
          type: 'streak',
          value: 3,
          description: 'Maintain a 3-day streak',
        },
        rarity: 2,
        tags: ['streak', 'consistency'],
      },
      {
        name: '7-Day Streak',
        description: 'Maintain a 7-day check-in streak',
        icon: 'Flame',
        color: '#EF4444',
        criteria: {
          type: 'streak',
          value: 7,
          description: 'Maintain a 7-day streak',
        },
        rarity: 3,
        tags: ['streak', 'consistency', 'dedication'],
      },
      {
        name: 'Half-way Hero',
        description: 'Reach 50% activity progress',
        icon: 'Award',
        color: '#8B5CF6',
        criteria: {
          type: 'progress',
          value: 50,
          description: 'Reach 50% activity progress',
        },
        rarity: 2,
        tags: ['progress', 'milestone'],
      },
      {
        name: 'Completion Star',
        description: 'Complete an entire activity',
        icon: 'Star',
        color: '#3B82F6',
        criteria: {
          type: 'activity_completion',
          value: 100,
          description: 'Complete an entire activity',
        },
        rarity: 4,
        tags: ['completion', 'achievement', 'milestone'],
      },
      {
        name: 'On-Time Champion',
        description: 'Complete 10 on-time check-ins',
        icon: 'Clock',
        color: '#06B6D4',
        criteria: {
          type: 'onTime',
          value: 10,
          description: 'Complete 10 on-time check-ins',
        },
        rarity: 3,
        tags: ['punctuality', 'consistency'],
      },
      // Streak milestone badges
      {
        name: 'First Steps',
        description: 'Achieve a 3-day streak',
        icon: 'Flame',
        color: '#F59E0B',
        criteria: {
          type: 'streak',
          value: 3,
          description: 'Achieve a 3-day streak',
        },
        rarity: 1,
        tags: ['streak', 'beginner'],
      },
      {
        name: 'Week Warrior',
        description: 'Achieve a 7-day streak',
        icon: 'Flame',
        color: '#EF4444',
        criteria: {
          type: 'streak',
          value: 7,
          description: 'Achieve a 7-day streak',
        },
        rarity: 2,
        tags: ['streak', 'dedication'],
      },
      {
        name: 'Fortnight Fighter',
        description: 'Achieve a 14-day streak',
        icon: 'Flame',
        color: '#DC2626',
        criteria: {
          type: 'streak',
          value: 14,
          description: 'Achieve a 14-day streak',
        },
        rarity: 3,
        tags: ['streak', 'commitment'],
      },
      {
        name: 'Monthly Master',
        description: 'Achieve a 30-day streak',
        icon: 'Flame',
        color: '#991B1B',
        criteria: {
          type: 'streak',
          value: 30,
          description: 'Achieve a 30-day streak',
        },
        rarity: 4,
        tags: ['streak', 'mastery'],
      },
      {
        name: 'Streak Legend',
        description: 'Achieve a 100-day streak',
        icon: 'Flame',
        color: '#7C2D12',
        criteria: {
          type: 'streak',
          value: 100,
          description: 'Achieve a 100-day streak',
        },
        rarity: 5,
        tags: ['streak', 'legendary'],
      },
    ];

    for (const badgeData of defaultBadges) {
      const existingBadge = await this.badgeModel
        .findOne({ name: badgeData.name })
        .exec();
      if (!existingBadge) {
        await this.badgeModel.create(badgeData);
      }
    }
  }
}
