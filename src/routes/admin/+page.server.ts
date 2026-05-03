import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { queries } from '$lib/server/modules';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user.role === 'employee') {
    throw redirect(303, '/employee/reports');
  }

  return {
    summary: queries.getDashboardSummary()
  };
};