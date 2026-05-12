<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { onMount } from 'svelte';
  import { tickSimulation } from '$lib/client/tick-simulation';
  import ODashboardSummary from '$lib/ui/organisms/ODashboardSummary.svelte';
  import OEmployeeRiskCards from '$lib/ui/organisms/OEmployeeRiskCards.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  let ticking = false;

  $: simulationSummary = data.simulationSummary;
  $: lastGenerated = simulationSummary.session.lastGeneratedAt
    ? new Date(simulationSummary.session.lastGeneratedAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    : '-';

  const tourSteps = [
    { label: '1. Simulate', detail: 'create load', href: '/admin/simulation' },
    { label: '2. Queue', detail: 'pick case', href: '/admin/alerts' },
    { label: '3. Evidence', detail: 'inspect signals', href: '/admin/alerts' },
    { label: '4. Resolve', detail: 'safe/malicious', href: '/admin/alerts' },
    { label: '5. Evaluate', detail: 'quality result', href: '/admin/simulation' },
    { label: '6. Learn', detail: 'close loop', href: '/employee/learning' }
  ];

  async function tickAndRefresh() {
    if (ticking) {
      return;
    }

    ticking = true;
    try {
      const result = await tickSimulation();
      if (result.success) {
        await invalidateAll();
      }
    } finally {
      ticking = false;
    }
  }

  onMount(() => {
    const timer = window.setInterval(() => {
      if (simulationSummary.session.mode === 'running') {
        void tickAndRefresh();
      }
    }, 5000);

    return () => window.clearInterval(timer);
  });
</script>

<section class="admin-cockpit">
  <section class="cockpit-intro" aria-label="Operations cockpit">
    <div class="cockpit-head">
      <div class="page-title">
        <p class="eyebrow">Admin cockpit</p>
        <h1>Suspicious mail operations</h1>
        <p>
          Control simulated workload, triage by evidence, measure decision quality, and close the follow-up learning loop.
        </p>
      </div>

      <div class="cockpit-status" aria-label="Current state">
        <span class="pill high">Simulation {simulationSummary.session.mode}</span>
        <span class="pill">Last case <b>{lastGenerated}</b></span>
        <span class="pill">Generated <b>{simulationSummary.session.generatedCount}</b></span>
        <span class="pill">Manual + simulated pipeline</span>
      </div>
    </div>

    <nav class="tour-rail" aria-label="Primary demo route">
      {#each tourSteps as step, index (step.label)}
        <a class="tour-step" class:active={index === 0} href={step.href}>
          <b>{step.label}</b>
          <span>{step.detail}</span>
        </a>
      {/each}
    </nav>

    <aside class="tour-card" aria-label="Guided tour step">
      <div>
        <div class="tour-progress">Step 1 of 6</div>
        <h2>Start simulation load</h2>
        <p>Synthetic reports enter the same queue as employee submissions.</p>
      </div>
      <div class="tour-actions">
        <a class="outline-link" href="/admin/simulation">Open simulation</a>
        <a class="solid-link" href="/admin/alerts">Prioritize queue</a>
      </div>
    </aside>
  </section>

  <div class="layout">
    <div class="main-column">
      <ODashboardSummary summary={data.summary} />
      <OEmployeeRiskCards summaries={data.employeeSummaries} />
    </div>

    <aside class="simulation-sidebar" aria-label="Simulation snapshot">
      <section class="simulation-snapshot">
        <div class="snapshot-head">
          <div>
            <p class="eyebrow">Simulation session</p>
            <h2>Simulation snapshot</h2>
          </div>
          <span class:running={simulationSummary.session.mode === 'running'}>
            {simulationSummary.session.mode}
          </span>
        </div>

        <div class="snapshot-grid">
          <div aria-label="Generated cases">
            <b>{simulationSummary.session.generatedCount}</b>
            <span>Generated cases</span>
          </div>
          <div aria-label="Last case">
            <b>{lastGenerated}</b>
            <span>Last case</span>
          </div>
          <div aria-label="Current rate">
            <b>{simulationSummary.session.config.ratePerMinute}/m</b>
            <span>Current rate</span>
          </div>
          <div aria-label="Malicious mix">
            <b>{Math.round(simulationSummary.session.config.maliciousRatio * 100)}%</b>
            <span>Malicious mix</span>
          </div>
        </div>

        <p>Use the dedicated simulation console to start, pause, inject, reset, and tune generated workload.</p>

        <a class="solid-link" href="/admin/simulation">Open simulation console</a>
      </section>
    </aside>
  </div>
</section>

<style lang="scss">
  .admin-cockpit {
    display: grid;
    gap: 0.875rem;

    > .cockpit-intro {
      display: grid;
      gap: 0.875rem;
      padding: 1.125rem;
      border-radius: var(--radius);
      background: var(--surface);
    }

    .cockpit-head {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 1.125rem;
      align-items: center;
    }

    .page-title {
      display: grid;
      gap: 0.375rem;
      min-width: 0;

      > .eyebrow {
        color: var(--text-muted);
        font: 400 0.75rem/1.4 var(--font-mono);
        text-transform: uppercase;
      }

      > h1 {
        max-width: 47.5rem;
        font-size: 2.25rem;
      }

      > p {
        max-width: 68ch;
        color: var(--text-muted);
        font-size: 0.875rem;
      }
    }

    .cockpit-status,
    .tour-actions {
      display: flex;
      align-items: center;
      justify-content: end;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .pill {
      display: inline-flex;
      align-items: center;
      min-height: 1.75rem;
      padding: 0.3125rem 0.625rem;
      border-radius: 999px;
      background: var(--surface-raised);
      color: var(--text-soft);
      font-size: 0.75rem;
      font-weight: 500;
      white-space: nowrap;

      &.high {
        background: var(--admin-tint);
        color: var(--admin-primary);
      }

      b {
        margin-inline-start: 0.25rem;
        font-weight: 500;
      }
    }

    .tour-rail {
      display: grid;
      grid-template-columns: repeat(6, minmax(0, 1fr));
      gap: 0.5rem;
    }

    .tour-step {
      min-height: 4rem;
      padding: 0.625rem;
      border-radius: 1rem;
      background: var(--surface-raised);
      color: var(--text-soft);
      text-align: start;
      text-decoration: none;

      &:hover,
      &.active {
        color: var(--accent);
        background: #dcecff;
      }

      b,
      span {
        display: block;
      }

      b {
        font-size: 0.75rem;
        font-weight: 500;
      }

      span {
        margin-top: 0.1875rem;
        color: var(--text-muted);
        font-size: 0.6875rem;
        line-height: 1.25;
      }
    }

    .tour-card {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 0.875rem;
      padding: 1rem;
      border-radius: var(--radius);
      background: var(--surface-raised);

      h2 {
        font-size: 1.375rem;
      }

      p {
        margin-top: 0.25rem;
        color: var(--text-soft);
        font-size: 0.875rem;
      }
    }

    .tour-progress {
      color: var(--text-muted);
      font: 400 0.6875rem/1.4 var(--font-mono);
      text-transform: uppercase;
    }

    .outline-link,
    .solid-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 2.5rem;
      padding: 0.5625rem 0.9375rem;
      border-radius: 999px;
      font-size: 0.875rem;
      font-weight: 500;
      text-decoration: none;
      white-space: nowrap;
    }

    .outline-link {
      background: var(--surface);
      color: var(--text);

      &:hover {
        color: var(--admin-primary);
        background: var(--admin-tint);
      }
    }

    .solid-link {
      background: var(--admin-primary);
      color: white;

      &:hover {
        background: var(--admin-primary-strong);
      }
    }

    > .layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(300px, 360px);
      gap: 0.875rem;
      align-items: start;
    }

    .main-column,
    .simulation-sidebar {
      display: grid;
      gap: 0.875rem;
    }

    .simulation-sidebar {
      position: sticky;
      top: 5rem;
    }

    .simulation-snapshot {
      display: grid;
      gap: 0.875rem;
      padding: 1rem;
      border-radius: var(--radius);
      background: var(--surface);

      > p {
        color: var(--text-muted);
        font-size: 0.875rem;
        line-height: 1.45;
      }

      > .solid-link {
        width: 100%;
      }
    }

    .snapshot-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;

      .eyebrow {
        color: var(--text-muted);
        font: 400 0.75rem/1.4 var(--font-mono);
        text-transform: uppercase;
      }

      h2 {
        margin-top: 0.25rem;
        font-size: 1.375rem;
      }

      > span {
        min-height: 1.75rem;
        padding: 0.3125rem 0.625rem;
        border-radius: 999px;
        background: var(--surface-raised);
        color: var(--text-muted);
        font-size: 0.75rem;
        font-weight: 500;

        &.running {
          background: var(--admin-tint);
          color: var(--admin-primary);
        }
      }
    }

    .snapshot-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.5rem;

      > div {
        min-height: 4rem;
        padding: 0.75rem;
        border-radius: var(--radius-sm);
        background: var(--surface-raised);
      }

      b,
      span {
        display: block;
      }

      b {
        font-family: var(--font-display);
        font-size: 1.375rem;
        font-weight: 400;
        line-height: 1;
      }

      span {
        margin-top: 0.25rem;
        color: var(--text-muted);
        font-size: 0.75rem;
      }
    }

    @media (max-width: 1100px) {
      .cockpit-head,
      > .layout {
        grid-template-columns: 1fr;
      }

      .cockpit-status {
        justify-content: flex-start;
      }

      .tour-rail {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .tour-card {
        grid-template-columns: 1fr;
      }

      .simulation-sidebar {
        position: static;
      }
    }

    @media (max-width: 760px) {
      .page-title > h1 {
        font-size: 1.875rem;
      }

      .tour-rail {
        grid-template-columns: 1fr;
      }
    }
  }
</style>
