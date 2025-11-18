'use client';
import { useIsMatchMedia } from '@/app/hooks/use-is-match-media';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/app/components/ui/drawer';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowLeft, CheckCircleIcon, Plus } from 'lucide-react';
import { Product } from '@/types';
import { useState } from 'react';
import Link from 'next/link';
import { destructiveToast } from '@/lib/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Spinner } from '../ui/spinner';
import { addToCart } from '../../actions/cart';

const ActionDrawer = ({ product }: { product: Product }) => {
  const isMobile = useIsMatchMedia('(max-width: 768px)');
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleAddToCart = async () => {
    setIsPending(true);
    const res = await addToCart({
      image: product.images[0],
      productId: product.id,
      qty: 1,
      price: product.price,
      name: product.name,
      slug: product.slug,
    });

    if (res && !res.success) {
      destructiveToast(res.message);
      setIsPending(false);
      return;
    }

    toast(res?.message, {
      action: {
        label: 'Go to cart',
        onClick: () => {
          router.push('/cart');
        },
      },
      position: 'top-left',
      classNames: {
        toast: '!w-[468px]',
      },
    });
    setIsPending(false);
  };

  return (
    <>
      <div className='flex flex-row justify-between items-center mb-4'>
        <Link
          className='hover:underline flex items-center gap-0.5'
          href='/products'
        >
          <ArrowLeft />
          Back to Products
        </Link>
        <Button
          className='font-bold dark:bg-white dark:hover:bg-gray-200'
          onClick={() => setOpenDrawer(true)}
        >
          View Product Details
        </Button>
      </div>
      <Drawer
        open={openDrawer}
        onOpenChange={setOpenDrawer}
        direction={isMobile ? 'bottom' : 'right'}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className='text-xl'>View Product Details</DrawerTitle>
            <DrawerDescription>
              Check stock, price, and add to cart.
            </DrawerDescription>
          </DrawerHeader>
          {/* Price */}
          <div className='my-5 px-4 flex flex-col gap-4'>
            <div className='flex flex-row justify-between items-center'>
              <p className='font-semibold'>Price</p>
              <div className='flex flex-row items-center justify-center gap-0.5 dark:text-orange-400'>
                <p className='dirham-symbol'>&#xea;</p>
                <p>{product.price}</p>
              </div>
            </div>
            {/* Status */}
            <div className='flex flex-row justify-between items-center '>
              <p className='font-semibold'>Stock</p>
              {product.stock > 0 ? (
                <Badge
                  variant='outline'
                  className='border-green-600 text-green-600 dark:border-green-400 dark:text-green-400 [a&]:hover:bg-green-600/10 [a&]:hover:text-green-600/90 dark:[a&]:hover:bg-green-400/10 dark:[a&]:hover:text-green-400/90'
                >
                  <CheckCircleIcon className='size-3' />
                  In Stock
                </Badge>
              ) : (
                <Badge className='bg-destructive/10 [a&]:hover:bg-destructive/5 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive rounded-full border-none focus-visible:outline-none'>
                  Out of Stock
                </Badge>
              )}
            </div>
          </div>
          <DrawerFooter className='gap-3'>
            <Button
              disabled={product.stock === 0 || isPending}
              className='w-full bg-gray-800 hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-200'
              onClick={handleAddToCart}
            >
              {product.stock === 0 ? (
                'Out Of Stock'
              ) : isPending ? (
                <Spinner className='size-7' />
              ) : (
                <>
                  <Plus /> Add to Cart
                </>
              )}
            </Button>
            <Button
              onClick={() => setOpenDrawer(false)}
              className='bg-gray-800 hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-200'
            >
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ActionDrawer;
