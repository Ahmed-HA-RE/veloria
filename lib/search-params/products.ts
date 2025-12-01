import { parseAsInteger, parseAsString, createLoader } from 'nuqs/server';

export const productsSearchParams = {
  q: parseAsString.withDefault(''),
  category: parseAsString.withDefault(''),
  price: parseAsString.withDefault(''),
  rate: parseAsString.withDefault('all'),
  sort: parseAsString.withDefault('newest'),
  page: parseAsInteger.withDefault(1),
};
export const loadSearchParams = createLoader(productsSearchParams);
