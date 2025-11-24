import ContactInfoForm from '@/app/components/user/ContactInfoForm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getUserById } from '@/app/actions/auth';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';
import { UserRoundXIcon } from 'lucide-react';
import { UpdateProfile } from '@/schema/userSchema';

const UserProfilePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) throw new Error('Unauthorized');

  return (
    <section className='my-4'>
      <h1 className='text-2xl md:text-3xl font-bold mb-14 md:mb-20'>
        Account Information
      </h1>
      {/* Contact information */}
      <div className='flex flex-col md:flex-row gap-5 items-start'>
        <div className='space-y-2 flex-1/5'>
          <h2 className='text-xl font-medium'>Contact Information</h2>
          <p className='opacity-50 dark:opacity-70 text-sm md:max-w-md'>
            Manage your contact information. All information here will be
            reflected in your orders.
          </p>
          {!session.user.emailVerified && (
            <Alert className='border-destructive bg-destructive/10 text-destructive rounded-none border-0 border-l-6 mt-6'>
              <UserRoundXIcon />
              <AlertDescription className='text-xs text-red-600 dark:text-red-400'>
                You can't update your email address until your current email is
                verified. Please check your inbox for the verification link. If
                it has expired, use the banner above to resend a new one.
              </AlertDescription>
            </Alert>
          )}
        </div>
        {/* Contact Information Form */}
        <ContactInfoForm session={session} />
      </div>
    </section>
  );
};

export default UserProfilePage;
