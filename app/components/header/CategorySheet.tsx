import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/app/components/ui/sheet';
import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';

type CategorySheetProps = {
  openSheet: boolean;
  setOpenSheet: Dispatch<SetStateAction<boolean>>;
};

const CategorySheet = ({ openSheet, setOpenSheet }: CategorySheetProps) => {
  return (
    <Sheet open={openSheet} onOpenChange={setOpenSheet}>
      <SheetContent className='rounded-r-xl gap-2' side='left'>
        <SheetHeader className='pt-10 pb-2'>
          <SheetTitle className='text-xl'>Select a category</SheetTitle>
          <SheetDescription>
            Browse and select your favorite men&apos;s shirts here. Click on any
            item to view details or add it to your cart.
          </SheetDescription>
        </SheetHeader>
        <div className='grid flex-1 auto-rows-min gap-6 px-1'>
          <div className='text-sm flex flex-col w-full'>
            <Link
              href=''
              className='hover:bg-blue-50 text-black dark:text-white dark:hover:bg-gray-100/30 cursor-pointer rounded-md p-3'
            >
              Mens Dress Shirts (5)
            </Link>
            <Link
              href=''
              className='hover:bg-blue-50 text-black dark:text-white dark:hover:bg-gray-100/30 cursor-pointer rounded-md p-3'
            >
              Mens Sweat Shirts (1)
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CategorySheet;
