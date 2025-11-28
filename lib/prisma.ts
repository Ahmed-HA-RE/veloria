import { PrismaClient } from './generated/prisma';
import { PrismaNeon } from '@prisma/adapter-neon';
import dotenv from 'dotenv';

dotenv.config();
const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    product: {
      price: {
        compute(product) {
          return product.price.toFixed(2);
        },
      },
      rating: {
        compute(product) {
          return product.rating.toFixed(1);
        },
      },
    },
    cart: {
      itemsPrice: {
        compute(order) {
          return order.itemsPrice.toFixed(2);
        },
      },
      shippingPrice: {
        compute(order) {
          return order.shippingPrice.toFixed(2);
        },
      },
      taxPrice: {
        compute(order) {
          return order.taxPrice.toFixed(2);
        },
      },
      totalPrice: {
        compute(order) {
          return order.totalPrice.toFixed(2);
        },
      },
    },
    order: {
      itemsPrice: {
        compute(order) {
          return order.itemsPrice.toFixed(2);
        },
      },
      shippingPrice: {
        compute(order) {
          return order.shippingPrice.toFixed(2);
        },
      },
      taxPrice: {
        compute(order) {
          return order.taxPrice.toFixed(2);
        },
      },
      totalPrice: {
        compute(order) {
          return order.totalPrice.toFixed(2);
        },
      },
    },
    orderItems: {
      price: {
        compute(orderItems) {
          return orderItems.price.toFixed(2);
        },
      },
    },
  },
});

export default prisma;
