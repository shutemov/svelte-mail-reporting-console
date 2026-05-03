import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { commands, queries } from '$lib/server/modules';

export const load: PageServerLoad = async ({ locals, params }) => {
  if (locals.user.role !== 'employee') {
    throw redirect(303, '/');
  }

  const item = queries.getLearningAssignmentView(params.id);
  if (!item || item.assignment.assigneeId !== locals.user.id) {
    throw error(404, 'Learning assignment not found');
  }

  await commands.startLearning(locals.user, item.assignment.id);
  const refreshed = queries.getLearningAssignmentView(params.id);
  if (!refreshed) {
    throw error(404, 'Learning assignment not found');
  }

  return {
    item: refreshed
  };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData();
    const assignmentId = String(formData.get('assignmentId') ?? '');

    const result = await commands.completeLearning(locals.user, { assignmentId });
    return result;
  }
};
