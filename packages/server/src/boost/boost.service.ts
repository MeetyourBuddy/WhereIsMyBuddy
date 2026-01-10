import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BoostMessage,
  BoostMessageDocument,
} from './schemas/boost-message.schema';
import { BoostStats, BoostStatsDocument } from './schemas/boost-stats.schema';
import { BoostBadge, BoostBadgeDocument } from './schemas/boost-badge.schema';
import { SendBoostDto } from './dto/send-boost.dto';

@Injectable()
export class BoostService {
  constructor(
    @InjectModel(BoostMessage.name)
    private boostMessageModel: Model<BoostMessageDocument>,
    @InjectModel(BoostStats.name)
    private boostStatsModel: Model<BoostStatsDocument>,
    @InjectModel(BoostBadge.name)
    private boostBadgeModel: Model<BoostBadgeDocument>,
  ) {}

  // Send a boost message
  async sendBoost(
    senderId: string,
    sendBoostDto: SendBoostDto,
  ): Promise<BoostMessage> {
    const { recipientId, messageId, activityId } = sendBoostDto;

    // Check if sender has remaining boosts for today
    const senderStats = await this.getOrCreateBoostStats(senderId);
    if (senderStats.dailyUsed >= senderStats.dailyLimit) {
      throw new BadRequestException('Daily boost limit reached');
    }

    // Validate message ID (ensure it's one of the predefined messages)
    const validMessageIds = [
      'energy-1',
      'energy-2',
      'energy-3',
      'strength-1',
      'strength-2',
      'strength-3',
      'celebration-1',
      'celebration-2',
      'celebration-3',
      'support-1',
      'support-2',
      'support-3',
      'focus-1',
      'focus-2',
      'focus-3',
    ];

    if (!validMessageIds.includes(messageId)) {
      throw new BadRequestException('Invalid boost message');
    }

    // Create boost message
    const boostMessage = new this.boostMessageModel({
      senderId,
      recipientId,
      messageId,
      activityId,
      timestamp: new Date(),
      read: false,
    });

    const savedBoost = await boostMessage.save();

    // Update sender stats
    await this.updateBoostStats(senderId, 'sent');

    // Update recipient stats
    await this.updateBoostStats(recipientId, 'received');

    // Check for badge achievements
    await this.checkBadgeAchievements(senderId);
    await this.checkBadgeAchievements(recipientId);

    return savedBoost;
  }

  // Get boost messages received by a user
  async getReceivedBoosts(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    boosts: BoostMessage[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [boosts, total] = await Promise.all([
      this.boostMessageModel
        .find({ recipientId: userId })
        .populate('senderId', 'name avatar')
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.boostMessageModel.countDocuments({ recipientId: userId }),
    ]);

    return {
      boosts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Get boost messages sent by a user
  async getSentBoosts(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    boosts: BoostMessage[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const [boosts, total] = await Promise.all([
      this.boostMessageModel
        .find({ senderId: userId })
        .populate('recipientId', 'name avatar')
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.boostMessageModel.countDocuments({ senderId: userId }),
    ]);

    return {
      boosts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Get user's boost statistics
  async getBoostStats(userId: string): Promise<BoostStats> {
    return this.getOrCreateBoostStats(userId);
  }

  // Get user's boost badges
  async getBoostBadges(userId: string): Promise<BoostBadge[]> {
    return this.boostBadgeModel.find({ userId }).sort({ earnedDate: -1 });
  }

  // Get boost leaderboard
  async getBoostLeaderboard(limit: number = 10): Promise<{
    topSenders: Array<{
      userId: string;
      totalSent: number;
      name: string;
      avatar?: string;
    }>;
    topReceivers: Array<{
      userId: string;
      totalReceived: number;
      name: string;
      avatar?: string;
    }>;
  }> {
    const [topSenders, topReceivers] = await Promise.all([
      this.boostStatsModel
        .find()
        .populate('userId', 'name avatar')
        .sort({ totalSent: -1 })
        .limit(limit)
        .exec(),
      this.boostStatsModel
        .find()
        .populate('userId', 'name avatar')
        .sort({ totalReceived: -1 })
        .limit(limit)
        .exec(),
    ]);

    return {
      topSenders: topSenders.map((stat: any) => ({
        userId: stat.userId._id.toString(),
        totalSent: stat.totalSent,
        name: stat.userId.name,
        avatar: stat.userId.avatar,
      })),
      topReceivers: topReceivers.map((stat: any) => ({
        userId: stat.userId._id.toString(),
        totalReceived: stat.totalReceived,
        name: stat.userId.name,
        avatar: stat.userId.avatar,
      })),
    };
  }

  // Mark boost as read
  async markBoostAsRead(boostId: string, userId: string): Promise<void> {
    const boost = await this.boostMessageModel.findOneAndUpdate(
      { _id: boostId, recipientId: userId },
      { read: true },
      { new: true },
    );

    if (!boost) {
      throw new NotFoundException('Boost message not found');
    }
  }

  // Get or create boost stats for a user
  private async getOrCreateBoostStats(
    userId: string,
  ): Promise<BoostStatsDocument> {
    let stats = await this.boostStatsModel.findOne({ userId });

    if (!stats) {
      stats = new this.boostStatsModel({
        userId,
        totalSent: 0,
        totalReceived: 0,
        currentStreak: 0,
        longestStreak: 0,
        dailyLimit: 3, // Default limit
        dailyUsed: 0,
        lastResetDate: new Date(),
      });
      await stats.save();
    }

    // Reset daily counter if it's a new day
    const today = new Date();
    const lastReset = new Date(stats.lastResetDate);
    if (today.toDateString() !== lastReset.toDateString()) {
      stats.dailyUsed = 0;
      stats.lastResetDate = today;
      await stats.save();
    }

    return stats;
  }

  // Update boost statistics
  private async updateBoostStats(
    userId: string,
    type: 'sent' | 'received',
  ): Promise<void> {
    const stats = await this.getOrCreateBoostStats(userId);

    if (type === 'sent') {
      stats.totalSent += 1;
      stats.dailyUsed += 1;
    } else {
      stats.totalReceived += 1;
    }

    await stats.save();
  }

  // Check for badge achievements
  private async checkBadgeAchievements(userId: string): Promise<void> {
    const stats = await this.getOrCreateBoostStats(userId);
    const existingBadges = await this.boostBadgeModel.find({ userId });
    const existingBadgeIds = existingBadges.map((badge) => badge.badgeId);

    const badgeDefinitions = [
      {
        id: 'first-boost',
        name: 'First Booster',
        condition: () => stats.totalSent >= 1,
      },
      {
        id: 'daily-giver',
        name: 'Daily Giver',
        condition: () => stats.currentStreak >= 7,
      },
      {
        id: 'week-warrior',
        name: 'Week Warrior',
        condition: () => stats.currentStreak >= 30,
      },
      {
        id: 'community-builder',
        name: 'Community Builder',
        condition: () => stats.totalSent >= 100,
      },
      {
        id: 'motivator',
        name: 'Motivator',
        condition: () => stats.totalReceived >= 50,
      },
      {
        id: 'inspiration',
        name: 'Inspiration',
        condition: () => stats.totalReceived >= 100,
      },
      {
        id: 'boost-master',
        name: 'Boost Master',
        condition: () => stats.totalSent >= 500,
      },
      {
        id: 'support-legend',
        name: 'Support Legend',
        condition: () => stats.totalSent >= 1000,
      },
    ];

    for (const badge of badgeDefinitions) {
      if (!existingBadgeIds.includes(badge.id) && badge.condition()) {
        const newBadge = new this.boostBadgeModel({
          userId,
          badgeId: badge.id,
          badgeName: badge.name,
          earnedDate: new Date(),
          isVisible: true,
        });
        await newBadge.save();
      }
    }
  }
}
