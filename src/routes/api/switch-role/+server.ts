import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { demoAuth } from '$lib/server/modules';

export const POST: RequestHandler = async ({ request, cookies, url }) => {
  const formData = await request.formData();
  const userId = String(formData.get('userId') ?? '');
  const cookie = demoAuth.switchUser(userId);

  cookies.set(cookie.cookieName, cookie.value, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: false
  });

  const fallback = '/';
  const returnTo = String(formData.get('returnTo') ?? '') || request.headers.get('referer') || fallback;

  let target: string;
  try {
    const parsed = new URL(returnTo, url.origin);
    target = `${parsed.pathname}${parsed.search}`;
  } catch {
    target = fallback;
  }

  throw redirect(303, target);
};
