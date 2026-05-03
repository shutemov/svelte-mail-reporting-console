import type { AlertStatus, Severity } from './types';

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