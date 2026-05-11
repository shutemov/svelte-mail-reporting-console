import type {
  Alert,
  DemoUser,
  EmployeeProfileDetails,
  EmployeeProfileSummary,
  EmployeeRiskSignal,
  EmployeeRiskStatus,
  LearningAssignment,
  Report,
  RiskyAction
} from './types';

type EmployeeProfileState = {
  users: DemoUser[];
  reports: Report[];
  alerts: Alert[];
  learningAssignments: LearningAssignment[];
};

const highRiskActions: RiskyAction[] = [
  'clicked_link',
  'downloaded_attachment',
  'entered_credentials'
];

const statusLabels: Record<EmployeeRiskStatus, string> = {
  green: 'Stable',
  yellow: 'Needs attention',
  red: 'High risk context'
};

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function percent(numerator: number, denominator: number): number {
  return denominator === 0 ? 0 : round((numerator / denominator) * 100);
}

function countAction(reports: Report[], action: RiskyAction): number {
  return reports.filter((report) => report.riskyActions.includes(action)).length;
}

function hasFinalOutcome(alert: Alert): boolean {
  return alert.finalOutcome === 'safe' || alert.finalOutcome === 'malicious';
}

export function calculateEmployeeRiskStatus(input: {
  highRiskReports: number;
  openAlerts: number;
  enteredCredentialsCount: number;
  learningAssigned: number;
  learningCompletionRate: number;
}): EmployeeRiskStatus {
  const hasIncompleteAssignedLearning =
    input.learningAssigned > 0 && input.learningCompletionRate < 50;

  if (
    input.enteredCredentialsCount > 0 ||
    input.highRiskReports >= 4 ||
    input.openAlerts >= 3 ||
    hasIncompleteAssignedLearning
  ) {
    return 'red';
  }

  if (
    input.highRiskReports >= 1 ||
    input.openAlerts >= 1 ||
    (input.learningAssigned > 0 && input.learningCompletionRate < 80)
  ) {
    return 'yellow';
  }

  return 'green';
}

export function buildEmployeeProfileSummaries(
  state: EmployeeProfileState,
  now: string
): EmployeeProfileSummary[] {
  const cutoff15m = Date.parse(now) - 15 * 60 * 1000;
  const employees = state.users.filter((user) => user.role === 'employee');

  return employees.map((user) => {
    const reports = state.reports.filter((report) => report.reporterId === user.id);
    const alerts = state.alerts.filter((alert) => alert.reporterId === user.id);
    const alertIds = new Set(alerts.map((alert) => alert.id));
    const learningAssignments = state.learningAssignments.filter(
      (assignment) => assignment.assigneeId === user.id || alertIds.has(assignment.alertId)
    );
    const openAlerts = alerts.filter(
      (alert) => alert.status === 'new' || alert.status === 'investigating'
    ).length;
    const highRiskReports = reports.filter((report) =>
      report.riskyActions.some((action) => highRiskActions.includes(action))
    ).length;
    const learningCompleted = learningAssignments.filter(
      (assignment) => assignment.status === 'completed'
    ).length;
    const learningCompletionRate = percent(learningCompleted, learningAssignments.length);
    const riskStatus = calculateEmployeeRiskStatus({
      highRiskReports,
      openAlerts,
      enteredCredentialsCount: countAction(reports, 'entered_credentials'),
      learningAssigned: learningAssignments.length,
      learningCompletionRate
    });

    return {
      user,
      riskStatus,
      riskStatusLabel: statusLabels[riskStatus],
      totalReports: reports.length,
      reportsLast15m: reports.filter((report) => Date.parse(report.createdAt) >= cutoff15m).length,
      openAlerts,
      highRiskReports,
      clickedLinkCount: countAction(reports, 'clicked_link'),
      downloadedAttachmentCount: countAction(reports, 'downloaded_attachment'),
      enteredCredentialsCount: countAction(reports, 'entered_credentials'),
      confirmedMalicious: alerts.filter((alert) => alert.finalOutcome === 'malicious').length,
      resolvedSafe: alerts.filter((alert) => alert.finalOutcome === 'safe').length,
      pendingTriage: alerts.filter((alert) => !hasFinalOutcome(alert)).length,
      learningAssigned: learningAssignments.length,
      learningCompleted,
      learningCompletionRate,
      lastReportAt:
        reports.length === 0
          ? null
          : reports
              .map((report) => report.createdAt)
              .sort((a, b) => Date.parse(b) - Date.parse(a))[0]
    };
  });
}

function buildRiskSignals(
  reports: Report[],
  alerts: Alert[],
  learningAssignments: LearningAssignment[]
): EmployeeRiskSignal[] {
  const alertsByReportId = new Map(alerts.map((alert) => [alert.reportId, alert]));
  const alertsById = new Map(alerts.map((alert) => [alert.id, alert]));
  const reportsByAlertId = new Map(reports.map((report) => [report.alertId, report]));
  const signals: EmployeeRiskSignal[] = [];

  reports.forEach((report) => {
    const alert = alertsByReportId.get(report.id);
    if (!alert) {
      return;
    }

    report.riskyActions
      .filter((action) => highRiskActions.includes(action))
      .forEach((action) => {
        signals.push({
          id: `${report.id}-${action}`,
          alertId: alert.id,
          reportId: report.id,
          type: action,
          severity: alert.severity,
          createdAt: report.createdAt,
          message: action.replaceAll('_', ' ')
        });
      });

    if (alert.finalOutcome === 'malicious') {
      signals.push({
        id: `${alert.id}-confirmed-malicious`,
        alertId: alert.id,
        reportId: report.id,
        type: 'confirmed_malicious',
        severity: alert.severity,
        createdAt: alert.resolvedAt ?? alert.updatedAt,
        message: 'Confirmed malicious'
      });
    }

    if (alert.finalOutcome === 'safe') {
      signals.push({
        id: `${alert.id}-resolved-safe`,
        alertId: alert.id,
        reportId: report.id,
        type: 'resolved_safe',
        severity: alert.severity,
        createdAt: alert.resolvedAt ?? alert.updatedAt,
        message: 'Resolved safe'
      });
    }
  });

  learningAssignments.forEach((assignment) => {
    const alert = alertsById.get(assignment.alertId);
    const report = reportsByAlertId.get(assignment.alertId);
    if (!alert || !report) {
      return;
    }

    signals.push({
      id: `${assignment.id}-assigned`,
      alertId: alert.id,
      reportId: report.id,
      type: 'learning_assigned',
      severity: alert.severity,
      createdAt: assignment.assignedAt,
      message: 'Learning assigned'
    });

    if (assignment.completedAt) {
      signals.push({
        id: `${assignment.id}-completed`,
        alertId: alert.id,
        reportId: report.id,
        type: 'learning_completed',
        severity: alert.severity,
        createdAt: assignment.completedAt,
        message: 'Learning completed'
      });
    }
  });

  return signals.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 8);
}

export function buildEmployeeProfileDetails(
  state: EmployeeProfileState,
  employeeId: string,
  now: string
): EmployeeProfileDetails | null {
  const user = state.users.find((item) => item.id === employeeId && item.role === 'employee');
  if (!user || user.profileEnabled !== true) {
    return null;
  }

  const summary = buildEmployeeProfileSummaries(state, now).find(
    (item) => item.user.id === employeeId
  );
  if (!summary) {
    return null;
  }

  const reports = state.reports
    .filter((report) => report.reporterId === employeeId)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  const alerts = state.alerts
    .filter((alert) => alert.reporterId === employeeId)
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  const alertIds = new Set(alerts.map((alert) => alert.id));
  const learningAssignments = state.learningAssignments
    .filter((assignment) => assignment.assigneeId === employeeId || alertIds.has(assignment.alertId))
    .sort((a, b) => Date.parse(b.assignedAt) - Date.parse(a.assignedAt));

  return {
    user,
    summary,
    reports,
    alerts,
    learningAssignments,
    recentRiskSignals: buildRiskSignals(reports, alerts, learningAssignments)
  };
}
