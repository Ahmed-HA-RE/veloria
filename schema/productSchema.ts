import z from 'zod';

export const moneyAmountString = () => {
  return z
    .string()
    .regex(/^(0|[1-9]\d*)\.\d{2}$/, {
      message: 'Must be a number with exactly 2 decimal places',
    })
    .refine((val) => Number.parseFloat(val) > 0, {
      message: 'Money amount must be greater than 0',
    });
};

export const insertProductSchema = z.object({
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
