import * as z from 'zod';

export const DurationUnit = {
  DAYS: 'days',
  WEEKS: 'weeks',
  MONTHS: 'months'
} as const;

export const CheckinFrequency = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  OTHER: 'other'
} as const;

export const ActivityType = {
  PUBLIC: 'public',
  PRIVATE: 'private'
} as const;

export const JoinType = {
  FIXED: 'fixed',
  FLEXIBLE: 'flexible'
} as const;

export const createActivitySchema = z.object({
  title: z
    .string()
    .min(1, 'Activity name is required')
    .max(100, 'Activity name must be less than 100 characters'),

  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters'),

  proposedDuration: z
    .number()
    .min(1, 'Duration must be at least 1')
    .max(365, 'Duration cannot exceed 365'),

  durationUnit: z.enum([DurationUnit.DAYS, DurationUnit.MONTHS], {
    errorMap: () => ({ message: 'Please select a valid duration unit' })
  }),

  bannerImage: z.string().optional(),

  checkinFrequency: z.number().min(1, 'Check-in frequency must be at least 1'),

  checkinFrequencyUnit: z.enum(
    [
      CheckinFrequency.DAILY,
      CheckinFrequency.WEEKLY,
      CheckinFrequency.MONTHLY,
      CheckinFrequency.OTHER
    ],
    {
      errorMap: () => ({ message: 'Please select a valid frequency unit' })
    }
  ),

  checkinDays: z.array(z.string()).optional(),

  checkinDateOfMonth: z.array(z.number()).min(1).max(31).optional(),

  checkinDayOfWeek: z.array(z.string()).optional(),

  checkinWeekOfMonth: z.array(z.number()).min(1).max(4).optional(),

  type: z.enum([ActivityType.PUBLIC, ActivityType.PRIVATE], {
    errorMap: () => ({ message: 'Please select a valid activity type' })
  }),

  startDate: z
    .date()
    .optional()
    .refine((date) => {
      if (!date) return true;
      return date >= new Date();
    }, 'Start date cannot be in the past'),

  joinType: z.enum([JoinType.FIXED, JoinType.FLEXIBLE], {
    errorMap: () => ({ message: 'Please select a valid join type' })
  }),

  maxSize: z
    .number()
    .min(1, 'Capacity must be at least 1')
    .max(1000, 'Capacity cannot exceed 1000'),

  categories: z.array(z.string()).min(1, 'At least one category is required'),

  tags: z.array(z.string()).min(1, 'At least one tag is required'),

  rules: z.array(
    z.object({
      rule: z.string(),
      isDefault: z.boolean()
    })
  ),

  allowedCheckInTypes: z
    .array(z.enum(['photo', 'checklist', 'hours', 'text', 'other']))
    .default(['photo'])
});

export type CreateActivityFormData = z.infer<typeof createActivitySchema>;
