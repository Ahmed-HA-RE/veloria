import { Alert, AlertTitle } from '../ui/alert';
import { TriangleAlertIcon } from 'lucide-react';
import ProductCard from './ProductCard';
import { getLatestProducts } from '../../../lib/actions/products';

const ProductList = async () => {
  const products = await getLatestProducts();
  return (
    <section className='mt-12'>
      <h2 className='mb-6 font-bold text-3xl md:text-4xl'>Newest Arrivals</h2>
      {products.length === 0 ? (
        <Alert className='bg-destructive/10 text-destructive border-none max-w-lg mx-auto'>
          <TriangleAlertIcon />
          <AlertTitle>No products found</AlertTitle>
        </Alert>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductList;
