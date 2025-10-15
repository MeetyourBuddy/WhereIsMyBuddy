import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Milestone,
  MilestoneDocument,
  UserMilestone,
  UserMilestoneDocument,
  MilestoneType,
  MilestoneTier,
} from './schemas/milestone.schema';
import { CheckIn, CheckInDocument } from './schemas/checkin.schema';
import { Activity, ActivityDocument } from './schemas/activity.schema';

@Injectable()
export class MilestoneService {
  constructor(
    @InjectModel(Milestone.name)
    private milestoneModel: Model<MilestoneDocument>,
    @InjectModel(UserMilestone.name)
    private userMilestoneModel: Model<UserMilestoneDocument>,
    @InjectModel(CheckIn.name) private checkInModel: Model<CheckInDocument>,
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
  ) {}

  async initializeDefaultMilestones(): Promise<void> {
    const defaultMilestones = [
      // Streak Milestones
      {
        name: 'First Steps',
        description: 'Complete your first 3-day streak',
        type: MilestoneType.STREAK,
        tier: MilestoneTier.BRONZE,
        targetValue: 3,
        reward: 'Bronze Streak Badge',
        badgeIcon: '🔥',
        badgeColor: '#CD7F32',
        points: 10,
        unlockMessage: "Great start! You're building momentum!",
        celebrationMessage: "🎉 First Steps achieved! You're on fire!",
      },
      {
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        type: MilestoneType.STREAK,
        tier: MilestoneTier.SILVER,
        targetValue: 7,
        reward: 'Silver Streak Badge',
        badgeIcon: '⚡',
        badgeColor: '#C0C0C0',
        points: 25,
        unlockMessage: 'One week strong! Keep it up!',
        celebrationMessage: "🌟 Week Warrior! You're unstoppable!",
      },
      {
        name: 'Fortnight Fighter',
        description: 'Achieve a 14-day streak',
        type: MilestoneType.STREAK,
        tier: MilestoneTier.GOLD,
        targetValue: 14,
        reward: 'Gold Streak Badge',
        badgeIcon: '💎',
        badgeColor: '#FFD700',
        points: 50,
        unlockMessage: "Two weeks! You're becoming a legend!",
        celebrationMessage: "🏆 Fortnight Fighter! You're a champion!",
      },
      {
        name: 'Monthly Master',
        description: 'Reach a 30-day streak',
        type: MilestoneType.STREAK,
        tier: MilestoneTier.PLATINUM,
        targetValue: 30,
        reward: 'Platinum Streak Badge',
        badgeIcon: '👑',
        badgeColor: '#E5E4E2',
        points: 100,
        unlockMessage: "One month! You're a streak master!",
        celebrationMessage: "🎊 Monthly Master! You're incredible!",
      },
      {
        name: 'Century Champion',
        description: 'Achieve a 100-day streak',
        type: MilestoneType.STREAK,
        tier: MilestoneTier.DIAMOND,
        targetValue: 100,
        reward: 'Diamond Streak Badge',
        badgeIcon: '💠',
        badgeColor: '#B9F2FF',
        points: 500,
        unlockMessage: "100 days! You're a legend!",
        celebrationMessage: "🎆 Century Champion! You're absolutely legendary!",
      },
      // Check-in Milestones
      {
        name: 'Getting Started',
        description: 'Complete your first 5 check-ins',
        type: MilestoneType.CHECKINS,
        tier: MilestoneTier.BRONZE,
        targetValue: 5,
        reward: 'Bronze Check-in Badge',
        badgeIcon: '✅',
        badgeColor: '#CD7F32',
        points: 15,
        unlockMessage: "You're getting the hang of it!",
        celebrationMessage: "🎯 Getting Started! You're on the right track!",
      },
      {
        name: 'Consistent Contributor',
        description: 'Complete 25 check-ins',
        type: MilestoneType.CHECKINS,
        tier: MilestoneTier.SILVER,
        targetValue: 25,
        reward: 'Silver Check-in Badge',
        badgeIcon: '🎖️',
        badgeColor: '#C0C0C0',
        points: 40,
        unlockMessage: "Quarter century! You're consistent!",
        celebrationMessage: "🏅 Consistent Contributor! You're reliable!",
      },
      {
        name: 'Half Century Hero',
        description: 'Complete 50 check-ins',
        type: MilestoneType.CHECKINS,
        tier: MilestoneTier.GOLD,
        targetValue: 50,
        reward: 'Gold Check-in Badge',
        badgeIcon: '🏆',
        badgeColor: '#FFD700',
        points: 75,
        unlockMessage: "Half century! You're a hero!",
        celebrationMessage: "🥇 Half Century Hero! You're amazing!",
      },
      {
        name: 'Century Star',
        description: 'Complete 100 check-ins',
        type: MilestoneType.CHECKINS,
        tier: MilestoneTier.PLATINUM,
        targetValue: 100,
        reward: 'Platinum Check-in Badge',
        badgeIcon: '⭐',
        badgeColor: '#E5E4E2',
        points: 150,
        unlockMessage: "Century! You're a star!",
        celebrationMessage: "🌟 Century Star! You're phenomenal!",
      },
      {
        name: 'Check-in Legend',
        description: 'Complete 500 check-ins',
        type: MilestoneType.CHECKINS,
        tier: MilestoneTier.DIAMOND,
        targetValue: 500,
        reward: 'Diamond Check-in Badge',
        badgeIcon: '💫',
        badgeColor: '#B9F2FF',
        points: 750,
        unlockMessage: "500 check-ins! You're a legend!",
        celebrationMessage: "🎆 Check-in Legend! You're absolutely incredible!",
      },
    ];

    for (const milestoneData of defaultMilestones) {
      const existingMilestone = await this.milestoneModel.findOne({
        type: milestoneData.type,
        targetValue: milestoneData.targetValue,
      });

      if (!existingMilestone) {
        await this.milestoneModel.create(milestoneData);
      }
    }
  }

  async checkAndAwardMilestones(
    userId: string,
    activityId?: string,
  ): Promise<UserMilestone[]> {
    const newMilestones: UserMilestone[] = [];

    // Get user's current stats
    const userStats = await this.getUserStats(userId, activityId);

    // Get all active milestones
    const milestones = await this.milestoneModel.find({ isActive: true });

    for (const milestone of milestones) {
      // Check if user already has this milestone
      const existingUserMilestone = await this.userMilestoneModel.findOne({
        user: userId,
        milestone: milestone._id,
        activity: activityId || null,
      });

      if (existingUserMilestone) continue;

      // Check if user qualifies for this milestone
      let currentValue = 0;
      let progress = 0;

      switch (milestone.type) {
        case MilestoneType.STREAK:
          currentValue = userStats.currentStreak;
          break;
        case MilestoneType.CHECKINS:
          currentValue = userStats.totalCheckIns;
          break;
        case MilestoneType.COMPLETION:
          currentValue = userStats.completionPercentage;
          break;
        case MilestoneType.TIME_BASED:
          currentValue = userStats.timeBasedValue;
          break;
      }

      progress = Math.min(
        100,
        Math.round((currentValue / milestone.targetValue) * 100),
      );

      if (currentValue >= milestone.targetValue) {
        // Award the milestone
        const userMilestone = await this.userMilestoneModel.create({
          user: userId,
          milestone: milestone._id,
          activity: activityId || null,
          achievedAt: new Date(),
          progress: 100,
          currentValue,
        });

        newMilestones.push(userMilestone);
      }
    }

    return newMilestones;
  }

  async getUserMilestones(userId: string, activityId?: string): Promise<any[]> {
    const userMilestones = await this.userMilestoneModel
      .find({
        user: userId,
        activity: activityId || null,
      })
      .populate('milestone')
      .sort({ achievedAt: -1 })
      .exec();

    return userMilestones.map((um) => ({
      id: um._id,
      milestone: um.milestone,
      achievedAt: um.achievedAt,
      isNotified: um.isNotified,
      isClaimed: um.isClaimed,
      claimedAt: um.claimedAt,
      progress: um.progress,
      currentValue: um.currentValue,
    }));
  }

  async getUserMilestoneProgress(
    userId: string,
    activityId?: string,
  ): Promise<any[]> {
    const milestones = await this.milestoneModel.find({ isActive: true });
    const userStats = await this.getUserStats(userId, activityId);
    const userMilestones = await this.getUserMilestones(userId, activityId);

    const progressData = milestones.map((milestone) => {
      const userMilestone = userMilestones.find(
        (um) => um.milestone._id.toString() === milestone._id.toString(),
      );

      let currentValue = 0;
      switch (milestone.type) {
        case MilestoneType.STREAK:
          currentValue = userStats.currentStreak;
          break;
        case MilestoneType.CHECKINS:
          currentValue = userStats.totalCheckIns;
          break;
        case MilestoneType.COMPLETION:
          currentValue = userStats.completionPercentage;
          break;
        case MilestoneType.TIME_BASED:
          currentValue = userStats.timeBasedValue;
          break;
      }

      const progress = Math.min(
        100,
        Math.round((currentValue / milestone.targetValue) * 100),
      );
      const isAchieved = userMilestone !== undefined;

      return {
        milestone,
        currentValue,
        progress,
        isAchieved,
        achievedAt: userMilestone?.achievedAt,
        isNotified: userMilestone?.isNotified || false,
        isClaimed: userMilestone?.isClaimed || false,
      };
    });

    return progressData;
  }

  async claimMilestone(userId: string, milestoneId: string): Promise<void> {
    const userMilestone = await this.userMilestoneModel.findOne({
      user: userId,
      milestone: milestoneId,
    });

    if (!userMilestone) {
      throw new NotFoundException('Milestone not found');
    }

    if (userMilestone.isClaimed) {
      throw new BadRequestException('Milestone already claimed');
    }

    userMilestone.isClaimed = true;
    userMilestone.claimedAt = new Date();
    await userMilestone.save();
  }

  private async getUserStats(
    userId: string,
    activityId?: string,
  ): Promise<{
    currentStreak: number;
    totalCheckIns: number;
    completionPercentage: number;
    timeBasedValue: number;
  }> {
    // Get user's check-ins
    const checkInFilter: any = {
      user: userId,
      isDeleted: false,
    };

    if (activityId) {
      checkInFilter.activity = activityId;
    }

    const checkIns = await this.checkInModel
      .find(checkInFilter)
      .sort({ checkInDate: -1 })
      .exec();

    // Calculate current streak
    let currentStreak = 0;
    if (checkIns.length > 0) {
      const checkInsByDate = new Map<string, any[]>();
      checkIns.forEach((checkIn) => {
        const dateKey = new Date(checkIn.checkInDate).toDateString();
        if (!checkInsByDate.has(dateKey)) {
          checkInsByDate.set(dateKey, []);
        }
        checkInsByDate.get(dateKey)!.push(checkIn);
      });

      const sortedDates = Array.from(checkInsByDate.keys()).sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime(),
      );

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
    }

    // Calculate completion percentage
    let completionPercentage = 0;
    if (activityId) {
      const activity = await this.activityModel.findById(activityId);
      if (activity) {
        const totalAvailableCheckIns =
          this.calculateTotalAvailableCheckIns(activity);
        completionPercentage =
          totalAvailableCheckIns > 0
            ? Math.round((checkIns.length / totalAvailableCheckIns) * 100)
            : 0;
      }
    }

    return {
      currentStreak,
      totalCheckIns: checkIns.length,
      completionPercentage,
      timeBasedValue: 0, // Placeholder for future time-based milestones
    };
  }

  private calculateTotalAvailableCheckIns(activity: any): number {
    if (!activity.startDate || !activity.proposedDuration) return 0;

    const startDate = new Date(activity.startDate);
    const endDate = activity.endDate ? new Date(activity.endDate) : new Date();
    const duration = activity.proposedDuration;

    let periodDuration: number;
    switch (activity.checkinFrequencyUnit) {
      case 'daily':
        periodDuration = 1;
        break;
      case 'weekly':
        periodDuration = 7;
        break;
      case 'monthly':
        periodDuration = 30;
        break;
      default:
        periodDuration = 1;
    }

    const totalDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    return Math.floor(totalDays / (periodDuration * activity.checkinFrequency));
  }
}
