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

  durationUnit: z.enum([DurationUnit.DAYS, DurationUnit.WEEKS, DurationUnit.MONTHS], {
    errorMap: () => ({ message: 'Please select a valid duration unit' })
  }),

  bannerImage: z.string().optional(),

  contactFrequency: z
    .enum(
      [
        CheckinFrequency.DAILY,
        CheckinFrequency.WEEKLY,
        CheckinFrequency.BIWEEKLY,
        CheckinFrequency.MONTHLY,
        CheckinFrequency.OTHER
      ],
      {
        errorMap: () => ({ message: 'Please select a valid frequency' })
      }
    )
    .optional(),

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

  joinType: z
    .enum([JoinType.FIXED, JoinType.FLEXIBLE], {
      errorMap: () => ({ message: 'Please select a valid join type' })
    })
    .optional(),

  maxSize: z
    .number()
    .min(1, 'Capacity must be at least 1')
    .max(1000, 'Capacity cannot exceed 1000'),

  categories: z.array(z.string()).min(1, 'At least one category is required'),

  tags: z.array(z.string()).min(1, 'At least one tag is required'),

  // participants: z.array(z.string()).optional(),

  rules: z.array(
    z.object({
      rule: z.string(),
      isDefault: z.boolean()
    })
  )

  // Additional form-specific validations
  // checkinOptions: z
  //   .object({
  //     photo: z
  //       .object({
  //         enabled: z.boolean(),
  //         description: z.string().optional()
  //       })
  //       .optional(),

  //     hours: z
  //       .object({
  //         enabled: z.boolean(),
  //         minHours: z.number().min(0).optional()
  //       })
  //       .optional(),

  //     checklist: z
  //       .object({
  //         enabled: z.boolean(),
  //         items: z.array(z.string()).optional()
  //       })
  //       .optional()
  //   })
  //   .optional()
});

export type CreateActivityFormData = z.infer<typeof createActivitySchema>;
