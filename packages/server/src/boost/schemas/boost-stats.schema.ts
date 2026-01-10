import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BoostStatsDocument = BoostStats & Document;

@Schema({ timestamps: true })
export class BoostStats {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ default: 0 })
  totalSent: number;

  @Prop({ default: 0 })
  totalReceived: number;

  @Prop({ default: 0 })
  currentStreak: number;

  @Prop({ default: 0 })
  longestStreak: number;

  @Prop({ default: 3 })
  dailyLimit: number;

  @Prop({ default: 0 })
  dailyUsed: number;

  @Prop({ default: Date.now })
  lastResetDate: Date;
}

export const BoostStatsSchema = SchemaFactory.createForClass(BoostStats);
