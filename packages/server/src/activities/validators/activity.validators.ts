import {
  ActivityType,
  JoinType,
  CheckinFrequency,
  DurationUnit,
} from '../schemas/activity.schema';

export const isValidActivityType = (type: string): type is ActivityType => {
  return Object.values(ActivityType).includes(type as ActivityType);
};

export const isValidJoinType = (type: string): type is JoinType => {
  return Object.values(JoinType).includes(type as JoinType);
};

export const isValidContactFrequency = (
  frequency: string,
): frequency is CheckinFrequency => {
  return Object.values(CheckinFrequency).includes(
    frequency as CheckinFrequency,
  );
};

export const isValidParticipantCount = (
  currentSize: number,
  maxSize: number,
): boolean => {
  return currentSize >= 0 && currentSize <= maxSize;
};

export const isValidStartDate = (startDate: Date): boolean => {
  const now = new Date();
  return startDate >= now;
};

export const isValidDuration = (
  duration: number,
  unit: DurationUnit,
): boolean => {
  if (duration < 1) return false;

  switch (unit) {
    case DurationUnit.DAYS:
      return duration <= 365;
    case DurationUnit.MONTHS:
      return duration <= 12;
    default:
      return false;
  }
};
