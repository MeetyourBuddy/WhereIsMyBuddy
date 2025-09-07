import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CheckInDocument = CheckIn & Document;

@Schema({ timestamps: true })
export class CheckIn {
  @Prop({ type: Types.ObjectId, ref: 'Activity', required: true })
  activity: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['text', 'image'],
    required: true,
  })
  type: 'text' | 'image';

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String, required: false })
  imageUrl?: string;

  @Prop({ type: String, required: false })
  fileId?: string;

  @Prop({ type: Date, required: true })
  scheduledDate: Date;

  @Prop({ type: Date, default: Date.now })
  checkInDate: Date;

  @Prop({ type: Boolean, default: true })
  isOnTime: boolean;

  @Prop({ type: Number, default: 0 })
  likes: number;

  @Prop([{ type: Types.ObjectId, ref: 'User' }])
  likedBy: Types.ObjectId[];

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Date, required: false })
  deletedAt?: Date;

  // Virtual fields for population
  createdAt: Date;
  updatedAt: Date;
}

export const CheckInSchema = SchemaFactory.createForClass(CheckIn);

// Index for efficient queries
CheckInSchema.index({ activity: 1, user: 1, scheduledDate: 1 });
CheckInSchema.index({ user: 1, checkInDate: -1 });
CheckInSchema.index({ activity: 1, checkInDate: -1 });
