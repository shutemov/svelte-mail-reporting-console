import type {
  Alert,
  GeneratedCaseMeta,
  HumanRiskLearningMetrics,
  LearningAssignment,
  QueueHealthMetrics,
  Report,
  SimulationSession,
  SimulationSummary,
  TimelineEvent,
  TriageOutcomeMetrics
} from '$lib/domains';

type SimulationMetricState = {
  alerts: Alert[];
  reports: Report[];
  timelineEvents: TimelineEvent[];
  learningAssignments: LearningAssignment[];
  generatedCaseMeta: GeneratedCaseMeta[];
  simulation: SimulationSession;
};

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function minutesBetween(start: string, end: string): number {
  return (Date.parse(end) - Date.parse(start)) / (1000 * 60);
}

function median(values: number[]): number | null {
  if (values.length === 0) {
    return null;
  }

  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 1) {
    return round(sorted[middle]);
  }

  return round((sorted[middle - 1] + sorted[middle]) / 2);
}

function percent(numerator: number, denominator: number): number {
  return denominator === 0 ? 0 : round((numerator / denominator) * 100);
}

function buildQueueHealth(state: SimulationMetricState, now: string): QueueHealthMetrics {
  const generatedIds = new Set(state.generatedCaseMeta.map((meta) => meta.alertId));
  const generatedAlerts = state.alerts.filter((alert) => generatedIds.has(alert.id));
  const openAlerts = generatedAlerts.filter(
    (alert) => alert.status === 'new' || alert.status === 'investigating'
  );
  const cutoff15m = Date.parse(now) - 15 * 60 * 1000;
  const newAlertsLast15m = generatedAlerts.filter(
    (alert) => Date.parse(alert.createdAt) >= cutoff15m
  ).length;
  const resolvedLast15m = generatedAlerts.filter(
    (alert) => alert.resolvedAt && Date.parse(alert.resolvedAt) >= cutoff15m
  ).length;

  return {
    openAlerts: openAlerts.length,
    newAlertsLast15m,
    backlogGrowthRate: round((newAlertsLast15m - resolvedLast15m) / 15),
    oldestOpenAlertMinutes:
      openAlerts.length === 0
        ? null
        : round(
            Math.max(...openAlerts.map((alert) => minutesBetween(alert.createdAt, now)))
          )
  };
}

function buildTriageOutcome(state: SimulationMetricState, now: string): TriageOutcomeMetrics {
  const generatedByAlertId = new Map(
    state.generatedCaseMeta.map((meta) => [meta.alertId, meta])
  );
  const generatedAlerts = state.alerts.filter((alert) => generatedByAlertId.has(alert.id));
  const resolvedAlerts = generatedAlerts.filter(
    (alert) => alert.finalOutcome === 'safe' || alert.finalOutcome === 'malicious'
  );

  const correctDecisions = resolvedAlerts.filter((alert) => {
    const meta = generatedByAlertId.get(alert.id);
    return meta?.groundTruth.outcome === alert.finalOutcome;
  }).length;
  const falsePositives = resolvedAlerts.filter((alert) => {
    const meta = generatedByAlertId.get(alert.id);
    return meta?.groundTruth.outcome === 'safe' && alert.finalOutcome === 'malicious';
  }).length;
  const falseNegatives = resolvedAlerts.filter((alert) => {
    const meta = generatedByAlertId.get(alert.id);
    return meta?.groundTruth.outcome === 'malicious' && alert.finalOutcome === 'safe';
  }).length;
  const truePositives = resolvedAlerts.filter((alert) => {
    const meta = generatedByAlertId.get(alert.id);
    return meta?.groundTruth.outcome === 'malicious' && alert.finalOutcome === 'malicious';
  }).length;
  const actualMalicious = resolvedAlerts.filter((alert) => {
    const meta = generatedByAlertId.get(alert.id);
    return meta?.groundTruth.outcome === 'malicious';
  }).length;
  const actualSafe = resolvedAlerts.filter((alert) => {
    const meta = generatedByAlertId.get(alert.id);
    return meta?.groundTruth.outcome === 'safe';
  }).length;
  const firstActionDurations = generatedAlerts
    .map((alert) => {
      const event = state.timelineEvents.find(
        (item) => item.alertId === alert.id && item.type === 'investigation_started'
      );
      return event ? minutesBetween(alert.createdAt, event.createdAt) : null;
    })
    .filter((value): value is number => value !== null);
  const resolutionDurations = resolvedAlerts
    .map((alert) => (alert.resolvedAt ? minutesBetween(alert.createdAt, alert.resolvedAt) : null))
    .filter((value): value is number => value !== null);
  const cutoff1h = Date.parse(now) - 60 * 60 * 1000;

  return {
    totalDecisions: resolvedAlerts.length,
    correctDecisions,
    falsePositives,
    falseNegatives,
    decisionAccuracyPercent: percent(correctDecisions, resolvedAlerts.length),
    falsePositiveRate: percent(falsePositives, actualSafe),
    falseNegativeRate: percent(falseNegatives, actualMalicious),
    precisionPercent: percent(truePositives, truePositives + falsePositives),
    recallPercent: percent(truePositives, truePositives + falseNegatives),
    medianTimeToFirstActionMinutes: median(firstActionDurations),
    medianTimeToResolutionMinutes: median(resolutionDurations),
    alertsResolvedLastHour: resolvedAlerts.filter(
      (alert) => alert.resolvedAt && Date.parse(alert.resolvedAt) >= cutoff1h
    ).length
  };
}

function buildHumanRiskLearning(state: SimulationMetricState): HumanRiskLearningMetrics {
  const generatedReportIds = new Set(state.generatedCaseMeta.map((meta) => meta.reportId));
  const generatedAlertIds = new Set(state.generatedCaseMeta.map((meta) => meta.alertId));
  const generatedReports = state.reports.filter((report) => generatedReportIds.has(report.id));
  const highRiskReports = generatedReports.filter((report) =>
    report.riskyActions.some((action) =>
      ['clicked_link', 'downloaded_attachment', 'entered_credentials'].includes(action)
    )
  );
  const eligibleAlerts = state.alerts.filter(
    (alert) =>
      generatedAlertIds.has(alert.id) &&
      alert.status === 'resolved_malicious' &&
      ['high', 'critical'].includes(alert.severity)
  );
  const assignedEligible = eligibleAlerts.filter((alert) =>
    state.learningAssignments.some((assignment) => assignment.alertId === alert.id)
  );
  const generatedAssignments = state.learningAssignments.filter((assignment) =>
    generatedAlertIds.has(assignment.alertId)
  );
  const completedAssignments = generatedAssignments.filter(
    (assignment) => assignment.status === 'completed'
  );

  return {
    highRiskActionRate: percent(highRiskReports.length, generatedReports.length),
    learningAssignmentRateForEligibleCases: percent(assignedEligible.length, eligibleAlerts.length),
    learningCompletionRate: percent(completedAssignments.length, generatedAssignments.length)
  };
}

export function buildSimulationSummary(
  state: SimulationMetricState,
  now: string
): SimulationSummary {
  return {
    session: state.simulation,
    generatedCases: state.generatedCaseMeta,
    queueHealth: buildQueueHealth(state, now),
    triageOutcome: buildTriageOutcome(state, now),
    humanRiskLearning: buildHumanRiskLearning(state)
  };
}
