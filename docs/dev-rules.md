# Development Rules

This document defines implementation rules for the MVP SvelteKit frontend.

## Atomic Component Naming

Reusable UI components follow Atomic Design naming with explicit prefixes:

```txt
A = atom
M = molecule
O = organism
```

Examples:

```txt
AButton.svelte
AInput.svelte
AStatusPill.svelte
MField.svelte
MMetricCard.svelte
MAlertSummary.svelte
OAlertQueue.svelte
OReportForm.svelte
ODashboardSummary.svelte
```

Rules:

- Atom component filenames must start with `A`.
- Molecule component filenames must start with `M`.
- Organism component filenames must start with `O`.
- Component names should describe product or UI purpose, not visual styling.
- Route-specific composition can stay colocated in `src/routes` and does not need an atomic prefix unless it is promoted to reusable UI.

## Component Boundaries

Atoms:

- Smallest reusable UI primitives.
- No domain workflow logic.
- No server imports.
- May accept labels, values, states, and event callbacks.

Molecules:

- Small composed UI pieces built from atoms.
- May know about simple public domain types when needed for display.
- No server imports.
- No direct mock state access.

Organisms:

- Larger reusable UI sections built from atoms and molecules.
- May coordinate local interaction state.
- Should not own server mutations directly.
- Route files should connect organisms to SvelteKit load data and form actions.

## Component Tests

Component, e2e, and performance testing rules are defined in `docs/test-rules.md`.
