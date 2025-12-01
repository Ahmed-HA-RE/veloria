'use client';

import { useState } from 'react';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/app/components/ui/dropdown-menu';
import { Search, ChevronDown, X, SlidersHorizontal } from 'lucide-react';
import { parseAsString, throttle, useQueryState } from 'nuqs';
import { cn, productsPriceRanges } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const sortOptions = [
  { id: 'featured', label: 'Featured' },
  { id: 'newest', label: 'Newest' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'rating', label: 'Customer Rating' },
];

type ProductFilterProps = {
  categories: {
    category: string;
    count: number;
  }[];
  totalProducts: number;
};

const ProductFilter = ({ categories, totalProducts }: ProductFilterProps) => {
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedSort, setSelectedSort] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const [price, setPrice] = useQueryState(
    'price',
    parseAsString.withDefault('').withOptions({
      limitUrlUpdates: throttle(200),
      shallow: false,
    })
  );

  const [category, setCategory] = useQueryState('category', {
    shallow: false,
    limitUrlUpdates: throttle(300),
  });

  const clearFilter = (type: string) => {
    if (type === 'price') {
      setPrice('');
    } else if (type === 'category') {
      setCategory(null);
    }
  };

  const clearAllFilters = () => {
    router.push('/products');
  };

  const activeFilters = [];
  if (category) activeFilters.push({ label: 'category', value: category });
  if (price) activeFilters.push({ label: 'price', value: `AED ${price}` });

  return (
    <>
      <div className='mb-8'>
        <h2 className='text-3xl font-bold tracking-tight text-balance'>
          Product Catalog
        </h2>
        <p className='text-muted-foreground mt-2'>
          Browse our collection of {totalProducts} products
        </p>
      </div>

      {/* Horizontal Filter Bar */}
      <div className='mb-6 space-y-4'>
        {/* Search and Sort Row */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          {/* Search */}
          <div className='relative max-w-md flex-1'>
            <Search className='text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2' />
            <Input
              placeholder='Search products...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10'
            />
          </div>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                className='w-full cursor-pointer sm:w-auto'
              >
                <SlidersHorizontal className='me-2 size-4' />
                Sort: {sortOptions.find((s) => s.id === selectedSort)?.label}
                <ChevronDown className='ms-2 size-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.id}
                  onClick={() => setSelectedSort(option.id)}
                  className={selectedSort === option.id ? 'bg-' : ''}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Category and Price Filter Row */}
        <div className='flex flex-wrap gap-3'>
          {/* Category Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm' className='cursor-pointer'>
                Category: {category === null ? 'All' : category}
                <ChevronDown className='ms-2 size-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56'>
              <DropdownMenuItem onClick={() => setCategory(null)}>
                All
              </DropdownMenuItem>
              {categories.map((cat) => (
                <DropdownMenuItem
                  key={cat.category}
                  onClick={() => setCategory(cat.category)}
                  className={cn(
                    category === cat.category
                      ? 'bg-gray-200 dark:bg-accent hover:bg-gray-200 hover:text-black'
                      : 'hover:bg-amber-400 hover:!text-white'
                  )}
                >
                  <div className='flex w-full items-center justify-between'>
                    <span>{cat.category}</span>
                    <Badge variant='secondary' className='text-xs'>
                      {cat.count}
                    </Badge>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Price Range Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm' className='cursor-pointer'>
                Price:{' '}
                {!price
                  ? 'All'
                  : productsPriceRanges.find((p) => p.value === price)?.label}
                <ChevronDown className='ms-2 size-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-48'>
              {productsPriceRanges.map((range) => (
                <DropdownMenuItem
                  key={range.id}
                  onClick={() => setPrice(range.value)}
                  className={cn(
                    price === range.value
                      ? 'bg-gray-200 dark:bg-accent hover:bg-gray-200 hover:text-black'
                      : 'hover:bg-amber-400 hover:!text-white'
                  )}
                >
                  {range.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className='flex flex-wrap items-center gap-2'>
            <span className='text-muted-foreground text-sm font-medium'>
              Active filters:
            </span>
            {activeFilters.map((filter, index) => (
              <Badge key={index} variant='secondary'>
                {filter.value}
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-auto cursor-pointer !p-1 text-inherit'
                  onClick={() => clearFilter(filter.label)}
                >
                  <X className='size-3' />
                </Button>
              </Badge>
            ))}
            <DropdownMenuSeparator className='mx-2' />
            <Button
              variant='ghost'
              size='sm'
              onClick={clearAllFilters}
              className='text-muted-foreground h-auto cursor-pointer p-1.5 text-xs'
            >
              Clear all
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductFilter;
