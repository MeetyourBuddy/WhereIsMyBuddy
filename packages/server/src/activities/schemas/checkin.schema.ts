import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { CheckInType } from './activity.schema';

export type CheckInDocument = CheckIn & Document;

interface PhotoContent {
  imageUrl: string;
  caption?: string;
}

interface ChecklistContent {
  items: Array<{
    text: string;
    completed: boolean;
    required: boolean;
  }>;
}

interface HoursContent {
  hours: number;
}

@Schema({
  timestamps: true,
})
export class CheckIn extends Document {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  user: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Activity',
    required: true,
    index: true,
  })
  activity: Types.ObjectId;

  @Prop({ required: true, type: Date })
  date: Date;

  @Prop({
    type: String,
    enum: CheckInType,
    required: true,
  })
  type: CheckInType;

  @Prop({
    type: MongooseSchema.Types.Mixed,
    required: true,
  })
  content: PhotoContent | ChecklistContent | HoursContent;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    index: true,
  })
  verifiedBy?: Types.ObjectId;

  @Prop({ type: Date })
  verifiedAt?: Date;

  @Prop({ type: String, required: false })
  status?: string;
}

export const CheckInSchema = SchemaFactory.createForClass(CheckIn);
