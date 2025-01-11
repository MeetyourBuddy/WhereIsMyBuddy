import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type ActivityDocument = Activity & Document;

export enum ActivityType {
  PRIVATE = 'private',
  PUBLIC = 'public',
  PUBLIC = 'public',
}

export enum JoinType {
  FLEXIBLE = 'flexible',
  FIXED = 'fixed',
  FIXED = 'fixed',
}

export enum CheckinFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  OTHER = 'other',
}

export enum DurationUnit {
  DAYS = 'days',
  MONTHS = 'months',
}

export enum ActivityRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

@Schema({
  timestamps: true,
})
export class Activity extends Document {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  admin: User | MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  proposedDuration: number;

  @Prop({
    type: String,
    enum: DurationUnit,
    required: true,
    default: DurationUnit.DAYS,
  })
  durationUnit: DurationUnit;

  @Prop({ required: false })
  proposedDurationInDays?: number;

  @Prop({ trim: true })
  bannerImage?: string;

  @Prop({
    type: String,
    enum: CheckinFrequency,
    required: false,
    default: CheckinFrequency.WEEKLY,
  })
  contactFrequency: CheckinFrequency;

  @Prop({
  @Prop({
    type: String,
    enum: ActivityType,
    required: true,
    default: ActivityType.PUBLIC,
    default: ActivityType.PUBLIC,
  })
  type: ActivityType;

  @Prop({ type: Date, required: false })
  startDate: Date;

  @Prop({
  @Prop({
    type: String,
    enum: JoinType,
    required: false,
    default: JoinType.FLEXIBLE,
    default: JoinType.FLEXIBLE,
  })
  joinType: JoinType;

  @Prop({ required: true, min: 1 })
  maxSize: number;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({
    type: [
      {
        rule: { type: String, required: false },
        isDefault: { type: Boolean, default: false },
      },
    ],
    type: [
      {
        rule: { type: String, required: false },
        isDefault: { type: Boolean, default: false },
      },
    ],
    default: [
      { rule: 'Be respectful to all participants', isDefault: true },
      { rule: 'Maintain regular communication', isDefault: true },
      { rule: 'Inform in advance if unable to attend', isDefault: true },
    ],
      { rule: 'Inform in advance if unable to attend', isDefault: true },
    ],
  })
  rules: Array<{ rule: string; isDefault: boolean }>;

  @Prop({
    type: [
      {
        user: { type: MongooseSchema.Types.ObjectId, ref: 'User' },
        role: {
          type: String,
          enum: ActivityRole,
          default: ActivityRole.MEMBER,
        },
      },
    ],
    default: [],
  })
  participants: Array<{
    user: User | MongooseSchema.Types.ObjectId;
    role: ActivityRole;
  }>;

  @Prop({ default: 0 })
  currentSize: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Date })
  endedAt?: Date;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);

ActivitySchema.index({ title: 'text', description: 'text', tags: 'text' });

ActivitySchema.virtual('availableSeats').get(function () {
  return this.maxSize - this.currentSize;
});
