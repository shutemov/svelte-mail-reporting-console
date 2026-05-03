# Suspicious Mail Reporting Console: MVP User Stories

## Product Scope

This demo is a focused SvelteKit proof-of-work for one complete cybersecurity awareness workflow:

```txt
Employee reports a suspicious email
-> Admin triages the alert
-> Reporter sees the investigation outcome
-> Risky behavior triggers follow-up learning
-> Dashboard reflects alert and learning metrics
```

The goal is not to clone a full enterprise security platform. The goal is to demonstrate reliable frontend architecture for API-heavy B2B SaaS workflows: routed data loading, mutations, empty/loading/error/retry states, role-aware UI, dashboard-heavy screens, and domain-driven state changes.

## MVP Roles

### Employee

An internal company user who reports suspicious emails and completes assigned learning.

Can:
- Submit a suspicious email report.
- Declare risky actions taken with the email.
- See the status and outcome of their reports.
- Complete an assigned follow-up learning module.

### Admin

A security/admin user who reviews reports and manages follow-up learning.

Can:
- View the security dashboard.
- Review the alert queue.
- Filter alerts by status, severity, reporter, and risky action.
- Open alert details.
- Change alert status.
- Add investigation notes.
- Assign follow-up learning when risk is confirmed.

### Viewer

Optional read-only role for polish if time allows.

Can:
- View dashboard and alert details.
- Cannot change alert status, add notes, or assign learning.

## Core Domain States

### Alert Status

```txt
new
investigating
resolved_safe
resolved_malicious
closed
```

### Severity

```txt
low
medium
high
critical
```

### Risky Actions

```txt
opened_email
clicked_link
downloaded_attachment
entered_credentials
reported_without_interaction
```

### Learning Status

```txt
not_assigned
assigned
in_progress
completed
```

## Primary User Journey

1. Employee receives a suspicious email.
2. Employee submits a report with email metadata and actions taken.
3. System creates a new alert and calculates initial severity.
4. Admin sees the alert in the queue.
5. Admin opens alert details and starts investigation.
6. Admin resolves the alert as safe or malicious.
7. If the employee performed risky actions, Admin assigns follow-up learning.
8. Employee sees the assigned learning module.
9. Employee reviews meaningful follow-up content and marks the module completed.
10. Dashboard updates alert, risk, and learning metrics.

## User Stories

### US-01: Submit Suspicious Email Report

As an Employee, I want to report a suspicious email so that the security team can investigate it.

Acceptance criteria:
- Employee can enter sender, subject, received date, reason, and optional message preview.
- Employee can select one or more actions they took with the email.
- Employee sees validation errors for required or malformed fields.
- Submit button has a clear loading state.
- On success, Employee lands on the report status/details screen.
- On failure, Employee sees an error state and can retry without losing entered data.

Notes:
- This should feel like a real workflow form, not a generic contact form.
- Risky action selection is important because it drives severity and learning assignment.

### US-02: View My Reports

As an Employee, I want to see my submitted reports so that I know whether the security team has reviewed them.

Acceptance criteria:
- Employee can see a list of their own reports.
- Each report shows subject, submitted date, status, severity, and investigation outcome if available.
- Empty state explains that no reports have been submitted yet.
- Loading and error states are implemented.
- Employee cannot see reports submitted by other users.

### US-03: Review Admin Dashboard

As an Admin, I want to see operational metrics so that I can understand the current reporting and learning workload.

Acceptance criteria:
- Dashboard shows open alerts, confirmed malicious reports, risky actions, average triage time, and learning completion.
- Metrics are derived from the same mock data used by the alert queue and learning views.
- Dashboard has loading, empty, and error states.
- Dashboard links to filtered alert queue views where relevant.

Notes:
- Prefer fewer meaningful metrics over decorative charts.
- Metrics should tell the story of the primary workflow.

### US-04: Triage Alert Queue

As an Admin, I want to filter and scan reported emails so that I can prioritize investigation.

Acceptance criteria:
- Admin can view alerts in a table or dense list.
- Alerts show reporter, subject, received date, status, severity, risky actions, and last updated time.
- Admin can filter by status, severity, reporter, and risky action.
- Filters are reflected in the URL query string.
- Empty filtered results have a useful empty state.
- Loading and error states are implemented.

### US-05: Investigate Alert Details

As an Admin, I want to inspect a reported email so that I can decide whether it is safe or malicious.

Acceptance criteria:
- Alert details show email metadata, reporter, selected risky actions, severity, current status, and message preview.
- Admin can see an investigation timeline.
- Admin can change status from `new` to `investigating`.
- Admin can resolve the alert as `resolved_safe` or `resolved_malicious`.
- Admin can add investigation notes.
- Status changes and notes appear in the timeline.
- Mutations have loading and error states.

### US-06: Assign Follow-Up Learning

As an Admin, I want to assign follow-up learning after risky behavior so that users receive targeted education.

Acceptance criteria:
- Admin can assign learning from the alert details screen.
- Learning assignment is available when the alert is malicious or risky behavior is present.
- Assignment creates a learning task for the Employee.
- Assignment does not replace the alert resolution status.
- Viewer role cannot assign learning.

Notes:
- Use one fixed learning module in MVP.
- Do not build course creation in MVP.

### US-07: Complete Learning Module

As an Employee, I want to complete assigned learning so that I understand what I should do next time.

Acceptance criteria:
- Employee can see assigned learning tasks.
- Employee can open a short follow-up learning module.
- The module explains why the behavior was risky and what to do next time.
- Employee can mark the module as completed after viewing it.
- Completion marks the learning task as `completed`.
- Dashboard learning completion metric updates after completion.

### US-08: Enforce Role-Aware UI

As a product user, I want the interface to respect my role so that I only see actions I am allowed to take.

Acceptance criteria:
- Employee sees report submission, report status, and learning views.
- Admin sees dashboard, alert queue, alert details, and learning assignment actions.
- Viewer, if implemented, sees read-only dashboard and alert details.
- Unauthorized routes show a clear access-denied state.
- Restricted actions are not available in the UI for unauthorized roles.

## Suggested Routes

```txt
/login
/employee/report
/employee/reports
/employee/reports/[id]
/employee/learning
/employee/learning/[id]
/admin
/admin/alerts
/admin/alerts/[id]
```

Optional:

```txt
/viewer
/viewer/alerts/[id]
```

## Suggested Mock API Surface

```txt
GET    /api/me
GET    /api/reports
POST   /api/reports
GET    /api/reports/:id
GET    /api/admin/dashboard
GET    /api/admin/alerts
GET    /api/admin/alerts/:id
PATCH  /api/admin/alerts/:id/status
POST   /api/admin/alerts/:id/notes
POST   /api/admin/alerts/:id/assign-learning
GET    /api/learning
GET    /api/learning/:id
POST   /api/learning/:id/complete
```

## Demo Quality Bar

The MVP should include:
- Realistic mock data with multiple alert statuses and severities.
- Deliberate loading states.
- Empty states for no reports, no alerts, and no learning assignments.
- Error states with retry affordances.
- URL-driven admin filters.
- At least one mutation with optimistic or clearly pending UI.
- A visible audit timeline for alert investigation.
- Small test coverage for risk scoring and state transitions.

## Out of Scope for MVP

These are good future extensions, but should not be built in the first demo:

- Full campaign creation.
- Course authoring.
- Multi-tenant organization management.
- Real email ingestion.
- Real authentication provider integration.
- Real SIEM/SOAR integrations.
- Advanced email header parsing.
- Complex RBAC permission editor.
- Bulk alert actions.
- Compliance export reports.

## Success Criteria

This demo succeeds if a reviewer can run it and understand, within a few minutes:
- what product workflow it represents;
- how data moves through the system;
- how SvelteKit is used for reliable routed application flows;
- how loading, empty, error, and retry states are handled;
- how the UI supports a realistic B2B security operations task.
