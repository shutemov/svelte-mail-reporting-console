# MVP Enhancement Proposal: Employee Risk Profiles

## 1. Purpose

Current MVP has a strong alert workflow, but manual reporting can feel too isolated: one employee submits one report, and the admin resolves one alert.

`Employee Risk Profiles` adds a human and organizational layer on top of reports and the Simulation Feed.

Expected product impact:

- reports become connected to employee behavior patterns;
- simulation output feels like activity from a real organization;
- learning assignments become easier to justify;
- admins can prioritize not only by alert severity, but also by reporter risk context;
- demo story becomes stronger: "who is affected, how often, and what changed after learning?"

## 2. Scope (MVP+)

### In scope

1. Admin-facing employee profile summaries.
2. Per-employee report, alert, risky action, and learning metrics.
3. Employee profile details page with alert/report history.
4. Simulation engine generates reports from multiple employees.
5. Reporter context appears in admin alert cards/details.
6. Minimal test coverage for aggregation logic and profile route happy path.

### Out of scope

1. Real HR directory integrations.
2. Sensitive personal data or compliance workflows.
3. Predictive risk scoring or ML-based employee ranking.
4. Cross-company benchmarking.

## 3. Product Rationale

Manual report submission should remain part of the demo, but it should not be the main source of "live workload".

Recommended positioning:

- `Simulation Feed`: drives realistic organizational alert volume.
- `Manual Report`: demonstrates how a real employee enters the same pipeline.
- `Employee Risk Profiles`: explains behavior patterns behind the queue.

This avoids making the manual report flow carry the whole demo by itself.

## 4. Architecture Proposal

### Domain

New entities:

- `EmployeeProfileSummary`
- `EmployeeProfileDetails`
- `EmployeeRiskSignal`
- `ReporterActivityMetrics`

New functions:

- `buildEmployeeProfileSummaries(state)`
- `buildEmployeeProfileDetails(state, employeeId)`
- `calculateReporterActivityMetrics(state, employeeId)`

### Server

Recommended modules:

- `src/lib/domains/employee-profile-aggregation.ts`
- Extend `ServerQueries` with:
  - `listEmployeeProfileSummaries()`
  - `getEmployeeProfileDetails(employeeId)`

State requirements:

- Existing `users`, `reports`, `alerts`, `learningAssignments`, and `timelineEvents` are enough for MVP.
- Optional later extension: add employee metadata such as department, title, location, and risk persona.

### Routes/UI

New routes:

- `GET /admin/employees`
- `GET /admin/employees/[id]`

New UI components:

- `OEmployeeProfilesList` (organism)
- `OEmployeeProfileDetails` (organism)
- `MEmployeeRiskSummary` (molecule)
- `MReporterActivityCard` (molecule)

Existing UI enhancements:

- Add reporter name and key risk context to alert queue cards.
- Link from alert details to employee profile.

## 5. Useful Admin Metrics

### A. Reporter workload

1. `totalReports`
2. `openAlerts`
3. `lastReportAt`
4. `reportsLast15m`

Why useful:

- shows who is actively reporting;
- helps distinguish a one-off report from repeated exposure.

### B. Risk behavior

1. `highRiskReports`
2. `clickedLinkCount`
3. `downloadedAttachmentCount`
4. `enteredCredentialsCount`

Why useful:

- shows employee behavior risk, not only alert count;
- helps admins prioritize learning and follow-up.

### C. Triage outcomes

1. `confirmedMalicious`
2. `resolvedSafe`
3. `falseNegativeCount` for simulated cases where ground truth exists
4. `falsePositiveCount` for simulated cases where ground truth exists

Why useful:

- connects employee history with admin decision quality;
- helps show whether risky employees are also generating true malicious cases.

### D. Learning loop

1. `learningAssigned`
2. `learningCompleted`
3. `learningCompletionRate`
4. `repeatRiskAfterCompletion` (future)

Why useful:

- connects incident response with behavior change;
- gives a clearer business reason for the learning workflow.

## 6. Draft Contracts

```ts
type EmployeeProfileSummary = {
  user: DemoUser;
  totalReports: number;
  openAlerts: number;
  confirmedMalicious: number;
  highRiskReports: number;
  learningAssigned: number;
  learningCompleted: number;
  learningCompletionRate: number;
  lastReportAt: string | null;
};

type EmployeeProfileDetails = {
  user: DemoUser;
  summary: EmployeeProfileSummary;
  reports: Report[];
  alerts: Alert[];
  learningAssignments: LearningAssignment[];
  recentRiskSignals: EmployeeRiskSignal[];
};

type EmployeeRiskSignal = {
  id: string;
  alertId: string;
  reportId: string;
  type: RiskyAction | 'confirmed_malicious' | 'learning_assigned' | 'learning_completed';
  severity: Severity;
  createdAt: string;
  message: string;
};
```

## 7. Simulation Integration

Simulation should generate reports from multiple employees instead of always using `employee-1`.

Recommended MVP behavior:

1. Add more seed users.
2. Pick reporter deterministically from seed + sequence.
3. Optionally bias templates by employee persona.

Example personas:

- careful reporter: reports often, mostly no interaction;
- frequent clicker: higher chance of `clicked_link`;
- finance target: more invoice/payment phishing;
- new employee: higher chance of risky action and learning assignment.

This keeps the simulation deterministic while making profiles feel alive.

## 8. Test Plan (minimum)

### Unit

1. Profile summary aggregation for multiple users.
2. High-risk action counts per employee.
3. Learning completion rate per employee.
4. Simulation chooses reporters deterministically for fixed seed.

### E2E

1. Admin opens employee profiles list and sees multiple employees.
2. Admin opens one employee profile and sees report/alert history.
3. Simulation generates reports for multiple employees.
4. Alert details link to the correct employee profile.

## 9. Rollout Plan

1. Add profile aggregation contracts and unit tests.
2. Add `/admin/employees` list route.
3. Add `/admin/employees/[id]` details route.
4. Update simulation reporter selection to use multiple employees.
5. Add reporter context and profile links to alert UI.
6. Add e2e happy path.

## 10. Definition of Done

Enhancement is complete when:

1. Admin can view employee-level report and risk summaries.
2. Admin can open a profile and inspect report, alert, and learning history.
3. Simulation generates reports from multiple employees.
4. Alert UI links incidents back to employee context.
5. All gates pass: `check`, `test:unit`, `test:e2e`, `build`.
