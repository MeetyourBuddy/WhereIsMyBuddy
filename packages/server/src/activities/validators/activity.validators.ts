import {
  ActivityType,
  JoinType,
  CheckinFrequencyUnit,
  DurationUnit,
} from '../schemas/activity.schema';
import { BadRequestException } from '@nestjs/common';
import { CreateActivityDto } from '../dto/activity/create-activity.dto';
import { CheckInType } from '../interfaces/checkin-type.interface';
import {
  PhotoValidation,
  ChecklistValidation,
  HoursValidation,
  CheckInValidation,
} from '../interfaces/checkin-validation.interface';

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

export function validateCheckInTypeConfigs(
  createActivityDto: CreateActivityDto,
): void {
  const { allowedCheckInTypes } = createActivityDto;

  if (!allowedCheckInTypes?.length) {
    throw new BadRequestException(
      'At least one check-in type must be specified',
    );
  }

  allowedCheckInTypes.forEach((config) => {
    validateCheckInTypeConfig(config.type, config.validation);
  });
}

function validateCheckInTypeConfig(
  type: CheckInType,
  validation: CheckInValidation,
): void {
  if (!validation) {
    throw new BadRequestException('Validation configuration is required');
  }

  switch (type) {
    case CheckInType.PHOTO:
      validatePhotoValidation(validation as PhotoValidation);
      break;
    case CheckInType.CHECKLIST:
      validateChecklistValidation(validation as ChecklistValidation);
      break;
    case CheckInType.HOURS:
      validateHoursValidation(validation as HoursValidation);
      break;
    default:
      throw new BadRequestException(`Invalid check-in type: ${type}`);
  }
}

function validatePhotoValidation(validation: PhotoValidation): void {
  if (!validation.guidelines) {
    throw new BadRequestException('Photo guidelines are required');
  }
}

function validateChecklistValidation(validation: ChecklistValidation): void {
  if (!validation.items?.length) {
    throw new BadRequestException('Checklist must contain at least one item');
  }

  validation.items.forEach((item) => {
    if (!item.text) {
      throw new BadRequestException('Each checklist item must have text');
    }
  });
}

function validateHoursValidation(validation: HoursValidation): void {
  if (!validation.description) {
    throw new BadRequestException('Hours description is required');
  }
}

export function validateAllowedCheckInTypes(types: CheckInType[]): void {
  const validTypes = [
    CheckInType.PHOTO,
    CheckInType.CHECKLIST,
    CheckInType.HOURS,
  ];

  const invalidTypes = types.filter((type) => !validTypes.includes(type));
  if (invalidTypes.length > 0) {
    throw new BadRequestException(
      `Invalid check-in types: ${invalidTypes.join(', ')}`,
    );
  }
}
