import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='grid min-h-svh lg:grid-cols-2'>
      <div className='flex flex-col gap-4 p-6 md:p-10'>
        <div className='flex justify-center gap-2 md:justify-start'>
          <Link href='/' className='flex items-center gap-2 font-medium'>
            <div className='bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md'>
              <ArrowLeft className='size-4' />
            </div>
            Back to Home
          </Link>
        </div>
        <div className='flex flex-1 items-center justify-center'>
          <div className='w-full max-w-md'>{children}</div>
        </div>
      </div>
      <div className='bg-muted relative hidden lg:block'>
        <Image
          src={'/images/auth.jpg'}
          alt='Auth Backround'
          width={0}
          height={0}
          loading='eager'
          sizes='100vw'
          className='absolute inset-0 h-full w-full object-cover object-bottom'
        />
      </div>
    </div>
  );
};

export default AuthLayout;
