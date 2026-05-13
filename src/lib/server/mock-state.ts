import type {
  Alert,
  AlertDetailsView,
  AlertListQuery,
  DemoUser,
  GeneratedCaseMeta,
  LearningAssignment,
  Report,
  Severity,
  SimulationConfig,
  SimulationSession,
  TimelineEvent
} from '$lib/domains';
import { defaultSimulationConfig } from './simulation-engine';

export type MockState = {
  users: DemoUser[];
  reports: Report[];
  alerts: Alert[];
  timelineEvents: TimelineEvent[];
  learningAssignments: LearningAssignment[];
  simulation: SimulationSession;
  generatedCaseMeta: GeneratedCaseMeta[];
};

export type SeedName = 'default' | 'empty';

function baseUsers(): DemoUser[] {
  return [
    {
      id: 'employee-1',
      role: 'employee',
      name: 'Alice Employee',
      persona: 'careful_reporter'
    },
    {
      id: 'employee-2',
      role: 'employee',
      name: 'Bob Employee',
      persona: 'credential_risk'
    },
    {
      id: 'employee-3',
      role: 'employee',
      name: 'Carol Finance',
      persona: 'finance_target'
    },
    {
      id: 'employee-4',
      role: 'employee',
      name: 'Dan Manager',
      persona: 'manager'
    },
    {
      id: 'employee-5',
      role: 'employee',
      name: 'Eva Assistant',
      persona: 'assistant'
    },
    {
      id: 'employee-6',
      role: 'employee',
      name: 'Frank Sales',
      persona: 'frequent_clicker'
    },
    {
      id: 'employee-7',
      role: 'employee',
      name: 'Grace HR',
      persona: 'hr'
    },
    {
      id: 'employee-8',
      role: 'employee',
      name: 'Helen Legal',
      persona: 'attachment_opener'
    },
    {
      id: 'employee-9',
      role: 'employee',
      name: 'Ivan Support',
      persona: 'support'
    },
    {
      id: 'employee-10',
      role: 'employee',
      name: 'Julia Operations',
      persona: 'operations'
    },
    { id: 'admin-1', role: 'admin', name: 'Ada Admin' },
    { id: 'viewer-1', role: 'viewer', name: 'Victor Viewer' }
  ];
}

function baseSimulation(config: SimulationConfig = defaultSimulationConfig): SimulationSession {
  return {
    mode: 'paused',
    config: structuredClone(config),
    generatedCount: 0
  };
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
    learningAssignments: [],
    simulation: baseSimulation(),
    generatedCaseMeta: []
  };
}

function emptySeed(): MockState {
  return {
    users: baseUsers(),
    reports: [],
    alerts: [],
    timelineEvents: [],
    learningAssignments: [],
    simulation: baseSimulation(),
    generatedCaseMeta: []
  };
}

export function createSeedState(seed: SeedName): MockState {
  return seed === 'empty' ? emptySeed() : defaultSeed();
}

export type MockRepository = {
  reset(seed: SeedName): import('$lib/domains').DashboardSummary;
  getCurrentState(): MockState;
  getUserById(userId: string): DemoUser | null;
  listReportsForUser(userId: string): Report[];
  getReportById(reportId: string): Report | null;
  createReport(
    input: import('$lib/domains').SubmitReportInput,
    actor: DemoUser,
    now: string
  ): Report;
  listAlerts(query: AlertListQuery): AlertDetailsView[];
  getAlertDetails(alertId: string): AlertDetailsView | null;
  updateAlert(alert: Alert): Alert;
  addTimelineEvent(event: TimelineEvent): TimelineEvent;
  updateSimulationConfig(config: SimulationConfig): SimulationSession;
  setSimulationMode(mode: SimulationSession['mode'], now: string): SimulationSession;
  resetSimulation(now: string): SimulationSession;
  createSimulationReport(
    input: import('$lib/domains').SubmitReportInput,
    actor: DemoUser,
    now: string,
    severity: Severity,
    meta: Omit<GeneratedCaseMeta, 'reportId' | 'alertId'>
  ): Report;
  createLearningAssignment(input: {
    alertId: string;
    assigneeId: string;
    moduleId: 'phishing-basics';
    now: string;
  }): LearningAssignment;
  updateLearningAssignment(assignment: LearningAssignment): LearningAssignment;
};
