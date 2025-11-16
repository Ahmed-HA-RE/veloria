'use client';
import { useId, useState } from 'react';
import { SearchIcon, ShoppingCartIcon } from 'lucide-react';
import UserMenu from '@/app/components/header/user-menu';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import Theme from './Theme';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import CategorySheet from './CategorySheet';
import { auth } from '@/lib/auth';

const Header = ({
  session,
}: {
  session: typeof auth.$Infer.Session | null;
}) => {
  const id = useId();
  const [openSheet, setOpenSheet] = useState(false);

  return (
    <header className='border-b dark:dark-border-color py-3'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex h-16 items-center justify-between gap-2'>
          {/* Left side */}
          <div className='flex flex-1/3 md:flex-1/2 items-center gap-1'>
            {/* Sheet trigger */}
            <Button
              className='group size-8 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-100/20 dark:hover:text-white transition'
              variant='ghost'
              size={'icon'}
              onClick={() => setOpenSheet(!openSheet)}
            >
              <svg
                className='pointer-events-none'
                width={16}
                height={16}
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M4 12L20 12'
                  className='origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]'
                />
                <path
                  d='M4 12H20'
                  className='origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45'
                />
                <path
                  d='M4 12H20'
                  className='origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]'
                />
              </svg>
            </Button>

            <div className='flex items-center gap-6'>
              <Link
                href='/'
                className='flex flex-row items-center justify-center gap-2'
              >
                <Image
                  src={'/images/logo.png'}
                  alt='Veloria Logo'
                  width={45}
                  height={45}
                  loading='eager'
                />
                <h4 className='hidden md:block font-bold text-2xl pt-1'>
                  Veloria
                </h4>
              </Link>
            </div>
          </div>
          {/* Middle area */}
          <div className='relative flex flex-row items-center justify-center gap-2 flex-1/2 md:flex-1/3'>
            <Input
              id={id}
              className='peer h-8 ps-8 pe-2 focus-visible:border-blue-400 focus-visible:ring-blue-400 dark:focus-visible:border-blue-500 dark:focus-visible:ring-blue-500 dark:border-white dark:text-white dark:placeholder:text-gray-50/70'
              placeholder='Search...'
              type='search'
            />

            <div className='pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 dark:text-gray-50/80 peer-disabled:opacity-50'>
              <SearchIcon size={16} />
            </div>
          </div>

          {/* Category Sheet */}
          <CategorySheet openSheet={openSheet} setOpenSheet={setOpenSheet} />

          {/* Right side */}
          <div className='flex flex-1/2 items-center justify-end gap-2 md:gap-4'>
            <div className='flex items-center md:gap-2'>
              {/* Theme */}
              <Theme />
              {/* Cart */}
              <div className='relative w-fit cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-100/10 dark:hover:text-white transition duration-200 rounded-md'>
                <Link href={'/cart'}>
                  <Avatar className='size-9 rounded-sm'>
                    <AvatarFallback className='rounded-sm bg-0'>
                      <ShoppingCartIcon className='size-6' />
                    </AvatarFallback>
                  </Avatar>
                  <Badge className='absolute -top-1 right-0.5 h-5 min-w-5 rounded-full px-1 tabular-nums text-xs'>
                    8
                  </Badge>
                </Link>
              </div>
            </div>
            {/* User menu */}
            <UserMenu session={session} />
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
