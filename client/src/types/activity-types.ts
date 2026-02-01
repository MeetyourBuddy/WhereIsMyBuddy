import { IUserResponse } from "./user-types";
import { InterestCategory } from "./interest-categories.enum";

export enum ActivityType {
  PRIVATE = "private",
  PUBLIC = "public",
}

export enum JoinType {
  FLEXIBLE = "flexible",
  FIXED = "fixed",
}

export enum DurationUnit {
  DAYS = "days",
  MONTHS = "months",
}

export enum ActivityRole {
  ADMIN = "admin",
  MEMBER = "member",
}

export enum DayOfWeek {
  SUNDAY = "sunday",
  MONDAY = "monday",
  TUESDAY = "tuesday",
  WEDNESDAY = "wednesday",
  THURSDAY = "thursday",
  FRIDAY = "friday",
  SATURDAY = "saturday",
}

export enum CheckInType {
  PHOTO = "photo",
  TEXT = "text",
}

export enum CheckinFrequencyUnit {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
}

export interface PhotoValidation {
  guidelines: string;
  requiredElements?: string[];
}

export interface TextValidation {
  guidelines: string;
  minLength?: number;
  maxLength?: number;
}

export interface CheckInTypeConfig {
  type: CheckInType;
  validation: PhotoValidation | TextValidation;
  isEnabled: boolean;
  description: string;
}

export interface IActivityRule {
  _id: string;
  title: string;
  description?: string;
  isDefault: boolean;
}

export interface IParticipant {
  user: IUserResponse;
  role: ActivityRole;
}

export interface IActivity {
  id?: string;
  title: string;
  description?: string;
  proposedDuration: number;
  bannerImage?: string;
  type: ActivityType;
  startDate: string;
  joinType?: JoinType;
  categories?: string[];
  goals?: string[];
  tags?: string[];
  rules?: IActivityRule[];
  checkinFrequency: number;
  checkinFrequencyUnit: CheckinFrequencyUnit;
  checkinDays?: DayOfWeek[];
  checkinDatesOfMonth?: number[];
  checkinWeeksOfMonth?: number[];
  allowedCheckInTypes: CheckInTypeConfig[];
  maxParticipants: number;
}

export interface IActivityResult extends IActivity {
  id: string;
  _id: string;
  admin: IUserResponse;
  participants: IUserResponse[];
  currentSize: number;
  isActive: boolean;
  endedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  availableSeats: number;
  nextCheckInDue?: Date;
  category: InterestCategory;
  streakCount: number;
  totalDays: number;
  daysCompleted: number;
  checkins: number;
  progress: number;
  name: string;
  frequency: string;
  duration: string;
  title: string;
  description: string;
  location?: string;
  startDate: string;
  endDate?: string;
  maxParticipants: number;
  /** Set when current user has an accepted join request for this activity (from list API). */
  currentUserJoinRequestStatus?: "pending" | "accepted";
}

// Helper function to check if a user is the creator of an activity
export const isActivityCreator = (
  activity: IActivityResult,
  userId?: string
): boolean => {
  // Check both _id and id fields
  const adminId = activity.admin?._id || activity.admin?.id;
  return adminId === userId;
};

// Helper function to check if a user is a participant of an activity
export const isActivityParticipant = (
  activity: IActivityResult,
  userId?: string
): boolean => {
  return (
    activity.participants?.some((participant) => participant._id === userId) ||
    false
  );
};

export type { InterestCategory };
