'use client';

import { SearchIcon } from 'lucide-react';
import { Input } from './ui/input';
import { NativeSelect, NativeSelectOption } from './ui/native-select';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { useQueryState, throttle } from 'nuqs';

type SearchProps = {
  categories: {
    category: string;
  }[];
};

const Search = ({ categories }: SearchProps) => {
  const [q, setQ] = useQueryState('q', {
    shallow: false,
    limitUrlUpdates: throttle(300),
  });

  return (
    <div className='flex flex-row items-center justify-center gap-2 md:flex-1/3'>
      <div className='hidden md:block flex-1/6'>
        <NativeSelect className='dark:border-white focus-visible:border-blue-500 focus-visible:ring-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-300'>
          <NativeSelectOption value='all'>All</NativeSelectOption>
          {categories.map(({ category }) => (
            <NativeSelectOption key={category} value={category}>
              {category}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>
      <div className='flex flex-row items-center justify-center gap-2 md:flex-1/2'>
        <Input
          className='h-9 focus-visible:border-blue-400 focus-visible:ring-blue-400 dark:focus-visible:border-blue-500 dark:focus-visible:ring-blue-500 dark:border-white dark:text-white dark:placeholder:text-gray-50/70'
          placeholder='Search...'
          type='search'
          value={q || ''}
          onChange={(e) => setQ(e.target.value || null)}
        />
        <Button>
          <SearchIcon size={16} />
        </Button>
      </div>
    </div>
  );
};

export default Search;
