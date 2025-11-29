import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getUserById } from '@/lib/actions/auth';
import { Shipping } from '@/types';
import UserContactForm from '@/app/components/user/ContactInfoForm';
import UserPublicInfoForm from '@/app/components/user/PublicInfoForm';
import { Alert, AlertTitle } from '@/app/components/ui/alert';
import { CircleAlertIcon, TriangleAlertIcon } from 'lucide-react';
import UserChangePassForm from '@/app/components/user/ChangePassForm';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Profile',
  description: 'View and manage your profile.',
};

const UserProfilePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const accounts = await auth.api.listUserAccounts({
    headers: await headers(),
  });

  const loggedInWithCredential = accounts.filter(
    (account) => account.providerId === 'credential'
  );

  if (!session?.user.id) throw new Error('Unauthorized');
  const user = await getUserById(session.user.id);

  return (
    <section className='mt-4'>
      <h1 className='text-2xl md:text-3xl font-bold mb-10 md:text-left md:mb-20'>
        Account Information
      </h1>
      {/* User Public information */}
      <div className='flex flex-col md:flex-row gap-5 items-start'>
        <div className='space-y-3 flex-1/5'>
          <h2 className='text-xl font-medium'>Public Information</h2>
          <p className='opacity-50 dark:opacity-70 text-sm md:max-w-md'>
            Manage your public information. Update your profile picture, name,
            and a short bio. All information here will be viewed for other
            users.
          </p>
          {!user.emailVerified && (
            <Alert className='bg-destructive dark:bg-destructive/60 border-none text-white'>
              <TriangleAlertIcon />
              <AlertTitle className='line-clamp-none'>
                You need to verify your email address in order to change your
                current email address.
              </AlertTitle>
            </Alert>
          )}
        </div>
        {/* Public Information Form */}
        <UserPublicInfoForm
          user={session.user}
          providerId={loggedInWithCredential[0]?.providerId}
        />
      </div>

      {/* User Contact information */}
      <div className='flex flex-col md:flex-row gap-5 items-start my-8'>
        <div className='space-y-2 flex-1/5 w-full'>
          <h2 className='text-xl font-medium'>Contact Information</h2>
          <p className='opacity-50 dark:opacity-70 text-sm md:max-w-md'>
            Manage your contact information. All information here will be
            reflected in your orders.
          </p>
          <Alert className='border-none bg-amber-400 text-white w-full mt-6'>
            <CircleAlertIcon />
            <AlertTitle className='text-white text-sm line-clamp-none'>
              Leave it blank if you don't want to provide contact information
            </AlertTitle>
          </Alert>
        </div>
        {/* Contact Information Form */}
        <UserContactForm address={user.address as Shipping} />
      </div>

      {loggedInWithCredential.length > 0 && (
        <>
          {/* User Password  */}
          <div className='flex flex-col md:flex-row gap-5 items-start'>
            <div className='space-y-2 flex-1/5 w-full'>
              <h2 className='text-xl font-medium'>Change Password</h2>
              <p className='opacity-50 dark:opacity-70 text-sm md:max-w-md'>
                Change your password. Make sure to choose a strong password to
                keep your account secure.
              </p>
              <Alert className='border-none bg-amber-400 text-white w-full mt-5'>
                <CircleAlertIcon />
                <AlertTitle className='text-white text-sm line-clamp-none'>
                  Leave it blank if you don't want to change your password
                </AlertTitle>
              </Alert>
            </div>
            {/* User Password Form */}
            <UserChangePassForm />
          </div>
        </>
      )}
    </section>
  );
};

export default UserProfilePage;
