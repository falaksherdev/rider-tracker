import crypto from 'crypto';
import { cookies } from 'next/headers';
export const COOKIE = 'et_auth';
export const makeToken = () =>
  crypto.createHmac('sha256', process.env.AUTH_SECRET || 'dev-secret')
    .update(process.env.APP_PASSWORD || '').digest('hex');
export function isAuthed() {
  if (!process.env.APP_PASSWORD) return false;
  const c = cookies().get(COOKIE);
  return !!c && c.value === makeToken();
}
