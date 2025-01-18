import { IUserResponse } from './user-types';

export enum ActivityType {
  PRIVATE = 'private',
  PUBLIC = 'public'
}

export enum JoinType {
  FLEXIBLE = 'flexible',
  FIXED = 'fixed'
}

export enum CheckinFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  OTHER = 'other'
}

export enum DurationUnit {
  DAYS = 'days',
  MONTHS = 'months'
}

export enum ActivityRole {
  ADMIN = 'admin',
  MEMBER = 'member'
}

export interface IActivity {
  id?: string;
  title: string;
  description: string;
  proposedDuration: number;
  durationUnit: DurationUnit;
  bannerImage?: string;
  contactFrequency?: CheckinFrequency;
  type: ActivityType;
  startDate?: string;
  joinType?: JoinType;
  maxSize: number;
  tags?: string[];
  rules?: IActivityRule[];
  //   participants: string[];
}

export interface IActivityRule {
  rule: string;
  isDefault: boolean;
}

export interface IParticipant {
  user: IUserResponse;
  role: ActivityRole;
}

export interface IActivityResponse {
  id: string;
  title: string;
  description: string;
  admin: IUserResponse;
  proposedDuration: number;
  durationUnit: DurationUnit;
  bannerImage?: string;
  contactFrequency: CheckinFrequency;
  type: ActivityType;
  startDate?: string;
  joinType: JoinType;
  maxSize: number;
  currentSize: number;
  tags: string[];
  rules: IActivityRule[];
  participants: IParticipant[];
  isActive: boolean;
  availableSeats: number;
  createdAt: string;
  updatedAt: string;
  proposedDurationInDays?: number;
  endedAt?: string;
}

// export interface IActivityResponse {
//     id: string;
//     title: string;
//     description: string;
//     admin: Types.ObjectId | User;
//     proposedDuration: number;
//     durationUnit: DurationUnit;
//     proposedDurationInDays?: number;
//     bannerImage?: string;
//     contactFrequency: CheckinFrequency;
//     type: ActivityType;
//     startDate?: Date;
//     joinType: JoinType;
//     maxSize: number;
//     currentSize: number;
//     tags: string[];
//     rules: Array<{ rule: string; isDefault: boolean }>;
//     participants: Array<Types.ObjectId | User>;
//     isActive: boolean;
//     availableSeats: number;
//     createdAt: Date;
//     updatedAt: Date;
//   }
