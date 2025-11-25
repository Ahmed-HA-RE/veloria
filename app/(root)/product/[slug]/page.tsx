import { getProductBySlug } from '@/app/actions/products';
import { notFound } from 'next/navigation';
import ActionDrawer from '@/app/components/products/ActionDrawer';
import { convertToPlainObject } from '@/lib/utils';
import ProductImages from '@/app/components/products/ProductImages';
import { getMyCart } from '@/app/actions/cart';

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
    <section>
      <ActionDrawer product={convertToPlainObject(product)} cart={cart} />
      <div className='flex flex-col md:flex-row  md:items-start gap-6 mt-4'>
        {/* Image */}
        <div className='flex-1/3 mx-auto w-full'>
          <ProductImages images={product.images} />
        </div>
        {/* Details */}
        <div className='flex-1/3 md:pt-4'>
          <div className='flex flex-col justify-center items-start gap-5'>
            <p>{product.brand}</p>
            <h2 className='text-2xl font-bold'>{product.name}</h2>
            <p>
              {product.rating} of {product.numReviews} reviews
            </p>
            <div className='flex flex-row items-center justify-center gap-0.5 text-green-700 dark:text-green-800 py-2 px-4 rounded-full bg-green-200/80 dark:bg-green-300/80'>
              <p className='dirham-symbol'>&#xea;</p>
              <p>{product.price}</p>
            </div>
            <div className=' font-bold text-lg'>
              Description
              <p className='font-normal text-base'>{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailsPage;
