'use client';
import { Cart } from '@/types';
import { Alert, AlertTitle } from '../ui/alert';
import {
  TriangleAlertIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import Link from 'next/link';
import Image from 'next/image';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart';
import { useTransition } from 'react';
import { Button } from '../ui/button';
import ScreenSpinner from '../ScreenSpinner';

const CartTable = ({ cart }: { cart: Cart }) => {
  const [isPending, startTransition] = useTransition();

  return (
    <div className='col-span-2 md:col-span-3 order-2 lg:order-1'>
      {isPending && <ScreenSpinner mutate={true} />}
      <Table>
        <TableHeader>
          <TableRow className='hover:bg-transparent'>
            <TableHead className='px-0'>Item</TableHead>
            <TableHead className='px-10'>Quantity</TableHead>
            <TableHead className='text-right'>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cart.items.map((item) => (
            <TableRow key={item.name}>
              <TableCell className='px-0'>
                <Link
                  className='flex items-center gap-4'
                  href={`/product/${item.slug}`}
                >
                  <Image
                    className='rounded-lg'
                    src={item.image}
                    width={40}
                    height={40}
                    alt={item.name}
                  />
                  <div className='font-medium truncate'>{item.name}</div>
                </Link>
              </TableCell>
              <TableCell className='px-6'>
                <div className='inline-flex -space-x-px rounded-md shadow-xs rtl:space-x-reverse'>
                  <Button
                    className='rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10'
                    variant='outline'
                    size='icon'
                    aria-label='Upvote'
                    onClick={() =>
                      startTransition(() => {
                        addItemToCart(item);
                      })
                    }
                    disabled={isPending}
                  >
                    <ChevronUpIcon size={16} aria-hidden='true' />
                  </Button>
                  <span className='flex items-center border border-input px-3 text-sm font-medium'>
                    {item.qty}
                  </span>
                  <Button
                    className='rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10'
                    variant='outline'
                    size='icon'
                    aria-label='Downvote'
                    onClick={() => {
                      startTransition(() => {
                        removeItemFromCart(item.productId);
                      });
                    }}
                    disabled={isPending}
                  >
                    <ChevronDownIcon size={16} aria-hidden='true' />
                  </Button>
                </div>
              </TableCell>
              <TableCell className='text-right px-0'>
                <div className='flex flex-row justify-end items-center gap-0.5 dark:text-orange-400'>
                  <p className='dirham-symbol'>&#xea;</p>
                  <p>{item.price}</p>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CartTable;
