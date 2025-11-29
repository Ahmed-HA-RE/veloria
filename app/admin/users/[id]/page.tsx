import { getUserById } from '@/lib/actions/auth';
import { Metadata } from 'next';

import UpdateUserPublicInfo from '@/app/components/admin/UpdateUserPublicInfo';
import UserContactForm from '@/app/components/user/ContactInfoForm';
import { Shipping } from '@/types';

export const metadata: Metadata = {
  title: 'Update User',
  description: "View and manage a user's profile as admin.",
};

const UpdateUserAsAdminPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const user = await getUserById(id);

  return (
    <section className='mt-4'>
      <h1 className='text-2xl md:text-3xl font-bold mb-10 md:text-left md:mb-20'>
        Update {user.role === 'admin' ? 'Admin' : 'User'} Info
      </h1>
      {/* User Public information */}
      <div className='flex flex-col md:flex-row gap-5 items-start'>
        <div className='space-y-3 flex-1/5'>
          <h2 className='text-xl font-medium'>
            {user.role === 'admin' ? "Admin's" : "User's"} Public Information
          </h2>
          <p className='opacity-50 dark:opacity-70 text-sm md:max-w-md'>
            Manage the {user.role === 'admin' ? "admin's" : "user's"} public
            information. Update their profile picture, name, and a short bio.
            All information here will be viewed for them by others.
          </p>
        </div>
        {/* Admin Public Information Form */}
        <UpdateUserPublicInfo user={user} userId={user.id} />
      </div>

      {/* User Contact information */}
      {user.role !== 'admin' && (
        <div className='flex flex-col md:flex-row gap-5 items-start my-8'>
          <div className='space-y-2 flex-1/5 w-full'>
            <h2 className='text-xl font-medium'>User's Contact Information</h2>
            <p className='opacity-50 dark:opacity-70 text-sm md:max-w-md'>
              Manage the user's contact information. All information here will
              be reflected in their orders.
            </p>
          </div>
          <UserContactForm
            type={'admin'}
            address={user.address as Shipping}
            userId={user.id}
          />
        </div>
      )}
    </section>
  );
};

export default UpdateUserAsAdminPage;
