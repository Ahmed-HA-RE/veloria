import z from 'zod';

export const registerSchema = z
  .object({
    name: z
      .string({ error: 'Invalid Name' })
      .min(3, 'Name must be at least 3 characters long')
      .max(25, 'Name must be at most 25 characters long')
      .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
    email: z.email({ error: 'Invalid email address' }),
    password: z
      .string({ error: 'Invalid password' })
      .min(6, 'Password must be at least 6 characters long')
      .regex(
        /^(?=.*[a-z]).*$/,
        'Password must contain at least one lowercase letter'
      )
      .regex(
        /^(?=.*[A-Z]).*$/,
        'Password must contain at least one uppercase letter'
      ),
    confirmPassword: z.string({ error: 'Invalid password confirmation' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterUserForm = z.infer<typeof registerSchema>;
