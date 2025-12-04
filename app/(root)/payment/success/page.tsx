import { Button } from '@/app/components/ui/button';
import Link from 'next/link';

const SuccessPaymentpage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) => {
  const { orderId } = await searchParams;

  return (
    <section className='mt-4 flex flex-col items-center gap-6'>
      <h1 className='text-3xl md:text-4xl font-bold'>
        Thanks for your purchase
      </h1>
      <p className='text-center max-w-md'>
        We are processing your order and will notify you once it is shipped.
      </p>
      <Button size={'lg'} className='text-base' asChild>
        <Link href={`/order/${orderId}`}>View Order</Link>
      </Button>
    </section>
  );
};

export default SuccessPaymentpage;
