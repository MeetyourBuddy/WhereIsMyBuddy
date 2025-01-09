import { ActivityType, JoinType, ContactFrequency } from '../schemas/activity.schema';

export const isValidActivityType = (type: string): type is ActivityType => {
  return Object.values(ActivityType).includes(type as ActivityType);
};

export const isValidJoinType = (type: string): type is JoinType => {
  return Object.values(JoinType).includes(type as JoinType);
};

export const isValidContactFrequency = (frequency: string): frequency is ContactFrequency => {
  return Object.values(ContactFrequency).includes(frequency as ContactFrequency);
};

export const isValidParticipantCount = (currentSize: number, maxSize: number): boolean => {
  return currentSize >= 0 && currentSize <= maxSize;
};

export const isValidStartDate = (startDate: Date): boolean => {
  const now = new Date();
  return startDate >= now;
}; 