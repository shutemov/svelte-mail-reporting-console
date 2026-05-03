import { describe, expect, it } from 'vitest';
import { applyAlertCommand, canApplyAlertCommand } from '$lib/domains/alert-lifecycle';
import type { Alert, DemoUser } from '$lib/domains/types';

const admin: DemoUser = { id: 'admin-1', role: 'admin', name: 'Admin' };
const employee: DemoUser = { id: 'employee-1', role: 'employee', name: 'Employee' };

const baseAlert: Alert = {
  id: 'a',
  reportId: 'r',
  reporterId: 'employee-1',
  status: 'new',
  severity: 'high',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z'
};

describe('alert-lifecycle', () => {
  it('allows admin transitions', () => {
    expect(canApplyAlertCommand(baseAlert, admin, 'startInvestigation')).toBe(true);
    expect(canApplyAlertCommand(baseAlert, admin, 'resolveAsSafe')).toBe(true);
    expect(canApplyAlertCommand(baseAlert, admin, 'resolveAsMalicious')).toBe(true);
  });

  it('blocks non-admin transitions', () => {
    expect(canApplyAlertCommand(baseAlert, employee, 'startInvestigation')).toBe(false);
  });

  it('updates status according to command', () => {
    const now = '2026-01-01T01:00:00.000Z';
    const updated = applyAlertCommand(baseAlert, admin, 'resolveAsMalicious', now);
    expect(updated.status).toBe('resolved_malicious');
    expect(updated.finalOutcome).toBe('malicious');
    expect(updated.resolvedAt).toBe(now);
  });

  it('throws for unsupported transitions', () => {
    expect(() =>
      applyAlertCommand(
        { ...baseAlert, status: 'closed' },
        admin,
        'resolveAsSafe',
        '2026-01-01T00:10:00.000Z'
      )
    ).toThrowError('ALERT_CONFLICT');
  });
});