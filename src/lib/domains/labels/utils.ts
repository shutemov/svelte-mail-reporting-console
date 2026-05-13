import { humanizeToken } from '$lib/common/text';
import type { AlertStatus, Severity } from '../alert/models';
import type { EmployeePersona } from '../identity/models';
import type { LearningStatus } from '../learning/models';
import type { RiskyAction } from '../report/models';

export const statusLabel: Record<AlertStatus, string> = {
  new: 'New',
  investigating: 'Investigating',
  resolved_safe: 'Resolved safe',
  resolved_malicious: 'Resolved malicious',
  closed: 'Closed'
};

export const severityLabel: Record<Severity, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical'
};

export function formatAlertStatus(status: AlertStatus): string {
  return statusLabel[status];
}

export function formatSeverity(severity: Severity): string {
  return severityLabel[severity];
}

export function formatRiskyAction(action: RiskyAction): string {
  return humanizeToken(action);
}

export function formatRiskyActions(actions: RiskyAction[]): string {
  return actions.map(formatRiskyAction).join(', ');
}

export function formatEmployeePersona(persona: EmployeePersona | undefined): string {
  return persona ? humanizeToken(persona) : 'employee';
}

export function formatLearningStatus(status: LearningStatus): string {
  return humanizeToken(status);
}

export function formatSimulationTemplateId(templateId: string): string {
  return humanizeToken(templateId);
}
