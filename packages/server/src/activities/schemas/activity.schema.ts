import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import * as mongoose from 'mongoose';

export type ActivityDocument = Activity & Document;

export enum ActivityType {
  PRIVATE = 'private',
  PUBLIC = 'public',
}

export enum JoinType {
  FLEXIBLE = 'flexible',
  FIXED = 'fixed',
}

export enum CheckinFrequencyUnit {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  OTHER = 'other',
}

export enum DayOfWeek {
  SUNDAY = 'sunday',
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
}

export enum DurationUnit {
  DAYS = 'days',
  MONTHS = 'months',
}

export enum ActivityRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

export enum CheckInType {
  PHOTO = 'photo',
  CHECKLIST = 'checklist',
  HOURS = 'hours',
}

interface PhotoValidation {
  guidelines: string; // What qualifies as a valid photo
  requiredElements?: string[]; // Optional specific elements that must be in photo
}

interface ChecklistValidation {
  items: Array<{
    text: string;
    required: boolean;
  }>;
}

interface HoursValidation {
  description: string; // Description of what counts as valid hours
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

  @Prop({ required: true, min: 1 })
  checkinFrequency: number;

  @Prop({
    type: String,
    enum: CheckinFrequencyUnit,
    required: true,
    default: CheckinFrequencyUnit.WEEKLY,
  })
  checkinFrequencyUnit: CheckinFrequencyUnit;

  @Prop({ type: [String], enum: DayOfWeek })
  checkinDays?: DayOfWeek[]; // For weekly/biweekly

  @Prop({ type: [Number], min: 1, max: 31 })
  checkinDatesOfMonth?: number[]; // For monthly - dates of month

  @Prop({ type: [String], enum: DayOfWeek })
  checkinDaysOfWeek?: DayOfWeek[]; // For monthly - days of week (e.g., ["monday", "thursday"])

  @Prop({ type: [Number], min: 1, max: 4 })
  checkinWeeksOfMonth?: number[]; // For monthly - which weeks (1st, 2nd, 3rd, 4th)

  @Prop({
    type: String,
    enum: ActivityType,
    required: true,
    default: ActivityType.PUBLIC,
  })
  type: ActivityType;

  @Prop({ type: Date, required: false })
  startDate: Date;

  @Prop({
    type: String,
    enum: JoinType,
    required: false,
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
        isDefault: { type: Boolean, default: true },
      },
    ],
    default: [
      { rule: 'Be respectful to all participants', isDefault: true },
      { rule: 'Maintain regular communication', isDefault: true },
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

  @Prop({
    type: [
      {
        type: {
          type: String,
          enum: CheckInType,
          required: true,
        },
        validation: {
          type: mongoose.Schema.Types.Mixed,
          required: true,
          validate: {
            validator: function (validation: any) {
              switch (this.type) {
                case CheckInType.PHOTO:
                  return (
                    validation.guidelines &&
                    typeof validation.guidelines === 'string'
                  );
                case CheckInType.CHECKLIST:
                  return (
                    Array.isArray(validation.items) &&
                    validation.items.every(
                      (item: any) =>
                        item.text &&
                        typeof item.text === 'string' &&
                        typeof item.required === 'boolean',
                    )
                  );
                case CheckInType.HOURS:
                  return (
                    validation.description &&
                    typeof validation.description === 'string'
                  );
                default:
                  return false;
              }
            },
            message: 'Invalid validation configuration for check-in type',
          },
        },
      },
    ],
    default: [],
  })
  allowedCheckInTypes: Array<{
    type: CheckInType;
    validation: PhotoValidation | ChecklistValidation | HoursValidation;
  }>;

  @Prop({
    type: [
      {
        user: { type: MongooseSchema.Types.ObjectId, ref: 'User' },
        requestedAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  joinRequests: Array<{
    user: User | MongooseSchema.Types.ObjectId;
    requestedAt: Date;
  }>;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);

ActivitySchema.index({ title: 'text', description: 'text', tags: 'text' });

ActivitySchema.virtual('availableSeats').get(function () {
  return this.maxSize - this.currentSize;
});
