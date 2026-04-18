import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'trace_auth';

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    // Don't intercept /login, API, Next.js internal resources
    if (
      pathname.startsWith('/login') ||
      pathname.startsWith('/api/auth') ||
      pathname.startsWith('/_next') ||
      pathname === '/favicon.ico'
    ) {
      return NextResponse.next();
    }

    const authCookie = request.cookies.get(COOKIE_NAME);
    const expectedToken = process.env.AUTH_TOKEN;

    // If env var missing, fail safe: redirect to login instead of crashing
    if (!expectedToken) {
      console.warn('[middleware] AUTH_TOKEN env var is not set');
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (authCookie?.value === expectedToken) {
      return NextResponse.next();
    }

    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  } catch (err) {
    console.error('[middleware] error:', err);
    // On any unexpected error, let the request through rather than 500
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
