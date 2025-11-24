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
    error: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type RegisterUserForm = z.infer<typeof registerSchema>;

export const signInSchema = z.object({
  email: registerSchema.shape.email,
  password: registerSchema.shape.password,
  rememberMe: z.boolean(),
});

export type SignInUserForm = z.infer<typeof signInSchema>;

export const resetPassSchema = z
  .object({
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
    error: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type ResetPassword = z.infer<typeof resetPassSchema>;

export const updateProfileSchema = z.object({
  name: registerSchema.shape.name,
  email: registerSchema.shape.email,
  address: z.object({
    city: z.enum([
      '',
      'Abu Dhabi',
      'Dubai',
      'Sharjah',
      'Ajman',
      'Umm Al Quwain',
      'Ras Al Khaimah',
      'Fujairah',
    ]),
    phoneNumber: z.string().optional(),
    streetAddress: z.string().optional(),
    image: z.string().optional(),
  }),
});

export type UpdateProfile = z.infer<typeof updateProfileSchema>;
