export type UserRole = 'employee' | 'admin' | 'viewer';

export type AlertStatus =
  | 'new'
  | 'investigating'
  | 'resolved_safe'
  | 'resolved_malicious'
  | 'closed';

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export type RiskyAction =
  | 'opened_email'
  | 'clicked_link'
  | 'downloaded_attachment'
  | 'entered_credentials'
  | 'reported_without_interaction';

export type LearningStatus =
  | 'not_assigned'
  | 'assigned'
  | 'in_progress'
  | 'completed';

export type EmployeePersona =
  | 'careful_reporter'
  | 'frequent_clicker'
  | 'attachment_opener'
  | 'credential_risk'
  | 'finance_target'
  | 'manager'
  | 'assistant'
  | 'hr'
  | 'support'
  | 'operations';

export type DemoUser = {
  id: string;
  role: UserRole;
  name: string;
  persona?: EmployeePersona;
};

export type Report = {
  id: string;
  reporterId: string;
  sender: string;
  subject: string;
  receivedAt: string;
  reason: string;
  riskyActions: RiskyAction[];
  messagePreview?: string;
  createdAt: string;
  alertId: string;
};

export type Alert = {
  id: string;
  reportId: string;
  reporterId: string;
  status: AlertStatus;
  severity: Severity;
  finalOutcome?: 'safe' | 'malicious';
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
};

export type TimelineEventType =
  | 'report_submitted'
  | 'investigation_started'
  | 'alert_resolved_safe'
  | 'alert_resolved_malicious'
  | 'alert_closed'
  | 'note_added'
  | 'learning_assigned';

export type TimelineEvent = {
  id: string;
  alertId: string;
  actorId: string;
  type: TimelineEventType;
  message: string;
  createdAt: string;
};

export type LearningAssignment = {
  id: string;
  alertId: string;
  assigneeId: string;
  moduleId: 'phishing-basics';
  status: LearningStatus;
  assignedAt: string;
  startedAt?: string;
  completedAt?: string;
};

export type FieldErrors<TValues> = Partial<Record<keyof TValues, string>>;

export type MutationResult<TValues, TData = unknown> = {
  success: boolean;
  values?: Partial<TValues>;
  fieldErrors?: FieldErrors<TValues>;
  formError?: string;
  data?: TData;
};

export type SubmitReportInput = {
  sender: string;
  subject: string;
  receivedAt: string;
  reason: string;
  riskyActions: RiskyAction[];
  messagePreview?: string;
};

export type AlertCommandInput = {
  command:
    | 'startInvestigation'
    | 'resolveAsSafe'
    | 'resolveAsMalicious'
    | 'closeAlert';
  resolutionNote?: string;
};

export type AddInvestigationNoteInput = {
  body: string;
};

export type AssignLearningInput = {
  moduleId: 'phishing-basics';
};

export type CompleteLearningInput = {
  assignmentId: string;
};

export type AlertListQuery = {
  status?: AlertStatus;
  severity?: Severity;
  reporterId?: string;
  riskyAction?: RiskyAction;
};

export type DashboardSummary = {
  openAlerts: number;
  incomingReportsLast15m: number;
  confirmedMalicious: number;
  highRiskReports: number;
  riskyActionReports: number;
  backlogGrowthRate: number;
  averageTriageMinutes: number | null;
  learningCompletionRate: number;
};

export type AlertDetailsView = {
  alert: Alert;
  report: Report;
  reporter: DemoUser;
  timeline: TimelineEvent[];
  learningAssignment?: LearningAssignment;
};

export type LearningAssignmentView = {
  assignment: LearningAssignment;
  alert: Alert;
  report: Pick<Report, 'id' | 'subject' | 'sender' | 'riskyActions'>;
  module: {
    id: 'phishing-basics';
    title: string;
    body: string;
  };
};

export type SimulationMode = 'paused' | 'running';

export type SeverityMix = Record<Severity, number>;

export type SimulationConfig = {
  ratePerMinute: number;
  maliciousRatio: number;
  severityMix: SeverityMix;
  seed: number;
  autoStartOnReset?: boolean;
};

export type GroundTruthOutcome = 'safe' | 'malicious';

export type GeneratedCaseMeta = {
  reportId: string;
  alertId: string;
  generatedAt: string;
  templateId: string;
  groundTruth: {
    outcome: GroundTruthOutcome;
    severity: Severity;
  };
};

export type SimulationSession = {
  mode: SimulationMode;
  config: SimulationConfig;
  generatedCount: number;
  startedAt?: string;
  lastGeneratedAt?: string;
};

export type QueueHealthMetrics = {
  openAlerts: number;
  newAlertsLast15m: number;
  backlogGrowthRate: number;
  oldestOpenAlertMinutes: number | null;
};

export type TriageOutcomeMetrics = {
  totalDecisions: number;
  correctDecisions: number;
  falsePositives: number;
  falseNegatives: number;
  decisionAccuracyPercent: number;
  falsePositiveRate: number;
  falseNegativeRate: number;
  precisionPercent: number;
  recallPercent: number;
  medianTimeToFirstActionMinutes: number | null;
  medianTimeToResolutionMinutes: number | null;
  alertsResolvedLastHour: number;
};

export type HumanRiskLearningMetrics = {
  highRiskActionRate: number;
  learningAssignmentRateForEligibleCases: number;
  learningCompletionRate: number;
};

export type SimulationSummary = {
  session: SimulationSession;
  generatedCases: GeneratedCaseMeta[];
  queueHealth: QueueHealthMetrics;
  triageOutcome: TriageOutcomeMetrics;
  humanRiskLearning: HumanRiskLearningMetrics;
};

export type EmployeeRiskStatus = 'green' | 'yellow' | 'red';

export type EmployeeProfileSummary = {
  user: DemoUser;
  riskStatus: EmployeeRiskStatus;
  riskStatusLabel: string;
  totalReports: number;
  reportsLast15m: number;
  openAlerts: number;
  highRiskReports: number;
  clickedLinkCount: number;
  downloadedAttachmentCount: number;
  enteredCredentialsCount: number;
  confirmedMalicious: number;
  resolvedSafe: number;
  pendingTriage: number;
  learningAssigned: number;
  learningCompleted: number;
  learningCompletionRate: number;
  lastReportAt: string | null;
};

export type EmployeeRiskSignal = {
  id: string;
  alertId: string;
  reportId: string;
  type:
    | RiskyAction
    | 'confirmed_malicious'
    | 'resolved_safe'
    | 'learning_assigned'
    | 'learning_completed';
  severity: Severity;
  createdAt: string;
  message: string;
};

export type EmployeeProfileDetails = {
  user: DemoUser;
  summary: EmployeeProfileSummary;
  reports: Report[];
  alerts: Alert[];
  learningAssignments: LearningAssignment[];
  recentRiskSignals: EmployeeRiskSignal[];
};
