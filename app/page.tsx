import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import TraceCaseFile from './TraceCaseFile';

const COOKIE_NAME = 'trace_auth';

export default async function Home() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(COOKIE_NAME);
  const expectedToken = process.env.AUTH_TOKEN;

  if (!expectedToken || authCookie?.value !== expectedToken) {
    redirect('/login');
  }

  return <TraceCaseFile />;
}
