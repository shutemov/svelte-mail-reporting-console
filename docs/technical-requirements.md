# Suspicious Mail Reporting Console: Technical Requirements

## Purpose

This document defines the frontend engineering contract for the MVP described in `docs/user-stories.md`.

The project is a focused SvelteKit proof-of-work for a B2B cybersecurity workflow:

```txt
Employee reports a suspicious email
-> Admin triages the alert
-> Reporter sees the investigation outcome
-> Risky behavior triggers follow-up learning
-> Dashboard reflects alert and learning metrics
```

The implementation should demonstrate reliable frontend architecture, not broad platform scope. Prefer complete, well-handled workflows over many shallow screens.

## Stack

- Framework: SvelteKit.
- UI runtime: Svelte.
- Language: TypeScript.
- Build tool: Vite through the standard SvelteKit toolchain.
- Package manager: pnpm.
- Validation: Zod.
- Unit testing: Vitest.
- End-to-end testing: Playwright.
- Styling: plain CSS with design tokens and RSCSS-style naming.

Do not add a UI kit, global state manager, table library, chart library, form library, or utility CSS framework unless a concrete problem cannot be solved cleanly with the chosen stack.

## Rendering Model

SSR must stay enabled by default.

Use SvelteKit's default rendering model for routed application screens:

- Server `load` functions fetch data needed before rendering.
- Server actions handle form mutations.
- Client enhancement is progressive, not required for basic form submission.
- Browser-only behavior should be isolated to the smallest possible component or route.

Do not disable SSR globally. If a future browser-only screen requires client-side rendering, document the reason near that route and disable SSR only for that route or layout.

## Architecture

Use a hybrid `domain + atomic UI` structure.

Recommended source layout:

```txt
src/
  app.d.ts
  app.html
  hooks.server.ts
  lib/
    domains/
      alerts/
      learning/
      reports/
      users/
    server/
      mock-api/
    styles/
    ui/
      atoms/
      molecules/
      organisms/
  routes/
    employee/
    admin/
    api/
```

Guidelines:

- Keep routes thin. Route files compose domain operations and UI, but should not own business rules.
- Put business types, Zod schemas, risk scoring, state transitions, and dashboard aggregation in `$lib/domains/*`.
- Put mock persistence, seeded state, and server-only data access in `$lib/server/*`.
- Put reusable visual building blocks in `$lib/ui/*`.
- Keep route-specific composition near the route when it is not reused elsewhere.
- Avoid strict Feature-Sliced Design ceremony for this MVP. The domain modules are enough structure for the current scope.
- Component naming and testing rules are defined in `docs/dev-rules.md`.

Dependency direction:

- `$lib/domains/*` is pure TypeScript and must not import `$lib/server/*`, `$lib/ui/*`, Svelte components, SvelteKit server modules, or browser-only APIs.
- `$lib/server/*` may import `$lib/domains/*`, but must not import `$lib/ui/*`.
- `$lib/ui/*` may import public domain types, schemas, and pure helpers, but must not import `$lib/server/*`.
- `src/routes/*` is the composition boundary: server load functions and form actions call server commands, while page components render UI components.
- Server-only mock state must stay behind `$lib/server/*` and must never be imported by client-side code.

## Domain Model

Define shared TypeScript types for the core workflow:

```txt
UserRole
AlertStatus
Severity
RiskyAction
LearningStatus
Report
Alert
LearningAssignment
TimelineEvent
```

Use these types across reports, alerts, learning, dashboard aggregation, mocks, and tests.

Expected state values:

```txt
AlertStatus:
new
investigating
resolved_safe
resolved_malicious
closed

Severity:
low
medium
high
critical

RiskyAction:
opened_email
clicked_link
downloaded_attachment
entered_credentials
reported_without_interaction

LearningStatus:
not_assigned
assigned
in_progress
completed
```

The alert, report, and learning records must share identifiers so the UI can show the full workflow from report submission through learning completion.

### Risk Scoring

Severity is calculated from the employee's reported actions.

Risk scoring table:

| Risky action | Severity | Meaning |
| --- | --- | --- |
| `reported_without_interaction` | `low` | Employee reported the email before interacting with it. |
| `opened_email` | `low` | Employee opened the message but did not interact with links, attachments, or credentials. |
| `clicked_link` | `high` | Employee clicked a link in the suspicious message. |
| `downloaded_attachment` | `high` | Employee downloaded or opened an attachment. |
| `entered_credentials` | `critical` | Employee entered credentials after interacting with the message. |

Rules:

- Initial alert severity is the highest severity produced by the selected risky actions.
- If multiple risky actions are selected, use the maximum severity.
- `medium` is reserved for seeded/demo alerts or future metadata-based scoring.
- `reported_without_interaction` must not be combined with other risky actions.
- Follow-up learning can be assigned when the alert is `resolved_malicious` and severity is `high` or `critical`.
- Unit tests must cover every scoring rule and at least one multi-action maximum-severity case.

### Dashboard Metrics

Dashboard metrics must be derived from the same seeded mock state used by reports, alerts, learning, and timelines.

Contract:

```ts
type DashboardSummary = {
  openAlerts: number;
  confirmedMalicious: number;
  riskyActionReports: number;
  averageTriageMinutes: number | null;
  learningCompletionRate: number;
};
```

Metric formulas:

| Metric | Formula | Display |
| --- | --- | --- |
| `openAlerts` | Count alerts with status `new` or `investigating`. | Integer count. |
| `confirmedMalicious` | Count alerts with status `resolved_malicious` or `closed` where final outcome is malicious. | Integer count. |
| `riskyActionReports` | Count reports whose actions include `clicked_link`, `downloaded_attachment`, or `entered_credentials`. | Integer count. |
| `averageTriageMinutes` | Average `resolvedAt - createdAt` in minutes for alerts with `resolvedAt`. | Rounded integer minutes; `null` when no resolved alerts exist. |
| `learningCompletionRate` | `completed learning assignments / total learning assignments`. | Percentage rounded to nearest whole number; `0` when no assignments exist. |

Rules:

- Dashboard aggregation lives in `$lib/domains/*` as pure TypeScript.
- Mock seed data must use fixed UTC timestamps so `averageTriageMinutes` is deterministic.
- E2E tests may assert exact baseline metric values for the `default` seed.
- The primary e2e workflow should verify that `learningCompletionRate` changes after Employee completes follow-up learning.

### Lifecycle Rules

Use command-based lifecycle rules instead of direct status updates from the client.

Client UI sends user intent through a SvelteKit form action. The server command validates actor role, ownership, current state, and allowed transition before changing stored state.

Alert lifecycle:

| Command | From | To | Actor | Side effects |
| --- | --- | --- | --- | --- |
| `startInvestigation` | `new` | `investigating` | Admin | Append timeline event. |
| `resolveAsSafe` | `new`, `investigating` | `resolved_safe` | Admin | Set reporter outcome to safe. Append timeline event. |
| `resolveAsMalicious` | `new`, `investigating` | `resolved_malicious` | Admin | Set reporter outcome to malicious. Append timeline event. Allow learning assignment if risky actions exist. |
| `closeAlert` | `resolved_safe`, `resolved_malicious` | `closed` | Admin | Append timeline event. Hide mutation actions except read-only timeline/details. |

Learning assignment lifecycle:

| Command | From | To | Actor | Side effects |
| --- | --- | --- | --- | --- |
| `assignLearning` | no assignment | `assigned` | Admin | Create `LearningAssignment` for the alert reporter. Append alert timeline event. Alert status remains unchanged. |
| `startLearning` | `assigned` | `in_progress` | Employee owner | Store learning start timestamp. |
| `completeLearning` | `in_progress` | `completed` | Employee owner | Store completion timestamp. |

Rules:

- The client must not submit arbitrary `AlertStatus` values as the primary mutation model.
- UI actions should map to commands such as `resolveAsMalicious`, not to generic `updateStatus`.
- The server rejects unsupported transitions with a conflict-style error.
- The server rejects unauthorized transitions with a permission error.
- Every alert lifecycle command appends a `TimelineEvent`.
- Learning assignment does not replace the alert resolution status.
- A malicious alert can be closed even if learning is still assigned or in progress.
- Unit tests must cover allowed transitions, rejected transitions, role restrictions, and required side effects.
- The MVP learning module is meaningful follow-up content with a `Mark as completed` action, not a quiz.

## Validation

Use Zod for all server-side payload validation.

Required schemas:

- Report submission.
- Alert status update.
- Investigation note creation.
- Learning assignment.
- Learning completion.

Rules:

- Server validation is the source of truth.
- Client validation may be added for faster feedback, but cannot replace server validation.
- Validation failures should return field-level errors when possible.
- Field-level validation errors should be strings, not arrays.
- Forms should preserve user input after validation errors.
- Unexpected malformed payloads should produce a safe error response, not an unhandled exception page.
- MVP form contracts, field constraints, and error messages are defined in `docs/zod-form-contracts.md`.

## Forms And Mutations

Use SvelteKit form actions for core mutations:

- Submit suspicious email report.
- Change alert status.
- Add investigation note.
- Assign learning.
- Mark learning module as completed.

Use `use:enhance` where it improves the experience:

- Pending states on submit buttons.
- Inline validation results.
- Retry after server errors.
- Preserving form input and scroll position.

Each mutation surface must have:

- Default state.
- Pending state.
- Success state.
- Validation error state.
- Unexpected error state.
- Retry path where the operation can reasonably be retried.

## Mock Server And Data

Implement the mock API through SvelteKit server code.

Requirements:

- Store seeded in-memory state under `$lib/server/mock-api`.
- Keep server-only modules out of client imports.
- Provide deterministic seed data for employees, reports, alerts, learning assignments, and timeline events.
- Use the same state for employee views, admin views, dashboard metrics, and tests.
- Include realistic delays and optional controlled failures where useful for demonstrating loading/error/retry states.

Expose a test-only reset/seed endpoint for Playwright:

```txt
POST /api/test/reset
POST /api/test/fail-next
```

Constraints:

- Test control endpoints must only work when `ENABLE_E2E_ENDPOINTS=true`.
- When `ENABLE_E2E_ENDPOINTS` is not enabled, test control endpoints must return `404`.
- Production-like builds must not expose test reset or failure behavior unless explicitly launched with `ENABLE_E2E_ENDPOINTS=true` for e2e.
- E2E tests should reset state before each scenario.

Test reset contract:

```txt
POST /api/test/reset
{
  "seed": "default"
}
```

Requirements:

- Reset in-memory users, reports, alerts, learning assignments, timeline events, and dashboard state.
- Clear all configured controlled failures.
- Return baseline dashboard metrics for the selected seed.
- Support `default` and `empty` seed variants for the first MVP iteration.

Controlled failure contract:

```txt
POST /api/test/fail-next
{
  "command": "submitReport",
  "status": 500,
  "message": "Report service is temporarily unavailable"
}
```

Requirements:

- Configure a one-shot failure for a named server command.
- The next matching command fails once with the configured status and message.
- The failure is cleared after it is used.
- Reset clears all pending failures.
- Allowed failure commands are `submitReport`, `updateAlertStatus`, `assignLearning`, and `completeLearning`.

## API Surface

The mock API should support the user-story workflow:

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
POST   /api/test/reset
POST   /api/test/fail-next
```

Prefer server actions for app forms. API routes are still useful for e2e setup, explicit mock API boundaries, and any UI behavior that naturally fetches JSON.

## Role-Aware UI

The MVP roles are:

- Employee.
- Admin.
- Optional Viewer.

Requirements:

- Employee can access report submission, own reports, report details, and own learning.
- Admin can access dashboard, alert queue, alert details, notes, status changes, and learning assignment.
- Viewer, if implemented, can read dashboard and alert details but cannot mutate data.
- Restricted routes should show a clear access-denied state.
- Restricted actions should not render for unauthorized roles.
- Server actions must enforce role permissions even when the UI hides controls.

Role handling may be mock-based for the demo, but the boundaries should be explicit enough to replace with real authentication later.

### Demo Role Switcher

Authentication is mocked for the MVP through a visible Demo Role Switcher in the top-right app shell.

Requirements:

- The switcher lets the reviewer choose the active demo user at any time.
- Switching user updates an httpOnly `demo_user_id` cookie through a server action.
- After switching user, the app reloads or invalidates the current route so server-loaded data reflects the active role.
- `hooks.server.ts` resolves `event.locals.user` from `demo_user_id`.
- If the cookie is missing or invalid, default to the seeded Employee user.
- The role switcher is a demo convenience only. It must not replace server-side authorization.

Seeded demo users:

- `employee-1`: Employee, Alex Reporter.
- `admin-1`: Admin, Morgan Security Admin.
- `viewer-1`: Viewer, Casey Viewer, optional.

Authorization rules:

- All server load functions, form actions, and API handlers must authorize against `locals.user`.
- UI role checks are presentational only.
- Employee-owned records must be checked by ownership, not by route convention.
- Employee can access only reports where `reporterId === locals.user.id`.
- Employee can access only learning assignments where `assigneeId === locals.user.id`.
- Admin can access all alerts, reports, dashboard data, notes, status changes, and learning assignment actions.
- Viewer, if implemented, can read admin dashboard and alert details but cannot execute mutations.

## Design System Foundation

Build a small design-system foundation without importing a component library.

Product UX rules are defined in `docs/ux-rules.md`.

Requirements:

- Define CSS custom properties for color, typography, spacing, borders, focus rings, shadows, and status colors.
- Keep global CSS focused on reset, base document styles, layout primitives, and tokens.
- Use component-scoped styles for component-specific presentation.
- Use RSCSS-style naming for non-trivial components.
- Use semantic status tokens for alert severity, status, validation, and learning state.
- Ensure focus-visible states are clear.
- Ensure color is not the only indicator for severity, validation, or status.
- Core workflows must support all target browsers according to `docs/ux-rules.md`; minimal visual differences between engines are acceptable.

Color palette:

| Token | Value | Usage |
| --- | --- | --- |
| `--color-primary` | `#4F46E5` | Primary actions, active navigation, key focus accents. |
| `--color-primary-hover` | `#4338CA` | Hover/active state for primary actions. |
| `--color-background` | `#F8FAFC` | App background. |
| `--color-surface` | `#FFFFFF` | Panels, cards, tables, form surfaces. |
| `--color-text` | `#0F172A` | Primary text. |
| `--color-text-muted` | `#64748B` | Secondary text, metadata, helper copy. |
| `--color-border` | `#E2E8F0` | Borders, dividers, table lines. |
| `--color-success` | `#16A34A` | Safe/resolved success states. |
| `--color-warning` | `#F59E0B` | Medium risk, warning, pending attention. |
| `--color-error` | `#DC2626` | Errors, malicious/critical warnings where appropriate. |
| `--color-info` | `#2563EB` | Informational states and neutral links. |

Breakpoint tokens:

| Token | Value |
| --- | --- |
| `--breakpoint-sm` | `640px` |
| `--breakpoint-md` | `768px` |
| `--breakpoint-lg` | `1024px` |
| `--breakpoint-xl` | `1280px` |
| `--breakpoint-2xl` | `1536px` |

Recommended style layout:

```txt
src/lib/styles/
  tokens.css
  base.css
  layout.css
  app.css
```

RSCSS guidance:

- Components use meaningful class roots, for example `.alert-card`, `.report-form`, `.status-pill`.
- Elements use child selectors or short element classes when needed.
- Variants use modifier classes such as `.-critical`, `.-pending`, `.-readonly`.
- Avoid deeply nested selectors.

## UI States

Every data-driven screen must intentionally handle:

- Loading state.
- Empty state.
- Error state.
- Retry state.
- Permission-denied state where relevant.

Loading state requirements:

- Loading is required for client-side navigation, enhanced form submissions, retry flows, delayed async regions, and pending mutations.
- Initial SSR may render the ready state, empty state, or error state directly without showing an artificial loading skeleton.
- Do not add skeleton UI only to satisfy a checklist when data is already available from SSR.

Required screens:

- Employee report form.
- Employee reports list.
- Employee report details.
- Employee learning list.
- Employee learning module.
- Admin dashboard.
- Admin alert queue.
- Admin alert details.

Avoid decorative placeholder dashboards. Empty and error states should describe the user's next useful action.

## Accessibility And Usability

Minimum requirements:

- Use semantic HTML for forms, tables, navigation, headings, and buttons.
- Every input has a visible label.
- Validation messages are associated with their fields.
- Form errors are announced or placed near the relevant field.
- Keyboard navigation works for forms, filters, tables, and actions.
- Buttons and links have clear accessible names.
- Loading states do not trap keyboard focus.
- Tables have useful headers and responsive behavior.

## Testing Requirements

### Unit Tests

Use Vitest for domain-level tests.

Atoms and molecules also require focused unit/component tests according to `docs/test-rules.md`.

Required coverage:

- Risk scoring from risky actions.
- Allowed and rejected alert state transitions.
- Dashboard aggregation from shared mock data.
- Zod schemas accepting valid payloads.
- Zod schemas rejecting invalid payloads.

### E2E Tests

Use Playwright for user workflows.

Locator, `data-testid`, `webServer`, retry, trace, and screenshot/video rules are defined in `docs/playwright-e2e-policy.md`.

Required scenarios:

- Employee submits suspicious report, Admin triages it, Admin assigns learning, Employee completes follow-up learning, dashboard metric changes.
- Admin alert filters update URL query params and survive reload.
- Report form shows validation errors and preserves input.
- A controlled server error shows an error state with retry.

Playwright tests must reset seeded state before each scenario through the test-only reset endpoint.

Playwright configuration requirements:

- `webServer` must start the SvelteKit app automatically for `pnpm test:e2e`.
- `webServer.env` must include `ENABLE_E2E_ENDPOINTS=true`.
- Tests must call `POST /api/test/reset` in `beforeEach`.
- Tests that verify retry UI must configure a one-shot failure with `POST /api/test/fail-next`.
- Detailed Playwright policy is defined in `docs/playwright-e2e-policy.md`.

### Required Commands

The project should eventually expose these commands:

```txt
pnpm check
pnpm test:unit
pnpm test:e2e
pnpm build
```

## Dependency Policy

Default to the SvelteKit platform and small domain utilities.

Allowed baseline dependencies:

- SvelteKit standard dependencies.
- Zod.
- Vitest.
- Playwright.

Avoid adding dependencies for:

- Global app state.
- Tables.
- Charts.
- Forms.
- Date manipulation.
- Styling.
- UI components.

If a dependency becomes necessary, document the reason and the rejected lightweight alternative in the pull request or implementation notes.

## Acceptance Criteria

The technical implementation is successful when:

- The primary workflow can be completed end to end.
- SSR remains enabled by default.
- Server-only mock state is isolated under `$lib/server`.
- Zod validates all form mutations on the server.
- Role boundaries exist in UI and server actions.
- Dashboard metrics come from the same state as alerts and learning.
- Loading, empty, error, retry, and permission states are visible in the app.
- E2E tests cover the primary workflow and filter URL behavior.
- Unit tests cover domain logic and schemas.
- The project can pass `pnpm check`, `pnpm test:unit`, `pnpm test:e2e`, and `pnpm build`.

## Grooming First Iteration

Before implementing screens, draft the contracts that define how data moves through the app.

Use a contract-first, schema-first workflow:

```txt
Domain model
-> Request, response, and view-model contracts
-> Shared Zod schemas
-> Server-only commands and queries
-> SvelteKit form actions and server load functions
-> UI screens and tests
```

Trust boundaries:

- The client does not trust server JSON responses at API boundaries.
- The server does not trust client form submissions or JSON payloads.
- Client-side validation exists for UX and immediate feedback.
- Server-side validation is the source of truth for correctness and authorization.
- Shared contracts and schemas live in `$lib/domains/*`.
- Server-only repositories, commands, queries, and mock state live in `$lib/server/*`.

Mutation boundary:

- Core UI mutations should use SvelteKit form actions.
- Form actions must validate payloads with shared Zod schemas before calling server commands.
- Form actions must pass the current actor from `locals.user` into server commands.
- Server commands own RBAC checks, state transition guards, timeline side effects, and mock repository writes.
- JSON mutation endpoints are out of scope for the first MVP iteration unless they are thin adapters over the same server commands.
- Do not implement duplicated mutation logic in both form actions and API routes.

Minimum contracts to draft first:

- `SubmitReportInput`
- `SubmitReportResult`
- `AlertListQuery`
- `AlertDetailsView`
- `UpdateAlertStatusInput`
- `AddInvestigationNoteInput`
- `AssignLearningInput`
- `LearningAssignmentView`
- `CompleteLearningInput`
- `MutationResult`

Client validation requirements:

- Reuse shared Zod schemas where the schema is safe to import into client code.
- Validate form values before submit when it improves UX.
- Show field-level client errors without preventing server validation.
- For client-side JSON fetches, parse responses with the expected response/view schema before rendering.

Server validation requirements:

- Validate every incoming form action payload.
- Validate every JSON payload if an API endpoint exists.
- Validate or construct response/view models through explicit schemas before returning data across an API boundary.
- Return a consistent mutation result shape with submitted values, string field errors, form-level errors, and success metadata.
- Use `docs/zod-form-contracts.md` as the source of truth for first-iteration form schemas and validation copy.

## Official References

- [SvelteKit project structure](https://svelte.dev/docs/kit/project-structure)
- [SvelteKit form actions](https://svelte.dev/docs/kit/form-actions)
- [SvelteKit page options](https://svelte.dev/docs/kit/page-options)
- [Vite guide](https://vite.dev/guide/)
- [Playwright best practices](https://playwright.dev/docs/best-practices)
- [Zod documentation](https://zod.dev/)
