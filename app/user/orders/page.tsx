import Link from 'next/link';
import { getMyOrders } from '@/lib/actions/order';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';
import { TriangleAlertIcon, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { convertToNumber, formatDateTime, formatId } from '@/lib/utils';
import { Button } from '@/app/components/ui/button';
import PaginationControls from '@/app/components/Pagination';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Orders',
  description: 'View and manage your orders.',
};

const UserOrdersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const page = Number((await searchParams).page) || 1;

  const result = await getMyOrders(page);
  const { orders } = result;

  return (
    <section className='mt-4'>
      <h1 className='text-3xl md:text-4xl font-bold mb-4'>My Orders</h1>
      {!orders || orders.length === 0 ? (
        <Alert className='bg-destructive dark:bg-destructive/60 border-none text-white max-w-md mx-auto'>
          <TriangleAlertIcon />
          <AlertTitle>No Orders Found</AlertTitle>
          <AlertDescription className='text-white/80 inline-block'>
            You have not placed any orders yet.{' '}
            <Link
              className='underline underline-offset-2 text-white'
              href={'/'}
            >
              Start Shopping
            </Link>
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow className='hover:bg-transparent'>
                <TableHead className='px-4'>ID</TableHead>
                <TableHead className='px-4'>DATE</TableHead>
                <TableHead className='px-4'>TOTAL</TableHead>
                <TableHead className='px-4'>PAID</TableHead>
                <TableHead className='px-4'>DELIVERED</TableHead>
                <TableHead className='px-4 text-right'>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className='px-4 font-medium'>
                    {formatId(order.id)}
                  </TableCell>
                  <TableCell className='px-4'>
                    {formatDateTime(order.createdAt).dateTime}
                  </TableCell>
                  <TableCell className='px-4'>
                    <div className='flex gap-0.5 dark:text-orange-400'>
                      <p className='dirham-symbol'>&#xea;</p>
                      <p>{convertToNumber(order.totalPrice)}</p>
                    </div>
                  </TableCell>
                  <TableCell className='px-4'>
                    {order.paidAt && order.isPaid ? (
                      formatDateTime(order.paidAt).dateTime
                    ) : (
                      <span className='flex items-center gap-1'>
                        <X className='text-red-500' />
                        Not Paid
                      </span>
                    )}
                  </TableCell>
                  <TableCell className='px-4'>
                    {order.deliveredAt && order.isDelivered ? (
                      formatDateTime(order.deliveredAt).dateOnly
                    ) : (
                      <span className='flex items-center gap-1'>
                        <X className='text-red-500' />
                        Not Delivered
                      </span>
                    )}
                  </TableCell>
                  <TableCell className='px-4 text-right'>
                    <Button size='sm' asChild>
                      <Link href={`/order/${order.id}`}>Details</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {result.totalPages > 1 && orders.length > 0 && (
            <PaginationControls
              currentPage={page}
              totalPages={result.totalPages}
            />
          )}
        </>
      )}
    </section>
  );
};

export default UserOrdersPage;
