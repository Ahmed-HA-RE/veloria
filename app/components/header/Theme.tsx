'use client';

import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Toggle } from '@/app/components/ui/toggle';

const Theme = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    mounted && (
      <div>
        <Toggle
          variant='outline'
          className='group size-9 border-0 shadow-none cursor-pointer transition'
          pressed={theme === 'dark'}
          onPressedChange={() =>
            setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
          }
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <MoonIcon
            size={16}
            className='shrink-0 scale-0 opacity-0 transition-all dark:scale-130 dark:opacity-100 dark:text-white'
            aria-hidden='true'
            onClick={() => setTheme('dark')}
          />
          <SunIcon
            size={16}
            className='absolute shrink-0 scale-130 opacity-100 transition-all dark:scale-0 dark:opacity-0'
            aria-hidden='true'
            onClick={() => setTheme('light')}
          />
        </Toggle>
      </div>
    )
  );
};

export default Theme;
