import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { RiskyAction } from '$lib/domains';
import { commands } from '$lib/server/modules';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user.role !== 'employee') {
    throw redirect(303, '/');
  }

  return {};
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    if (locals.user.role !== 'employee') {
      return {
        success: false,
        values: {},
        formError: 'Permission denied'
      };
    }

    const formData = await request.formData();
    const riskyActions = formData
      .getAll('riskyActions')
      .map((value) => String(value)) as RiskyAction[];
    const payload = {
      sender: String(formData.get('sender') ?? ''),
      subject: String(formData.get('subject') ?? ''),
      receivedAt: String(formData.get('receivedAt') ?? ''),
      reason: String(formData.get('reason') ?? ''),
      riskyActions,
      messagePreview: String(formData.get('messagePreview') ?? '')
    };

    const result = await commands.submitReport(locals.user, payload);

    if (result.success && result.data) {
      throw redirect(303, `/employee/reports/${result.data.reportId}`);
    }

    return result;
  }
};
