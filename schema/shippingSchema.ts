import z from 'zod';

export const shippingSchema = z.object({
  fullName: z
    .string({ error: 'Invalid Name' })
    .min(3, 'Name must be at least 3 characters long')
    .max(25, 'Name must be at most 25 characters long')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .trim(),
  phoneNumber: z
    .string({ error: 'Invalid Phone Number' })
    .min(7, 'Phone Number must be at least 7 digits long')
    .max(10, 'Phone Number must be at most 10 digits long')
    .regex(
      /^\+971(50|51|52|54|55|56|58)\d{7}$/,
      'Phone Number must start with 50, 51, 52, 54, 55, 56, or 58 and be followed by 7 digits'
    ),
  city: z.enum(
    [
      'Abu Dhabi',
      'Dubai',
      'Sharjah',
      'Ajman',
      'Umm Al-Quwain',
      'Ras Al Khaimah',
      'Fujairah',
    ],
    { error: 'City is required' }
  ),
  streetAddress: z
    .string({ error: 'Invalid Street Address' })
    .min(5, 'Street Address must be at least 5 characters long')
    .max(100, 'Street Address must be at most 100 characters long')
    .trim(),
});
