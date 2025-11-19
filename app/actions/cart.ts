'use server';
import { CartItem } from '@/types';
import prisma from '@/lib/prisma';
import { cartItemSchema, cartSchema } from '@/schema/cartSchema';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { cookies } from 'next/headers';
import { convertToPlainObject } from '@/lib/utils';
import { roundToTwoDecimals } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

const calcPrices = (items: CartItem[]) => {
  const itemsPrice = roundToTwoDecimals(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
  );
  // add 10 AED shipping fee for orders below 100 AED
  const shippingPrice =
    items.length > 0 ? roundToTwoDecimals(itemsPrice < 100 ? 10 : 0) : 0;
  const taxPrice = roundToTwoDecimals(itemsPrice * 0.05); // 5% tax
  const totalPrice = roundToTwoDecimals(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export const addItemToCart = async (item: CartItem) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const sessionCartId = (await cookies()).get('sessionCartId')?.value;

  const validatedCartItem = cartItemSchema.safeParse(item);
  if (!validatedCartItem.success) {
    throw new Error('Invalid cart item data');
  }

  const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calcPrices([
    validatedCartItem.data,
  ]);

  // fetch the product to ensure it exists
  const product = await prisma.product.findFirst({
    where: { id: validatedCartItem.data.productId },
  });

  if (!product) {
    throw new Error('Product not found');
  }

  const cart = await getMyCart();

  if (!cart) {
    const newCart = cartSchema.safeParse({
      sessionCartId: sessionCartId,
      userId: session?.user.id,
      items: [validatedCartItem.data],
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });
    if (newCart.success) {
      await prisma.cart.create({
        data: newCart.data,
      });
    }

    return { success: true, message: `${item.name} added to cart` };
  } else {
    // Check if the item already exists in the cart
    const existingItem = cart.items.find(
      (item) => item.productId === validatedCartItem.data.productId
    );

    if (existingItem) {
      // If it exists, update the quantity
      if (product.stock < existingItem.qty + 1)
        throw new Error('Not enough stock available');

      cart.items.find(
        (item) => item.productId === validatedCartItem.data.productId
      )!.qty++;
    } else {
      cart.items.push(validatedCartItem.data);
    }

    const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calcPrices(
      cart.items
    );

    await prisma.cart.update({
      data: {
        items: cart.items,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      },
      where: {
        id: cart.id,
      },
    });
    revalidatePath(`/product/${product.slug}`);
    return {
      success: true,
      message: existingItem
        ? `Increased quantity of ${item.name} in cart`
        : `${item.name} added to cart`,
    };
  }
};

export const getMyCart = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const sessionCartId = (await cookies()).get('sessionCartId')?.value;

  const cart = await prisma.cart.findFirst({
    where: {
      OR: [{ sessionCartId }, { userId: session?.user.id }],
    },
  });

  if (!cart) return undefined;

  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
  });
};

export const removeItemFromCart = async (productId: string) => {
  const cart = await getMyCart();

  if (!cart) throw new Error('Cart not found');

  const exist = (cart.items as CartItem[]).find(
    (item) => item.productId === productId
  );

  if (!exist) throw new Error('Item was not found in cart');

  if (exist.qty === 1) {
    cart.items = (cart.items as CartItem[]).filter(
      (item) => item.productId !== productId
    );
  } else if (exist.qty > 1) {
    (cart.items as CartItem[]).find((item) => item.productId === productId)!
      .qty--;
  }

  const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calcPrices(
    cart.items as CartItem[]
  );

  await prisma.cart.update({
    where: { id: cart.id },
    data: {
      items: cart.items,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    },
  });
  revalidatePath(`/product/${exist.productId}`);
  return {
    success: true,
    message: `${exist.name} removed from cart`,
  };
};
