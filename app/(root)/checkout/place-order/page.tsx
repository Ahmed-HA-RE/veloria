import CheckoutStepper from '@/app/components/checkout/CheckoutStepper';
import { redirect } from 'next/navigation';
import { getUserById } from '@/app/actions/auth';
import { getMyCart } from '@/app/actions/cart';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { Metadata } from 'next';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/app/components/ui/card';
import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { SERVER_URL } from '@/lib/constants';
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

export const metadata: Metadata = {
  title: 'Place Order',
  description: 'Review and place your order',
};

const PlaceOrderPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error('No User Found');

  const user = await getUserById(session.user.id);
  if (!user) throw new Error('No User Found');

  const cart = await getMyCart();

  if (!cart || cart.items.length === 0) redirect('/cart');
  if (!user.address) redirect('/checkout/shipping-address');
  if (!user.paymentMethod) redirect('/checkout/payment-method');

  return (
    <>
      <CheckoutStepper currentStep={3} />
      <section className='mt-14'>
        <h1 className='text-3xl font-bold mb-4'>Place Order</h1>
        <div className='grid grid-cols-1 md:grid-cols-5 gap-5'>
          {/* Left Col */}
          <div className='md:col-span-3  space-y-5 order-2 md:order-1'>
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
                  <span className='font-normal'>{user.address.fullName}</span>
                </p>
                <p className='font-bold'>
                  Address:{' '}
                  <span className='font-normal'>
                    {user.address.streetAddress.includes('street')
                      ? user.address.streetAddress
                      : `${user.address.streetAddress} street`}
                    , {user.address.city}
                  </span>
                </p>
              </CardContent>
              <CardFooter className='px-4'>
                <Button
                  className='w-22 h-10 text-base bg-amber-400 text-white hover:opacity-90 hover:bg-0'
                  variant={'default'}
                  asChild
                >
                  <Link
                    href={`/checkout/shipping-address?callbackUrl=${SERVER_URL}/checkout/place-order`}
                  >
                    Edit
                  </Link>
                </Button>
              </CardFooter>
            </Card>
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
                  <span className='font-normal'>{user.paymentMethod}</span>
                </p>
              </CardContent>
              <CardFooter className='px-4'>
                <Button
                  className='w-22 h-10 text-base bg-amber-400 text-white hover:opacity-90 hover:bg-0'
                  variant={'default'}
                  asChild
                >
                  <Link href={'/checkout/payment-method'}>Edit</Link>
                </Button>
              </CardFooter>
            </Card>
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
                    {cart.items.map((item) => (
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
            <Card className='dark:dark-border-color gap-6'>
              <CardContent className='md:px-3 '>
                {/* Items Before Tax and Shipping */}
                <div className='flex flex-row justify-between items-center'>
                  <p>Items:</p>
                  <div className='flex flex-row justify-end items-center gap-0.5 dark:text-orange-400'>
                    <p className='dirham-symbol'>&#xea;</p>
                    <p>{cart.itemsPrice}</p>
                  </div>
                </div>
                <Separator className='my-4' />
                {/* Shipping */}
                <div className='flex flex-row justify-between items-center'>
                  <p>Shipping:</p>
                  <div className='flex flex-row justify-end items-center gap-0.5 dark:text-orange-400'>
                    <p className='dirham-symbol'>&#xea;</p>
                    <p>{cart.shippingPrice}</p>
                  </div>
                </div>
                <Separator className='my-4' />
                {/* Tax */}
                <div className='flex flex-row justify-between items-center'>
                  <p>Tax:</p>
                  <div className='flex flex-row justify-end items-center gap-0.5 dark:text-orange-400'>
                    <p className='dirham-symbol'>&#xea;</p>
                    <p>{cart.taxPrice}</p>
                  </div>
                </div>
                <Separator className='my-4' />
                {/* Total */}
                <div className='flex flex-row justify-between items-center '>
                  <p>Total:</p>
                  <div className='flex flex-row justify-end items-center gap-0.5 dark:text-orange-400'>
                    <p className='dirham-symbol'>&#xea;</p>
                    <p>{cart.totalPrice}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default PlaceOrderPage;
