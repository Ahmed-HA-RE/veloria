'use client';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/app/components/ui/card';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
} from '@/app/components/ui/table';
import Image from 'next/image';
import { Separator } from '@/app/components/ui/separator';
import { Order } from '@/types';
import {
  destructiveToast,
  formatDateTime,
  formatId,
  successToast,
} from '@/lib/utils';
import { Badge } from './ui/badge';
import {
  createOrderPayment,
  confirmOrderPayment,
  updateOrderToPaidCOD,
  updateOrderToDelivered,
} from '../../lib/actions/order';
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import { Spinner } from './ui/spinner';
import { Button } from './ui/button';
import { useTransition } from 'react';

type OrderDetailsTableProps = {
  order: Order;
  paypalClientId: string;
  isAdmin: boolean;
};

const OrderDetailsTable = ({
  order,
  paypalClientId,
  isAdmin,
}: OrderDetailsTableProps) => {
  // PayPal Loading Screen
  const PayPalLoadingScreen = () => {
    const [{ isPending }] = usePayPalScriptReducer();
    return isPending ? <Spinner className='text-black size-8 mx-auto' /> : null;
  };
  const [isPending, startTransition] = useTransition();

  const handleCreateOrder = async () => {
    const res = await createOrderPayment(order.id);
    return res.id;
  };

  const handleApproveOrder = async (data: { orderID: string }) => {
    const res = await confirmOrderPayment(order.id, data);

    if (!res.success) {
      destructiveToast(res.message);
    } else {
      successToast(res.message);
    }
  };

  const handleMarkAsPaidCOD = async () => {
    startTransition(async () => {
      const res = await updateOrderToPaidCOD(order.id);

      if (!res.success) {
        destructiveToast(res.message);
      } else {
        successToast(res.message);
      }
    });
  };

  const handleMarkAsDelivered = async () => {
    startTransition(async () => {
      const res = await updateOrderToDelivered(order.id);

      if (!res.success) {
        destructiveToast(res.message);
      } else {
        successToast(res.message);
      }
    });
  };

  return (
    <section className='mt-4'>
      <h1 className='text-3xl font-bold mb-4'>Order {formatId(order.id)}</h1>
      <div className='grid grid-cols-1 md:grid-cols-5 gap-5'>
        {/* Left Col */}
        <div className='md:col-span-3 space-y-5 order-2 md:order-1'>
          {/* Payment Method Card */}
          <Card className='dark:dark-border-color gap-3 py-4'>
            <CardHeader className='px-4 gap-0'>
              <CardTitle className='text-2xl font-medium'>
                Payment Method:
              </CardTitle>
            </CardHeader>
            <CardContent className='px-4 space-y-2 mb-2'>
              <p className='font-bold'>
                Selected:{' '}
                <span className='font-normal'>{order.paymentMethod}</span>
              </p>
            </CardContent>
            <CardFooter className='px-4'>
              {order.isPaid ? (
                <Badge className='border-none bg-green-600/10 text-green-600 focus-visible:ring-green-600/20 focus-visible:outline-none dark:bg-green-400/10 dark:text-green-400 dark:focus-visible:ring-green-400/40 [a&]:hover:bg-green-600/5 dark:[a&]:hover:bg-green-400/5'>
                  <span
                    className='size-1.5 rounded-full bg-green-600 dark:bg-green-400'
                    aria-hidden='true'
                  />
                  Paid at {formatDateTime(order.paidAt!).dateTime}
                </Badge>
              ) : (
                <Badge className='bg-destructive/10 [a&]:hover:bg-destructive/5 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive border-none focus-visible:outline-none min-w-27'>
                  <span
                    className='bg-destructive size-1.5 rounded-full'
                    aria-hidden='true'
                  />
                  Not Paid
                </Badge>
              )}
            </CardFooter>
          </Card>

          {/* Shipping Card */}
          <Card className='dark:dark-border-color gap-3 py-4'>
            <CardHeader className='px-4'>
              <CardTitle className='text-2xl font-medium'>
                Shipping Address:
              </CardTitle>
            </CardHeader>
            <CardContent className='px-4 space-y-2 mb-2'>
              <p className='font-bold'>
                Name:{' '}
                <span className='font-normal'>
                  {order.shippingAddress.fullName}
                </span>
              </p>
              <p className='font-bold'>
                Address:{' '}
                <span className='font-normal'>
                  {order.shippingAddress.streetAddress.includes('street')
                    ? order.shippingAddress.streetAddress
                    : `${order.shippingAddress.streetAddress} street`}
                  , {order.shippingAddress.city}
                </span>
              </p>
            </CardContent>
            <CardFooter className='px-4'>
              {order.isDelivered ? (
                <Badge className='border-none bg-green-600/10 text-green-600 focus-visible:ring-green-600/20 focus-visible:outline-none dark:bg-green-400/10 dark:text-green-400 dark:focus-visible:ring-green-400/40 [a&]:hover:bg-green-600/5 dark:[a&]:hover:bg-green-400/5'>
                  <span
                    className='size-1.5 rounded-full bg-green-600 dark:bg-green-400'
                    aria-hidden='true'
                  />
                  Delivered at {formatDateTime(order.deliveredAt!).dateTime}
                </Badge>
              ) : (
                <Badge className='bg-destructive/10 [a&]:hover:bg-destructive/5 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive border-none focus-visible:outline-none min-w-28'>
                  <span
                    className='bg-destructive size-1.5 rounded-full'
                    aria-hidden='true'
                  />
                  Not Delivered
                </Badge>
              )}
            </CardFooter>
          </Card>

          {/* Orders */}
          <Card className='dark:dark-border-color gap-0 py-4'>
            <CardHeader className='px-4'>
              <CardTitle className='text-2xl font-medium'>
                Order Items:
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Items Table */}
              <Table>
                <TableHeader>
                  <TableRow className='hover:bg-transparent'>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className='text-right'>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.orderItems.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell className='px-0'>
                        <Link
                          className='flex items-center gap-4'
                          href={`/product/${item.slug}`}
                        >
                          <Image
                            className='rounded-lg'
                            src={item.image}
                            width={40}
                            height={40}
                            alt={item.name}
                            loading='eager'
                          />
                          <div className='font-medium truncate'>
                            {item.name}
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className='px-6'>
                        <span>{item.qty}</span>
                      </TableCell>
                      <TableCell className='text-right px-0'>
                        <div className='flex flex-row justify-end items-center gap-0.5 dark:text-orange-400'>
                          <p className='dirham-symbol'>&#xea;</p>
                          <p>{item.price}</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        {/* Right Col */}
        <div className='md:col-span-2 order-1 md:order-2'>
          <Card className='dark:dark-border-color gap-6 pb-3'>
            <CardContent className='md:px-3 '>
              {/* Items Before Tax and Shipping */}
              <div className='flex flex-row justify-between items-center'>
                <p>Items:</p>
                <div className='flex flex-row justify-end items-center gap-0.5 dark:text-orange-400'>
                  <p className='dirham-symbol'>&#xea;</p>
                  <p>{order.itemsPrice}</p>
                </div>
              </div>
              <Separator className='my-4' />
              {/* Shipping */}
              <div className='flex flex-row justify-between items-center'>
                <p>Shipping:</p>
                <div className='flex flex-row justify-end items-center gap-0.5 dark:text-orange-400'>
                  <p className='dirham-symbol'>&#xea;</p>
                  <p>{order.shippingPrice}</p>
                </div>
              </div>
              <Separator className='my-4' />
              {/* Tax */}
              <div className='flex flex-row justify-between items-center'>
                <p>Tax:</p>
                <div className='flex flex-row justify-end items-center gap-0.5 dark:text-orange-400'>
                  <p className='dirham-symbol'>&#xea;</p>
                  <p>{order.taxPrice}</p>
                </div>
              </div>
              <Separator className='my-4' />
              {/* Total */}
              <div className='flex flex-row justify-between items-center '>
                <p>Total:</p>
                <div className='flex flex-row justify-end items-center gap-0.5 dark:text-orange-400'>
                  <p className='dirham-symbol'>&#xea;</p>
                  <p>{order.totalPrice}</p>
                </div>
              </div>
            </CardContent>
            {/* Payment Buttons */}

            {/* PayPal */}
            {order.paymentMethod === 'PayPal' && !order.isPaid && (
              <CardFooter className='px-6 md:px-3  w-full block'>
                {/* PayPal */}
                <PayPalScriptProvider
                  options={{
                    clientId: paypalClientId,
                    disableFunding: 'credit,card',
                  }}
                >
                  <PayPalLoadingScreen />
                  <PayPalButtons
                    style={{ color: 'blue' }}
                    createOrder={handleCreateOrder}
                    onApprove={handleApproveOrder}
                  />
                </PayPalScriptProvider>
              </CardFooter>
            )}

            {/* Cash On Delivery */}

            {/* Marked as Paid */}
            {order.paymentMethod === 'CashOnDelivery' &&
              !order.isPaid &&
              isAdmin && (
                <CardFooter className='px-6 md:px-3  w-full block'>
                  <Button
                    onClick={handleMarkAsPaidCOD}
                    className='w-full text-base'
                    size={'lg'}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <Spinner className='text-white size-8' />
                    ) : (
                      'Mark as Paid'
                    )}
                  </Button>
                </CardFooter>
              )}

            {/* Marked as Delieved */}
            {order.isPaid && !order.isDelivered && isAdmin && (
              <CardFooter className='px-6 md:px-3  w-full block'>
                <Button
                  onClick={handleMarkAsDelivered}
                  className='w-full text-base'
                  size={'lg'}
                  disabled={isPending}
                >
                  {isPending ? (
                    <Spinner className='text-white size-8' />
                  ) : (
                    'Mark as Delivered'
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
};

export default OrderDetailsTable;
