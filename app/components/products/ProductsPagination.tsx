'use client';

import { cn } from '@/lib/utils';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination';
import { parseAsInteger, useQueryState } from 'nuqs';

const ProductsPagination = ({ totalPages }: { totalPages: number }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const [page, setPage] = useQueryState(
    'page',
    parseAsInteger
      .withOptions({
        shallow: false,
      })
      .withDefault(1)
  );

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            aria-disabled={page === 1 ? true : undefined}
            className='hover:bg-amber-400 hover:text-white aria-disabled:pointer-events-none aria-disabled:opacity-50'
            onClick={() => setPage(page - 1)}
          />
        </PaginationItem>
        {pages.map((currentPage) => (
          <PaginationItem key={currentPage}>
            <PaginationLink
              className={`dark:text-white dark:hover:bg-accent !shadow-none dark:border-transparent ${currentPage === page && 'bg-amber-400 dark:bg-amber-400 dark:text-white text-white hover:bg-amber-400 hover:text-white dark:hover:bg-amber-400 dark:hover:text-white'}`}
              onClick={() => setPage(currentPage)}
            >
              {currentPage}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            aria-disabled={page >= totalPages ? true : undefined}
            className={cn(
              'hover:bg-amber-400',
              'hover:text-white',
              page >= totalPages &&
                'aria-disabled:pointer-events-none aria-disabled:opacity-50'
            )}
            onClick={() => setPage(page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default ProductsPagination;
