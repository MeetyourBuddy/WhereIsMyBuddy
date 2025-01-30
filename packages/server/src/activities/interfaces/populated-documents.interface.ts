import { Types } from 'mongoose';
import { Activity, ActivityRole } from '../schemas/activity.schema';
import { CheckInType } from './checkin-type.interface';
import { CheckInContent } from './checkin-content.interface';

export interface PopulatedUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  profilePicture?: string;
}

export interface PopulatedActivity extends Omit<Activity, 'participants'> {
  participants: Array<{
    _id: Types.ObjectId;
    name: string;
    email: string;
    profilePicture?: string;
    role: ActivityRole;
  }>;
}

export interface PopulatedCheckIn {
  _id: Types.ObjectId;
  user: PopulatedUser;
  activity: Types.ObjectId;
  date: Date;
  type: CheckInType;
  content: CheckInContent;
  createdAt: Date;
  updatedAt: Date;
}

// Defines the format of responses with populated references
