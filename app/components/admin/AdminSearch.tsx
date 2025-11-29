'use client';

import { SearchIcon } from 'lucide-react';
import { Input } from '../ui/input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import ScreenSpinner from '../ScreenSpinner';

const AdminSearch = () => {
  const searchParams = useSearchParams().get('query') || '';

  const [queryValue, setQueryValue] = useState(searchParams);
  const pathname = usePathname();
  const url =
    pathname === '/admin/orders'
      ? '/admin/orders'
      : pathname === '/admin/users'
        ? '/admin/users'
        : '/admin/products';

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    startTransition(() => {
      e.preventDefault();
      router.push(queryValue ? `${url}?query=${queryValue}` : url);
    });
  };

  return (
    <>
      {isPending && <ScreenSpinner mutate={false} />}
      <form
        onSubmit={handleSearch}
        className='relative flex flex-row items-center justify-center gap-2 md:flex-1/3'
      >
        <Input
          className='peer h-8 ps-8 pe-2 focus-visible:border-blue-400 focus-visible:ring-blue-400 dark:focus-visible:border-blue-500 dark:focus-visible:ring-blue-500 dark:border-white dark:text-white dark:placeholder:text-gray-50/70'
          placeholder='Search...'
          type='search'
          value={queryValue}
          onChange={(e) => setQueryValue(e.target.value)}
        />

        <div className='pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 dark:text-gray-50/80 peer-disabled:opacity-50'>
          <SearchIcon size={16} />
        </div>
      </form>
    </>
  );
};

export default AdminSearch;
