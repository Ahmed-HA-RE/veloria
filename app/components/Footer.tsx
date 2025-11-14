const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='border-t bg-white dark:bg-transparent dark:dark-border-color p-6'>
      <p className='text-center text-black dark:text-white text-sm font-medium'>
        {currentYear} &#169; Veloria. All Rights Reserved
      </p>
    </footer>
  );
};

export default Footer;
