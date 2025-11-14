import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Product } from '@/types';
import Link from 'next/link';

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className='flex *:rounded-none *:shadow-none max-xl:flex-col max-xl:*:not-last:border-b-0 max-xl:*:first:rounded-t-xl max-xl:*:last:rounded-b-xl xl:*:not-last:border-r-0 xl:*:first:rounded-l-xl xl:*:last:rounded-r-xl'>
      <Card className='overflow-hidden pt-0 gap-4 border-gray-300 dark:dark-border-color w-full'>
        <Link href={`/products/${product.slug}`}>
          <CardContent className='px-0 h-60 flex items-stretch sm:h-70 overflow-hidden '>
            <Image
              src={product.images[0]}
              alt={product.name}
              width={0}
              height={0}
              sizes='100vw'
              loading='eager'
              className='w-full object-cover hover:scale-110 transition duration-200'
            />
          </CardContent>
          <CardHeader className='gap-1.5 px-3 py-4'>
            <small className='font-medium'>{product.brand}</small>
            <CardTitle className='text-lg truncate'>{product.name}</CardTitle>
          </CardHeader>
          <CardFooter className='flex flex-row  items-center justify-between w-full px-3'>
            {/* rate */}
            <p>{Number(product.rating)} Stars</p>
            {/* price */}
            {product.stock === 0 ? (
              <span className='text-red-600 font-medium'>Out Of Stock</span>
            ) : (
              <div className='flex flex-row items-center justify-center gap-0.5 dark:text-orange-400'>
                ca
                <p className='dirham-symbol'>&#xea;</p>
                <p>{Number(product.price)}</p>
              </div>
            )}
          </CardFooter>
        </Link>
      </Card>
    </div>
  );
};

export default ProductCard;
