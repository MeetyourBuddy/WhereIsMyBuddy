import * as z from 'zod';

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  country: z.string().min(1, 'Please select a country'),
  email: z.string().email('Please enter a valid email'),
  city: z.string().min(1, 'Please select a city'),
  bio: z.string().min(10, 'Bio must be at least 10 characters').optional(),
  profileLink: z.string().min(1, 'Please enter a valid URL').optional(),
  collaborationStatus: z.enum(['open', 'closed', 'undecided']),
  portfolio: z.string().min(1, 'Please enter a valid URL').optional(),
  github: z.string().min(1, 'Please enter a valid URL').optional(),
  linkedin: z.string().min(1, 'Please enter a valid URL').optional(),
  preferredLanguage: z.string().min(1, 'Please select a language'),
  interestsCategories: z.array(z.string()).min(1, 'Please select at least one category'),
  interestsCommodities: z.array(z.string()).optional(),
  dateOfBirth: z.string().min(1, 'Please select a date'),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']),
  goals: z.string().min(20, 'Please provide more detailed goals').optional(),
  profileImage: z.string().optional(),
  bannerImage: z.string().optional()
});

export type Profile = z.infer<typeof profileSchema>;
