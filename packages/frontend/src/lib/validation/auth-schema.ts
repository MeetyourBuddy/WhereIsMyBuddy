import { z } from 'zod';

// Sign-in Schema
export const signinSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' })
});

export type SigninSchema = z.infer<typeof signinSchema>;

// Sign-up Schema
export const signupSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
    confirmPassword: z.string(),
    name: z.string().min(3, { message: 'name must be at least 3 characters' })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  });

export type SignupSchema = z.infer<typeof signupSchema>;
