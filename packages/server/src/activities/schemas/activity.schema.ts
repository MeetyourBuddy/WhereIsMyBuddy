import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { InterestCategory } from '../../users/enums/interests.enum';

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
  MONTHLY = 'monthly',
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

export enum CheckInType {
  PHOTO = 'photo',
  TEXT = 'text',
}

@Schema({ timestamps: true })
class ActivityRule {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: false })
  isDefault: boolean;
}

@Schema({ timestamps: true })
class ValidationConfig {
  @Prop({ type: String })
  guidelines: string;

  @Prop({ type: [String] })
  requiredElements?: string[];

  @Prop({ type: Number })
  minLength?: number;

  @Prop({ type: Number })
  maxLength?: number;
}

@Schema({ timestamps: true })
class CheckInTypeConfig {
  @Prop({ required: true, enum: CheckInType })
  type: CheckInType;

  @Prop({ type: ValidationConfig })
  validation: ValidationConfig;

  @Prop({ required: true })
  isEnabled: boolean;

  @Prop({ required: true })
  description: string;
}

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Activity {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;
  @Prop({ required: true })
  proposedDuration: number;

  @Prop()
  bannerImage?: string;

  @Prop({ required: true, enum: ActivityType })
  type: ActivityType;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ enum: JoinType, default: JoinType.FLEXIBLE })
  joinType: JoinType;

  @Prop({ type: [String], default: [] })
  categories: string[];

  @Prop({
    type: [String],
    required: true,
    validate: [(v: string[]) => v.length > 0, 'Goals cannot be empty'],
  })
  goals: string[];

  @Prop([String])
  tags: string[];

  @Prop({ required: true, enum: InterestCategory })
  category: InterestCategory;

  @Prop({ type: [{ type: ActivityRule }] })
  rules: ActivityRule[];

  @Prop({ required: true })
  checkinFrequency: number;

  @Prop({ required: true, enum: CheckinFrequencyUnit })
  checkinFrequencyUnit: CheckinFrequencyUnit;

  @Prop({ type: [{ type: String, enum: DayOfWeek }] })
  checkinDays?: DayOfWeek[];

  @Prop({ type: [Number], default: [] })
  checkinDatesOfMonth: number[];

  @Prop([Number])
  checkinWeeksOfMonth?: number[];

  @Prop({ type: [{ type: CheckInTypeConfig }] })
  allowedCheckInTypes: CheckInTypeConfig[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  admin: User | Types.ObjectId;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  participants: (User | Types.ObjectId)[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  endDate?: Date;

  @Prop()
  endedAt?: Date;

  @Prop({ default: 0 })
  checkins: number;

  // Virtual fields (computed)
  @Prop({ type: Number })
  get progress(): number {
    if (!this.proposedDuration) return 0;
    const totalDays = this.proposedDuration;
    const completedDays = this.checkins || 0;
    return Math.round((completedDays / totalDays) * 100);
  }

  @Prop({ type: Number })
  get streakCount(): number {
    // TODO: Implement streak calculation when we add check-ins
    return this.checkins || 0;
  }

  @Prop({ type: Number })
  get totalDays(): number {
    return this.proposedDuration || 0;
  }

  @Prop({ type: Number })
  get daysCompleted(): number {
    return this.checkins || 0;
  }
}

export type ActivityDocument = Activity & Document;
export const ActivitySchema = SchemaFactory.createForClass(Activity);
ActivitySchema.set('toJSON', { virtuals: true });
ActivitySchema.set('toObject', { virtuals: true });

// Calculate end date
ActivitySchema.pre('save', function (next) {
  // Calculate end date for all activities regardless of type
  this.endDate = new Date(this.startDate);

  // Always add months since duration is always in months
  this.endDate.setMonth(this.endDate.getMonth() + this.proposedDuration);

  next();
});
