import type {
  Alert,
  AlertDetailsView,
  DashboardSummary,
  DemoUser,
  EmployeeProfileDetails,
  EmployeeProfileSummary,
  GeneratedCaseMeta,
  LearningAssignment,
  LearningAssignmentView,
  QueueHealthMetrics,
  Report,
  SimulationConfig,
  SimulationSession,
  SimulationSummary,
  TimelineEvent
} from '$lib/domains';

export const storyUsers: DemoUser[] = [
  {
    id: 'admin-1',
    role: 'admin',
    name: 'Alex Morgan'
  },
  {
    id: 'viewer-1',
    role: 'viewer',
    name: 'Sam Rivera'
  },
  {
    id: 'employee-1',
    role: 'employee',
    name: 'Maya Chen',
    persona: 'finance_target'
  },
  {
    id: 'employee-2',
    role: 'employee',
    name: 'Jordan Lee',
    persona: 'frequent_clicker'
  },
  {
    id: 'employee-3',
    role: 'employee',
    name: 'Priya Shah',
    persona: 'careful_reporter'
  }
];

export const storyDashboardSummary: DashboardSummary = {
  openAlerts: 42,
  incomingReportsLast15m: 18,
  confirmedMalicious: 11,
  highRiskReports: 9,
  riskyActionReports: 16,
  backlogGrowthRate: 2.4,
  averageTriageMinutes: 7,
  learningCompletionRate: 86
};

export const storyReport: Report = {
  id: 'report-1042',
  reporterId: 'employee-1',
  sender: 'billing@example-payments.net',
  subject: 'Urgent invoice approval required',
  receivedAt: '2026-05-12T07:48:00.000Z',
  reason: 'The sender domain is unfamiliar and the invoice link opens outside the vendor portal.',
  riskyActions: ['opened_email', 'clicked_link'],
  messagePreview:
    'Please approve the overdue invoice before the end of the business day.\n\nLink: https://example-payments.net/approve',
  createdAt: '2026-05-12T08:12:00.000Z',
  alertId: 'alert-1042'
};

export const storyAlert: Alert = {
  id: 'alert-1042',
  reportId: storyReport.id,
  reporterId: storyReport.reporterId,
  status: 'investigating',
  severity: 'high',
  createdAt: '2026-05-12T08:12:00.000Z',
  updatedAt: '2026-05-12T08:24:00.000Z'
};

export const storyTimeline: TimelineEvent[] = [
  {
    id: 'event-1',
    alertId: storyAlert.id,
    actorId: 'employee-1',
    type: 'report_submitted',
    message: 'Maya Chen reported the message after opening the email.',
    createdAt: '2026-05-12T08:12:00.000Z'
  },
  {
    id: 'event-2',
    alertId: storyAlert.id,
    actorId: 'admin-1',
    type: 'investigation_started',
    message: 'Alex Morgan started triage and reviewed sender identity.',
    createdAt: '2026-05-12T08:24:00.000Z'
  },
  {
    id: 'event-3',
    alertId: storyAlert.id,
    actorId: 'admin-1',
    type: 'note_added',
    message: 'Domain and payment link do not match the approved vendor workflow.',
    createdAt: '2026-05-12T08:31:00.000Z'
  }
];

export const storyLearningAssignment: LearningAssignment = {
  id: 'learning-1042',
  alertId: storyAlert.id,
  assigneeId: storyReport.reporterId,
  moduleId: 'phishing-basics',
  status: 'assigned',
  assignedAt: '2026-05-12T08:36:00.000Z'
};

export const storyAlertDetails: AlertDetailsView = {
  alert: storyAlert,
  report: storyReport,
  reporter: storyUsers[2],
  timeline: storyTimeline
};

export const storyResolvedAlertDetails: AlertDetailsView = {
  ...storyAlertDetails,
  alert: {
    ...storyAlert,
    status: 'resolved_malicious',
    finalOutcome: 'malicious',
    resolvedAt: '2026-05-12T08:36:00.000Z',
    updatedAt: '2026-05-12T08:36:00.000Z'
  },
  timeline: [
    ...storyTimeline,
    {
      id: 'event-4',
      alertId: storyAlert.id,
      actorId: 'admin-1',
      type: 'alert_resolved_malicious',
      message: 'Resolved as malicious after confirming the link impersonates a vendor portal.',
      createdAt: '2026-05-12T08:36:00.000Z'
    }
  ],
  learningAssignment: storyLearningAssignment
};

export function makeAlertDetails(index: number): AlertDetailsView {
  const severities = ['low', 'medium', 'high', 'critical'] as const;
  const statuses = ['new', 'investigating', 'resolved_safe', 'resolved_malicious', 'closed'] as const;
  const severity = severities[index % severities.length];
  const status = statuses[index % statuses.length];
  const reporter = storyUsers[2 + (index % 3)];
  const id = String(2000 + index);

  return {
    alert: {
      id: `alert-${id}`,
      reportId: `report-${id}`,
      reporterId: reporter.id,
      status,
      severity,
      finalOutcome: status === 'resolved_safe' ? 'safe' : status === 'resolved_malicious' ? 'malicious' : undefined,
      createdAt: `2026-05-12T0${index % 9}:12:00.000Z`,
      updatedAt: `2026-05-12T0${index % 9}:24:00.000Z`
    },
    report: {
      id: `report-${id}`,
      reporterId: reporter.id,
      sender: index % 2 === 0 ? 'payroll@example-benefits.net' : 'it-helpdesk@example-login.net',
      subject: index % 2 === 0 ? 'Payroll document shared with you' : 'Mailbox password expires today',
      receivedAt: `2026-05-12T0${index % 9}:05:00.000Z`,
      reason: 'Unexpected sender and off-process request.',
      riskyActions: index % 3 === 0 ? ['opened_email', 'entered_credentials'] : ['opened_email', 'clicked_link'],
      messagePreview: 'Please review the linked document and confirm access.',
      createdAt: `2026-05-12T0${index % 9}:12:00.000Z`,
      alertId: `alert-${id}`
    },
    reporter,
    timeline: storyTimeline.map((event, eventIndex) => ({
      ...event,
      id: `event-${id}-${eventIndex}`,
      alertId: `alert-${id}`
    }))
  };
}

export const storyAlertQueue = Array.from({ length: 24 }, (_, index) => makeAlertDetails(index + 1));

export const storyEmployeeSummaries: EmployeeProfileSummary[] = [
  {
    user: storyUsers[2],
    riskStatus: 'yellow',
    riskStatusLabel: 'Elevated',
    totalReports: 18,
    reportsLast15m: 2,
    openAlerts: 3,
    highRiskReports: 5,
    clickedLinkCount: 4,
    downloadedAttachmentCount: 1,
    enteredCredentialsCount: 0,
    confirmedMalicious: 3,
    resolvedSafe: 10,
    pendingTriage: 3,
    learningAssigned: 4,
    learningCompleted: 3,
    learningCompletionRate: 75,
    lastReportAt: '2026-05-12T08:12:00.000Z'
  },
  {
    user: storyUsers[3],
    riskStatus: 'red',
    riskStatusLabel: 'High risk',
    totalReports: 25,
    reportsLast15m: 5,
    openAlerts: 7,
    highRiskReports: 11,
    clickedLinkCount: 9,
    downloadedAttachmentCount: 3,
    enteredCredentialsCount: 2,
    confirmedMalicious: 8,
    resolvedSafe: 6,
    pendingTriage: 7,
    learningAssigned: 6,
    learningCompleted: 2,
    learningCompletionRate: 33,
    lastReportAt: '2026-05-12T08:31:00.000Z'
  },
  {
    user: storyUsers[4],
    riskStatus: 'green',
    riskStatusLabel: 'Healthy',
    totalReports: 12,
    reportsLast15m: 0,
    openAlerts: 0,
    highRiskReports: 0,
    clickedLinkCount: 0,
    downloadedAttachmentCount: 0,
    enteredCredentialsCount: 0,
    confirmedMalicious: 0,
    resolvedSafe: 9,
    pendingTriage: 0,
    learningAssigned: 1,
    learningCompleted: 1,
    learningCompletionRate: 100,
    lastReportAt: '2026-05-11T16:40:00.000Z'
  }
];

export const storyEmployeeProfileDetails: EmployeeProfileDetails = {
  user: storyUsers[2],
  summary: storyEmployeeSummaries[0],
  reports: [storyReport, makeAlertDetails(7).report],
  alerts: [storyAlert, makeAlertDetails(7).alert],
  learningAssignments: [storyLearningAssignment],
  recentRiskSignals: [
    {
      id: 'signal-1',
      alertId: storyAlert.id,
      reportId: storyReport.id,
      type: 'clicked_link',
      severity: 'high',
      createdAt: '2026-05-12T08:12:00.000Z',
      message: 'Clicked a link in a suspicious invoice message.'
    },
    {
      id: 'signal-2',
      alertId: 'alert-2007',
      reportId: 'report-2007',
      type: 'resolved_safe',
      severity: 'low',
      createdAt: '2026-05-11T16:40:00.000Z',
      message: 'Reported a safe vendor message without risky interaction.'
    }
  ]
};

export const storyLearningAssignmentView: LearningAssignmentView = {
  assignment: storyLearningAssignment,
  alert: storyResolvedAlertDetails.alert,
  report: {
    id: storyReport.id,
    subject: storyReport.subject,
    sender: storyReport.sender,
    riskyActions: storyReport.riskyActions
  },
  module: {
    id: 'phishing-basics',
    title: 'Phishing basics for payment requests',
    body: 'Review sender identity, payment urgency, and off-process approval requests before interacting with mail content.'
  }
};

export const storyLearningAssignments: LearningAssignmentView[] = [
  storyLearningAssignmentView,
  {
    ...storyLearningAssignmentView,
    assignment: {
      ...storyLearningAssignment,
      id: 'learning-1043',
      status: 'in_progress',
      assignedAt: '2026-05-11T13:20:00.000Z',
      startedAt: '2026-05-11T14:02:00.000Z'
    },
    report: {
      id: 'report-1043',
      subject: 'Mailbox password expires today',
      sender: 'it-helpdesk@example-login.net',
      riskyActions: ['entered_credentials']
    }
  }
];

export const storyReportsList = [
  {
    id: storyReport.id,
    subject: storyReport.subject,
    createdAt: storyReport.createdAt
  },
  {
    id: 'report-1043',
    subject: 'Mailbox password expires today',
    createdAt: '2026-05-11T13:20:00.000Z'
  }
];

export const storySimulationConfig: SimulationConfig = {
  ratePerMinute: 4,
  maliciousRatio: 0.45,
  severityMix: {
    low: 30,
    medium: 35,
    high: 25,
    critical: 10
  },
  seed: 12345,
  autoStartOnReset: true
};

export const storySimulationSession: SimulationSession = {
  mode: 'running',
  config: storySimulationConfig,
  generatedCount: 128,
  startedAt: '2026-05-12T07:00:00.000Z',
  lastGeneratedAt: '2026-05-12T08:42:00.000Z'
};

const queueHealth: QueueHealthMetrics = {
  openAlerts: 42,
  newAlertsLast15m: 18,
  backlogGrowthRate: 2.4,
  oldestOpenAlertMinutes: 38
};

const generatedCases: GeneratedCaseMeta[] = [
  {
    reportId: storyReport.id,
    alertId: storyAlert.id,
    generatedAt: storyReport.createdAt,
    templateId: 'invoice-approval',
    groundTruth: {
      outcome: 'malicious',
      severity: 'high'
    }
  }
];

export const storySimulationSummary: SimulationSummary = {
  session: storySimulationSession,
  generatedCases,
  queueHealth,
  triageOutcome: {
    totalDecisions: 46,
    correctDecisions: 42,
    falsePositives: 2,
    falseNegatives: 2,
    decisionAccuracyPercent: 91,
    falsePositiveRate: 4,
    falseNegativeRate: 4,
    precisionPercent: 92,
    recallPercent: 92,
    medianTimeToFirstActionMinutes: 3,
    medianTimeToResolutionMinutes: 9,
    alertsResolvedLastHour: 17
  },
  humanRiskLearning: {
    highRiskActionRate: 18,
    learningAssignmentRateForEligibleCases: 80,
    learningCompletionRate: 86
  }
};

export const storyNavItems = [
  { href: '/admin', label: 'Dashboard', shortLabel: 'Dash', hint: 'Live' },
  { href: '/admin/alerts', label: 'Alert queue', shortLabel: 'Alerts', hint: 'Queue' },
  { href: '/admin/simulation', label: 'Simulation', shortLabel: 'Sim', hint: 'Load' }
];
