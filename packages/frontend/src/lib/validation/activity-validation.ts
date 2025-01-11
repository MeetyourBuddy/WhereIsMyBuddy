import * as z from 'zod';

export const activitySchema = z.object({
  id: z.string(),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  duration: z.number().min(1, 'Duration must be at least 1 day'),
  bannerUrl: z.string().url().optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'custom']),
  type: z.enum(['private', 'public']),
  startDate: z.date(),
  size: z.number().min(1, 'Size must be at least 1'),
  tags: z.array(z.string()),
  members: z.array(z.string()), // Array of user IDs
  isOpen: z.boolean(),
  rules: z.string().optional()
});

export type Activity = z.infer<typeof activitySchema>;
