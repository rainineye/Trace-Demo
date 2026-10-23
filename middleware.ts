// ============================================================================
// Trace demo — auth middleware
// ----------------------------------------------------------------------------
// Runs before any page renders. Three ways in, checked in this order:
//
//   0. `?c=<code>` in the URL (sent by the deck Worker on
//      deck.traceintelligence.io, which appends the visitor's own code to the
//      "Case study" link). The code is looked up in D1 trace-angels.deck_codes,
//      the same table the deck uses. Valid -> pass through, set a `trace_demo`
//      cookie (code.<code>.<hmac>, 30 days) so the next visit without `?c=`
//      still works. `?c=` stays in the address bar; a refresh re-checks it.
//      Once the code is set active = 0 in D1, the cookie stops working too.
//
//   1. A valid `trace_auth` cookie (the "logged in via password" case —
//      existing behavior, unchanged).
//
//   1b. A valid `trace_demo` code cookie from an earlier coded link.
//
//   2. `?s=<sessionId>` invite-session redemption via traceintelligence.io
//      (existing behavior, unchanged).
//
// Every page open by an authenticated visitor is logged to D1 demo_visits
// (who, via, path, ip, country, city), parallel to the deck's deck_visits.
// Assets, RSC fetches and prefetches are not logged.
//
// Anyone else is sent to /login?from=<path>, so after the password they land
// back on the page they asked for (e.g. /?v=v05) instead of on /.
//
// app/page.tsx (and the other pages) only know `trace_auth === AUTH_TOKEN`.
// For code visitors that cookie is injected into the request forwarded to the
// page only — the browser never receives AUTH_TOKEN, so revoking the code in
// D1 is enough to lock them out again.
//
// Without CF_ACCOUNT_ID / CF_D1_DATABASE_ID / CF_D1_TOKEN the password keeps
// working, coded links don't, and nothing is logged (see lib/demo-gate.ts).
// ============================================================================

import { NextResponse } from 'next/server';
import type { NextRequest, NextFetchEvent } from 'next/server';
import {
  clientIp,
  codeMac,
  codeToken,
  dbConfigured,
  findCode,
  fromRow,
  isPageRequest,
  logVisit,
  misses,
  normCode,
  timingSafeEqual,
  type Who,
} from '@/lib/demo-gate';

const COOKIE_NAME = 'trace_auth';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, matches /api/auth
const CODE_COOKIE_NAME = 'trace_demo';
const CODE_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days, matches the deck
const LANDING_API = 'https://traceintelligence.io/api/check-session';
const MAX_MISSES = 10; // 15 分钟内同一 IP 最多试错 10 个码

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const url = request.nextUrl;
  const expectedToken = process.env.AUTH_TOKEN;
  const existingCookie = request.cookies.get(COOKIE_NAME)?.value;
  const path = url.pathname + url.search;
  const isPage = isPageRequest(request.method, url.pathname, request.headers);

  let who: Who | null = null;
  let codeCookie = '';

  // 0. Coded link: ?c=<code>, same deck_codes table as the deck.
  const linkCode = url.searchParams.get('c');
  if (linkCode && request.method === 'GET' && expectedToken && dbConfigured()) {
    const ip = clientIp(request.headers);
    const [n, row] = await Promise.all([misses(ip), findCode(normCode(linkCode))]);
    if (n < MAX_MISSES) {
      if (row) {
        who = fromRow(row, 'link');
        codeCookie = await codeToken(expectedToken, row.code);
      } else {
        event.waitUntil(logVisit(request.headers, { who: 'badcode:' + linkCode.slice(0, 40), via: 'link' }, 'badcode', path));
      }
    }
    // Bad code: treated as no code at all, falls through to the cookies / login page.
  }

  // 1. Already authenticated via password — existing behavior.
  if (!who && expectedToken && existingCookie === expectedToken) {
    who = { who: 'password', via: 'password' };
  }

  // 1b. Code cookie from an earlier coded link: code.<code>.<hmac>.
  //     Pages re-check the code in D1 (so a revoked code locks out at the next
  //     page load); assets and RSC fetches trust the HMAC alone.
  if (!who && expectedToken && dbConfigured()) {
    const c = request.cookies.get(CODE_COOKIE_NAME)?.value || '';
    if (c.startsWith('code.')) {
      const [, code, mac] = c.split('.');
      if (code && mac && timingSafeEqual(mac, await codeMac(expectedToken, code))) {
        if (isPage) {
          const row = await findCode(code);
          if (row) who = fromRow(row, 'cookie');
        } else {
          who = { who: 'code:' + code, via: 'cookie', code };
        }
      }
    }
  }

  if (who && expectedToken) {
    let response: NextResponse;
    if (who.via === 'password') {
      response = NextResponse.next();
    } else {
      // Code visitor: make the page's own `trace_auth` check pass without
      // handing AUTH_TOKEN to the browser.
      const headers = new Headers(request.headers);
      headers.set('cookie', withCookie(request.headers.get('cookie'), COOKIE_NAME, expectedToken));
      response = NextResponse.next({ request: { headers } });
    }
    if (codeCookie) {
      response.cookies.set(CODE_COOKIE_NAME, codeCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: CODE_COOKIE_MAX_AGE,
        path: '/',
      });
    }
    response.headers.set('x-demo-gate', who.via);
    if (isPage && url.pathname !== '/login') {
      event.waitUntil(logVisit(request.headers, who, 'open', path));
    }
    return response;
  }

  // 2. Invite-session redemption — existing behavior, unchanged.
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

  // 3. Not authenticated. Page navigations go to /login with `from` so the
  //    visitor comes back to the page they asked for (the hash survives the
  //    redirect on its own). Everything else falls through as before.
  if (isPage && url.pathname !== '/login') {
    const login = url.clone();
    login.pathname = '/login';
    login.search = '';
    if (path !== '/') login.searchParams.set('from', path);
    const response = NextResponse.redirect(login);
    response.headers.set('x-demo-gate', 'login');
    return response;
  }
  return NextResponse.next();
}

// Replace or add one cookie in a raw Cookie header.
function withCookie(raw: string | null, name: string, value: string): string {
  const kept = (raw || '')
    .split(';')
    .map((p) => p.trim())
    .filter((p) => p && !p.startsWith(name + '='));
  kept.push(`${name}=${value}`);
  return kept.join('; ');
}

// Don't run middleware on Next internals or /api/* (api routes set their
// own cookies via /api/auth).
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
