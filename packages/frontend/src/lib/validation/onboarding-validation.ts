import * as z from 'zod';
import { Country } from '@/lib/constants';

export const onboardingSchema = z.object({
  country: z.nativeEnum(Country, {
    errorMap: () => ({ message: 'Please select a country' })
  }),
  city: z.string().min(3, 'Please select a city'),
  dateOfBirth: z.date({
    required_error: 'Please select a date'
  }),
  interestsCategories: z.array(z.string()).min(3, 'Please select at least 3 interests')
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
