import * as z from 'zod';

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  country: z.string().optional(),
  city: z.string().optional(),
  bio: z.string().optional(),
  collaborationStatus: z.enum(['open', 'occupied', 'undecided']).optional(),
  preferredLanguage: z.string().optional(),
  interestsCategories: z.array(z.string()).optional(),
  interestsCommodities: z.array(z.string()).optional(),
  gender: z.enum(['male', 'female', 'other']),
  goals: z.string().optional(),
  profileImage: z.string().optional(),
  githubUrl: z.string().optional(),
  linkedInUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  phoneNumber: z.string().optional(),
  isActive: z.boolean().optional(),
  portfolioUrl: z.string().optional(),
  timezone: z.string().optional()
});

export type Profile = z.infer<typeof profileSchema>;
