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

export const updateUserPubInfoSchema = z.object({
  name: registerSchema.shape.name,
  bio: z
    .string()
    .max(160, 'Bio must be at most 160 characters long')
    .optional()
    .nullable(),
  email: registerSchema.shape.email,
});

export const updateUserPassSchema = z
  .object({
    currentPassword: resetPassSchema.shape.password,
    newPassword: resetPassSchema.shape.password,
    confirmPassword: resetPassSchema.shape.confirmPassword,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    error: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type UpdateUserPassForm = z.infer<typeof updateUserPassSchema>;
