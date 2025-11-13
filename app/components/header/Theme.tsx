'use client';

import { useState } from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';

import { Toggle } from '@/app/components/ui/toggle';

const Theme = () => {
  const [theme, setTheme] = useState<string>('light');

  return (
    <div>
      <Toggle
        variant='outline'
        className='group size-9 border-0 shadow-none cursor-pointer transition hover:bg-blue-50'
        pressed={theme === 'dark'}
        onPressedChange={() =>
          setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
        }
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {/* Note: After dark mode implementation, rely on dark: prefix rather than group-data-[state=on]: */}
        <MoonIcon
          size={16}
          className='shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-130 group-data-[state=on]:opacity-100'
          aria-hidden='true'
        />
        <SunIcon
          size={16}
          className='absolute shrink-0 scale-130 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0'
          aria-hidden='true'
        />
      </Toggle>
    </div>
  );
};

export default Theme;
