import { Types } from 'mongoose';
import { Activity, ActivityRole } from '../schemas/activity.schema';
import { CheckIn } from '../schemas/checkin.schema';

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

export interface PopulatedCheckIn extends Omit<CheckIn, 'user' | 'activity'> {
  _id: Types.ObjectId;
  user: PopulatedUser;
  activity: PopulatedActivity;
  createdAt: Date;
  updatedAt: Date;
}

// Defines the format of responses with populated references
