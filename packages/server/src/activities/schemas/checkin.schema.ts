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

  @Prop({
    type: String,
    enum: CheckInType,
    required: true,
    validate: {
      validator: async function (type: CheckInType) {
        const activity = await this.model('Activity').findById(this.activity);
        return activity.allowedCheckInTypes.includes(type);
      },
      message: 'This type of check-in is not allowed for this activity',
    },
  })
  type: CheckInType;

  @Prop({ required: true })
  content: string; // Will store different content based on type (photo URL, hours, text, etc.)

  @Prop({ required: true })
  date: Date;

  @Prop({ required: false })
  comment: string;

  @Prop({ default: false })
  isCompleted: boolean;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  verifiedBy?: User;
}

export const CheckInSchema = SchemaFactory.createForClass(CheckIn);
