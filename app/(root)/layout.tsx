import Header from '../components/header/Header';
import Footer from '../components/Footer';
import VerifyEmailBanner from '../components/VerifyEmailBanner';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className='flex flex-col min-h-screen'>
      {session && !session.user.emailVerified ? (
        <VerifyEmailBanner session={session} />
      ) : null}
      <Header />
      <main className='flex-grow container'>{children}</main>
      <Footer />
    </div>
  );
};

export default RootLayout;
