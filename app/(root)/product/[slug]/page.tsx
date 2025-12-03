import { getProductBySlug } from '@/lib/actions/products';
import { notFound } from 'next/navigation';
import { convertToPlainObject } from '@/lib/utils';
import { getMyCart } from '@/lib/actions/cart';
import ProductReviews from '@/app/components/products/ProductReviews';
import ProductDetails from '@/app/components/products/ProductDetails';

const ProductDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return notFound();
  const cart = await getMyCart();
  return (
    <>
      <ProductDetails product={convertToPlainObject(product)} cart={cart} />
      <ProductReviews productId={product.id} productSlug={product.slug} />
    </>
  );
};

export default ProductDetailsPage;
