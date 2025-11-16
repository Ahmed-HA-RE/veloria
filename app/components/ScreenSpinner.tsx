'use client';
import { ClipLoader, ClimbingBoxLoader } from 'react-spinners';
import { useTheme } from 'next-themes';

const ScreenSpinner = ({ mutate }: { mutate: boolean }) => {
  const { theme } = useTheme();

  return (
    <div className='flex min-h-screen items-center justify-center fixed inset-0 backdrop-blur-[3px] z-50'>
      {mutate ? (
        <ClimbingBoxLoader
          color={theme === 'light' ? '#0c65eb' : 'white'}
          size={35}
        />
      ) : (
        <ClipLoader
          color={theme === 'light' ? '#0c65eb' : 'white'}
          cssOverride={{
            borderWidth: '4px',
          }}
          size={160}
        />
      )}
    </div>
  );
};

export default ScreenSpinner;
