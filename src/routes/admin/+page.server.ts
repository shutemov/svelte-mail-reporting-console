import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { SimulationConfig } from '$lib/domains/types';
import { commands, queries } from '$lib/server/modules';
import { defaultSimulationConfig } from '$lib/server/simulation-engine';

function readConfig(formData: FormData): SimulationConfig {
  return {
    ratePerMinute: formData.get('ratePerMinute'),
    maliciousRatio: formData.get('maliciousRatio'),
    severityMix: {
      low: formData.get('severityMix.low'),
      medium: formData.get('severityMix.medium'),
      high: formData.get('severityMix.high'),
      critical: formData.get('severityMix.critical')
    },
    seed: formData.get('seed'),
    autoStartOnReset: formData.get('autoStartOnReset') === 'on'
  } as unknown as SimulationConfig;
}

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user.role === 'employee') {
    throw redirect(303, '/employee/reports');
  }

  return {
    summary: queries.getDashboardSummary(),
    simulationSummary: queries.getSimulationSummary(),
    employeeSummaries: queries.listEmployeeProfileSummaries()
  };
};

export const actions: Actions = {
  updateConfig: async ({ request, locals }) => {
    const formData = await request.formData();
    return commands.updateSimulationConfig(locals.user, readConfig(formData));
  },
  resetConfigDefaults: async ({ locals }) => {
    return commands.updateSimulationConfig(locals.user, defaultSimulationConfig);
  },
  start: async ({ locals }) => {
    return commands.startSimulation(locals.user);
  },
  pause: async ({ locals }) => {
    return commands.pauseSimulation(locals.user);
  },
  inject: async ({ locals }) => {
    return commands.injectSimulationReport(locals.user);
  },
  reset: async ({ locals }) => {
    return commands.resetSimulation(locals.user);
  }
};
