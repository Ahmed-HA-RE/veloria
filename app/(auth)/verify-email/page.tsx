import OTPForm from '@/app/components/auth/OTPForm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Verify Email',
  description: 'Verify your email address to access special features.',
};

const VerifyEmailPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  return <OTPForm session={session} />;
};

export default VerifyEmailPage;
