import { BadRequestException } from '@nestjs/common';
import { Activity } from '../schemas/activity.schema';
import { CheckInType } from '../interfaces/checkin-type.interface';
import {
  CheckInContent,
  PhotoContent,
  ChecklistContent,
  HoursContent,
} from '../interfaces/checkin-content.interface';

export function validateCheckInContent(
  type: CheckInType,
  content: CheckInContent,
  activity: Activity,
): void {
  const checkInConfig = activity.allowedCheckInTypes.find(
    (config) => config.type === type,
  );

  if (!checkInConfig) {
    throw new BadRequestException(
      `Check-in type ${type} is not allowed for this activity`,
    );
  }

  switch (type) {
    case CheckInType.PHOTO:
      validatePhotoContent(content as PhotoContent, checkInConfig.validation);
      break;

    case CheckInType.CHECKLIST:
      validateChecklistContent(
        content as ChecklistContent,
        checkInConfig.validation,
      );
      break;

    case CheckInType.HOURS:
      validateHoursContent(content as HoursContent);
      break;

    default:
      throw new BadRequestException(`Invalid check-in type: ${type}`);
  }
}

function validatePhotoContent(content: PhotoContent, validation: any): void {
  if (!content.imageUrl) {
    throw new BadRequestException('Photo URL is required');
  }

  if (validation.requiredElements?.length) {
    // Additional photo validation logic here
    // Could implement AI/ML validation in the future
  }
}

function validateChecklistContent(
  content: ChecklistContent,
  validation: any,
): void {
  if (!Array.isArray(content.items)) {
    throw new BadRequestException('Checklist items must be an array');
  }

  // Get all required items from the validation config
  const requiredItems = validation.items.filter((item) => item.required);

  // Find which required items were completed in the check-in
  const completedRequiredItems = content.items.filter((item) =>
    requiredItems.some(
      (req) =>
        req.text === item.text && // Match the item text
        item.completed, // Check if it was marked as completed
    ),
  );

  // If any required items are not completed, throw error
  if (completedRequiredItems.length < requiredItems.length) {
    const missingItems = requiredItems
      .filter(
        (req) =>
          !content.items.some(
            (item) => item.text === req.text && item.completed,
          ),
      )
      .map((item) => item.text);

    throw new BadRequestException(
      `Missing required checklist items: ${missingItems.join(', ')}`,
    );
  }
}

function validateHoursContent(content: HoursContent): void {
  if (typeof content.hours !== 'number' || content.hours <= 0) {
    throw new BadRequestException('Valid hours value is required');
  }
  
  // Note: The minHours validation would happen at the activity level
  // when creating/updating an activity, not during check-in
}
