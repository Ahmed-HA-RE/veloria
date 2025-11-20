'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from './components/ui/button';

const Error = ({ error }: { error: Error }) => {
  return (
    <main>
      <section>
        <div className='grid min-h-screen grid-cols-1 lg:grid-cols-2'>
          <div className='flex flex-col items-center justify-center px-4 pt-20  text-center'>
            <h2 className='mb-6 text-5xl font-semibold'>Whoops!</h2>
            <h3 className='mb-1.5 text-3xl font-semibold'>
              Something went wrong
            </h3>
            <p className='text-muted-foreground mb-6 max-w-sm'>
              {error.message}
            </p>
            <Button
              asChild
              size='lg'
              className='rounded-lg text-base shadow-sm'
            >
              <Link href='/'>Back to home page</Link>
            </Button>
          </div>

          {/* Right Section: Illustration */}
          <div className='relative max-h-screen w-full  max-lg:hidden'>
            <Image
              src={'/images/404.jpg'}
              alt='404 Image'
              width={0}
              height={0}
              sizes='100vw'
              loading='eager'
              className='w-full h-full'
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Error;
