import type { Handle } from '@sveltejs/kit';
import { demoAuth } from '$lib/server/modules';

export const handle: Handle = async ({ event, resolve }) => {
  const cookieUserId = event.cookies.get('demo_user_id');
  event.locals.user = demoAuth.resolveUser(cookieUserId);

  return resolve(event);
};