import Header from '../components/header/Header';
import Footer from '../components/Footer';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-grow container'>{children}</main>
      <Footer />
    </div>
  );
};

export default RootLayout;
