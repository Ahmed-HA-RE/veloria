'use client';

import { useState } from 'react';
import { Alert, AlertTitle } from '../ui/alert';
import Link from 'next/link';
import { SERVER_URL } from '@/lib/constants';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Rating } from '../ui/star-rating';
import ProductReviewForm from './ProductReviewForm';

type ProductReviewsProps = {
  productId: string;
  userId?: string;
  productSlug: string;
};

const testimonials = [
  {
    name: 'Eleanor Pena',
    handle: '@BerryB777',
    avatar:
      'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png?width=48&height=48&format=auto',
    rating: 5,
    title: 'Seamless Integration',
    content:
      'shadcn/studio has made my development process so much easier! The components are intuitive and blend perfectly with Tailwind CSS.',
    platformName: 'G2',
    platformImage:
      'https://cdn.shadcnstudio.com/ss-assets/brand-logo/g2-logo.png?width=22&height=22&format=auto',
  },
  {
    name: 'Darlene Robertson',
    handle: '@LatentHQ',
    avatar:
      'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png?width=48&height=48&format=auto',
    rating: 5,
    title: 'Incredible Support',
    content:
      'The support team behind shadcn/studio is fantastic! They helped me with integration issues quickly and efficiently.',
    platformName: 'Trustpilot',
    platformImage:
      'https://cdn.shadcnstudio.com/ss-assets/brand-logo/trustpilot-icon.png?width=22&height=22&format=auto',
  },
  {
    name: 'Esther Howard',
    handle: '@oxtuggs',
    avatar:
      'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png?width=48&height=48&format=auto',
    rating: 4.5,
    title: 'Fantastic Component Library',
    content:
      'shadcn/studio is a fantastic tool for any developer using Shadcn UI. The components are not only beautiful but also functional!',
    platformName: 'Twitter',
    platformImage:
      'https://cdn.shadcnstudio.com/ss-assets/brand-logo/twitter-icon.png?width=22&height=22&format=auto',
  },
  {
    name: 'Floyd Miles',
    handle: '@Athar',
    avatar:
      'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png?width=48&height=48&format=auto',
    rating: 4.5,
    title: 'Game Changer for Developers',
    content:
      'Using shadcn/studio has transformed the way I build applications. The ease of use and flexibility is unmatched!',
    platformName: 'Twitter',
    platformImage:
      'https://cdn.shadcnstudio.com/ss-assets/brand-logo/twitter-icon.png?width=22&height=22&format=auto',
  },
  {
    name: 'Brad Hanna',
    handle: '@Marko',
    avatar:
      'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png?width=48&height=48&format=auto',
    rating: 4.5,
    title: 'Perfect for Rapid Development',
    content:
      'shadcn/studio has significantly sped up my development process. The pre-built components are perfect for rapid prototyping!',
    platformName: 'Twitter',
    platformImage:
      'https://cdn.shadcnstudio.com/ss-assets/brand-logo/twitter-icon.png?width=22&height=22&format=auto',
  },
  {
    name: 'Cody Fisher',
    handle: '@BerryB777',
    avatar:
      'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png?width=48&height=48&format=auto',
    rating: 5,
    title: 'Effortless Design',
    content:
      'shadcn/studio has made designing my web applications effortless. The components are easy to customize and integrate seamlessly!',
    platformName: 'G2',
    platformImage:
      'https://cdn.shadcnstudio.com/ss-assets/brand-logo/g2-logo.png?width=22&height=22&format=auto',
  },
  {
    name: 'Theresa Webb',
    handle: '@inverse_hq',
    avatar:
      'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png?width=48&height=48&format=auto',
    rating: 4.5,
    title: 'Highly Recommended',
    content:
      "The attention to detail in shadcn/studio's components is impressive. It saves me so much time and effort in my projects!",
    platformName: 'Trustpilot',
    platformImage:
      'https://cdn.shadcnstudio.com/ss-assets/brand-logo/trustpilot-icon.png?width=22&height=22&format=auto',
  },
];

const ProductReviews = ({
  productId,
  userId,
  productSlug,
}: ProductReviewsProps) => {
  const [reviews, setReviews] = useState(['hi']);

  return (
    <div className='py-10 pt-14'>
      {reviews.length === 0 ? (
        <Alert className='max-w-md border-black dark:dark-border-color mx-auto'>
          <AlertTitle>No reviews yet.</AlertTitle>
        </Alert>
      ) : (
        <div className='space-y-6 md:spaec-y-8 lg:space-y-8'>
          <div className='text-center flex flex-col justify-center items-center gap-4'>
            <h2 className='relative z-1 font-semibold text-3xl lg:text-4xl'>
              Customer Reviews
              <span
                className='from-primary absolute bottom-0 left-0 -z-1 h-0.5 w-full rounded-full bg-gradient-to-r to-transparent'
                aria-hidden='true'
              />
            </h2>
            {!userId ? (
              <div className='block'>
                Please{' '}
                <Link
                  href={`/signin?callbackUrl=${SERVER_URL}/product/${productSlug}`}
                  className='text-blue-500 underline underline-offset-2'
                >
                  sign in
                </Link>{' '}
                to share your review
              </div>
            ) : (
              <ProductReviewForm />
            )}
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 '>
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className='break-inside-avoid-column border-none duration-300 shadow-md'
              >
                <CardContent className='space-y-6'>
                  <div className='flex items-center justify-between gap-3'>
                    <Rating
                      readOnly
                      variant='yellow'
                      size={24}
                      value={testimonial.rating}
                      precision={0.5}
                    />

                    <div className='flex grow justify-end gap-1.5'>
                      {/* created at */}
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <h3 className='text-lg font-semibold'>
                      {testimonial.title}
                    </h3>
                    <p className='text-muted-foreground'>
                      {testimonial.content}
                    </p>
                  </div>
                  <div className='flex items-center gap-3'>
                    <Avatar className='size-12'>
                      <AvatarImage
                        src={testimonial.avatar}
                        alt={testimonial.name}
                      />
                      <AvatarFallback className='text-sm'>
                        {testimonial.name
                          .split(' ', 2)
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className='font-medium'>{testimonial.name}</h4>
                      <p className='text-muted-foreground text-sm'>
                        {/* verfied badge */}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
