import type { DemoUser } from '../identity/models';
import type { Alert, AlertCommand } from './models';

const allowedTransitions: Record<Alert['status'], AlertCommand[]> = {
  new: ['startInvestigation', 'resolveAsSafe', 'resolveAsMalicious'],
  investigating: ['resolveAsSafe', 'resolveAsMalicious'],
  resolved_safe: ['closeAlert'],
  resolved_malicious: ['closeAlert'],
  closed: []
};

export function canApplyAlertCommand(
  alert: Alert,
  actor: DemoUser,
  command: AlertCommand
): boolean {
  if (actor.role !== 'admin') {
    return false;
  }

  return allowedTransitions[alert.status].includes(command);
}

export function applyAlertCommand(
  alert: Alert,
  actor: DemoUser,
  command: AlertCommand,
  now: string
): Alert {
  if (!canApplyAlertCommand(alert, actor, command)) {
    throw new Error('ALERT_CONFLICT');
  }

  const next: Alert = {
    ...alert,
    updatedAt: now
  };

  if (command === 'startInvestigation') {
    next.status = 'investigating';
    return next;
  }

  if (command === 'resolveAsSafe') {
    next.status = 'resolved_safe';
    next.finalOutcome = 'safe';
    next.resolvedAt = now;
    return next;
  }

  if (command === 'resolveAsMalicious') {
    next.status = 'resolved_malicious';
    next.finalOutcome = 'malicious';
    next.resolvedAt = now;
    return next;
  }

  next.status = 'closed';
  return next;
}
