import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ActivityJoinRequestDocument = ActivityJoinRequest & Document;

@Schema({ timestamps: true })
export class ActivityJoinRequest {
  @Prop({ type: Types.ObjectId, ref: 'Activity', required: true })
  activityId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: false, maxlength: 500 })
  message?: string;

  @Prop({
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending',
  })
  status: 'pending' | 'accepted' | 'declined';

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const ActivityJoinRequestSchema =
  SchemaFactory.createForClass(ActivityJoinRequest);

ActivityJoinRequestSchema.index({ activityId: 1, userId: 1 }, { unique: true });
ActivityJoinRequestSchema.index({ activityId: 1, status: 1 });
ActivityJoinRequestSchema.index({ userId: 1, status: 1 });
