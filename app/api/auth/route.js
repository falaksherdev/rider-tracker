import { cookies } from 'next/headers';
import { COOKIE, makeToken } from '@/lib/auth';
export const dynamic = 'force-dynamic';
export async function POST(req) {
  const { password } = await req.json().catch(() => ({}));
  if (!process.env.APP_PASSWORD) return Response.json({ error: 'APP_PASSWORD env variable set nahi hai' }, { status: 500 });
  if (password !== process.env.APP_PASSWORD) return Response.json({ error: 'Password ghalat hai' }, { status: 401 });
  cookies().set(COOKIE, makeToken(), {
    httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production',
    path: '/', maxAge: 60 * 60 * 24 * 365,
  });
  return Response.json({ ok: true });
}
export async function DELETE() {
  cookies().delete(COOKIE);
  return Response.json({ ok: true });
}
