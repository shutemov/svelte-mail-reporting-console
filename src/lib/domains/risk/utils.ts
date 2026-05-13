import type { Severity } from '../alert/models';
import type { RiskyAction } from '../report/models';

const severityOrder: Record<Severity, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4
};

const actionSeverity: Record<RiskyAction, Severity> = {
  reported_without_interaction: 'low',
  opened_email: 'low',
  clicked_link: 'high',
  downloaded_attachment: 'high',
  entered_credentials: 'critical'
};

export function validateRiskyActionCombination(actions: RiskyAction[]): string | null {
  if (actions.includes('reported_without_interaction') && actions.length > 1) {
    return 'reported_without_interaction cannot be combined with other actions';
  }
  return null;
}

export function calculateSeverity(actions: RiskyAction[]): Severity {
  let current: Severity = 'low';

  for (const action of actions) {
    const candidate = actionSeverity[action];
    if (severityOrder[candidate] > severityOrder[current]) {
      current = candidate;
    }
  }

  return current;
}
