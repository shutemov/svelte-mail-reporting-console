import { describe, expect, it } from 'vitest';
import { buildDashboardSummary } from '$lib/domains/dashboard-aggregation';
import type { Alert, LearningAssignment, Report } from '$lib/domains/types';

const reports: Report[] = [
  {
    id: 'r1',
    reporterId: 'employee-1',
    sender: 'a@b.com',
    subject: 's1',
    receivedAt: '2026-01-01T00:00:00.000Z',
    reason: 'x',
    riskyActions: ['clicked_link'],
    createdAt: '2026-01-01T00:00:00.000Z',
    alertId: 'a1'
  },
  {
    id: 'r2',
    reporterId: 'employee-1',
    sender: 'a@b.com',
    subject: 's2',
    receivedAt: '2026-01-01T00:00:00.000Z',
    reason: 'x',
    riskyActions: ['opened_email'],
    createdAt: '2026-01-01T00:00:00.000Z',
    alertId: 'a2'
  }
];

const alerts: Alert[] = [
  {
    id: 'a1',
    reportId: 'r1',
    reporterId: 'employee-1',
    status: 'new',
    severity: 'high',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'a2',
    reportId: 'r2',
    reporterId: 'employee-1',
    status: 'resolved_malicious',
    severity: 'critical',
    finalOutcome: 'malicious',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:30:00.000Z',
    resolvedAt: '2026-01-01T00:30:00.000Z'
  }
];

const assignments: LearningAssignment[] = [
  {
    id: 'la1',
    alertId: 'a2',
    assigneeId: 'employee-1',
    moduleId: 'phishing-basics',
    status: 'completed',
    assignedAt: '2026-01-01T01:00:00.000Z',
    startedAt: '2026-01-01T01:05:00.000Z',
    completedAt: '2026-01-01T01:10:00.000Z'
  }
];

describe('dashboard aggregation', () => {
  it('calculates summary', () => {
    const summary = buildDashboardSummary({ alerts, reports, learningAssignments: assignments });
    expect(summary.openAlerts).toBe(1);
    expect(summary.confirmedMalicious).toBe(1);
    expect(summary.riskyActionReports).toBe(1);
    expect(summary.averageTriageMinutes).toBe(30);
    expect(summary.learningCompletionRate).toBe(100);
  });

  it('handles empty assignment and unresolved alerts', () => {
    const summary = buildDashboardSummary({
      alerts: [alerts[0]],
      reports: [reports[0]],
      learningAssignments: []
    });

    expect(summary.averageTriageMinutes).toBeNull();
    expect(summary.learningCompletionRate).toBe(0);
  });
});