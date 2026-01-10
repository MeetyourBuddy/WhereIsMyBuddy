import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ActivityMessageDocument = ActivityMessage & Document;

@Schema({ timestamps: true })
export class ActivityMessage {
  @Prop({ type: Types.ObjectId, ref: 'Activity', required: true })
  activityId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, maxlength: 500 })
  content: string;

  @Prop({ default: 0 })
  likes: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  likedBy: Types.ObjectId[];

  @Prop({ default: false })
  isPinned: boolean;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const ActivityMessageSchema =
  SchemaFactory.createForClass(ActivityMessage);

// Create indexes for better performance
ActivityMessageSchema.index({ activityId: 1, createdAt: -1 });
ActivityMessageSchema.index({ activityId: 1, isPinned: -1, createdAt: -1 });
ActivityMessageSchema.index({ userId: 1 });
ActivityMessageSchema.index({ tags: 1 });
