import type {
  Alert,
  AlertDetailsView,
  AlertListQuery,
  DemoUser,
  LearningAssignment,
  Report,
  TimelineEvent
} from '$lib/domains/types';

export type MockState = {
  users: DemoUser[];
  reports: Report[];
  alerts: Alert[];
  timelineEvents: TimelineEvent[];
  learningAssignments: LearningAssignment[];
};

export type SeedName = 'default' | 'empty';

function baseUsers(): DemoUser[] {
  return [
    { id: 'employee-1', role: 'employee', name: 'Alice Employee' },
    { id: 'employee-2', role: 'employee', name: 'Bob Employee' },
    { id: 'admin-1', role: 'admin', name: 'Ada Admin' },
    { id: 'viewer-1', role: 'viewer', name: 'Victor Viewer' }
  ];
}

function defaultSeed(): MockState {
  const now = '2026-01-10T10:00:00.000Z';
  const created = '2026-01-10T09:40:00.000Z';

  const report: Report = {
    id: 'report-1',
    reporterId: 'employee-1',
    sender: 'suspicious@mailer.biz',
    subject: 'Urgent action required',
    receivedAt: '2026-01-10T09:15:00.000Z',
    reason: 'Looks like phishing and asks for login data.',
    riskyActions: ['clicked_link'],
    messagePreview: 'Please verify your account immediately.',
    createdAt: created,
    alertId: 'alert-1'
  };

  const alert: Alert = {
    id: 'alert-1',
    reportId: 'report-1',
    reporterId: 'employee-1',
    status: 'investigating',
    severity: 'high',
    createdAt: created,
    updatedAt: now
  };

  const timeline: TimelineEvent[] = [
    {
      id: 'tl-1',
      alertId: 'alert-1',
      actorId: 'employee-1',
      type: 'report_submitted',
      message: 'Suspicious report submitted',
      createdAt: created
    },
    {
      id: 'tl-2',
      alertId: 'alert-1',
      actorId: 'admin-1',
      type: 'investigation_started',
      message: 'Investigation started',
      createdAt: now
    }
  ];

  return {
    users: baseUsers(),
    reports: [report],
    alerts: [alert],
    timelineEvents: timeline,
    learningAssignments: []
  };
}

function emptySeed(): MockState {
  return {
    users: baseUsers(),
    reports: [],
    alerts: [],
    timelineEvents: [],
    learningAssignments: []
  };
}

export function createSeedState(seed: SeedName): MockState {
  return seed === 'empty' ? emptySeed() : defaultSeed();
}

export type MockRepository = {
  reset(seed: SeedName): import('$lib/domains/types').DashboardSummary;
  getCurrentState(): MockState;
  getUserById(userId: string): DemoUser | null;
  listReportsForUser(userId: string): Report[];
  getReportById(reportId: string): Report | null;
  createReport(
    input: import('$lib/domains/types').SubmitReportInput,
    actor: DemoUser,
    now: string
  ): Report;
  listAlerts(query: AlertListQuery): AlertDetailsView[];
  getAlertDetails(alertId: string): AlertDetailsView | null;
  updateAlert(alert: Alert): Alert;
  addTimelineEvent(event: TimelineEvent): TimelineEvent;
  createLearningAssignment(input: {
    alertId: string;
    assigneeId: string;
    moduleId: 'phishing-basics';
    now: string;
  }): LearningAssignment;
  updateLearningAssignment(assignment: LearningAssignment): LearningAssignment;
};