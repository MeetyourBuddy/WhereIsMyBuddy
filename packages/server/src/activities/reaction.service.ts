import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Reaction, ReactionDocument } from './schemas/reaction.schema';
import { CheckIn, CheckInDocument } from './schemas/checkin.schema';

export interface ReactionStats {
  like: number;
  love: number;
  fire: number;
  star: number;
  celebrate: number;
  rocket: number;
  total: number;
}

export interface UserReaction {
  type: string;
  hasReacted: boolean;
}

@Injectable()
export class ReactionService {
  constructor(
    @InjectModel(Reaction.name) private reactionModel: Model<ReactionDocument>,
    @InjectModel(CheckIn.name) private checkInModel: Model<CheckInDocument>,
  ) {}

  async addReaction(
    checkInId: string,
    userId: string,
    reactionType: string,
  ): Promise<ReactionStats> {
    if (!Types.ObjectId.isValid(checkInId)) {
      throw new BadRequestException('Invalid check-in ID');
    }

    // Verify check-in exists
    const checkIn = await this.checkInModel.findById(checkInId).exec();
    if (!checkIn || checkIn.isDeleted) {
      throw new NotFoundException('Check-in not found');
    }

    // Remove any existing reaction from this user
    await this.reactionModel
      .deleteOne({
        checkIn: checkInId,
        user: userId,
      })
      .exec();

    // Add new reaction
    const reaction = new this.reactionModel({
      checkIn: checkInId,
      user: userId,
      type: reactionType,
    });

    await reaction.save();

    // Return updated reaction stats
    return this.getReactionStats(checkInId, userId);
  }

  async removeReaction(
    checkInId: string,
    userId: string,
  ): Promise<ReactionStats> {
    if (!Types.ObjectId.isValid(checkInId)) {
      throw new BadRequestException('Invalid check-in ID');
    }

    // Remove reaction
    await this.reactionModel
      .deleteOne({
        checkIn: checkInId,
        user: userId,
      })
      .exec();

    // Return updated reaction stats
    return this.getReactionStats(checkInId, userId);
  }

  async getReactionStats(
    checkInId: string,
    userId?: string,
  ): Promise<ReactionStats> {
    if (!Types.ObjectId.isValid(checkInId)) {
      throw new BadRequestException('Invalid check-in ID');
    }

    const reactions = await this.reactionModel
      .find({ checkIn: checkInId })
      .exec();

    const stats: ReactionStats = {
      like: 0,
      love: 0,
      fire: 0,
      star: 0,
      celebrate: 0,
      rocket: 0,
      total: reactions.length,
    };

    reactions.forEach((reaction) => {
      if (reaction.type in stats) {
        stats[reaction.type as keyof ReactionStats]++;
      }
    });

    return stats;
  }

  async getUserReaction(
    checkInId: string,
    userId: string,
  ): Promise<UserReaction | null> {
    if (!Types.ObjectId.isValid(checkInId)) {
      throw new BadRequestException('Invalid check-in ID');
    }

    const reaction = await this.reactionModel
      .findOne({
        checkIn: checkInId,
        user: userId,
      })
      .exec();

    if (!reaction) {
      return null;
    }

    return {
      type: reaction.type,
      hasReacted: true,
    };
  }

  async getReactionsForCheckIn(checkInId: string): Promise<Reaction[]> {
    if (!Types.ObjectId.isValid(checkInId)) {
      throw new BadRequestException('Invalid check-in ID');
    }

    return this.reactionModel
      .find({ checkIn: checkInId })
      .populate('user', '_id name avatar')
      .exec();
  }
}
