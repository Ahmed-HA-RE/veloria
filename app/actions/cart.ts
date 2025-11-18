'use server';
import { CartItem } from '@/types';

export const addToCart = async (item: CartItem) => {
  try {
    return { success: true, message: `${item.name} added to cart` };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {}
};
