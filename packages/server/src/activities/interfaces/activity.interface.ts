import { Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import {
  ActivityType,
  JoinType,
  CheckinFrequencyUnit,
  DurationUnit,
  ActivityRole,
} from '../schemas/activity.schema';

// Defines the structure of Activity data in API responses
export interface IActivityResponse {
  id: string;
  title: string;
  description: string;
  admin: Types.ObjectId | User;
  proposedDuration: number;
  durationUnit: DurationUnit;
  proposedDurationInDays?: number;
  bannerImage?: string;
  contactFrequency: CheckinFrequencyUnit;
  type: ActivityType;
  startDate?: Date;
  joinType: JoinType;
  maxSize: number;
  currentSize: number;
  tags: string[];
  rules: Array<{ rule: string; isDefault: boolean }>;
  participants: Array<Types.ObjectId | User>;
  isActive: boolean;
  availableSeats: number;
  createdAt: Date;
  updatedAt: Date;
  checkinFrequency: number;
  checkinFrequencyUnit: CheckinFrequencyUnit;
}

// Query parameters interface for filtering activities
export interface IActivityQueryParams {
  type?: ActivityType;
  joinType?: JoinType;
  contactFrequency?: CheckinFrequencyUnit;
  hasAvailableSeats?: boolean;
  tags?: string[];
  isActive?: boolean;
  adminId?: string;
  startDateFrom?: Date;
  startDateTo?: Date;
  minDuration?: number;
  maxDuration?: number;
  durationUnit?: DurationUnit;
  checkinFrequency?: number;
  checkinFrequencyUnit?: CheckinFrequencyUnit;
}

// Interface for activity statistics
export interface IActivityStats {
  totalParticipants: number;
  availableSeats: number;
  participationRate: number;
  isJoinable: boolean;
}
