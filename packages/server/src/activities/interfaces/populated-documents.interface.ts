import { Types } from 'mongoose';
import { Activity } from '../schemas/activity.schema';
import { CheckIn } from '../schemas/checkin.schema';

export interface PopulatedUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  profilePicture?: string;
}

export interface PopulatedActivity
  extends Omit<Activity, 'admin' | 'participants'> {
  _id: Types.ObjectId;
  admin: PopulatedUser;
  participants: PopulatedUser[];
}

export interface PopulatedCheckIn extends Omit<CheckIn, 'user' | 'activity'> {
  _id: Types.ObjectId;
  user: PopulatedUser;
  activity: PopulatedActivity;
  createdAt: Date;
  updatedAt: Date;
}
