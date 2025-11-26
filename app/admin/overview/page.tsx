import { auth } from '@/lib/auth';
import { getOrdersOverview } from '@/app/actions/order';
import { headers } from 'next/headers';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/app/components/ui/card';
import { BanknoteArrowUp, Barcode, CreditCard, Users } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { formatDateTime } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import BarChartOverview from '@/app/components/admin/OverviewChart';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Overview of sales, customers, orders and products.',
};

const AdminOverviewPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) throw new Error('Unauthorized');

  const ordersSummary = await getOrdersOverview();

  return (
    <section className='mt-4'>
      <h1 className='text-3xl md:text-4xl font-bold mb-4'>Dashboard</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
        {/* Total Sales */}
        <Card className='py-4 gap-3 border-gray-300 dark:dark-border-color'>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle className='text-xl'>Total Sales</CardTitle>
            <BanknoteArrowUp size={30} />
          </CardHeader>
          <CardContent className='flex flex-row items-center gap-0.5 dark:text-orange-400 text-2xl font-bold'>
            <p className='dirham-symbol'>&#xea;</p>
            <p>
              {Number(
                ordersSummary.totalRevenueData._sum.totalPrice?.toString()
              ).toLocaleString() || 0}
            </p>
          </CardContent>
        </Card>
        {/* Total Sold */}
        <Card className='py-4 gap-3 border-gray-300 dark:dark-border-color'>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle className='text-xl'>Total Sold</CardTitle>
            <CreditCard size={30} />
          </CardHeader>
          <CardContent>
            <p className='dark:text-orange-400 text-2xl font-bold'>
              {ordersSummary.ordersSales}
            </p>
          </CardContent>
        </Card>
        {/* Total Customers */}
        <Card className='py-4 gap-3 border-gray-300 dark:dark-border-color'>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle className='text-xl'>Total Customers</CardTitle>
            <Users size={30} />
          </CardHeader>
          <CardContent>
            <p className='dark:text-orange-400 text-2xl font-bold'>
              {ordersSummary.totalCustomers}
            </p>
          </CardContent>
        </Card>
        {/* Total Products */}
        <Card className='py-4 gap-3 border-gray-300 dark:dark-border-color'>
          <CardHeader className='flex flex-row items-center justify-between'>
            <CardTitle className='text-xl'>Total Products</CardTitle>
            <Barcode size={30} />
          </CardHeader>
          <CardContent>
            <p className='dark:text-orange-400 text-2xl font-bold'>
              {ordersSummary.totalProducts}
            </p>
          </CardContent>
        </Card>
      </div>
      {/* Chart and Recent sales  */}
      <div className='grid grid-cols-1 lg:grid-cols-7 gap-4'>
        {/* Chart */}
        <div className='lg:col-span-4'>
          <Card className='dark:dark-border-color py-4 gap-2'>
            <CardHeader className='px-3'>
              <CardTitle className='text-2xl'>Overview</CardTitle>
            </CardHeader>
            <CardContent className='px-2'>
              <BarChartOverview salesData={ordersSummary.salesData} />
            </CardContent>
          </Card>
        </div>
        {/* Recent Sales */}
        <div className='lg:col-span-3 h-full'>
          <Card className='dark:dark-border-color py-4 gap-0 h-full'>
            <CardHeader>
              <CardTitle className='text-2xl'>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className='hover:bg-transparent'>
                    <TableHead>BUYER</TableHead>
                    <TableHead>DATE</TableHead>
                    <TableHead>TOTAL</TableHead>
                    <TableHead className='text-right'>ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordersSummary.recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className='font-medium'>
                        {order.user.name}
                      </TableCell>
                      <TableCell>
                        {formatDateTime(order.createdAt).dateOnly}
                      </TableCell>
                      <TableCell className='px-2'>
                        <div className='flex flex-row  gap-0.5 dark:text-orange-400'>
                          <p className='dirham-symbol'>&#xea;</p>
                          <p>{order.totalPrice}</p>
                        </div>
                      </TableCell>
                      <TableCell className='text-right'>
                        <Button size={'sm'} asChild>
                          <Link href={`/order/${order.id}`}>Details</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AdminOverviewPage;
