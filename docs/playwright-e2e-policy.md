# Playwright E2E Policy

This document defines the first MVP Playwright rules for `docs/technical-requirements.md`.

The goal is to keep e2e tests stable while still testing the product the way a user experiences it.

## Locator Priority

Use locators in this order:

1. `getByRole` for buttons, links, navigation, tables, rows, headings, dialogs, and alerts.
2. `getByLabel` for form fields.
3. `getByText` for stable user-facing copy that is part of the expected experience.
4. `getByTestId` for dynamic records, repeated UI, metrics, transient states, and ambiguous controls.

Do not use CSS classes as test selectors unless there is no practical alternative.

Do not use `nth()` for business-critical assertions when a stable semantic locator or `data-testid` can identify the element.

## Test ID Rules

Use `data-testid` deliberately, not on every element.

Required test IDs:

```txt
role-switcher
report-submit-form
report-submit-error
report-submit-retry
alert-row-{alertId}
alert-status-{alertId}
alert-action-start-investigation
alert-action-resolve-safe
alert-action-resolve-malicious
alert-action-assign-learning
metric-open-alerts
metric-confirmed-malicious
metric-risky-action-reports
metric-average-triage
metric-learning-completion
learning-assignment-{assignmentId}
learning-complete-action
timeline-event-{eventId}
empty-state-{screenName}
error-state-{screenName}
```

Naming rules:

- Use kebab-case.
- Include stable domain IDs for repeated records.
- Do not include array indexes in test IDs.
- Do not encode visual styling in test IDs.
- Prefer domain meaning over component implementation details.

Examples:

```txt
alert-row-alert-1
alert-status-alert-1
learning-assignment-learning-1
empty-state-admin-alerts
error-state-report-submit
```

## Assertions

Prefer user-observable assertions:

- URL query params for filters.
- Visible status labels for lifecycle changes.
- Dashboard metric values for aggregation changes.
- Timeline events for investigation side effects.
- Form field errors for validation failures.

Avoid asserting implementation details such as component class names, DOM nesting, or internal Svelte state.

## Waiting

Do not use arbitrary `waitForTimeout`.

Wait through Playwright expectations:

```ts
await expect(page.getByRole('button', { name: 'Submit report' })).toBeEnabled();
await expect(page.getByTestId('metric-learning-completion')).toContainText('100%');
```

Allowed waiting patterns:

- `expect(locator).toBeVisible()`
- `expect(locator).toHaveText()`
- `expect(locator).toContainText()`
- `expect(page).toHaveURL()`
- `expect.poll()` for server-derived state when there is no direct UI transition

## Web Server

`pnpm test:e2e` must start the app automatically through Playwright `webServer`.

Required config behavior:

```txt
baseURL: http://127.0.0.1:4173
webServer.command: pnpm build && pnpm preview --host 127.0.0.1 --port 4173
webServer.env.ENABLE_E2E_ENDPOINTS: true
reuseExistingServer: true locally, false in CI
```

The exact command may change if SvelteKit scaffold defaults require it, but `pnpm test:e2e` must not require a manually started server.

## Test Controls

Every test starts from known state:

```txt
beforeEach:
POST /api/test/reset { "seed": "default" }
```

Use `empty` seed for empty-state tests:

```txt
POST /api/test/reset { "seed": "empty" }
```

Use one-shot failure controls for retry tests:

```txt
POST /api/test/fail-next
{
  "command": "submitReport",
  "status": 500,
  "message": "Report service is temporarily unavailable"
}
```

## Retry And Diagnostics

Recommended Playwright settings:

```txt
retries: 0 locally
retries: 2 in CI
trace: on-first-retry
screenshot: only-on-failure
video: retain-on-failure
```

Retries should diagnose flakes, not hide broken user flows.

## Required MVP Specs

Minimum e2e coverage:

- Employee submits suspicious report, Admin resolves it as malicious, Admin assigns learning, Employee completes learning, dashboard metric updates.
- Admin alert filters update URL query params and survive reload.
- Report form validation errors preserve input.
- Controlled server error shows retry UI, and retry succeeds.
- Empty state renders for reports, alerts, or learning through the `empty` seed.
- Mobile viewport smoke covers navigation, role switching, report form accessibility, and one admin table/list view.
- Cross-browser smoke covers Chromium, Firefox, and WebKit for report form submission, role switching, and one admin alert detail flow.
