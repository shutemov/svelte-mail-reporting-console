import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { parseAlertListQuery } from '$lib/server/alert-list-query-parser';
import { queries } from '$lib/server/modules';

export const load: PageServerLoad = async ({ locals, url }) => {
  if (locals.user.role === 'employee') {
    throw redirect(303, '/');
  }

  const filters = parseAlertListQuery(url.searchParams);

  return {
    filters,
    alerts: queries.listAlerts(filters),
    totalAlerts: queries.listAlerts({}).length
  };
};
