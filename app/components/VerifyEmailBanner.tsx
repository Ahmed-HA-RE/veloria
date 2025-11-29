'use client';

import { useState, useTransition } from 'react';
import { Mail, XIcon } from 'lucide-react';

import { Button } from '@/app/components/ui/button';
import { auth } from '@/lib/auth';
import ScreenSpinner from './ScreenSpinner';
import { sendEmailVerificationOTP } from '../../lib/actions/auth';
import { destructiveToast, successToast } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const VerifyEmailBanner = ({
  session,
}: {
  session: typeof auth.$Infer.Session;
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (!isVisible) return null;

  const handleSendEmailVerification = async () => {
    startTransition(async () => {
      const result = await sendEmailVerificationOTP(session.user.email);
      if (result?.success) {
        successToast(result.message);
        setTimeout(() => router.push('/verify-email'), 2000);
      } else {
        destructiveToast(result?.message);
        return;
      }
    });
  };

  return (
    <>
      {isPending && <ScreenSpinner mutate={true} />}
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
              <span
                onClick={handleSendEmailVerification}
                className='underline decoration-2 underline-offset-4 decoration-white cursor-pointer'
              >
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
    </>
  );
};
export default VerifyEmailBanner;
