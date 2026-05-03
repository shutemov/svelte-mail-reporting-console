import type {
  Alert,
  DashboardSummary,
  LearningAssignment,
  Report,
  RiskyAction
} from './types';

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

export function buildDashboardSummary(state: State): DashboardSummary {
  const openAlerts = state.alerts.filter(
    (alert) => alert.status === 'new' || alert.status === 'investigating'
  ).length;

  const confirmedMalicious = state.alerts.filter(
    (alert) => alert.finalOutcome === 'malicious'
  ).length;

  const riskyActionReports = state.reports.filter((report) =>
    report.riskyActions.some((action) => riskySignalActions.includes(action))
  ).length;

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
    confirmedMalicious,
    riskyActionReports,
    averageTriageMinutes,
    learningCompletionRate
  };
}