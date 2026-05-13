import type {
  Alert,
  AlertDetailsView,
  AlertListQuery,
  DemoUser,
  GeneratedCaseMeta,
  LearningAssignment,
  Report,
  RiskyAction,
  Severity,
  SimulationConfig,
  SubmitReportInput,
  TimelineEvent
} from '$lib/domains';
import { buildDashboardSummary } from '$lib/domains/dashboard';
import { calculateSeverity } from '$lib/domains/risk';
import { createSeedState, type MockRepository, type MockState, type SeedName } from './mock-state';
import { defaultSimulationConfig } from './simulation-engine';

function nextId(prefix: string, list: Array<{ id: string }>): string {
  return `${prefix}-${list.length + 1}`;
}

function clone<T>(value: T): T {
  return structuredClone(value);
}

export class InMemoryMockRepository implements MockRepository {
  private state: MockState;

  constructor(seed: SeedName = 'default') {
    this.state = createSeedState(seed);
  }

  reset(seed: SeedName) {
    this.state = createSeedState(seed);
    return buildDashboardSummary(this.state);
  }

  getCurrentState() {
    return clone(this.state);
  }

  getUserById(userId: string): DemoUser | null {
    return this.state.users.find((user) => user.id === userId) ?? null;
  }

  listReportsForUser(userId: string): Report[] {
    return clone(this.state.reports.filter((report) => report.reporterId === userId));
  }

  getReportById(reportId: string): Report | null {
    return clone(this.state.reports.find((report) => report.id === reportId) ?? null);
  }

  createReport(input: SubmitReportInput, actor: DemoUser, now: string): Report {
    const reportId = nextId('report', this.state.reports);
    const alertId = nextId('alert', this.state.alerts);

    const report: Report = {
      id: reportId,
      reporterId: actor.id,
      sender: input.sender,
      subject: input.subject,
      receivedAt: input.receivedAt,
      reason: input.reason,
      riskyActions: input.riskyActions,
      messagePreview: input.messagePreview || undefined,
      createdAt: now,
      alertId
    };

    const alert: Alert = {
      id: alertId,
      reportId,
      reporterId: actor.id,
      status: 'new',
      severity: calculateSeverity(input.riskyActions),
      createdAt: now,
      updatedAt: now
    };

    this.state.reports.push(report);
    this.state.alerts.push(alert);

    return clone(report);
  }

  listAlerts(query: AlertListQuery): AlertDetailsView[] {
    const result = this.state.alerts
      .filter((alert) => (query.status ? alert.status === query.status : true))
      .filter((alert) => (query.severity ? alert.severity === query.severity : true))
      .filter((alert) => (query.reporterId ? alert.reporterId === query.reporterId : true))
      .filter((alert) => {
        if (!query.riskyAction) {
          return true;
        }

        const report = this.state.reports.find((item) => item.id === alert.reportId);
        return !!report?.riskyActions.includes(query.riskyAction as RiskyAction);
      })
      .map((alert) => this.toAlertDetails(alert))
      .filter((value): value is AlertDetailsView => value !== null);

    return clone(result);
  }

  getAlertDetails(alertId: string): AlertDetailsView | null {
    const alert = this.state.alerts.find((item) => item.id === alertId);
    if (!alert) {
      return null;
    }

    return clone(this.toAlertDetails(alert));
  }

  updateAlert(alert: Alert): Alert {
    const index = this.state.alerts.findIndex((item) => item.id === alert.id);
    if (index === -1) {
      throw new Error('ALERT_NOT_FOUND');
    }

    this.state.alerts[index] = clone(alert);
    return clone(this.state.alerts[index]);
  }

  addTimelineEvent(event: TimelineEvent): TimelineEvent {
    const created: TimelineEvent = {
      ...event,
      id: event.id || nextId('tl', this.state.timelineEvents)
    };

    this.state.timelineEvents.push(created);
    return clone(created);
  }

  updateSimulationConfig(config: SimulationConfig) {
    this.state.simulation.config = clone(config);
    return clone(this.state.simulation);
  }

  setSimulationMode(mode: MockState['simulation']['mode'], now: string) {
    this.state.simulation.mode = mode;
    if (mode === 'running' && !this.state.simulation.startedAt) {
      this.state.simulation.startedAt = now;
    }

    return clone(this.state.simulation);
  }

  resetSimulation(now: string) {
    const generatedAlertIds = new Set(
      this.state.generatedCaseMeta.map((meta) => meta.alertId)
    );
    const generatedReportIds = new Set(
      this.state.generatedCaseMeta.map((meta) => meta.reportId)
    );
    const shouldRun = this.state.simulation.config.autoStartOnReset === true;

    this.state.reports = this.state.reports.filter((report) => !generatedReportIds.has(report.id));
    this.state.alerts = this.state.alerts.filter((alert) => !generatedAlertIds.has(alert.id));
    this.state.timelineEvents = this.state.timelineEvents.filter(
      (event) => !generatedAlertIds.has(event.alertId)
    );
    this.state.learningAssignments = this.state.learningAssignments.filter(
      (assignment) => !generatedAlertIds.has(assignment.alertId)
    );
    this.state.generatedCaseMeta = [];
    this.state.simulation = {
      mode: shouldRun ? 'running' : 'paused',
      config: clone(this.state.simulation.config ?? defaultSimulationConfig),
      generatedCount: 0,
      startedAt: shouldRun ? now : undefined,
      lastGeneratedAt: undefined
    };

    return clone(this.state.simulation);
  }

  createSimulationReport(
    input: SubmitReportInput,
    actor: DemoUser,
    now: string,
    severity: Severity,
    meta: Omit<GeneratedCaseMeta, 'reportId' | 'alertId'>
  ): Report {
    const reportId = nextId('report', this.state.reports);
    const alertId = nextId('alert', this.state.alerts);

    const report: Report = {
      id: reportId,
      reporterId: actor.id,
      sender: input.sender,
      subject: input.subject,
      receivedAt: input.receivedAt,
      reason: input.reason,
      riskyActions: input.riskyActions,
      messagePreview: input.messagePreview || undefined,
      createdAt: now,
      alertId
    };

    const alert = {
      id: alertId,
      reportId,
      reporterId: actor.id,
      status: 'new' as const,
      severity,
      createdAt: now,
      updatedAt: now
    };

    this.state.reports.push(report);
    this.state.alerts.push(alert);
    this.state.generatedCaseMeta.push({
      ...meta,
      reportId,
      alertId
    });
    this.state.simulation.generatedCount += 1;
    this.state.simulation.lastGeneratedAt = now;

    return clone(report);
  }

  createLearningAssignment(input: {
    alertId: string;
    assigneeId: string;
    moduleId: 'phishing-basics';
    now: string;
  }): LearningAssignment {
    const assignment: LearningAssignment = {
      id: nextId('la', this.state.learningAssignments),
      alertId: input.alertId,
      assigneeId: input.assigneeId,
      moduleId: input.moduleId,
      status: 'assigned',
      assignedAt: input.now
    };

    this.state.learningAssignments.push(assignment);
    return clone(assignment);
  }

  updateLearningAssignment(assignment: LearningAssignment): LearningAssignment {
    const index = this.state.learningAssignments.findIndex((item) => item.id === assignment.id);
    if (index === -1) {
      throw new Error('LEARNING_ASSIGNMENT_NOT_FOUND');
    }

    this.state.learningAssignments[index] = clone(assignment);
    return clone(this.state.learningAssignments[index]);
  }

  private toAlertDetails(alert: Alert): AlertDetailsView | null {
    const report = this.state.reports.find((item) => item.id === alert.reportId);
    const reporter = this.state.users.find((item) => item.id === alert.reporterId);
    if (!report || !reporter) {
      return null;
    }

    const timeline = this.state.timelineEvents
      .filter((event) => event.alertId === alert.id)
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

    const learningAssignment = this.state.learningAssignments.find(
      (assignment) => assignment.alertId === alert.id
    );

    return {
      alert,
      report,
      reporter,
      timeline,
      learningAssignment
    };
  }
}
