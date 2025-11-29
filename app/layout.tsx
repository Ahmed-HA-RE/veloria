import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { APP_NAME } from '@/lib/constants';
import { ThemeProvider } from './components/ui/theme-provider';
import { Toaster } from './components/ui/sonner';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: `${APP_NAME}`,
  },
  description: `Discover premium products at unbeatable prices on ${APP_NAME} a modern, secure, and seamless shopping experience in the UAE. Shop smart, shop ${APP_NAME}.`,
  openGraph: {
    siteName: APP_NAME,
    title: `${APP_NAME} - Premium Products at Unbeatable Prices`,
    description: `Discover premium products at unbeatable prices on ${APP_NAME} a modern, secure, and seamless shopping experience in the UAE. Shop smart, shop ${APP_NAME}.`,
    type: 'website',
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html className={inter.className} lang='en' suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
