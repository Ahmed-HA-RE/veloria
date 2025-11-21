import z from 'zod';
import { moneyAmountString } from '@/lib/utils';
import { shippingSchema } from './checkoutSchema';
import { PAYMENT_METHODS } from '@/lib/constants';

export const orderSchema = z.object({
  userId: z.uuid({ error: 'Invalid user ID' }),
  shippingAddress: shippingSchema,
  paymentMethod: z.enum(PAYMENT_METHODS.split(', '), {
    error: 'Invalid payment method',
  }),
  itemsPrice: moneyAmountString(),
  shippingPrice: moneyAmountString(),
  taxPrice: moneyAmountString(),
  totalPrice: moneyAmountString(),
});

export const orderItemSchema = z.object({
  productId: z.uuid({ error: 'Invalid product ID' }),
  qty: z
    .number({ error: 'Quantity must be a number' })
    .min(1, { error: 'Quantity must be at least 1' }),
  name: z.string().min(1, { error: 'Product name is required' }),
  slug: z.string().min(1, { error: 'Product slug is required' }),
  price: moneyAmountString(),
  image: z.string().min(1, { error: 'Product Image is required' }),
});
