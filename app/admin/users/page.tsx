import { getAllUsersForAdmin } from '@/app/actions/auth';
import { Alert, AlertTitle } from '@/app/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { FaUsers } from 'react-icons/fa6';
import Image from 'next/image';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Suspense } from 'react';
import PaginationControls from '@/app/components/Pagination';

const AdminUsersPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) => {
  const page = Number((await searchParams).page) || 1;

  const { users, totalPages } = await getAllUsersForAdmin(page);

  return (
    <section className='mt-4'>
      <h1 className='text-3xl md:text-4xl font-bold mb-4'>Users</h1>
      {!users || users.length === 0 ? (
        <Alert className='bg-destructive dark:bg-destructive/60 border-none text-white max-w-md mx-auto'>
          <FaUsers />
          <AlertTitle>No Users Found</AlertTitle>
        </Alert>
      ) : (
        <div className='[&>div]:rounded-sm [&>div]:border [&>div]:border-gray-300 [&>div]:dark:dark-border-color'>
          <Table>
            <TableHeader>
              <TableRow className='hover:bg-transparent dark:dark-border-color border-gray-300'>
                <TableHead>NAME</TableHead>
                <TableHead>EMAIL</TableHead>
                <TableHead>ROLE</TableHead>
                <TableHead className='text-center'>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  className='has-data-[state=checked]:bg-muted/50 dark:dark-border-color border-gray-300'
                >
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <Avatar className='rounded-full'>
                        <Suspense
                          fallback={
                            <AvatarFallback>
                              {user.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          }
                        >
                          <Image
                            src={
                              user.image ||
                              'https://res.cloudinary.com/ahmed--dev/image/upload/v1755243182/default_avatar_7541d4c434.webp'
                            }
                            alt='logo'
                            width={50}
                            height={50}
                            className='object-center object-cover'
                          />
                        </Suspense>
                      </Avatar>
                      <div className='font-medium'>{user.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.role === 'admin' ? (
                      <Badge variant={'default'}>Admin</Badge>
                    ) : (
                      <Badge variant={'secondary'}>User</Badge>
                    )}
                  </TableCell>
                  <TableCell className='text-center'>
                    <Button size='sm' asChild>
                      <Link href={`/users/${user.id}`}>Details</Link>
                    </Button>
                    {/* <DeleteDialog
                      id={order.id}
                      action={deleteOrderById}
                      type={'order'}
                    /> */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {users && totalPages > 1 && (
        <PaginationControls currentPage={page} totalPages={totalPages} />
      )}
    </section>
  );
};

export default AdminUsersPage;
