import { auth } from '@/lib/auth';
import { getUserById } from './auth';
import { getMyCart } from './cart';
import { orderSchema } from '@/schema/orderSchema';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';

export const createOrder = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) throw new Error('User is not authenticated');

    const user = await getUserById(session.user.id);

    if (!user) throw new Error('No User Found');

    const cart = await getMyCart();

    if (!cart || cart.items.length === 0) throw new Error('Cart is empty');
    if (!user.address) throw new Error('Shipping address is missing');
    if (!user.paymentMethod) throw new Error('Payment method is missing');

    const order = orderSchema.safeParse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      taxPrice: cart.taxPrice,
      shippingPrice: cart.shippingPrice,
      totalPrice: cart.totalPrice,
    });

    if (!order.success) throw new Error('Invalid order data');

    const result = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: order.data,
      });

      await tx.orderItems.createMany({
        data: {
          orderId: createdOrder.id,
          ...cart.items,
        },
      });
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          itemsPrice: 0,
          taxPrice: 0,
          shippingPrice: 0,
          totalPrice: 0,
        },
      });
      return createdOrder;
    });

    return {
      success: true,
      message: 'Order created successfully',
      order: result,
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
