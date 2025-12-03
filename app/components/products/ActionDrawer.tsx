'use client';
import { useIsMatchMedia } from '@/app/hooks/use-is-match-media';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/app/components/ui/drawer';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  CheckCircleIcon,
  Plus,
  ChevronDownIcon,
  ChevronUpIcon,
} from 'lucide-react';
import { Cart, Product } from '@/types';
import { useState, useTransition } from 'react';
import { destructiveToast, successToast } from '@/lib/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Spinner } from '../ui/spinner';
import { addItemToCart, removeItemFromCart } from '../../../lib/actions/cart';
import { Separator } from '../ui/separator';

type ActionDrawerProps = {
  product: Product;
  cart: Cart | undefined;
};

const ActionDrawer = ({ product, cart }: ActionDrawerProps) => {
  const isMobile = useIsMatchMedia('(max-width: 768px)');
  const [openDrawer, setOpenDrawer] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const matchedProductInCart = cart?.items.find(
    (item) => item.productId === product.id
  );

  const showQuantityButtons =
    matchedProductInCart && matchedProductInCart?.qty >= 1;

  const handleAddToCart = async () => {
    startTransition(async () => {
      try {
        const res = await addItemToCart({
          image: product.images[0],
          productId: product.id,
          qty: 1,
          price: product.price,
          name: product.name,
          slug: product.slug,
        });

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
            actionButton: '!font-bold !text-sm !py-4 !px-4',
          },
        });
      } catch (error: any) {
        destructiveToast(error.message);
      }
    });
  };

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      try {
        const res = await removeItemFromCart(product.id);
        successToast(res?.message);
      } catch (error: any) {
        destructiveToast(error.message);
      }
    });
  };

  return (
    <Drawer
      open={openDrawer}
      onOpenChange={setOpenDrawer}
      direction={isMobile ? 'bottom' : 'right'}
    >
      <DrawerTrigger asChild>
        <Button
          className='dark:bg-white dark:hover:bg-gray-200'
          onClick={() => setOpenDrawer(true)}
        >
          View Product Details
        </Button>
      </DrawerTrigger>
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
          <Separator className='bg-gray-300 my-1' />
          {/* Stock */}
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
          {/* if there is already an item in cart */}
          {showQuantityButtons && (
            <>
              <Separator className='bg-gray-300 my-1' />
              {/* Quantity in cart */}
              <div className='flex flex-row justify-between items-center '>
                <p className='font-semibold'>In Your Cart</p>
                <div className='inline-flex -space-x-px rounded-md shadow-xs rtl:space-x-reverse'>
                  <Button
                    className='rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10'
                    variant='outline'
                    size='icon'
                    aria-label='Upvote'
                    onClick={handleAddToCart}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Spinner className='size-4 ' />
                    ) : (
                      <ChevronUpIcon size={16} aria-hidden='true' />
                    )}
                  </Button>
                  <span className='flex items-center border border-input px-3 text-sm font-medium'>
                    {matchedProductInCart?.qty}
                  </span>
                  <Button
                    className='rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10'
                    variant='outline'
                    size='icon'
                    aria-label='Downvote'
                    onClick={handleRemoveFromCart}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Spinner className='size-4 ' />
                    ) : (
                      <ChevronDownIcon size={16} aria-hidden='true' />
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
        <DrawerFooter className='gap-3'>
          {!showQuantityButtons && (
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
          )}
          <Button
            onClick={() => setOpenDrawer(false)}
            className='bg-gray-800 hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-200'
          >
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ActionDrawer;
