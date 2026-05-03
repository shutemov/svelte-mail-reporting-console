# Zod Form Contracts

This document defines the first MVP form contracts for `docs/technical-requirements.md`.

The goal is to keep forms predictable without over-designing the final implementation before the SvelteKit app exists.

## Shared Mutation Result

All SvelteKit form actions should return a consistent result shape.

```ts
type FieldErrors<TValues> = Partial<Record<keyof TValues, string>>;

type MutationResult<TValues, TData = unknown> = {
  success: boolean;
  values?: Partial<TValues>;
  fieldErrors?: FieldErrors<TValues>;
  formError?: string;
  data?: TData;
};
```

Rules:

- Field validation errors are strings, not arrays.
- Use `fieldErrors` for errors attached to a specific input.
- Use `formError` for cross-field errors, permission errors, lifecycle conflicts, and unexpected server failures.
- Return `values` after validation failure so the form can preserve user input.
- Server-side validation is the source of truth.
- Client-side validation may reuse the same schemas for immediate feedback.

## Submit Report

Contract:

```ts
type SubmitReportInput = {
  sender: string;
  subject: string;
  receivedAt: string;
  reason: string;
  riskyActions: RiskyAction[];
  messagePreview?: string;
};
```

Validation:

| Field | Rules | Error message |
| --- | --- | --- |
| `sender` | Required. Must be an email-like string. | `Enter the sender email address.` |
| `subject` | Required. 3-160 characters. | `Enter a subject between 3 and 160 characters.` |
| `receivedAt` | Required. Must be an ISO date or datetime string. | `Enter when the email was received.` |
| `reason` | Required. 10-500 characters. | `Describe why this email looks suspicious.` |
| `riskyActions` | At least one action. | `Select what happened with the email.` |
| `messagePreview` | Optional. Max 2000 characters. | `Keep the message preview under 2000 characters.` |

Cross-field validation:

- `reported_without_interaction` cannot be combined with any other `RiskyAction`.
- Cross-field error message: `Reported without interaction cannot be combined with other actions.`

Success behavior:

- Create a report and alert for the active Employee.
- Calculate initial severity from `riskyActions`.
- Redirect or navigate to the created report details/status screen.

## Alert Command

Contract:

```ts
type AlertCommandInput = {
  command: 'startInvestigation' | 'resolveAsSafe' | 'resolveAsMalicious' | 'closeAlert';
  resolutionNote?: string;
};
```

Validation:

| Field | Rules | Error message |
| --- | --- | --- |
| `command` | Required. Must be an allowed alert command. | `Choose a valid alert action.` |
| `resolutionNote` | Optional. Max 1000 characters. | `Keep the resolution note under 1000 characters.` |

Server rules:

- Admin role is required.
- The command must be allowed by the alert lifecycle rules.
- Unsupported lifecycle transitions return `formError`.
- Permission errors return `formError`.

## Investigation Note

Contract:

```ts
type AddInvestigationNoteInput = {
  body: string;
};
```

Validation:

| Field | Rules | Error message |
| --- | --- | --- |
| `body` | Required. 3-1000 characters. | `Enter a note between 3 and 1000 characters.` |

Server rules:

- Admin role is required.
- The note is appended to the alert timeline.
- Email-derived content must render as text, not raw HTML.

## Assign Learning

Contract:

```ts
type AssignLearningInput = {
  moduleId: 'phishing-basics';
};
```

Validation:

| Field | Rules | Error message |
| --- | --- | --- |
| `moduleId` | Required. Must be `phishing-basics` for MVP. | `Choose a valid learning module.` |

Server rules:

- Admin role is required.
- Alert must be `resolved_malicious`.
- Alert severity must be `high` or `critical`.
- The alert reporter must not already have an assignment for this alert.
- Lifecycle or duplicate-assignment errors return `formError`.

## Complete Learning

Contract:

```ts
type CompleteLearningInput = {
  assignmentId: string;
};
```

Validation:

| Field | Rules | Error message |
| --- | --- | --- |
| `assignmentId` | Required. Must reference an existing assignment. | `Choose a valid learning assignment.` |

Server rules:

- Employee role is required.
- The active Employee must own the assignment.
- Assignment must be `in_progress`.
- Successful completion sets status to `completed` and stores completion timestamp.

## Safe Rendering

Suspicious email fields are untrusted content.

Rules:

- Render sender, subject, headers, URLs, and message preview as text by default.
- Do not render raw HTML from reported email content.
- Truncate long previews in UI, but preserve the stored mock value.
- Validate external or mock JSON data before using it as a response/view model.
