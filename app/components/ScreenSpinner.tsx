'use client';
import { ClipLoader } from 'react-spinners';
import { useTheme } from 'next-themes';

const ScreenSpinner = () => {
  const { theme } = useTheme();

  return (
    <div className='flex min-h-screen items-center justify-center fixed inset-0 backdrop-blur-[3px] z-50'>
      <ClipLoader
        color={theme === 'light' ? '#0c65eb' : 'white'}
        cssOverride={{
          borderWidth: '4px',
        }}
        size={160}
      />
    </div>
  );
};

export default ScreenSpinner;
