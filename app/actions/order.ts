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
import { revalidatePath } from 'next/cache';
import { Prisma } from '@/lib/generated/prisma';

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
    if (!user.emailVerified)
      throw new Error('Please verify your email to place an order');

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

    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentResult: {
          id: paypalOrder.id,
          status: paypalOrder.status,
          email_address: '',
          pricePaid: 0,
        },
      },
    });

    return paypalOrder;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const confirmOrderPayment = async (
  orderId: string,
  data: { orderID: string }
) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId },
      include: { orderItems: true },
    });

    if (!order) throw new Error('No Order Found');

    const capturePayPalPayment = await paypal.capturePayment(data.orderID);

    if (!capturePayPalPayment || capturePayPalPayment.status !== 'COMPLETED') {
      throw new Error('Something went wrong with the payment process');
    }

    // Do Transaction to update the order and product stock
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: {
          paymentResult: {
            id: capturePayPalPayment.id,
            status: capturePayPalPayment.status,
            email_address: capturePayPalPayment.payer?.email_address,
            pricePaid:
              capturePayPalPayment.purchase_units[0].payments?.captures[0]
                ?.amount?.value,
          },
          isPaid: true,
          paidAt: new Date(),
        },
      });

      for (const item of order.orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.qty },
          },
        });
      }
    });

    revalidatePath(`/order/${orderId}`, 'page');
    return {
      success: true,
      message: 'Payment completed successfully. Thank you for your purchase!',
    };
  } catch (error) {
    console.log(error);
    throw new Error((error as Error).message);
  }
};

export const getMyOrders = async (page: number, limit: number = 10) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) throw new Error('User is not authenticated');

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: 'desc' },
    });
    const totalUserOrders = await prisma.order.count({
      where: { userId: session.user.id },
    });

    return {
      success: true,
      orders,
      totalPages: Math.ceil(totalUserOrders / limit),
    };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

type SalesDataType = {
  month: string;
  totalSales: number;
}[];

export const getOrdersOverview = async () => {
  // Get orders sales, customers, and products data for admin overview page
  const [ordersSales, totalCustomers, totalProducts] = await Promise.all([
    await prisma.order.count(),
    await prisma.user.count(),
    await prisma.product.count(),
  ]);

  // Get total revenue
  const totalRevenueData = await prisma.order.aggregate({
    _sum: {
      totalPrice: true,
    },
  });

  // Get monthly sales
  const salesDataRaw = await prisma.$queryRaw<
    Array<{ month: string; totalSales: Prisma.Decimal }>
  >`SELECT to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales" FROM "Order" GROUP BY to_char("createdAt", 'MM/YY')`;

  const salesData: SalesDataType = salesDataRaw.map((entry) => ({
    month: entry.month,
    totalSales: Number(entry.totalSales),
  }));

  // Get recent sales
  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true } } },
    take: 6,
  });

  return {
    ordersSales,
    totalCustomers,
    totalProducts,
    totalRevenueData,
    salesData,
    recentOrders,
  };
};

// Get the orders for admin with pagination
export const getOrdersForAdmin = async (page: number, limit: number = 10) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) throw new Error('User is not authorized');

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } },
      take: limit,
      skip: (page - 1) * limit,
    });

    const totalOrders = await prisma.order.count();

    return {
      orders,
      totalPages: Math.ceil(totalOrders / limit),
    };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

// Delete an order by ID (Admin only)
export const deleteOrderById = async (id: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) throw new Error('User is not authorized');

    await prisma.order.delete({
      where: { id },
    });

    revalidatePath('/admin/orders', 'page');
    return { success: true, message: 'Order deleted successfully' };
  } catch (error) {
    console.log(error);
    return { success: false, message: (error as Error).message };
  }
};
