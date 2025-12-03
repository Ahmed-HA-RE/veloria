'use client';

import { useEffect, useState } from 'react';
import ActionDrawer from './ActionDrawer';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '../ui/carousel';
import { Rating } from '../ui/star-rating';
import { Cart, Product } from '@/types';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';

type ProductDetailsProps = {
  product: Product;
  cart: Cart | undefined;
};

const ProductDetails = ({ product, cart }: ProductDetailsProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  // Sync carousel with thumbnail selection
  useEffect(() => {
    if (!api) return;

    api.scrollTo(selectedImage);
  }, [api, selectedImage]);

  // Update selectedImage when carousel changes
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setSelectedImage(api.selectedScrollSnap());
    };

    api.on('select', onSelect);
    onSelect();

    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  return (
    <section className='mt-4'>
      <Link className='hover:underline flex items-center gap-0.5' href='/'>
        <ArrowLeft />
        Back to Home
      </Link>
      <div className='mb-10 mt-6 md:mt-10' key={product.name}>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          <div className='grid gap-6 sm:grid-cols-2 md:col-span-2'>
            <div className='flex flex-col justify-around gap-5'>
              <h2 className='text-4xl font-semibold'>{product.name}</h2>
              <p className='text-muted-foreground'>{product.description}</p>
              <div className='flex gap-3'>
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    type='button'
                    onClick={() => setSelectedImage(index)}
                    className='cursor-pointer overflow-hidden rounded-md transition-all duration-200'
                  >
                    <Image
                      src={image}
                      alt={index.toString()}
                      width={64}
                      height={64}
                      className='object-cover'
                    />
                  </button>
                ))}
              </div>
            </div>
            <Carousel
              className='w-full'
              setApi={setApi}
              opts={{
                align: 'start',
                loop: true,
              }}
            >
              <CarouselContent>
                {product.images.map((image, index) => (
                  <CarouselItem key={`${image}-${index}`}>
                    <div className='h-82 overflow-hidden rounded-md bg-gray-100'>
                      <Image
                        src={image}
                        alt={index.toString()}
                        width={0}
                        height={0}
                        sizes='100vw'
                        className='h-full w-full object-cover'
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
          <div className='md:max-lg:col-span-2 space-y-6'>
            <div className='flex w-full items-center justify-between'>
              <span className='text-muted-foreground font-medium'>Brand</span>
              <span className='text-2xl font-semibold'>{product.brand}</span>
            </div>
            <div className='flex w-full items-center justify-between'>
              <span className='text-muted-foreground font-medium'>Price</span>
              <div className='flex flex-row items-center justify-center gap-0.5 dark:text-orange-400 text-xl font-semibold'>
                <p className='dirham-symbol'>&#xea;</p>
                <p>{product.price}</p>
              </div>
            </div>
            <div className='flex w-full items-center justify-between'>
              <span className='text-muted-foreground font-medium'>Rating</span>
              <Rating
                readOnly
                variant='yellow'
                size={24}
                value={Number(product.rating)}
                precision={0.5}
              />
            </div>
            <ActionDrawer product={product} cart={cart} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
