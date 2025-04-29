import { Exclude, Expose, Type } from 'class-transformer';
import {
  ActivityType,
  JoinType,
  CheckinFrequencyUnit,
  DayOfWeek,
} from '../schemas/activity.schema';

@Exclude()
export class ActivityResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description?: string;

  @Expose()
  proposedDuration: number;

  @Expose()
  bannerImage?: string;

  @Expose()
  type: ActivityType;

  @Expose()
  startDate: Date;

  @Expose()
  joinType: JoinType;

  @Expose()
  categories: string[];

  @Expose()
  maxSize: number;

  @Expose()
  goals: string[];

  @Expose()
  tags: string[];

  @Expose()
  rules: {
    rule: string;
    isDefault: boolean;
  }[];

  @Expose()
  checkinFrequency: number;

  @Expose()
  checkinFrequencyUnit: CheckinFrequencyUnit;

  @Expose()
  checkinDays?: DayOfWeek[];

  @Expose()
  checkinDatesOfMonth?: number[];

  @Expose()
  checkinWeeksOfMonth?: number[];

  @Expose()
  allowedCheckInTypes: {
    type: string;
    validation: {
      guidelines?: string;
      requiredElements?: string[];
      items?: Array<{ text: string; required: boolean }>;
      minimumHours?: number;
      maximumHours?: number;
    };
  }[];

  @Expose()
  participants: string[];

  @Expose()
  isActive: boolean;

  @Expose()
  endedAt?: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<ActivityResponseDto>) {
    Object.assign(this, partial);
  }
}
