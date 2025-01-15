import { CheckInType } from '../schemas/checkin.schema';

export const isValidCheckInType = (type: string): type is CheckInType => {
  return Object.values(CheckInType).includes(type as CheckInType);
};

export const isValidChecklist = (
  checklist: Array<{ item: string; completed: boolean }>,
): boolean => {
  return checklist.every(
    (item) =>
      typeof item.item === 'string' && typeof item.completed === 'boolean',
  );
};

export const isValidHours = (
  hours: number,
  min: number,
  max: number,
): boolean => {
  return hours >= min && hours <= max;
};

export const isValidPhotoUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isCheckInComplete = (checkIn: any): boolean => {
  for (const type of checkIn.types) {
    switch (type) {
      case CheckInType.PHOTO:
        if (!checkIn.photo?.imageUrl) return false;
        break;
      case CheckInType.CHECKLIST:
        if (!checkIn.checklist?.every((item) => item.completed)) return false;
        break;
      case CheckInType.HOURS:
        if (!checkIn.hours?.hours) return false;
        break;
      case CheckInType.OTHER:
        if (!checkIn.other?.value) return false;
        break;
    }
  }
  return true;
};
