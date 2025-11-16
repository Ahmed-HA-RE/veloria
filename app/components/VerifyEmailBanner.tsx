'use client';

import { useState } from 'react';
import { Mail, XIcon } from 'lucide-react';

import { Button } from '@/app/components/ui/button';

const VerifyEmailBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className='dark bg-red-600 px-4 py-4 text-foreground'>
      <div className='flex gap-2 justify-between items-center'>
        <div className='flex gap-3 items-center mx-auto'>
          <Mail
            className='opacity-90 max-md:mt-0.5'
            size={16}
            aria-hidden='true'
          />
          <p className='text-sm text-center'>
            Check your inbox to verify your email or{' '}
            <span className='underline decoration-2 underline-offset-4 decoration-white cursor-pointer'>
              request a new one.
            </span>
          </p>
        </div>
        <Button
          variant='ghost'
          className='group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent'
          onClick={() => setIsVisible(false)}
          aria-label='Close banner'
        >
          <XIcon
            size={16}
            className='opacity-80 transition-opacity group-hover:opacity-100'
            aria-hidden='true'
          />
        </Button>
      </div>
    </div>
  );
};
export default VerifyEmailBanner;
