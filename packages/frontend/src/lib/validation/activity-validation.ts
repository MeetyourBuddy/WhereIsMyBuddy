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

export const CheckinType = {
  photo: {
    type: 'photo',
    description: '',
    isEnabled: false
  },
  checklist: {
    type: 'checklist',
    description: '',
    checklistItems: [{ title: '', description: '' }],
    isEnabled: false
  },
  text: {
    type: 'text',
    description: '',
    isEnabled: false
  },
  hours: {
    type: 'hours',
    description: '',
    isEnabled: false
  }
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

  checkinDateOfMonth: z
    .array(z.number())
    .min(1)
    .max(31)
    .optional()
    .superRefine((val, ctx) => {
      type Input = typeof ctx.parent;
      const parent: Input = ctx.parent;
      if (
        parent.checkinFrequencyUnit === CheckinFrequency.MONTHLY &&
        (!val || val.length === 0) &&
        (!parent.checkinWeekOfMonth || parent.checkinWeekOfMonth.length === 0)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Monthly check-ins require either dates of month or weeks of month'
        });
      }
    }),

  checkinWeekOfMonth: z
    .array(z.number())
    .min(1)
    .max(4)
    .optional()
    .superRefine((val, ctx) => {
      type Input = typeof ctx.parent;
      const parent: Input = ctx.parent;
      if (
        parent.checkinFrequencyUnit === CheckinFrequency.MONTHLY &&
        (!val || val.length === 0) &&
        (!parent.checkinDateOfMonth || parent.checkinDateOfMonth.length === 0)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Monthly check-ins require either dates of month or weeks of month'
        });
      }
    }),

  type: z.enum([ActivityType.PUBLIC, ActivityType.PRIVATE], {
    errorMap: () => ({ message: 'Please select a valid activity type' })
  }),

  startDate: z
    .date()
    .optional()
    .refine((date) => {
      if (!date) return true;
      return date > new Date();
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

  allowedCheckInTypes: z.object({
    photo: z.object({
      type: z.literal('photo'),
      description: z.string(),
      isEnabled: z.boolean()
    }),
    checklist: z.object({
      type: z.literal('checklist'),
      description: z.string(),
      checklistItems: z.array(
        z.object({
          title: z.string(),
          description: z.string()
        })
      ),
      isEnabled: z.boolean()
    }),
    hours: z.object({
      type: z.literal('hours'),
      description: z.string(),
      isEnabled: z.boolean()
    })
  })
});

export type CreateActivityFormData = z.infer<typeof createActivitySchema>;
