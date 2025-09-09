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
  admin: Types.ObjectId | User;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  participants: (Types.ObjectId | User)[];

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
    if (
      !this.proposedDuration ||
      !this.startDate ||
      !this.checkinFrequency ||
      !this.checkinFrequencyUnit
    )
      return 0;

    // Calculate total available check-ins based on activity duration and frequency
    const totalAvailableCheckIns = this.calculateTotalAvailableCheckIns();

    // Use actual check-ins count for progress calculation
    const completedCheckIns = this.checkins || 0;

    if (totalAvailableCheckIns === 0) return 0;

    return Math.round((completedCheckIns / totalAvailableCheckIns) * 100);
  }

  @Prop({ type: Number })
  get streakCount(): number {
    // This will be calculated by the service based on actual check-ins
    // For now, return 0 to avoid incorrect calculations
    return 0;
  }

  @Prop({ type: Number })
  get totalDays(): number {
    return this.proposedDuration || 0;
  }

  @Prop({ type: Number })
  get daysCompleted(): number {
    return this.checkins || 0;
  }

  @Prop({ type: Number, required: true })
  maxParticipants: number;

  // Helper method to calculate total available check-ins
  calculateTotalAvailableCheckIns(): number {
    if (
      !this.proposedDuration ||
      !this.checkinFrequency ||
      !this.checkinFrequencyUnit
    )
      return 0;

    const startDate = new Date(this.startDate);
    const endDate = this.endDate
      ? new Date(this.endDate)
      : new Date(
          startDate.getTime() +
            this.proposedDuration * 30 * 24 * 60 * 60 * 1000,
        ); // Convert months to milliseconds

    const totalDuration = endDate.getTime() - startDate.getTime();

    // Calculate period duration based on frequency unit
    let periodDuration: number;
    switch (this.checkinFrequencyUnit) {
      case 'daily':
        periodDuration = 24 * 60 * 60 * 1000; // 1 day in milliseconds
        break;
      case 'weekly':
        periodDuration = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
        break;
      case 'monthly':
        periodDuration = 30 * 24 * 60 * 60 * 1000; // 1 month in milliseconds
        break;
      default:
        periodDuration = 24 * 60 * 60 * 1000; // Default to daily
    }

    // Calculate total number of check-in periods
    const totalPeriods = Math.floor(
      totalDuration / (periodDuration * this.checkinFrequency),
    );

    return totalPeriods;
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
