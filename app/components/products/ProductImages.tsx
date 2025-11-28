'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const ProductImages = ({ images }: { images: string[] }) => {
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <div>
      <Image
        src={images[currentImage]}
        alt={'Product Image'}
        width={1000}
        height={1000}
        sizes='100vw'
        loading='eager'
        className='max-h-[500px] object-cover object-center rounded-lg'
      />
      {images.length > 1 && (
        <div className='flex flex-row gap-3 my-6 md:mt-7 md:mb-0'>
          {images.map((img, index) => (
            <div
              className={cn(
                'border',
                'border-orange-500',
                'cursor-pointer',
                'flex',
                'items-stretch',
                'justify-center',
                currentImage === index && 'border-2 ring-orange-600'
              )}
              key={index}
              onClick={() => setCurrentImage(index)}
            >
              <Image
                src={img}
                alt={'Product Image'}
                width={150}
                height={150}
                sizes='100vw'
                loading='eager'
                className='max-h-[150px] object-cover '
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImages;
