import { NextResponse, NextRequest } from 'next/server';
import { auth } from './lib/auth';
import { headers } from 'next/headers';

export const proxy = async (req: NextRequest) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const invalidToken = req.nextUrl.searchParams
    .get('error')
    ?.includes('INVALID_TOKEN');

  if (
    session &&
    session.user.role !== 'admin' &&
    req.nextUrl.pathname === '/register'
  ) {
    return NextResponse.redirect(new URL('/', req.url));
  } else if (
    session &&
    session.user.role !== 'admin' &&
    req.nextUrl.pathname === '/signin'
  ) {
    return NextResponse.redirect(new URL('/', req.url));
  } else if (
    (!session || session.user.emailVerified) &&
    req.nextUrl.pathname === '/verify-email'
  ) {
    return NextResponse.redirect(new URL('/', req.url));
  } else if (
    session &&
    session.user.role !== 'admin' &&
    req.nextUrl.pathname === '/forgot-password'
  ) {
    return NextResponse.redirect(new URL('/', req.url));
  } else if (invalidToken && req.nextUrl.pathname === '/reset-password') {
    return NextResponse.redirect(
      new URL('/verification?status=false', req.url)
    );
  }

  // Storing cartId in cookies
  if (!req.cookies.get('sessionCartId')) {
    // generate a unique cartId
    const sessionCartId = crypto.randomUUID();
    const res = NextResponse.next();
    res.cookies.set('sessionCartId', sessionCartId, {
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return res;
  }
};
export const config = {
  matcher: [
    '/register',
    '/signin',
    '/verify-email',
    '/forgot-password',
    '/reset-password',
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
};
