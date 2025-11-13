const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-gray-50/10 border p-4'>
      <p className='text-center text-black text-sm font-medium'>
        {currentYear} &#169; Veloria. All Rights Reserved
      </p>
    </footer>
  );
};

export default Footer;
