import { z } from 'zod';

export const authValidationSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }).optional(),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' })
});

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(6, 'Old password must be at least 6 characters long'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters long'),
    confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters long')
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});
