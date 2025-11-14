import z from 'zod';
import { insertProductSchema } from '@/schema/productSchema';

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
};
