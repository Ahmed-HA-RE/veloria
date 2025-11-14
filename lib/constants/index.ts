export const SERVER_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_DEV_URL
    : process.env.NEXT_PUBLIC_PROD_URL;

export const APP_NAME = 'Veloria';
export const LIMIT_LIST_PRODUCTS = 4;
