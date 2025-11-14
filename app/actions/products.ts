'use server';
import { LIMIT_LIST_PRODUCTS } from '@/lib/constants';
import prisma from '@/lib/prisma';

export const getLatestProducts = async () => {
  const data = await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: LIMIT_LIST_PRODUCTS,
  });
  return data.map((product) => ({
    ...product,
    price: product.price.toFixed(2),
    rating: product.rating.toFixed(1),
  }));
};
