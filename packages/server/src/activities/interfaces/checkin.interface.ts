import { Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Activity } from '../schemas/activity.schema';
import { CheckInType } from './checkin-type.interface';
import { CheckInContent } from './checkin-content.interface';

export interface ICheckInResponse {
  id: string;
  user: Types.ObjectId | User;
  activity: Types.ObjectId | Activity;
  type: CheckInType;
  content: CheckInContent;
  date: Date;
  isVerified: boolean;
  verifiedBy?: Types.ObjectId | User;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICheckInQueryParams {
  activityId?: string;
  userId?: string;
  type?: CheckInType;
  startDate?: Date;
  endDate?: Date;
  isVerified?: boolean;
}

// Validation interfaces for activity check-in types
export interface PhotoValidation {
  guidelines: string;
  requiredElements?: string[];
}

export interface ChecklistValidation {
  items: Array<{
    text: string;
    required: boolean;
  }>;
}

export interface HoursValidation {
  description: string;
  minHours?: number;
  maxHours?: number;
}

export interface TextValidation {
  guidelines: string;
  minLength?: number;
  maxLength?: number;
}

export type CheckInValidation =
  | PhotoValidation
  | ChecklistValidation
  | HoursValidation
  | TextValidation;

export interface CheckInTypeConfig {
  type: CheckInType;
  validation: CheckInValidation;
  isRequired?: boolean; // Whether this type of check-in is required
  frequency?: number; // How often this type should be used
}

export interface CheckInValidationResult {
  isValid: boolean;
  errors?: string[];
}
