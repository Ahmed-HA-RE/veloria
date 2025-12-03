import Link from 'next/link';
import Image from 'next/image';
import { SERVER_URL } from '@/lib/constants';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Card, CardContent } from '../ui/card';
import { Rating } from '../ui/star-rating';
import ProductReviewForm from './ProductReviewForm';
import {
  getAllReviewsByProductId,
  getUserReviewsByProductId,
} from '@/lib/actions/review';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { formatDateTime } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Check, X } from 'lucide-react';
import { Suspense } from 'react';

type ProductReviewsProps = {
  productId: string;
  userId?: string;
  productSlug: string;
};

const ProductReviews = async ({
  productId,
  productSlug,
}: ProductReviewsProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const reviews = await getAllReviewsByProductId(productId);
  const userReview = await getUserReviewsByProductId(productId);

  return (
    <section>
      <div className='space-y-6 md:space-y-8 lg:space-y-8 pt-15 pb-6'>
        <div className='text-center flex flex-col justify-center items-center gap-6'>
          <h2 className='relative z-1 font-semibold text-3xl lg:text-4xl'>
            Customer Reviews
            <span
              className='from-primary absolute bottom-0 left-0 -z-1 h-0.5 w-full rounded-full bg-gradient-to-r to-transparent'
              aria-hidden='true'
            />
          </h2>
          {!session?.user.id ? (
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
            <ProductReviewForm userReview={userReview} productId={productId} />
          )}
          {reviews.length === 0 ? (
            <p className='text-base text-center font-bold '>No reviews yet.</p>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 '>
              {reviews.map((review, index) => (
                <Card key={index} className='border duration-300 shadow-md'>
                  <CardContent className='space-y-6'>
                    <div className='flex flex-row justify-between items-center gap-3'>
                      <Rating
                        readOnly
                        variant='yellow'
                        size={24}
                        value={review.rating}
                        precision={1}
                      />

                      <div className='flex grow justify-end gap-1.5'>
                        {review.user.emailVerified ? (
                          <Badge
                            variant='outline'
                            className='rounded-sm border-green-600 text-green-600 dark:border-green-400 dark:text-green-400 [a&]:hover:bg-green-600/10 [a&]:hover:text-green-600/90 dark:[a&]:hover:bg-green-400/10 dark:[a&]:hover:text-green-400/90'
                          >
                            <Check className='size-3' />
                            Verified
                          </Badge>
                        ) : (
                          <Badge
                            variant='outline'
                            className='text-destructive [a&]:hover:bg-destructive/10 [a&]:hover:text-destructive/90 border-destructive rounded-sm'
                          >
                            <X className='size-3' />
                            Not Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className='space-y-2 text-left'>
                      <h3 className='text-lg font-semibold'>{review.title}</h3>
                      <p className='text-muted-foreground text-sm'>
                        {review.comment}
                      </p>
                    </div>
                    <div className='flex items-center gap-3'>
                      <Avatar>
                        <Suspense
                          fallback={
                            <AvatarFallback className='bg-gray-200 text-base font-semibold'>
                              {review.user.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          }
                        >
                          <Image
                            src={review.user.image}
                            alt='logo'
                            width={50}
                            height={50}
                            className='object-cover'
                          />
                        </Suspense>
                      </Avatar>
                      <div className='text-left'>
                        <h4 className='font-medium'>{review.user.name}</h4>
                        <p className='text-muted-foreground text-sm'>
                          {formatDateTime(review.createdAt).dateOnly}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductReviews;
