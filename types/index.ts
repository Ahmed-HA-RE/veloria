import z from 'zod';
import { insertProductSchema } from '@/schema/productSchema';
import { cartItemSchema, cartSchema } from '@/schema/cartSchema';
import { paymentMethodSchema, shippingSchema } from '@/schema/checkoutSchema';
import { orderItemSchema, orderSchema } from '@/schema/orderSchema';

export type Product = z.infer<typeof insertProductSchema> & {
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
