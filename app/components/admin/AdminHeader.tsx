'use client';

import { SearchIcon } from 'lucide-react';
import UserMenu from '../shared/user-menu';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/app/components/ui/navigation-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover';
import Link from 'next/link';
import Image from 'next/image';
import { APP_NAME } from '@/lib/constants';
import Theme from '../shared/Theme';
import { auth } from '@/lib/auth';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import AdminSearch from './AdminSearch';

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { href: '/admin/overview', label: 'Overview' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/users', label: 'Users' },
];

const AdminHeader = ({ session }: { session: typeof auth.$Infer.Session }) => {
  const pathname = usePathname();
  const [openPopover, setOpenPopover] = useState(false);

  return (
    <header className='border-b dark:dark-border-color'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex h-18 items-center justify-between gap-4'>
          {/* Left side */}
          <div className='flex sm:flex-1/3 items-center gap-1'>
            {/* Mobile menu trigger */}
            <Popover open={openPopover} onOpenChange={setOpenPopover}>
              <PopoverTrigger asChild>
                <Button
                  className='group size-8 md:hidden'
                  size='icon'
                  variant='ghost'
                >
                  <svg
                    className='pointer-events-none'
                    fill='none'
                    height={16}
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    viewBox='0 0 24 24'
                    width={16}
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      className='-translate-y-[7px] origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]'
                      d='M4 12L20 12'
                    />
                    <path
                      className='origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45'
                      d='M4 12H20'
                    />
                    <path
                      className='origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]'
                      d='M4 12H20'
                    />
                  </svg>
                </Button>
              </PopoverTrigger>
              <PopoverContent align='start' className='w-36 p-1 md:hidden'>
                <NavigationMenu className='max-w-none *:w-full'>
                  <NavigationMenuList className='flex-col items-start gap-1.5 md:gap-2'>
                    {navigationLinks.map((link, _index) => (
                      <NavigationMenuItem className='w-full' key={link.label}>
                        <NavigationMenuLink
                          asChild
                          active={pathname === link.href}
                          className='py-1.5 font-medium text-black dark:text-white hover:text-white'
                          href={link.href}
                        >
                          <Link
                            href={link.href}
                            onClick={() => setOpenPopover(false)}
                          >
                            {link.label}
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              </PopoverContent>
            </Popover>
            {/* Logo */}
            <div className='flex items-center gap-6'>
              <Link
                href='/'
                className='flex flex-row items-center justify-center gap-2'
              >
                <Image
                  src={'/images/logo.png'}
                  alt={`${APP_NAME} Logo`}
                  width={45}
                  height={45}
                  loading='eager'
                />
                <h4 className='hidden md:block font-bold text-2xl pt-1'>
                  {APP_NAME}
                </h4>
              </Link>
            </div>
          </div>
          {/* Middle area */}
          <AdminSearch />
          {/* Right side */}
          <div className='flex sm:flex-1/3 items-center justify-end gap-2'>
            {/* Theme */}
            <Theme />
            {/* User menu */}
            <UserMenu session={session} />
          </div>
        </div>
        {/* Bottom navigation */}
        <div className='border-t dark:dark-border-color py-2 max-md:hidden'>
          {/* Navigation menu */}
          <NavigationMenu>
            <NavigationMenuList className='gap-2'>
              {navigationLinks.map((link, _index) => (
                <NavigationMenuItem key={link.label}>
                  <NavigationMenuLink
                    asChild
                    active={pathname === link.href}
                    className='py-1.5 font-medium text-black dark:text-white hover:text-white'
                    href={link.href}
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
