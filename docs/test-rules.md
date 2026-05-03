# Test Rules

This document defines unit, component, e2e, and performance testing rules for the MVP.

## Component Tests

Atoms and molecules require unit/component tests in addition to e2e coverage.

Required test focus:

- Rendering key props.
- Accessible labels and roles.
- Disabled, loading, error, and selected states where applicable.
- Event callback behavior for interactive atoms/molecules.
- Important visual-state class or token mapping when it affects product meaning.

Organisms do not require unit tests by default if the behavior is covered by e2e, but complex reusable organisms should get focused component tests.

## E2E Relationship

E2E tests validate user workflows and integration:

- Role switching.
- Report submission.
- Admin triage.
- Learning assignment and completion.
- Dashboard metric updates.
- Error and retry flows.

Unit/component tests validate reusable component behavior:

- Atoms.
- Molecules.
- Complex reusable organisms when needed.

Do not replace e2e workflow coverage with atom/molecule tests.

Do not replace atom/molecule tests with broad e2e tests when the component has meaningful states.

## Performance Checks

Performance checks are smoke/budget checks, not full benchmarks.

Rules:

- Do not add manual performance logs around every function.
- Measure only key domain operations and key user flows.
- Use shared test utilities instead of ad hoc `console.time` or one-off timers.
- Budgets should be generous enough to avoid flaky CI.
- A performance check should catch obvious regressions, not force micro-optimizations.

Recommended test utility:

```txt
tests/utils/performance.ts
```

Required helpers:

```txt
measure(name, fn)
measureStep(name, fn)
logPerfResult(result)
expectWithinBudget(result, budgetMs)
```

Perf result shape:

```ts
type PerfResult = {
  name: string;
  durationMs: number;
  budgetMs?: number;
  passed?: boolean;
};
```

Perf logs should include:

```txt
name
durationMs
budgetMs
pass/fail
```

Unit-level performance checks:

| Operation | Budget |
| --- | --- |
| Risk scoring on one report | `< 5ms` |
| Dashboard aggregation on seeded data | `< 20ms` |
| Alert filtering on seeded data | `< 20ms` |

E2E performance checks:

| User flow | Budget |
| --- | --- |
| Admin alerts page ready | `< 1500ms` |
| Submit report flow completes | `< 1500ms` |
| Dashboard metric updates after learning completion | `< 1500ms` |

Guidance:

- Unit performance checks should run through Vitest.
- E2E performance checks should run through Playwright using user-observable readiness.
- Prefer assertions on visible ready states over low-level browser timing APIs for MVP.
- If a performance check is flaky, loosen the budget or move it to an informational log before disabling it.
