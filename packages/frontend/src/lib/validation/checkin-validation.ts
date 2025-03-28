import { z } from 'zod';
import { CheckInType } from '@/types/checkin-types';

const photoContentSchema = z.object({
  imageUrl: z.string().url('Please enter a valid image URL'),
  caption: z.string().optional()
});

const checklistItemSchema = z.object({
  text: z.string().min(1, 'Task description is required'),
  completed: z.boolean()
});

const checklistContentSchema = z.object({
  items: z.array(checklistItemSchema).min(1, 'At least one task is required')
});

const hoursContentSchema = z.object({
  hours: z.number().min(0.1, 'Hours must be greater than 0'),
  notes: z.string().optional()
});

export const checkInValidationSchema = z.object({
  type: z.nativeEnum(CheckInType),
  content: z.discriminatedUnion('type', [
    z.object({ type: z.literal(CheckInType.PHOTO), content: photoContentSchema }),
    z.object({ type: z.literal(CheckInType.CHECKLIST), content: checklistContentSchema }),
    z.object({ type: z.literal(CheckInType.HOURS), content: hoursContentSchema })
  ])
});
