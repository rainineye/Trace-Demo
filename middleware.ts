// ============================================================================
// Trace demo — auth middleware
// ----------------------------------------------------------------------------
// Runs before any page renders. Two responsibilities:
//
//   1. If the visitor already has a valid `trace_auth` cookie, pass through.
//      (This is the "logged in via password" case — existing behavior.)
//
//   2. If the visitor arrives with `?s=<sessionId>` in the URL (sent by the
//      Cloudflare Worker on traceintelligence.io after they redeemed an
//      invite code), validate that session against the worker. If valid,
//      set the SAME `trace_auth` cookie a password user would get and
//      redirect to the clean URL — so they skip /login entirely.
//
// Anything else falls through to the existing flow (app/page.tsx will
// redirect to /login if no valid cookie is present).
// ============================================================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'trace_auth';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, matches /api/auth
const LANDING_API = 'https://traceintelligence.io/api/check-session';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const expectedToken = process.env.AUTH_TOKEN;
  const existingCookie = request.cookies.get(COOKIE_NAME)?.value;

  // 1. Already authenticated — let the request proceed.
  if (expectedToken && existingCookie === expectedToken) {
    return NextResponse.next();
  }

  // 2. Invite-session redemption.
  const sessionId = url.searchParams.get('s');
  if (sessionId && expectedToken) {
    let valid = false;
    try {
      const res = await fetch(
        `${LANDING_API}?s=${encodeURIComponent(sessionId)}`,
        { cache: 'no-store' }
      );
      if (res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { ok?: boolean }
          | null;
        valid = !!(data && data.ok);
      }
    } catch {
      // network error -> treat as invalid, fall through to /login
    }

    if (valid) {
      // Strip ?s= from the URL so the link can't be casually forwarded
      // and the redirect chain doesn't keep the param around.
      const cleanUrl = url.clone();
      cleanUrl.searchParams.delete('s');

      const response = NextResponse.redirect(cleanUrl);
      response.cookies.set(COOKIE_NAME, expectedToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: COOKIE_MAX_AGE,
        path: '/',
      });
      return response;
    }
  }

  // 3. No cookie, no valid invite session -> fall through. app/page.tsx
  //    will redirect to /login as before.
  return NextResponse.next();
}

// Don't run middleware on Next internals or /api/* (api routes set their
// own cookies via /api/auth).
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
