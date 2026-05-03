import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { failNextSchema } from '$lib/domains/schemas';
import { testControls } from '$lib/server/modules';

export const POST: RequestHandler = async ({ request }) => {
  if (process.env.ENABLE_E2E_ENDPOINTS !== 'true') {
    throw error(404, 'Not found');
  }

  const payload = await request.json();
  const parsed = failNextSchema.safeParse(payload);
  if (!parsed.success) {
    return json(
      {
        error: parsed.error.flatten()
      },
      { status: 400 }
    );
  }

  testControls.failNext(parsed.data);
  return json({ ok: true });
};