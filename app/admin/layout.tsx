import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import AdminHeader from '../components/admin/AdminHeader';

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error('Unauthorized');

  return (
    <div className='flex flex-col min-h-screen'>
      <AdminHeader session={session} />
      <main className='flex-grow container'>{children}</main>
    </div>
  );
};

export default AdminLayout;
