import CheckoutStepper from '@/app/components/checkout/CheckoutStepper';
import { auth } from '@/lib/auth';
import { getUserById } from '@/lib/actions/auth';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { getMyCart } from '@/lib/actions/cart';
import { redirect } from 'next/navigation';
import PaymentMethodForm from '@/app/components/checkout/PaymentMethodForm';

export const metadata: Metadata = {
  title: 'Payment Method',
  description: 'Select your payment method during checkout.',
};

const PaymentMethodPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error('No User Found');

  const user = await getUserById(session.user.id);

  if (!user) throw new Error('User not found');

  const cart = await getMyCart();

  if (!cart || cart.items.length === 0) redirect('/cart');
  if (!user.address) redirect('/checkout/shipping-address');

  return (
    <>
      <CheckoutStepper currentStep={2} />
      <section>
        <div className='max-w-md mx-auto'>
          <h1 className='text-3xl font-bold mb-3'>Payment Method</h1>
          <p className='text-sm text-gray-400 dark:text-gray-400 text-left max-w-md mb-6'>
            Choose your preferred payment method to complete your purchase.
          </p>
          {/* Payment Method Form */}
          <PaymentMethodForm userPayment={user.paymentMethod} />
        </div>
      </section>
    </>
  );
};

export default PaymentMethodPage;
