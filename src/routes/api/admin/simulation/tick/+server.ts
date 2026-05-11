import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { commands } from '$lib/server/modules';

export const POST: RequestHandler = async ({ locals }) => {
  const result = await commands.tickSimulation(locals.user);

  return json(result, {
    status: result.success ? 200 : 403
  });
};
