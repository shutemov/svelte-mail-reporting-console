import type { Alert } from '../alert/models';
import type { LearningAssignment } from '../learning/models';
import type { Report, RiskyAction } from '../report/models';
import type { DashboardSummary } from './models';

type State = {
  alerts: Alert[];
  reports: Report[];
  learningAssignments: LearningAssignment[];
};

const riskySignalActions: RiskyAction[] = [
  'clicked_link',
  'downloaded_attachment',
  'entered_credentials'
];

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

export function buildDashboardSummary(
  state: State,
  now: string = new Date().toISOString()
): DashboardSummary {
  const nowMs = Date.parse(now);
  const cutoff15m = Date.parse(now) - 15 * 60 * 1000;
  const openAlerts = state.alerts.filter(
    (alert) => alert.status === 'new' || alert.status === 'investigating'
  ).length;
  const incomingReportsLast15m = state.reports.filter(
    (report) => Date.parse(report.createdAt) >= cutoff15m && Date.parse(report.createdAt) <= nowMs
  ).length;
  const resolvedAlertsLast15m = state.alerts.filter(
    (alert) =>
      alert.resolvedAt &&
      Date.parse(alert.resolvedAt) >= cutoff15m &&
      Date.parse(alert.resolvedAt) <= nowMs
  ).length;

  const confirmedMalicious = state.alerts.filter(
    (alert) => alert.finalOutcome === 'malicious'
  ).length;

  const highRiskReports = state.reports.filter((report) =>
    report.riskyActions.some((action) => riskySignalActions.includes(action))
  ).length;
  const riskyActionReports = highRiskReports;

  const resolvedAlerts = state.alerts.filter((alert) => !!alert.resolvedAt);
  const averageTriageMinutes =
    resolvedAlerts.length === 0
      ? null
      : round(
          resolvedAlerts.reduce((acc, alert) => {
            const created = Date.parse(alert.createdAt);
            const resolved = Date.parse(alert.resolvedAt ?? alert.updatedAt);
            return acc + (resolved - created) / (1000 * 60);
          }, 0) / resolvedAlerts.length
        );

  const assignmentsTotal = state.learningAssignments.length;
  const assignmentsCompleted = state.learningAssignments.filter(
    (assignment) => assignment.status === 'completed'
  ).length;
  const learningCompletionRate =
    assignmentsTotal === 0 ? 0 : round((assignmentsCompleted / assignmentsTotal) * 100);

  return {
    openAlerts,
    incomingReportsLast15m,
    confirmedMalicious,
    highRiskReports,
    riskyActionReports,
    backlogGrowthRate: round((incomingReportsLast15m - resolvedAlertsLast15m) / 15),
    averageTriageMinutes,
    learningCompletionRate
  };
}
