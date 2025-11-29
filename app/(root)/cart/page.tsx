import CartTable from '@/app/components/cart/CartTable';
import { getMyCart } from '@/lib/actions/cart';
import { Metadata } from 'next';
import CartTotalCard from '@/app/components/cart/CartTotalCard';
import { Alert, AlertTitle } from '@/app/components/ui/alert';
import { TriangleAlertIcon } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'Shopping Cart',
  description: 'View and manage the items in your shopping cart.',
};

const CartPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const cart = await getMyCart();

  return (
    <section className='mt-2'>
      <h1 className='text-2xl md:text-3xl font-bold mb-5'>
        Your Shopping Cart
      </h1>
      {!cart || cart.items.length === 0 ? (
        <Alert className='bg-destructive dark:bg-destructive/60 border-none text-white max-w-md mx-auto'>
          <TriangleAlertIcon />
          <AlertTitle>
            Your cart is empty.{' '}
            <Link className='underline underline-offset-2' href='/'>
              Go Shopping
            </Link>
          </AlertTitle>
        </Alert>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-5 gap-x-10 gap-y-4 items-start'>
          <CartTable cart={cart} />
          <CartTotalCard cart={cart} session={session} />
        </div>
      )}
    </section>
  );
};

export default CartPage;
