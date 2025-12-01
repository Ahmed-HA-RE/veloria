import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/app/components/ui/sheet';
import Link from 'next/link';
import { Button } from '../ui/button';
import { FaBars } from 'react-icons/fa6';
import { getCategories } from '@/lib/actions/products';

const CategorySheet = async () => {
  const categories = await getCategories();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className='group size-8 cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-100/20 dark:hover:text-white transition'
          variant='ghost'
          size={'icon'}
        >
          <FaBars />
        </Button>
      </SheetTrigger>
      <SheetContent className='rounded-r-xl gap-2' side='left'>
        <SheetHeader className='pt-10 pb-2'>
          <SheetTitle className='text-xl'>Select a category</SheetTitle>
          <SheetDescription>
            Browse and select your favorite men&apos;s shirts here. Click on any
            item to view details or add it to your cart.
          </SheetDescription>
        </SheetHeader>
        <div className='grid flex-1 auto-rows-min gap-1 px-1 text-sm'>
          {categories.map((category, index) => (
            <Link
              key={index}
              href={`/search?category=${category.category}`}
              className='hover:bg-blue-50 text-black dark:text-white dark:hover:bg-gray-100/30 cursor-pointer rounded-md p-3'
            >
              {category.category} ({category.count})
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CategorySheet;
