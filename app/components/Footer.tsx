const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { APP_NAME } = require('@/lib/constants');

  return (
    <footer className='border-t bg-white dark:bg-transparent dark:dark-border-color p-6 mt-4'>
      <p className='text-center text-black dark:text-white text-sm font-medium'>
        {currentYear} &#169; {APP_NAME}. All Rights Reserved
      </p>
    </footer>
  );
};

export default Footer;
