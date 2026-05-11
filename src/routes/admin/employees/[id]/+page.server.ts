import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { queries } from '$lib/server/modules';

export const load: PageServerLoad = async ({ locals, params }) => {
  if (locals.user.role === 'employee') {
    throw redirect(303, '/employee/reports');
  }

  const details = queries.getEmployeeProfileDetails(params.id);
  if (!details) {
    throw error(404, 'Employee profile not found');
  }

  return {
    details
  };
};
