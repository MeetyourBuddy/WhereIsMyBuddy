import * as z from 'zod';

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  country: z.string().min(1, 'Please select a country'),
  email: z.string().email('Please enter a valid email'),
  city: z.string().min(1, 'Please select a city'),
  bio: z.string().min(10, 'Bio must be at least 10 characters').optional(),
  profileLink: z.string().url('Please enter a valid URL').optional(),
  collaborationStatus: z.enum(['open', 'closed', 'undecided']),
  portfolio: z.string().url('Please enter a valid URL').optional(),
  github: z.string().url('Please enter a valid URL').optional(),
  linkedin: z.string().url('Please enter a valid URL').optional(),
  preferredLanguage: z.string().min(1, 'Please select a language'),
  categories: z.array(z.string()).min(1, 'Please select at least one category'),
  interests: z.array(z.string()).min(1, 'Please select at least one interest'),
  age: z.number().min(13, 'Must be at least 13 years old').optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']),
  goals: z.string().min(20, 'Please provide more detailed goals').optional()
});

export type Profile = z.infer<typeof profileSchema>;
