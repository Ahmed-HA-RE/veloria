import { NextResponse, NextRequest } from 'next/server';
import { auth } from './lib/auth';
import { headers } from 'next/headers';

export const proxy = async (req: NextRequest) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

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
  }
};
export const config = {
  matcher: ['/register', '/signin', '/verify-email'],
};
