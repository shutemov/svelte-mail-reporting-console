# spec.md

# Technical Specification: Suspicious Mail Reporting Console MVP

## 1. Overview

Build a SvelteKit MVP for a suspicious mail reporting and admin triage workflow.

Primary flow:

```txt
Employee reports suspicious email
-> Admin triages alert
-> Admin assigns follow-up learning when risk is confirmed
-> Employee completes learning
-> Dashboard metrics update
```

Implementation must follow:

- `docs/user-stories.md`
- `docs/technical-requirements.md`
- `docs/zod-form-contracts.md`
- `docs/dev-rules.md`
- `docs/test-rules.md`
- `docs/playwright-e2e-policy.md`
- `docs/ux-rules.md`

Core constraints:

- SvelteKit + TypeScript + Vite + pnpm.
- SSR enabled by default.
- SvelteKit form actions for UI mutations.
- Zod validation on server; optional client reuse for UX.
- Mock backend through `$lib/server`.
- Domain logic as pure TypeScript under `$lib/domains`.
- No UI kit, global state manager, chart library, form library, or table library.

## 2. Use Cases

### UC-01: Submit Suspicious Report

Actor: Employee.

Flow:

1. Employee opens `/employee/report`.
2. Employee submits sender, subject, received date, reason, risky actions, optional message preview.
3. Server validates payload and actor.
4. Server creates `Report`, `Alert`, and `TimelineEvent`.
5. Server calculates alert severity.
6. Employee lands on created report details/status screen.

Modules:

- `ReportSchemas`
- `ReportCommands`
- `MockRepository`
- `RiskScoring`
- `TimelineFactory`
- `OReportForm`

### UC-02: View Own Reports

Actor: Employee.

Flow:

1. Employee opens `/employee/reports`.
2. Server loads only reports where `reporterId === locals.user.id`.
3. UI renders list, empty state, or access-denied/error state.

Modules:

- `ReportQueries`
- `AuthContext`
- `MReportSummary`

### UC-03: Review Admin Dashboard

Actor: Admin.

Flow:

1. Admin opens `/admin`.
2. Server loads dashboard summary from shared mock state.
3. UI renders operational metrics and links to filtered alert queue.

Modules:

- `DashboardAggregator`
- `AlertQueries`
- `LearningQueries`
- `MMetricCard`
- `ODashboardSummary`

### UC-04: Triage Alert Queue

Actor: Admin.

Flow:

1. Admin opens `/admin/alerts`.
2. Server parses URL filters.
3. Server returns filtered alerts.
4. UI renders table/dense list and empty states.
5. Filters update URL query params.

Modules:

- `AlertSchemas`
- `AlertQueries`
- `AlertListQueryParser`
- `OAlertQueue`

### UC-05: Investigate Alert Details

Actor: Admin.

Flow:

1. Admin opens `/admin/alerts/[id]`.
2. Server loads alert details and timeline.
3. Admin starts investigation, resolves safe/malicious, adds note.
4. Server commands validate role and lifecycle transition.
5. Timeline updates after every command.

Modules:

- `AlertLifecycle`
- `AlertCommands`
- `TimelineFactory`
- `OAlertDetails`
- `MAlertTimeline`

### UC-06: Assign Follow-Up Learning

Actor: Admin.

Flow:

1. Admin opens malicious high/critical alert.
2. Admin assigns fixed learning module `phishing-basics`.
3. Server validates actor, alert status, severity, duplicate assignment.
4. Server creates `LearningAssignment`.
5. Alert resolution status stays unchanged.

Modules:

- `LearningCommands`
- `LearningSchemas`
- `AlertLifecycle`
- `MockRepository`

### UC-07: Complete Learning

Actor: Employee owner.

Flow:

1. Employee opens `/employee/learning`.
2. Employee opens assigned module.
3. Server marks assignment `in_progress` when opened.
4. Employee clicks `Mark as completed`.
5. Server validates ownership and status.
6. Server sets assignment `completed`.

Modules:

- `LearningCommands`
- `LearningQueries`
- `OLearningModule`

### UC-08: Switch Demo Role

Actor: Reviewer.

Flow:

1. Reviewer uses Demo Role Switcher.
2. Server action writes httpOnly `demo_user_id` cookie.
3. `hooks.server.ts` resolves `locals.user`.
4. Current route reloads/invalidates.

Modules:

- `DemoAuth`
- `hooks.server.ts`
- `MDemoRoleSwitcher`

## 3. Module Design

### 3.1 Domain Layer

Path: `src/lib/domains/*`

Rules:

- Pure TypeScript.
- No Svelte components.
- No `$lib/server`.
- No browser-only APIs.

Responsibilities:

- Types.
- Zod schemas safe for client import.
- Risk scoring.
- Lifecycle rules.
- Dashboard aggregation.
- Formatting labels where useful.

### 3.2 Server Layer

Path: `src/lib/server/*`

Responsibilities:

- In-memory seeded mock state.
- Repositories.
- Commands.
- Queries.
- Test controls.
- Auth resolution helpers.

Rules:

- May import domain modules.
- Must not import UI modules.
- Owns RBAC, ownership checks, lifecycle guards, side effects.

### 3.3 UI Layer

Path: `src/lib/ui/*`

Rules:

- Atomic naming: `A*`, `M*`, `O*`.
- No `$lib/server` imports.
- Atoms and molecules require unit/component tests.
- Organisms should remain reusable and avoid owning server mutations directly.

### 3.4 Routes

Path: `src/routes/*`

Responsibilities:

- Server `load` functions call server queries.
- Form actions call server commands.
- Page components compose UI components.
- URL filters live in route query params.

## 4. TypeScript Interface Drafts

### 4.1 Core Types

```ts
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

export type DemoUser = {
  id: string;
  role: UserRole;
  name: string;
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

export type TimelineEvent = {
  id: string;
  alertId: string;
  actorId: string;
  type:
    | 'report_submitted'
    | 'investigation_started'
    | 'alert_resolved_safe'
    | 'alert_resolved_malicious'
    | 'alert_closed'
    | 'note_added'
    | 'learning_assigned';
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
```

### 4.2 Form Contracts

```ts
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
```

### 4.3 Query/View Contracts

```ts
export type AlertListQuery = {
  status?: AlertStatus;
  severity?: Severity;
  reporterId?: string;
  riskyAction?: RiskyAction;
};

export type DashboardSummary = {
  openAlerts: number;
  confirmedMalicious: number;
  riskyActionReports: number;
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
```

## 5. Domain Interfaces And Test Contracts

### 5.1 Risk Scoring

Interface:

```ts
export function calculateSeverity(actions: RiskyAction[]): Severity;
export function validateRiskyActionCombination(actions: RiskyAction[]): string | null;
```

Positive tests:

- `reported_without_interaction` returns `low`.
- `opened_email` returns `low`.
- `clicked_link` returns `high`.
- `downloaded_attachment` returns `high`.
- `entered_credentials` returns `critical`.
- Multiple actions return maximum severity.

Negative/edge tests:

- Empty actions are rejected by schema.
- `reported_without_interaction` with any other action returns validation error.

Mocks:

- None.

### 5.2 Alert Lifecycle

Interface:

```ts
export type AlertCommand =
  | 'startInvestigation'
  | 'resolveAsSafe'
  | 'resolveAsMalicious'
  | 'closeAlert';

export function canApplyAlertCommand(alert: Alert, actor: DemoUser, command: AlertCommand): boolean;
export function applyAlertCommand(alert: Alert, actor: DemoUser, command: AlertCommand, now: string): Alert;
```

Positive tests:

- Admin can start investigation from `new`.
- Admin can resolve safe from `new` or `investigating`.
- Admin can resolve malicious from `new` or `investigating`.
- Admin can close from `resolved_safe` or `resolved_malicious`.

Negative/edge tests:

- Employee cannot apply admin commands.
- Viewer cannot apply mutation commands.
- Cannot close `new` alert.
- Cannot resolve already closed alert.
- Unsupported transitions return conflict-style error through server command.

Mocks:

- Fixed `now` timestamp.

### 5.3 Dashboard Aggregation

Interface:

```ts
export function buildDashboardSummary(state: {
  alerts: Alert[];
  reports: Report[];
  learningAssignments: LearningAssignment[];
}): DashboardSummary;
```

Positive tests:

- Counts `new` and `investigating` as open.
- Counts malicious resolved/closed alerts.
- Counts reports with link, attachment, or credentials as risky.
- Calculates rounded average triage minutes from fixed UTC timestamps.
- Calculates learning completion percentage.

Negative/edge tests:

- No resolved alerts returns `averageTriageMinutes: null`.
- No assignments returns `learningCompletionRate: 0`.

Mocks:

- Seeded fixed UTC state.

## 6. Server Interfaces And Test Contracts

### 6.1 Mock Repository

Interface:

```ts
export interface MockRepository {
  reset(seed: 'default' | 'empty'): DashboardSummary;
  getCurrentState(): MockState;
  getUserById(userId: string): DemoUser | null;
  listReportsForUser(userId: string): Report[];
  getReportById(reportId: string): Report | null;
  createReport(input: SubmitReportInput, actor: DemoUser, now: string): Report;
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
}
```

Tests:

- Reset `default` creates stable users and baseline records.
- Reset `empty` creates users but no reports/alerts/assignments.
- Created reports and alerts share identifiers.
- Repository state is only mutated through repository methods.

Mocks:

- Fixed seed data.
- Fixed clock.

### 6.2 Server Commands

Interface:

```ts
export interface ServerCommands {
  submitReport(actor: DemoUser, input: SubmitReportInput): Promise<MutationResult<SubmitReportInput, { reportId: string; alertId: string }>>;
  applyAlertCommand(actor: DemoUser, alertId: string, input: AlertCommandInput): Promise<MutationResult<AlertCommandInput, AlertDetailsView>>;
  addInvestigationNote(actor: DemoUser, alertId: string, input: AddInvestigationNoteInput): Promise<MutationResult<AddInvestigationNoteInput, AlertDetailsView>>;
  assignLearning(actor: DemoUser, alertId: string, input: AssignLearningInput): Promise<MutationResult<AssignLearningInput, LearningAssignment>>;
  startLearning(actor: DemoUser, assignmentId: string): Promise<LearningAssignmentView>;
  completeLearning(actor: DemoUser, input: CompleteLearningInput): Promise<MutationResult<CompleteLearningInput, LearningAssignmentView>>;
}
```

Test contract:

- Every command validates Zod payloads.
- Every mutation checks actor role.
- Employee-owned records check ownership.
- Alert commands append timeline events.
- `assignLearning` requires `resolved_malicious` and `high` or `critical`.
- `assignLearning` rejects duplicate assignment.
- `completeLearning` requires Employee owner and `in_progress`.

Negative tests:

- Direct Employee request to admin command returns permission form error.
- Closed alert rejects resolution commands.
- Invalid form payload returns string field errors and preserved values.
- Controlled failure mode returns configured server error once.

Mocks:

- `MockRepository`.
- `Clock`.
- Controlled failure registry.

### 6.3 Auth Context

Interface:

```ts
export interface DemoAuth {
  resolveUser(cookieUserId: string | undefined): DemoUser;
  switchUser(userId: string): { cookieName: 'demo_user_id'; value: string };
}
```

Tests:

- Missing cookie defaults to `employee-1`.
- Invalid cookie defaults to `employee-1`.
- Valid admin cookie resolves admin.
- Valid viewer cookie resolves viewer if implemented.

Mocks:

- Seeded users.

### 6.4 Test Controls

Interface:

```ts
export type FailureCommand =
  | 'submitReport'
  | 'updateAlertStatus'
  | 'assignLearning'
  | 'completeLearning';

export interface TestControls {
  reset(seed: 'default' | 'empty'): DashboardSummary;
  failNext(input: { command: FailureCommand; status: number; message: string }): void;
  consumeFailure(command: FailureCommand): { status: number; message: string } | null;
}
```

Tests:

- Endpoints return `404` unless `ENABLE_E2E_ENDPOINTS=true`.
- Reset clears failures.
- `failNext` fails once and then clears.
- Unknown failure command is rejected by schema.

Mocks:

- Environment flag.
- In-memory failure registry.

## 7. Route Implementation Contracts

### 7.1 App Shell

Files:

- `src/hooks.server.ts`
- `src/routes/+layout.server.ts`
- `src/routes/+layout.svelte`

Requirements:

- Resolve `locals.user` from `demo_user_id`.
- Render app shell with left navigation and top-right Demo Role Switcher.
- Role switcher posts to server action and invalidates current route.

### 7.2 Employee Routes

Files:

- `src/routes/employee/report/+page.server.ts`
- `src/routes/employee/report/+page.svelte`
- `src/routes/employee/reports/+page.server.ts`
- `src/routes/employee/reports/+page.svelte`
- `src/routes/employee/reports/[id]/+page.server.ts`
- `src/routes/employee/learning/+page.server.ts`
- `src/routes/employee/learning/[id]/+page.server.ts`

Requirements:

- Employee role required.
- Report and learning ownership enforced server-side.
- Report form uses shared schema on client and server where safe.
- Learning module uses `Mark as completed`, no quiz.

### 7.3 Admin Routes

Files:

- `src/routes/admin/+page.server.ts`
- `src/routes/admin/+page.svelte`
- `src/routes/admin/alerts/+page.server.ts`
- `src/routes/admin/alerts/+page.svelte`
- `src/routes/admin/alerts/[id]/+page.server.ts`
- `src/routes/admin/alerts/[id]/+page.svelte`

Requirements:

- Admin role required for mutations.
- Alert filters reflected in URL query params.
- Alert details render email content as text.
- Timeline shows status changes, notes, and learning assignment.

### 7.4 API/Test Routes

Files:

- `src/routes/api/me/+server.ts`
- `src/routes/api/test/reset/+server.ts`
- `src/routes/api/test/fail-next/+server.ts`

Requirements:

- `/api/me` returns current demo user.
- Test endpoints require `ENABLE_E2E_ENDPOINTS=true`.
- Test endpoints return `404` otherwise.

## 8. UI Component Contracts

Atoms:

- `AButton.svelte`
- `AInput.svelte`
- `ATextarea.svelte`
- `ACheckbox.svelte`
- `ASelect.svelte`
- `AStatusPill.svelte`
- `AErrorMessage.svelte`

Molecules:

- `MField.svelte`
- `MRiskyActionGroup.svelte`
- `MMetricCard.svelte`
- `MAlertSummary.svelte`
- `MDemoRoleSwitcher.svelte`
- `MTimelineEvent.svelte`

Organisms:

- `OReportForm.svelte`
- `OAlertQueue.svelte`
- `OAlertDetails.svelte`
- `ODashboardSummary.svelte`
- `OLearningModule.svelte`

Component test contract:

- Atoms and molecules have unit/component tests.
- Tests cover key props, labels/roles, disabled/loading/error states, callbacks.
- Organisms are covered by e2e unless reusable complexity warrants component tests.

## 9. E2E Test Contract

Use Playwright policy from `docs/playwright-e2e-policy.md`.

Required specs:

- `tests/e2e/report-to-learning.spec.ts`
- `tests/e2e/admin-alert-filters.spec.ts`
- `tests/e2e/report-validation-retry.spec.ts`
- `tests/e2e/empty-states.spec.ts`
- `tests/e2e/mobile-cross-browser-smoke.spec.ts`

Scenarios:

- Primary workflow: submit report, switch to admin, resolve malicious, assign learning, switch to employee, complete learning, assert dashboard metric changes.
- Filters: update status/severity/risky action filters, assert URL query params survive reload.
- Validation: invalid report shows string field errors and preserves input.
- Retry: `fail-next submitReport`, first submit fails, retry succeeds.
- Empty: `empty` seed renders empty states.
- Mobile: navigation, role switcher, report form accessibility, admin alert list.
- Cross-browser: Chromium, Firefox, WebKit smoke for report submission, role switch, alert detail.

## 10. Performance Test Contract

Implement:

- `tests/utils/performance.ts`

Required helpers:

- `measure`
- `measureStep`
- `logPerfResult`
- `expectWithinBudget`

Unit performance checks:

- Risk scoring under `5ms`.
- Dashboard aggregation under `20ms`.
- Alert filtering under `20ms`.

E2E performance checks:

- Admin alerts page ready under `1500ms`.
- Submit report flow under `1500ms`.
- Dashboard metric update after learning completion under `1500ms`.

## 11. Implementation Checklist

Recommended order:

1. Scaffold SvelteKit with TypeScript, pnpm, Vitest, Playwright.
2. Add docs-aligned folder structure.
3. Add CSS tokens, base styles, app shell, responsive layout.
4. Implement domain types and Zod schemas.
5. Implement risk scoring, lifecycle, dashboard aggregation with unit tests.
6. Implement mock repository, seed data, auth resolver, test controls.
7. Implement server commands and command tests.
8. Implement Employee report flow.
9. Implement Admin dashboard, alert queue, alert details.
10. Implement learning assignment and completion.
11. Implement atoms/molecules and component tests.
12. Implement e2e primary workflow, filters, validation/retry, empty state.
13. Add mobile and cross-browser smoke.
14. Add performance test utils and budget checks.
15. Run `pnpm check`, `pnpm test:unit`, `pnpm test:e2e`, `pnpm build`.

Files/directories to create:

```txt
src/lib/domains/
src/lib/server/
src/lib/styles/
src/lib/ui/atoms/
src/lib/ui/molecules/
src/lib/ui/organisms/
src/routes/employee/
src/routes/admin/
src/routes/api/test/
tests/e2e/
tests/unit/
tests/utils/performance.ts
```

Non-functional notes:

- Keep domain modules stateless and deterministic.
- Keep mock state server-only.
- Keep route files thin.
- Render suspicious email content as text.
- Preserve SSR by default.
- Keep dependencies intentionally small.
- Make mobile and target-browser support part of acceptance, not a later polish pass.
