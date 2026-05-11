# MVP Enhancement Proposal: Simulation Feed

## 1. Purpose

Current MVP demonstrates strong engineering architecture (SSR, server actions, domain contracts, role boundaries), but alert validation is mostly manual.  
`Simulation Feed` adds realistic workload and measurable admin outcomes.

Expected product impact:

- less "trust-only" feeling in triage;
- live alert queue under changing load;
- objective quality metrics for admin decisions;
- stronger business-facing demo value.

## 2. Scope (MVP+)

### In scope

1. Server-side synthetic report generation from scenario templates.
2. Simulation controls: `start`, `pause`, `inject once`, `reset`.
3. Flow settings: `rate`, `seed`, `safe/malicious mix`, `severity mix`.
4. Hidden `groundTruth` per generated case (never shown in triage UI).
5. Admin `Simulation` page with triage quality and throughput metrics.
6. Minimal test coverage: unit + e2e happy path.

### Out of scope

1. External integrations (mailbox, SIEM/SOAR, reputation APIs).
2. ML scoring or automatic incident decisions.
3. Fully autonomous investigation workflow.

## 3. Architecture Proposal

### Domain

New entities:

- `SimulationConfig`
- `SimulationSession`
- `GeneratedCaseMeta` (server-only, includes `groundTruth`)
- `TriageOutcomeMetrics`
- `QueueHealthMetrics`

New functions:

- `generateSyntheticReport(config, now, seed)`
- `evaluateTriageDecision(decision, groundTruth)`
- `buildSimulationSummary(state)`

### Server

New modules:

- `src/lib/server/simulation-engine.ts`
- `src/lib/server/simulation-templates.ts`
- `src/lib/server/simulation-metrics.ts`

State extensions:

- `mock-state.ts`: add `simulation` state and server-only truth map.

Commands:

- `startSimulation`
- `pauseSimulation`
- `updateSimulationConfig`
- `injectSimulationReport`
- `resetSimulation`

### Routes/UI

New route:

- `GET /admin/simulation`
- `POST /admin/simulation` (actions for start/pause/inject/reset/config update)

New UI components:

- `OSimulationFlowSettings` (organism, required)
- `OSimulationControlPanel` (organism)
- `MSimulationMetricCard` (molecule)

## 4. Requirement: Flow Settings Component

### Mandatory component

`OSimulationFlowSettings` must be implemented as a dedicated organism and used on `/admin/simulation`.

### Responsibilities

1. Render and submit validated simulation configuration.
2. Show current active config and pending changes.
3. Enforce guardrails to prevent unrealistic or unstable load.
4. Explain impact of each setting on queue behavior.

### Required fields

1. `ratePerMinute` (`1..20`)
2. `maliciousRatio` (`0..1`)
3. `severityMix` (low/medium/high/critical percentages, sum = `100`)
4. `seed` (integer)
5. `autoStartOnReset` (boolean, optional)

### UX requirements

1. Inline field validation with clear string errors.
2. Save button with pending/success/error states.
3. "Reset to defaults" action.
4. "Preview expected volume" hint (for next 15 minutes).
5. Changes are server-validated via SvelteKit form action.

## 5. Useful Admin Metrics

Metrics should help operational decisions, not only look good in demo.

### A. Queue health (workload)

1. `openAlerts`: current queue size (`new + investigating`).
2. `newAlertsLast15m`: incoming load trend.
3. `backlogGrowthRate`: queue growth vs. processing rate.
4. `oldestOpenAlertMinutes`: staleness and SLA risk.

Why useful:

- shows whether team keeps up with incoming incidents;
- highlights when escalation is needed.

### B. Triage efficiency

1. `medianTimeToFirstAction`: from report creation to `startInvestigation`.
2. `medianTimeToResolution`: from report creation to resolved status.
3. `alertsResolvedLastHour`: operational throughput.
4. `reopenOrStateConflictCount` (if later supported): process quality signal.

Why useful:

- quantifies speed of investigation;
- reveals bottlenecks in daily operations.

### C. Decision quality (against ground truth)

1. `decisionAccuracyPercent`
2. `falsePositiveRate`
3. `falseNegativeRate` (most critical)
4. `precisionPercent`
5. `recallPercent`

Why useful:

- measures correctness of admin decisions, not only volume;
- helps detect overly aggressive or overly permissive triage behavior.

### D. Human risk learning loop

1. `highRiskActionRate` (`clicked_link`, `downloaded_attachment`, `entered_credentials`)
2. `learningAssignmentRateForEligibleCases`
3. `learningCompletionRate`
4. `repeatRiskAfterCompletion` (future metric, if historical linkage is added)

Why useful:

- connects incident handling with user behavior change;
- proves value beyond alert closing.

## 6. Draft Contracts

```ts
type SimulationMode = 'paused' | 'running';

type SeverityMix = {
  low: number;
  medium: number;
  high: number;
  critical: number;
};

type SimulationConfig = {
  ratePerMinute: number; // 1..20
  maliciousRatio: number; // 0..1
  severityMix: SeverityMix; // sum = 100
  seed: number;
  autoStartOnReset?: boolean;
};

type SimulationSession = {
  mode: SimulationMode;
  config: SimulationConfig;
  generatedCount: number;
  startedAt?: string;
  lastGeneratedAt?: string;
};

type QueueHealthMetrics = {
  openAlerts: number;
  newAlertsLast15m: number;
  backlogGrowthRate: number;
  oldestOpenAlertMinutes: number | null;
};

type TriageOutcomeMetrics = {
  totalDecisions: number;
  correctDecisions: number;
  falsePositives: number;
  falseNegatives: number;
  decisionAccuracyPercent: number;
  precisionPercent: number;
  recallPercent: number;
  medianTimeToResolutionMinutes: number | null;
};
```

## 7. Test Plan (minimum)

### Unit

1. Deterministic generation for fixed seed.
2. Config validation (`rate`, `ratios`, `severityMix sum`).
3. Metric calculations for accuracy/precision/recall and backlog growth.

### E2E

1. Admin updates flow settings, config persists, and generation behavior changes.
2. Admin starts simulation, queue receives new alerts.
3. Admin resolves simulated alerts, decision quality metrics update.
4. Reset clears session and counters.

## 8. Rollout Plan

1. Add domain types and config schema.
2. Implement simulation engine and metrics module.
3. Add `/admin/simulation` route with `OSimulationFlowSettings`.
4. Add queue health + quality metric cards.
5. Add unit/e2e tests and include in quality gates.

## 9. Definition of Done

Enhancement is complete when:

1. Admin can safely configure and control report stream.
2. Queue updates from synthetic flow are visible and stable.
3. Metrics show both workload and decision quality.
4. All gates pass: `check`, `test:unit`, `test:e2e`, `build`.
