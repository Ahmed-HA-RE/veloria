import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Veloria',
  description:
    'Discover premium products at unbeatable prices on Veloria a modern, secure, and seamless shopping experience in the UAE. Shop smart, shop Veloria.',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html className={inter.className} lang='en'>
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
