'use server';

import { auth } from '@/lib/auth';
import { getUserById } from './auth';
import { getMyCart } from './cart';
import { orderSchema } from '@/schema/orderSchema';
import { headers } from 'next/headers';
import prisma from '@/lib/prisma';
import { convertToPlainObject } from '@/lib/utils';
import { Shipping } from '@/types';
import { paypal } from '@/lib/paypal';

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
        data: cart.items.map((item) => ({
          orderId: createdOrder.id,
          productId: item.productId,
          qty: item.qty,
          name: item.name,
          slug: item.slug,
          image: item.image,
          price: item.price,
        })),
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
      redirect: `/order/${result.id}`,
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const getOrderById = async (orderId: string) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      orderItems: true,
      user: { select: { name: true, email: true } },
    },
  });

  if (!order) throw new Error('Order not found');

  return convertToPlainObject({
    ...order,
    shippingAddress: order.shippingAddress as Shipping,
  });
};

export const createOrderPayment = async (orderId: string) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId },
    });

    if (!order) throw new Error('No Order Found');

    const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

    return paypalOrder;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
