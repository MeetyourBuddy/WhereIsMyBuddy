import {
  ActivityType,
  JoinType,
  CheckinFrequencyUnit,
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
): frequency is CheckinFrequencyUnit => {
  return Object.values(CheckinFrequencyUnit).includes(
    frequency as CheckinFrequencyUnit,
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

export function validateCheckinFrequency(
  frequency: CheckinFrequencyUnit,
): boolean {
  return Object.values(CheckinFrequencyUnit).includes(frequency);
}

export const isValidCheckinFrequency = (frequency: number): boolean => {
  return frequency > 0;
};

export const isValidCheckinFrequencyUnit = (
  unit: string,
): unit is CheckinFrequencyUnit => {
  return Object.values(CheckinFrequencyUnit).includes(
    unit as CheckinFrequencyUnit,
  );
};
