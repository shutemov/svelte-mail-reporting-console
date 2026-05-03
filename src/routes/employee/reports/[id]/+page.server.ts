import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { queries } from '$lib/server/modules';

export const load: PageServerLoad = async ({ locals, params }) => {
  if (locals.user.role !== 'employee') {
    throw redirect(303, '/');
  }

  const report = queries.getReportById(params.id);
  if (!report || report.reporterId !== locals.user.id) {
    throw error(404, 'Report not found');
  }

  return {
    report
  };
};