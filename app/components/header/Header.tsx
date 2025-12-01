import { ShoppingCartIcon } from 'lucide-react';
import UserMenu from '@/app/components/shared/user-menu';
import Theme from '../shared/Theme';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import Link from 'next/link';
import Image from 'next/image';
import CategorySheet from './CategorySheet';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { APP_NAME } from '@/lib/constants';
import Search from '../Search';
import { getCategories } from '@/lib/actions/products';

const Header = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const categories = await getCategories();

  return (
    <header className='border-b dark:dark-border-color py-1'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex h-16 items-center justify-between gap-2'>
          {/* Left side */}
          <div className='flex flex-1/4 md:flex-1/5 items-center gap-1'>
            {/* Category Sheet */}
            <CategorySheet />

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
          <Search categories={categories} />
          {/* Right side */}
          <div className='flex flex-1/3 md:flex-1/5 items-center justify-end gap-2 md:gap-4'>
            <div className='flex items-center md:gap-2'>
              {/* Theme */}
              <Theme />
              {/* Cart */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className='w-fit cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-100/10 dark:hover:text-white transition duration-200 rounded-md'>
                    <Link href={'/cart'}>
                      <Avatar className='size-9 rounded-sm'>
                        <AvatarFallback className='rounded-sm bg-0'>
                          <ShoppingCartIcon className='size-6' />
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                  </div>
                </TooltipTrigger>
                <TooltipContent side='bottom'>View Cart</TooltipContent>
              </Tooltip>
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
