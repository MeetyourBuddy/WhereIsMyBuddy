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
}

// Helper function to check if a user is the creator of an activity
export const isActivityCreator = (
  activity: IActivityResult,
  userId?: string
): boolean => {
  console.log("🔥 FIRE TEST - isActivityCreator called!");
  console.log("=== isActivityCreator Debug ===");
  console.log("Activity:", activity);
  console.log("Activity admin:", activity.admin);
  console.log("Activity admin._id:", activity.admin?._id);
  console.log("Activity admin._id type:", typeof activity.admin?._id);
  console.log("UserId:", userId);
  console.log("UserId type:", typeof userId);
  console.log("Comparison result (strict):", activity.admin?._id === userId);
  console.log(
    "Comparison result (string):",
    activity.admin?._id?.toString() === userId?.toString()
  );
  console.log("Comparison result (loose):", activity.admin?._id == userId);
  console.log("==============================");

  const result = activity.admin?._id === userId;
  console.log("🔥 FINAL RESULT:", result);
  console.log("🔥 Admin is null:", activity.admin === null);
  console.log("🔥 Admin is undefined:", activity.admin === undefined);
  console.log("🔥 Admin._id is undefined:", activity.admin?._id === undefined);

  return result;
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
