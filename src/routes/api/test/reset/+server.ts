import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { testControls } from '$lib/server/modules';

export const POST: RequestHandler = async ({ request }) => {
  if (process.env.ENABLE_E2E_ENDPOINTS !== 'true') {
    throw error(404, 'Not found');
  }

  const payload = await request.json().catch(() => ({ seed: 'default' }));
  const seed = payload?.seed === 'empty' ? 'empty' : 'default';
  const summary = testControls.reset(seed);

  return json({ summary });
};