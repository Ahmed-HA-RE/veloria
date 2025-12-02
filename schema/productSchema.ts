import z from 'zod';
import { moneyAmountString } from '@/lib/utils';

export const baseProductSchema = z.object({
  name: z
    .string({ error: 'Invalid name' })
    .min(3, 'Product name is required')
    .max(50, 'Product name is too long'),
  slug: z
    .string({ error: 'Invalid slug' })
    .min(3, 'Product slug is required')
    .max(50, 'Product slug is too long'),
  category: z
    .string({ error: 'Invalid category' })
    .min(3, 'Category is required')
    .max(50, 'Category is too long'),
  description: z
    .string({ error: 'Invalid description' })
    .min(3, 'Description is required')
    .max(500, 'Description is too long'),
  images: z
    .array(z.string({ error: 'Invalid images' }))
    .min(1, 'At least one image is required'),
  price: moneyAmountString(),
  brand: z
    .string({ error: 'Invalid brand' })
    .min(2, 'Brand is required')
    .max(50, 'Brand is too long'),
  stock: z.coerce
    .number<number>({ error: 'Invalid stock' })
    .min(0, 'Stock cannot be negative'),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
});

export const createProductSchema = baseProductSchema.omit({
  images: true,
  banner: true,
});

export const updateProductSchema = createProductSchema.extend({
  id: z.string({ error: 'Invalid product ID' }),
});

// Product reviews
export const baseReviewSchema = z.object({
  productId: z
    .string({ error: 'Invalid product' })
    .min(1, 'Product is required'),
  userId: z.string({ error: 'Invalid user' }).min(1, 'User is required'),
  rating: z.coerce
    .number<number>()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot be more than 5'),
  title: z
    .string({ error: 'Invalid title' })
    .min(3, 'Title is required')
    .max(100, 'Title is too long'),
  comment: z
    .string({ error: 'Invalid comment' })
    .min(10, 'Comment is required')
    .max(1000, 'Comment is too long'),
});

export const createReviewSchema = baseReviewSchema.omit({
  productId: true,
  userId: true,
});
