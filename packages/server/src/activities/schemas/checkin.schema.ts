import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Activity } from './activity.schema';

export type CheckInDocument = CheckIn & Document;

export enum CheckInType {
  PHOTO = 'photo',
  CHECKLIST = 'checklist',
  HOURS = 'hours',
  OTHER = 'other',
}

@Schema({
  timestamps: true,
})
export class CheckIn {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User | MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Activity',
    required: true,
  })
  activity: Activity | MongooseSchema.Types.ObjectId;

  @Prop({ type: [String], enum: CheckInType, required: true })
  types: CheckInType[];

  @Prop({
    type: {
      imageUrl: String,
      guidelines: String,
    },
    required: false,
  })
  photo?: {
    imageUrl: string;
    guidelines: string;
  };

  @Prop({
    type: [
      {
        item: { type: String, required: true },
        completed: { type: Boolean, default: false },
      },
    ],
    required: false,
  })
  checklist?: Array<{
    item: string;
    completed: boolean;
  }>;

  @Prop({
    type: {
      hours: Number,
      min: Number,
      max: Number,
    },
    required: false,
  })
  hours?: {
    hours: number;
    min: number;
    max: number;
  };

  @Prop({
    type: {
      description: String,
      value: String,
    },
    required: false,
  })
  other?: {
    description: string;
    value: string;
  };

  @Prop({ default: false })
  isCompleted: boolean;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  verifiedBy?: User;
}

export const CheckInSchema = SchemaFactory.createForClass(CheckIn);
