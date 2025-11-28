import z from 'zod';
import {
  baseProductSchema,
  createProductSchema,
  updateProductSchema,
} from '@/schema/productSchema';
import { cartItemSchema, cartSchema } from '@/schema/cartSchema';
import {
  paymentMethodSchema,
  paymentResultsSchema,
  shippingSchema,
} from '@/schema/checkoutSchema';
import { orderItemSchema, orderSchema } from '@/schema/orderSchema';
import { updateUserPubInfoSchema } from '@/schema/userSchema';

export type Product = z.infer<typeof baseProductSchema> & {
  id: string;
  rating: string;
};

export type CartItem = z.infer<typeof cartItemSchema>;
export type Cart = z.infer<typeof cartSchema>;
export type Shipping = z.infer<typeof shippingSchema>;
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type OrderItems = z.infer<typeof orderItemSchema>;
export type Order = z.infer<typeof orderSchema> & {
  id: string;
  isPaid: boolean;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
  createdAt: Date;
  user: { name: string; email: string };
  orderItems: OrderItems[];
};

export type PaymentResults = z.infer<typeof paymentResultsSchema>;
export type UpdateUserPubInfo = z.infer<typeof updateUserPubInfoSchema> & {
  image?: string | null;
};

export type CreateProduct = z.infer<typeof createProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;
