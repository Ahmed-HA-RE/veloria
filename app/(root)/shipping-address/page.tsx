import { getUserById } from '@/app/actions/auth';
import { getMyCart } from '@/app/actions/cart';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const ShippingAddressPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const cart = await getMyCart();

  if (!cart || cart.items.length === 0) redirect('/cart');

  if (!session) throw new Error('No user id found');

  const user = await getUserById(session?.user.id);

  return <div>ShippingAddressPage</div>;
};

export default ShippingAddressPage;
