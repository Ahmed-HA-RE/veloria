import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { deleteOrderById, getOrdersForAdmin } from '@/app/actions/order';
import { Boxes, X } from 'lucide-react';
import { Alert, AlertTitle } from '@/app/components/ui/alert';
import PaginationControls from '@/app/components/Pagination';
import { Metadata } from 'next';
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
import Link from 'next/link';
import DeleteDialog from '@/app/components/shared/DeleteDialog';

export const metadata: Metadata = {
  title: 'Admin Orders',
  description: 'View and manage all orders placed on the store — admin panel.',
};

const AdminOrdersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const page = Number((await searchParams).page) || 1;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'admin')
    throw new Error('User is not authorized');

  const { orders, totalPages } = await getOrdersForAdmin(page);

  return (
    <section className='mt-4'>
      <h1 className='text-3xl md:text-4xl font-bold mb-4'>Orders</h1>
      {!orders || orders.length === 0 ? (
        <Alert className='bg-destructive dark:bg-destructive/60 border-none text-white max-w-md mx-auto'>
          <Boxes />
          <AlertTitle>No Orders Found</AlertTitle>
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
                <TableHead className='text-left'>ACTIONS</TableHead>
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
                  <TableCell className='px-4 text-left'>
                    <Button size='sm' asChild>
                      <Link href={`/order/${order.id}`}>Details</Link>
                    </Button>
                    <DeleteDialog id={order.id} action={deleteOrderById} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {totalPages > 1 && orders.length > 0 && (
            <PaginationControls currentPage={page} totalPages={totalPages} />
          )}
        </>
      )}
    </section>
  );
};

export default AdminOrdersPage;
