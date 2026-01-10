import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export enum MilestoneType {
  STREAK = 'streak',
  CHECKINS = 'checkins',
  COMPLETION = 'completion',
  TIME_BASED = 'time_based',
}

export enum MilestoneTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
  DIAMOND = 'diamond',
}

@Schema({ timestamps: true })
export class Milestone {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: MilestoneType })
  type: MilestoneType;

  @Prop({ required: true, enum: MilestoneTier })
  tier: MilestoneTier;

  @Prop({ required: true })
  targetValue: number;

  @Prop({ required: true })
  reward: string;

  @Prop()
  badgeIcon?: string;

  @Prop()
  badgeColor?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  points: number;

  @Prop()
  unlockMessage?: string;

  @Prop()
  celebrationMessage?: string;
}

@Schema({ timestamps: true })
export class UserMilestone {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId | User;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Milestone',
    required: true,
  })
  milestone: Types.ObjectId | Milestone;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Activity' })
  activity?: Types.ObjectId;

  @Prop({ required: true })
  achievedAt: Date;

  @Prop({ default: false })
  isNotified: boolean;

  @Prop({ default: false })
  isClaimed: boolean;

  @Prop()
  claimedAt?: Date;

  @Prop({ default: 0 })
  progress: number;

  @Prop({ default: 0 })
  currentValue: number;
}

export const MilestoneSchema = SchemaFactory.createForClass(Milestone);
export const UserMilestoneSchema = SchemaFactory.createForClass(UserMilestone);

export type MilestoneDocument = Milestone & Document;
export type UserMilestoneDocument = UserMilestone & Document;
