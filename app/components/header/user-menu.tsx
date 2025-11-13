'use client';

import { LogOutIcon } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/app/components/ui/avatar';
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
import { useState } from 'react';
import Link from 'next/link';

export default function UserMenu() {
  const [user, setUser] = useState<null | { role: string }>(null);

  const adminLinks =
    user && user?.role === 'admin'
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
      href: '/profile',
      label: 'Profile',
      icon: <FaUserLarge size={16} aria-hidden='true' />,
    },
    {
      href: '/order-history',
      label: 'Order history',
      icon: <TfiPackage size={16} aria-hidden='true' />,
    },
  ];

  const userMenuLinks = [...baseLinks, ...adminLinks];

  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='h-auto p-0 pb-1 hover:bg-transparent cursor-pointer'
        >
          <Avatar>
            <AvatarImage src='/origin/avatar.jpg' alt='Profile image' />
            <AvatarFallback className='bg-gray-200 text-base'>
              KK
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-52' align='end'>
        <DropdownMenuLabel className='flex min-w-0 flex-col'>
          <span className='truncate text-sm font-medium text-foreground'>
            Keith Kennedy
          </span>
          <span className='truncate text-xs font-normal text-muted-foreground'>
            k.kennedy@coss.com
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {userMenuLinks.map((link, index) => (
            <DropdownMenuItem asChild key={index}>
              <Link href={link.href}>
                {link.icon}
                {link.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOutIcon size={16} aria-hidden='true' />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <div className='pb-1'>
      <Button className='bg-blue-900 dark:bg-white dark:hover:bg-gray-300 hover:bg-blue-950 '>
        Sign In
      </Button>
    </div>
  );
}
