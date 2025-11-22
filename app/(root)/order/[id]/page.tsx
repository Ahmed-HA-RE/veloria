import { getOrderById } from '@/app/actions/order';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import OrderDetailsTable from '@/app/components/OrderDetailsTable';

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

  const order = await getOrderById(id);
  if (!order) notFound();

  return <OrderDetailsTable order={order} />;
};

export default OrderDetailsPage;
