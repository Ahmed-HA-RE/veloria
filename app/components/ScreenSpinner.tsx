'use client';
import { ClipLoader, PulseLoader } from 'react-spinners';

const ScreenSpinner = ({ mutate }: { mutate: boolean }) => {
  return (
    <div className='fixed inset-0 flex items-center justify-center backdrop-blur-xs z-50'>
      {mutate ? (
        <PulseLoader color='#141ce6' size={30} margin={10} />
      ) : (
        <ClipLoader
          color='#0c65eb'
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
