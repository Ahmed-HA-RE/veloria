import z from 'zod';
import { moneyAmountString } from '@/lib/utils';

export const cartItemSchema = z.object({
  name: z.string().min(1, { message: 'Product name is required' }),
  productId: z.uuid({ message: 'Invalid product ID' }),
  slug: z.string().min(1, { message: 'Product slug is required' }),
  qty: z.number().min(1, { message: 'Quantity must be at least 1' }),
  price: moneyAmountString(),
  image: z.string().min(1, { message: 'Image URL is required' }),
});

export const cartSchema = z.object({
  sessionCartId: z.uuid({ message: 'Invalid session cart ID' }).optional(),
  userId: z.string({ message: 'Invalid user ID' }).optional(),
  items: z.array(cartItemSchema),
  itemsPrice: moneyAmountString(),
  shippingPrice: moneyAmountString(),
  totalPrice: moneyAmountString(),
  taxPrice: moneyAmountString(),
});
