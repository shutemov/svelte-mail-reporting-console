import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { commands, queries } from '$lib/server/modules';

export const load: PageServerLoad = async ({ locals, params }) => {
  if (locals.user.role === 'employee') {
    throw redirect(303, '/');
  }

  const details = queries.getAlertDetails(params.id);
  if (!details) {
    throw error(404, 'Alert not found');
  }

  return {
    details
  };
};

export const actions: Actions = {
  command: async ({ request, locals, params }) => {
    const formData = await request.formData();
    const input = {
      command: String(formData.get('command') ?? ''),
      resolutionNote: String(formData.get('resolutionNote') ?? '') || undefined
    };

    return commands.applyAlertCommand(locals.user, params.id, input as never);
  },
  note: async ({ request, locals, params }) => {
    const formData = await request.formData();
    const input = {
      body: String(formData.get('body') ?? '')
    };

    return commands.addInvestigationNote(locals.user, params.id, input);
  },
  assignLearning: async ({ request, locals, params }) => {
    const formData = await request.formData();
    const input = {
      moduleId: String(formData.get('moduleId') ?? '')
    };

    return commands.assignLearning(locals.user, params.id, input as never);
  }
};