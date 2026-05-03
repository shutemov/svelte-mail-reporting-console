# UX Rules

This document defines UX principles for the Suspicious Mail Reporting Console MVP.

The demo should feel like a focused B2B security operations console, not a marketing page, toy quiz, or generic dashboard.

## Product UX Direction

Design for two modes:

- Employee mode: fast reporting, clear confirmation, calm follow-up learning.
- Admin mode: dense but readable triage, filtering, investigation, and operational metrics.

The first screen after role selection should be a usable product surface, not a landing page.

## HENNGE/Tadrill-Inspired Principles

Open HENNGE/Tadrill materials emphasize suspicious email reporting, training results, risky actions, summaries, user/action lists, dashboards, and follow-up learning.

Apply these principles:

- Treat reporting as a normal organizational workflow, not an alarmist incident page.
- Make risky actions and reports easy to scan in tables and summaries.
- Use tabs or segmented views when separating summary, user/action details, timeline, and learning state.
- Use clear filters for status, severity, reporter, and risky action.
- Prefer operational language: `Reported`, `Investigating`, `Resolved as malicious`, `Learning assigned`, `Completed`.
- Avoid playful quiz-like UX for follow-up learning in MVP.
- Explain risk with calm remediation guidance, not blame.

## Layout

Use an app-shell layout:

- Left navigation for main areas.
- Top-right Demo Role Switcher.
- Main content area for dashboards, tables, details, and forms.
- Details pages may use a two-column layout: primary investigation content and secondary metadata/timeline.

Admin screens:

- Favor dense scan-friendly layouts.
- Tables should have clear headers, status/severity pills, and row-level actions.
- Dashboard metrics should be compact and linked to filtered views when useful.
- Avoid oversized hero sections, decorative illustrations, or marketing copy.

Employee screens:

- Report form should be direct and confidence-building.
- Confirmation/status screens should clearly say what happens next.
- Learning module should read like focused guidance, not a school quiz.

## Responsive Design

Design for responsive parity across desktop and mobile.

Desktop is the primary operating context for the admin console, but mobile must be supported with the same quality bar: readable content, complete workflows, accessible controls, and no broken or hidden primary actions.

Use these breakpoint tokens:

```txt
--breakpoint-sm: 640px
--breakpoint-md: 768px
--breakpoint-lg: 1024px
--breakpoint-xl: 1280px
--breakpoint-2xl: 1536px
```

Responsive rules:

- Mobile layout is single-column by default.
- Desktop may use app-shell left navigation; mobile should use a compact top navigation or collapsible navigation.
- The Demo Role Switcher must remain reachable on mobile without covering page content.
- Tables must not become unreadable on mobile. Use horizontal overflow, stacked row cards, or priority columns depending on the screen.
- Filters should collapse into a compact filter panel or stacked controls on mobile.
- Forms should use full-width fields on mobile.
- Details pages should stack metadata/timeline below primary content on mobile.
- Dashboard metrics should wrap into one or two columns depending on available width.
- No primary workflow may require desktop-only hover behavior.

Mobile accessibility:

- Touch targets should be at least 44px tall/wide where practical.
- Focus states must remain visible on small screens.
- Text must not overlap, truncate critical information, or overflow controls.
- Validation errors must appear near the relevant input and remain readable after the mobile keyboard opens.
- Sticky headers/actions must not cover focused inputs or error messages.
- Horizontal scrolling areas must be obvious and keyboard accessible.

## Target Browser Support

The MVP must support all target browsers at the same quality bar for core workflows.

Target browsers:

- Current Chromium-based browsers.
- Current Firefox.
- Current Safari.
- Current iOS Safari.

Minimal visual differences between engines are acceptable, but workflow behavior, accessibility, validation, and data integrity must be consistent.

Requirements:

- Core workflows must work in all target browsers.
- Forms must submit and validate correctly with and without `use:enhance`.
- Avoid relying on Chromium-only CSS, browser APIs, or input behavior.
- Use progressive enhancement for form actions and navigation.
- Date/time inputs must not depend on browser-specific date picker behavior. Provide labels, helper text, and server validation that work even when native picker UI differs.
- Sticky navigation, sticky actions, and scroll containers must be checked on iOS Safari-sized viewports.
- Focus states must remain visible in all target browsers.
- Touch interactions must not require hover.
- Use feature detection or CSS fallbacks when using newer platform features.
- Do not use unsupported CSS without checking target browser support and adding a fallback.

Cross-browser risks to check:

- Form input rendering and validation affordances.
- `position: sticky` inside scroll containers.
- Viewport height behavior on mobile Safari.
- Horizontal table overflow.
- Focus-visible styling.
- Date/datetime field behavior.
- Differences in native select, checkbox, date, and file/input styling.

## Interaction

General rules:

- Primary actions should be obvious and singular per task area.
- Destructive or finalizing actions should have clear labels and pending states.
- Filters should update URL query params.
- Role switching should reload or invalidate data so the current view matches the selected demo user.
- Retry actions should keep entered form values where possible.

State communication:

- Show status, severity, and learning state with text plus color.
- Color must never be the only indicator.
- Timeline events should explain who did what and when.
- Empty states should explain the user's next useful action.
- Error states should be calm and actionable.

## Forms

Report form:

- Group email metadata, risky actions, and explanation/preview into clear sections.
- Risky actions should be selectable with checkboxes.
- `reported_without_interaction` should visually conflict with other risky actions and show inline validation when combined.
- Required fields need visible labels and nearby error messages.

Admin forms/actions:

- Status-changing actions should read as commands, for example `Start investigation`, `Resolve as safe`, `Resolve as malicious`.
- Notes should be lightweight and stay close to the investigation timeline.
- Assign learning should be available only when the alert is malicious and severity allows it.

Learning completion:

- Show meaningful follow-up content.
- Use `Mark as completed` as the final action.
- Do not add quiz UI in the first MVP.

## Visual Style

Use the palette defined in `docs/technical-requirements.md`.

Visual tone:

- Clean.
- Calm.
- Trustworthy.
- Operational.
- Low-noise.

Avoid:

- Decorative hero sections.
- Game-like visuals.
- Alarmist red-heavy screens.
- Overly soft marketing cards.
- Generic SaaS filler copy.

## Accessibility

UX must support:

- Keyboard navigation.
- Visible focus states.
- Semantic tables and forms.
- Field-level validation messages.
- Status labels that work without relying on color.
- Sufficient color contrast.
- Helpful accessible names for icon buttons.

## Content Voice

Use concise, professional, non-blaming language.

Preferred:

- `This report is being reviewed by the security team.`
- `A risky action was detected, so follow-up learning is available.`
- `Resolve as malicious`
- `Mark as completed`

Avoid:

- `You failed the phishing test.`
- `Danger! Critical mistake!`
- `Take this quiz to prove you learned.`
- Vague filler such as `Optimize your security journey`.

## References

- [HENNGE Tadrill Product Overview](https://support.hdeone.com/hc/en-us/articles/33635884619673-HENNGE-Tadrill-Product-Overview)
- [Tadrill Checking Training Results](https://support.hdeone.com/hc/en-us/articles/40261432541593--Tadrill-Checking-Training-Results)
- [HENNGE brand guidelines](https://hennge.com/global/about/brand/)
