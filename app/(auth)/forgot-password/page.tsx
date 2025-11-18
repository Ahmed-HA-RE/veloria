import ForgotPasswordForm from '@/app/components/auth/ForgotPasswordForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { ChevronLeftIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Forgot Password',
  description: 'Enter your email to receive password reset instructions.',
};

const ForgotPasswordPage = () => {
  return (
    <div className='flex  items-center justify-center'>
      <Card className='z-1 w-full border-none shadow-md'>
        <CardHeader className='gap-6'>
          <Image
            src={'/images/logo.png'}
            alt='Veloria Logo'
            width={40}
            height={40}
            className='gap-3'
          />

          <div>
            <CardTitle className='mb-1.5 text-2xl'>Forgot Password?</CardTitle>
            <CardDescription className='text-base'>
              Enter your email and we&apos;ll send you instructions to reset
              your password
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className='space-y-4'>
          <ForgotPasswordForm />

          <Link
            href='/signin'
            className='group mx-auto flex w-fit items-center gap-2'
          >
            <ChevronLeftIcon className='size-5 transition-transform duration-200 group-hover:-translate-x-0.5' />
            <span>Back to login</span>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
