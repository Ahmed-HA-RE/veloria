import { SearchIcon } from 'lucide-react';
import { Input } from './ui/input';
import { NativeSelect, NativeSelectOption } from './ui/native-select';
import { getCategories } from '@/lib/actions/products';
import { Button } from './ui/button';

const Search = async () => {
  const categories = await getCategories();
  const searchUrl = '/search';

  return (
    <form
      action={searchUrl}
      method='GET'
      className='flex flex-row items-center justify-center gap-2 md:flex-1/2'
    >
      <div className='hidden md:block flex-1/3'>
        <NativeSelect
          className='dark:border-white focus-visible:border-blue-500 focus-visible:ring-blue-500 placeholder:text-gray-500 dark:placeholder:text-gray-300'
          name='category'
        >
          <NativeSelectOption value='all'>All</NativeSelectOption>
          {categories.length > 0 &&
            categories.map((category) => (
              <NativeSelectOption
                key={category.category}
                value={category.category}
              >
                {category.category}
              </NativeSelectOption>
            ))}
        </NativeSelect>
      </div>
      <div className='flex flex-row items-center justify-center gap-2 md:flex-1/2'>
        <Input
          className='h-9 focus-visible:border-blue-400 focus-visible:ring-blue-400 dark:focus-visible:border-blue-500 dark:focus-visible:ring-blue-500 dark:border-white dark:text-white dark:placeholder:text-gray-50/70'
          placeholder='Search...'
          type='search'
          name='q'
        />
        <Button>
          <SearchIcon size={16} />
        </Button>
      </div>
    </form>
  );
};

export default Search;
