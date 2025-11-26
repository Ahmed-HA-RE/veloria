import { NextResponse, NextRequest } from 'next/server';
import { auth } from './lib/auth';
import { headers } from 'next/headers';
import { SERVER_URL } from './lib/constants';

export const proxy = async (req: NextRequest) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const invalidToken = req.nextUrl.searchParams
    .get('error')
    ?.includes('INVALID_TOKEN');

  const { pathname } = req.nextUrl;

  const checkoutPaths = [
    '/checkout/shipping-address',
    '/checkout/payment-method',
    '/checkout/place-order',
  ];

  const usersPaths = ['/user/orders', '/user/profile'];

  const adminPaths = [
    '/admin/overview',
    '/admin/products',
    '/admin/orders',
    '/admin/users',
  ];

  if (session && session.user.role !== 'admin' && pathname === '/register') {
    return NextResponse.redirect(new URL('/', req.url));
  } else if (
    session &&
    session.user.role !== 'admin' &&
    pathname === '/signin'
  ) {
    return NextResponse.redirect(new URL('/', req.url));
  } else if (
    (!session || session.user.emailVerified) &&
    pathname === '/verify-email'
  ) {
    return NextResponse.redirect(new URL('/', req.url));
  } else if (invalidToken && pathname === '/reset-password') {
    return NextResponse.redirect(
      new URL('/verification?status=false', req.url)
    );
  }

  // for checkout only pages
  if (!session && checkoutPaths.find((path) => path === pathname)) {
    return NextResponse.redirect(
      new URL(`/signin?callbackUrl=${SERVER_URL}${pathname}`, req.url)
    );
  }

  // for users only pages
  if (!session && usersPaths.find((path) => path === pathname)) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // for admins only pages
  if (!session && adminPaths.find((path) => path === pathname)) {
    return NextResponse.redirect(new URL('/', req.url));
  } else if (
    session &&
    session.user.role !== 'admin' &&
    adminPaths.find((path) => path === pathname)
  ) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Storing cartId in cookies
  if (!req.cookies.get('sessionCartId')) {
    // generate a unique cartId
    const sessionCartId = crypto.randomUUID();
    const res = NextResponse.next();
    res.cookies.set('sessionCartId', sessionCartId, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    });

    return res;
  }
};
export const config = {
  matcher: [
    '/register',
    '/signin',
    '/verify-email',
    '/reset-password',
    '/checkout/:path*',
    '/user/:path*',
    '/admin/:path*',
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
};
