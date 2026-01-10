import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserBadgeDocument = UserBadge & Document;

@Schema({ timestamps: true })
export class UserBadge {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Badge', required: true })
  badge: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  earnedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'Activity' })
  activity?: Types.ObjectId;

  @Prop({ default: false })
  isDisplayed: boolean;

  @Prop({ default: false })
  isShared: boolean;

  // Virtual fields
  createdAt: Date;
  updatedAt: Date;
}

export const UserBadgeSchema = SchemaFactory.createForClass(UserBadge);

// Create compound index to prevent duplicate badges
UserBadgeSchema.index({ user: 1, badge: 1, activity: 1 }, { unique: true });
