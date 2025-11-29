import { getOrderById } from '@/lib/actions/order';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import OrderDetailsTable from '@/app/components/OrderDetailsTable';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Order Details',
  description: 'View the details of your order',
};

const OrderDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const order = await getOrderById(id);
  if (!order) notFound();

  if (session?.user.id !== order.userId && session?.user.role !== 'admin')
    redirect('/');

  return (
    <OrderDetailsTable
      order={order}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || ''}
      isAdmin={session.user.role === 'admin'}
    />
  );
};

export default OrderDetailsPage;
