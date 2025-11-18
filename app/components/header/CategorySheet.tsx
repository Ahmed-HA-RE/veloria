'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/app/components/ui/sheet';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '../ui/button';
import { FaBars } from 'react-icons/fa6';

type CategorySheetProps = {
  menDressShirtsCount: number;
  menSweatShirtsCount: number;
  menSneakersCount: number;
};

const CategorySheet = ({
  menDressShirtsCount,
  menSweatShirtsCount,
  menSneakersCount,
}: CategorySheetProps) => {
  const [openSheet, setOpenSheet] = useState(false);

  return (
    <>
      {/* Sheet trigger */}
      <Button
        className='group size-8 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-100/20 dark:hover:text-white transition'
        variant='ghost'
        size={'icon'}
        onClick={() => setOpenSheet(!openSheet)}
      >
        <FaBars />
      </Button>
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent className='rounded-r-xl gap-2' side='left'>
          <SheetHeader className='pt-10 pb-2'>
            <SheetTitle className='text-xl'>Select a category</SheetTitle>
            <SheetDescription>
              Browse and select your favorite men&apos;s shirts here. Click on
              any item to view details or add it to your cart.
            </SheetDescription>
          </SheetHeader>
          <div className='grid flex-1 auto-rows-min gap-6 px-1'>
            <div className='text-sm flex flex-col w-full'>
              <Link
                href=''
                className='hover:bg-blue-50 text-black dark:text-white dark:hover:bg-gray-100/30 cursor-pointer rounded-md p-3'
              >
                Men&apos;s Dress Shirts ({menDressShirtsCount})
              </Link>
              <Link
                href=''
                className='hover:bg-blue-50 text-black dark:text-white dark:hover:bg-gray-100/30 cursor-pointer rounded-md p-3'
              >
                Men&apos;s Sweat Shirts ({menSweatShirtsCount})
              </Link>
              <Link
                href=''
                className='hover:bg-blue-50 text-black dark:text-white dark:hover:bg-gray-100/30 cursor-pointer rounded-md p-3'
              >
                Men&apos;s Sneakers ({menSneakersCount})
              </Link>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default CategorySheet;
