import { getFeaturedProducts } from '@/lib/actions/products';
import FeaturedCarousel from '../components/FeaturedCarousel';
import ProductCategory from '../components/products/ProductCategory';
import ProductList from '../components/products/ProductList';
import Features from '../components/Features';

const HomePage = async () => {
  const featuredProducts = await getFeaturedProducts();
  return (
    <>
      {featuredProducts.length > 0 && (
        <FeaturedCarousel products={featuredProducts} />
      )}
      <ProductList />
      <ProductCategory />
      <Features />
    </>
  );
};

export default HomePage;
