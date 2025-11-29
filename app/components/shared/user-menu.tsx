'use client';

import { LogOutIcon } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { FaUserLarge } from 'react-icons/fa6';
import { TfiPackage } from 'react-icons/tfi';
import { MdAdminPanelSettings } from 'react-icons/md';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { signOutUser } from '@/lib/actions/auth';
import { Suspense, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import ScreenSpinner from '../ScreenSpinner';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const UserMenu = ({
  session,
}: {
  session: typeof auth.$Infer.Session | null;
}) => {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const adminLinks =
    session && session.user.role === 'admin'
      ? [
          {
            href: '/admin/overview',
            label: 'Admin',
            icon: <MdAdminPanelSettings size={20} aria-hidden='true' />,
          },
        ]
      : [];

  const baseLinks = [
    {
      href: '/user/profile',
      label: 'Profile',
      icon: <FaUserLarge size={16} aria-hidden='true' />,
    },
    {
      href: '/user/orders',
      label: 'Orders History',
      icon: <TfiPackage size={16} aria-hidden='true' />,
    },
  ];

  const userMenuLinks = [...baseLinks, ...adminLinks];

  const handleSignOut = async () => {
    startTransition(async () => {
      const result = await signOutUser();

      if (result.success) {
        router.push('/signin');
      }
    });
  };

  return (
    <>
      {isPending && <ScreenSpinner mutate={true} />}
      {session?.user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className='h-auto p-0 pb-1 hover:bg-transparent cursor-pointer'
            >
              <Avatar>
                <Suspense
                  fallback={
                    <AvatarFallback className='bg-gray-200 text-base font-semibold'>
                      {session.user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  }
                >
                  <Image
                    src={session.user?.image as string}
                    alt='logo'
                    width={50}
                    height={50}
                    className='object-cover'
                  />
                </Suspense>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-52' align='end'>
            <DropdownMenuLabel className='flex min-w-0 flex-col'>
              <span className='truncate text-sm font-medium text-foreground'>
                {session.user.name}
              </span>
              <span className='truncate text-xs font-normal text-muted-foreground'>
                {session.user.email}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className='space-y-1'>
              {userMenuLinks.map((link, index) => (
                <DropdownMenuItem className='' asChild key={index}>
                  <Link
                    className={cn(
                      'dark:hover:text-black',

                      pathname === link.href && 'bg-gray-200 dark:text-black'
                    )}
                    href={link.href}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className='dark:hover:text-black'
            >
              <LogOutIcon size={16} aria-hidden='true' />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className='pb-1'>
          <Button
            asChild
            className='bg-blue-900 dark:bg-white dark:hover:bg-gray-300 hover:bg-blue-950 '
          >
            <Link href='/signin'>Sign In</Link>
          </Button>
        </div>
      )}
    </>
  );
};
export default UserMenu;
