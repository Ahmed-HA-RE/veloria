import { PAYMENT_METHODS } from '@/lib/constants/index';
import z from 'zod';

export const shippingSchema = z.object({
  fullName: z
    .string({ error: 'Invalid Name' })
    .min(3, 'Name must be at least 3 characters long')
    .max(25, 'Name must be at most 25 characters long')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters')
    .trim(),
  phoneNumber: z
    .string({ error: 'Invalid Phone Number' })
    .min(13, 'Phone Number must be at least 7 digits long')
    .max(15, 'Phone Number must not exceed 15 digits long'),
  city: z.enum(
    [
      'Abu Dhabi',
      'Dubai',
      'Sharjah',
      'Ajman',
      'Umm Al Quwain',
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

export const paymentMethodSchema = z.object({
  paymentMethod: z.enum(PAYMENT_METHODS.split(', '), {
    error: 'Payment Method is required',
  }),
});
