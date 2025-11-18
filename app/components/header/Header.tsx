import { SearchIcon, ShoppingCartIcon } from 'lucide-react';
import UserMenu from '@/app/components/header/user-menu';
import { Input } from '@/app/components/ui/input';
import Theme from './Theme';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import CategorySheet from './CategorySheet';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';

const Header = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const [menDressShirtsCount, menSweatShirtsCount, menSneakersCount] =
    await Promise.all([
      prisma.product.count({ where: { category: "Men's Dress Shirts" } }),
      prisma.product.count({ where: { category: "Men's Sweatshirts" } }),
      prisma.product.count({ where: { category: "Men's Sneakers" } }),
    ]);

  return (
    <header className='border-b dark:dark-border-color py-3'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex h-16 items-center justify-between gap-2'>
          {/* Left side */}
          <div className='flex flex-1/3 md:flex-1/2 items-center gap-1'>
            {/* Category Sheet */}
            <CategorySheet
              menDressShirtsCount={menDressShirtsCount}
              menSweatShirtsCount={menSweatShirtsCount}
              menSneakersCount={menSneakersCount}
            />

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
              className='peer h-8 ps-8 pe-2 focus-visible:border-blue-400 focus-visible:ring-blue-400 dark:focus-visible:border-blue-500 dark:focus-visible:ring-blue-500 dark:border-white dark:text-white dark:placeholder:text-gray-50/70'
              placeholder='Search...'
              type='search'
            />

            <div className='pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 dark:text-gray-50/80 peer-disabled:opacity-50'>
              <SearchIcon size={16} />
            </div>
          </div>

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
