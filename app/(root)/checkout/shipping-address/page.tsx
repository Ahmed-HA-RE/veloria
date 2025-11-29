import { getUserById } from '@/lib/actions/auth';
import { getMyCart } from '@/lib/actions/cart';
import CheckoutStepper from '@/app/components/checkout/CheckoutStepper';
import ShippingAddressForm from '@/app/components/checkout/ShippingAddressForm';
import { auth } from '@/lib/auth';
import { Shipping } from '@/types';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Address',
  description: 'Provide your shipping address.',
};

const ShippingAddressPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const cart = await getMyCart();

  if (!cart || cart.items.length === 0) redirect('/cart');

  if (!session) throw new Error('No user id found');

  const user = await getUserById(session?.user.id);

  return (
    <>
      <CheckoutStepper currentStep={1} />
      <section>
        <div className='max-w-md mx-auto'>
          <h1 className='text-3xl font-bold mb-3'>Shipping Address</h1>
          <p className='text-sm text-gray-400 dark:text-gray-400 text-left max-w-md mb-6'>
            Please provide your full address and contact information to complete
            your delivery.
          </p>
          {/* Shipping Address Form */}
          <ShippingAddressForm userAddress={user.address as Shipping} />
        </div>
      </section>
    </>
  );
};

export default ShippingAddressPage;
