import VerifyEmailBanner from '../components/VerifyEmailBanner';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import UserHeader from '../components/user/UserHeader';

const UserLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className='flex flex-col min-h-screen'>
      {session && !session.user.emailVerified ? (
        <VerifyEmailBanner session={session} />
      ) : null}
      <UserHeader />
      <main className='flex-grow container'>{children}</main>
    </div>
  );
};

export default UserLayout;
