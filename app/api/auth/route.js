import { NextResponse, after } from 'next/server';
import { logVisit, safeFrom } from '@/lib/demo-gate';

const COOKIE_NAME = 'trace_auth';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function POST(request) {
  const { password, from } = await request.json();
  const expectedPassword = process.env.AUTH_PASSWORD;
  const token = process.env.AUTH_TOKEN;

  if (password !== expectedPassword) {
    return NextResponse.json({ error: 'invalid' }, { status: 401 });
  }

  // 记一行 demo_visits（event = 'gate'），在响应发出之后写，不拖慢登录。
  after(() => logVisit(request.headers, { who: 'password', via: 'password' }, 'gate', safeFrom(from)));

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE,
    path: '/',
  });

  return response;
}
