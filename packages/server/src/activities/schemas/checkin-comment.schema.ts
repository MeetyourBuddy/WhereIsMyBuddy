import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CheckInCommentDocument = CheckInComment & Document;

@Schema({ timestamps: true })
export class CheckInComment {
  @Prop({ type: Types.ObjectId, ref: 'CheckIn', required: true })
  checkIn: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: String, required: true, maxlength: 500 })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'CheckInComment', required: false })
  parentComment?: Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Date, required: false })
  deletedAt?: Date;

  // Virtual fields for population
  createdAt: Date;
  updatedAt: Date;
}

export const CheckInCommentSchema =
  SchemaFactory.createForClass(CheckInComment);

// Add indexes for better performance
CheckInCommentSchema.index({ checkIn: 1, createdAt: -1 });
CheckInCommentSchema.index({ user: 1 });
CheckInCommentSchema.index({ parentComment: 1 });
