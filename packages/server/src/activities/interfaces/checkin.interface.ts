import { Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Activity } from '../schemas/activity.schema';
import { CheckInType } from '../schemas/checkin.schema';

export interface ICheckInResponse {
  id: string;
  user: Types.ObjectId | User;
  activity: Types.ObjectId | Activity;
  type: CheckInType;
  content: string;
  date: Date;
  comment?: string;
  photo?: {
    imageUrl: string;
    guidelines: string;
  };
  checklist?: Array<{
    item: string;
    completed: boolean;
  }>;
  hours?: {
    hours: number;
    min: number;
    max: number;
  };
  other?: {
    description: string;
    value: string;
  };
  isCompleted: boolean;
  isVerified: boolean;
  verifiedBy?: Types.ObjectId | User;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICheckInQueryParams {
  activityId?: string;
  userId?: string;
  isCompleted?: boolean;
  isVerified?: boolean;
  startDate?: Date;
  endDate?: Date;
}
