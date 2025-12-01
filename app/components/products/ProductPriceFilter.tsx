'use client';

import { Input } from '../ui/input';
import { throttle, useQueryState, parseAsInteger } from 'nuqs';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';

const PRICE_RANGE = { min: 0, max: 2000 };

const ProductPriceFilter = () => {
  const [priceMin, setPriceMin] = useQueryState(
    'priceMin',
    parseAsInteger.withDefault(PRICE_RANGE.min).withOptions({
      limitUrlUpdates: throttle(200),
      shallow: false,
    })
  );

  const [priceMax, setPriceMax] = useQueryState(
    'priceMax',
    parseAsInteger.withDefault(PRICE_RANGE.max).withOptions({
      limitUrlUpdates: throttle(200),
      shallow: false,
    })
  );

  const formatPrice = (value: number) =>
    value === PRICE_RANGE.max ? `AED ${value}+` : `AED ${value}`;

  return (
    <div className='*:not-first:mt-3'>
      <Label className=' justify-center md:justify-start'>
        From {formatPrice(priceMin)} to {formatPrice(priceMax)}
      </Label>

      <div className='flex items-center gap-4'>
        <Slider
          className=''
          aria-label='Price range slider'
          min={PRICE_RANGE.min}
          max={PRICE_RANGE.max}
          value={[priceMin, priceMax]}
          onValueChange={([min, max]) => {
            setPriceMin(min);
            setPriceMax(max);
          }}
        />
      </div>
    </div>
  );
};

export default ProductPriceFilter;
