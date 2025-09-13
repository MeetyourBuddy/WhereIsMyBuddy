import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BoostBadgeDocument = BoostBadge & Document;

@Schema({ timestamps: true })
export class BoostBadge {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  badgeId: string;

  @Prop({ required: true })
  badgeName: string;

  @Prop({ default: Date.now })
  earnedDate: Date;

  @Prop({ default: true })
  isVisible: boolean;
}

export const BoostBadgeSchema = SchemaFactory.createForClass(BoostBadge);
