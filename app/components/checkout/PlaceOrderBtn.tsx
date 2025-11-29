'use client';
import { useTransition } from 'react';
import { Button } from '../ui/button';
import ScreenSpinner from '../ScreenSpinner';
import { Check } from 'lucide-react';
import { successToast, destructiveToast } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { createOrder } from '@/lib/actions/order';

const PlaceOrderBtn = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handlePlaceOrder = () => {
    startTransition(async () => {
      try {
        const res = await createOrder();

        if (res.success) {
          successToast(res.message);
          setTimeout(() => router.push(res.redirect), 1500);
        }
      } catch (error) {
        if (error instanceof Error) {
          destructiveToast(error.message);
        }
      }
    });
  };

  return (
    <>
      {isPending && <ScreenSpinner mutate={true} />}
      <Button
        size={'lg'}
        variant={'outline'}
        className='w-full dark:dark-border-color border-black bg-transparent'
        disabled={isPending}
        onClick={handlePlaceOrder}
      >
        <Check /> Place Order
      </Button>
    </>
  );
};

export default PlaceOrderBtn;
