<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { onMount } from 'svelte';
  import { tickSimulation } from '$lib/client/tick-simulation';
  import MSimulationMetricCard from '$lib/ui/molecules/MSimulationMetricCard.svelte';
  import OSimulationControlPanel from '$lib/ui/organisms/OSimulationControlPanel.svelte';
  import OSimulationFlowSettings from '$lib/ui/organisms/OSimulationFlowSettings.svelte';
  import type { ActionData, PageData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  let ticking = false;

  $: summary = data.summary;
  $: queue = summary.queueHealth;
  $: triage = summary.triageOutcome;
  $: learning = summary.humanRiskLearning;

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
      if (summary.session.mode === 'running') {
        void tickAndRefresh();
      }
    }, 5000);

    return () => window.clearInterval(timer);
  });
</script>

<section class="simulation-page">
  <section class="simulation-console" aria-label="Demo-only simulation operator controls">
    <div class="page-title">
      <p class="eyebrow">Demo operator layer</p>
      <h1>Simulation controls</h1>
      <p>Generate synthetic suspicious mail reports, tune workload mix, and watch queue pressure change.</p>
    </div>

    <OSimulationControlPanel session={summary.session} formError={form?.formError ?? ''} />
  </section>

  <div class="layout">
    <OSimulationFlowSettings config={summary.session.config} {form} />

    <section class="simulation-feed">
      <div class="section-head">
        <div>
          <h2>Generated cases feed</h2>
          <p>
            {summary.session.mode === 'running'
              ? 'Synthetic reports are entering the queue. Evaluation runs after resolution.'
              : 'Simulation paused. Existing generated cases remain in the queue for triage.'}
          </p>
        </div>
        <a href="/admin/alerts">Prioritize queue</a>
      </div>

      <div class="feed-list">
        {#if summary.generatedCases.length === 0}
          <p class="empty">No generated cases yet. Start or inject the simulation to create workload.</p>
        {:else}
          {#each summary.generatedCases.slice(0, 5) as item (item.alertId)}
            <a class="feed-item" href={`/admin/alerts/${item.alertId}`}>
              <span class="time">
                {new Date(item.generatedAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
              <div>
                <b>{item.alertId} / {item.templateId.replaceAll('-', ' ')}</b>
                <span>{item.groundTruth.outcome}, {item.groundTruth.severity} severity</span>
              </div>
              <span class={`pill ${item.groundTruth.severity}`}>queued</span>
            </a>
          {/each}
        {/if}
      </div>
    </section>
  </div>

  <section class="metrics">
    <div class="section-head compact">
      <div>
        <h2>Operational metrics</h2>
        <p>Live simulation health and decision quality.</p>
      </div>
    </div>

    <div class="cards">
      <MSimulationMetricCard label="Open alerts" value={queue.openAlerts} hint="Synthetic new + investigating alerts." />
      <MSimulationMetricCard label="New alerts last 15m" value={queue.newAlertsLast15m} hint="Incoming load trend." />
      <MSimulationMetricCard label="Backlog growth / min" value={queue.backlogGrowthRate} hint="Queue pressure." />
      <MSimulationMetricCard
        label="Oldest open alert"
        value={queue.oldestOpenAlertMinutes === null ? 'n/a' : `${queue.oldestOpenAlertMinutes}m`}
        hint="Staleness and SLA pressure."
      />
      <MSimulationMetricCard
        label="Decision accuracy"
        value={`${triage.decisionAccuracyPercent}%`}
        hint={`${triage.correctDecisions}/${triage.totalDecisions} resolved decisions correct.`}
      />
      <MSimulationMetricCard label="False negatives" value={`${triage.falseNegativeRate}%`} hint="Critical miss rate." />
      <MSimulationMetricCard
        label="Precision / recall"
        value={`${triage.precisionPercent}% / ${triage.recallPercent}%`}
        hint="Malicious decision quality."
      />
      <MSimulationMetricCard
        label="Median resolution"
        value={triage.medianTimeToResolutionMinutes === null ? 'n/a' : `${triage.medianTimeToResolutionMinutes}m`}
        hint={`${triage.alertsResolvedLastHour} synthetic alerts resolved in the last hour.`}
      />
      <MSimulationMetricCard label="High-risk actions" value={`${learning.highRiskActionRate}%`} hint="Generated risky actions." />
      <MSimulationMetricCard
        label="Learning assignment"
        value={`${learning.learningAssignmentRateForEligibleCases}%`}
        hint="Eligible cases assigned learning."
      />
    </div>
  </section>
</section>

<style lang="scss">
  .simulation-page {
    display: grid;
    gap: 0.875rem;

    > .simulation-console {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(320px, 0.65fr);
      gap: 0.875rem;
      align-items: stretch;
    }

    .page-title,
    .simulation-feed,
    .metrics {
      padding: 1.125rem;
      border-radius: var(--radius);
      background: var(--surface);
    }

    .page-title {
      display: grid;
      align-content: center;
      gap: 0.375rem;

      > .eyebrow {
        color: var(--text-muted);
        font: 400 0.75rem/1.4 var(--font-mono);
        text-transform: uppercase;
      }

      > p {
        max-width: 68ch;
        color: var(--text-muted);
        font-size: 0.875rem;
      }
    }

    > .layout {
      display: grid;
      grid-template-columns: minmax(280px, 0.9fr) minmax(320px, 1.1fr);
      gap: 0.875rem;
      align-items: start;
    }

    .simulation-feed {
      display: grid;
      gap: 0.875rem;
    }

    .section-head {
      display: flex;
      align-items: start;
      justify-content: space-between;
      gap: 1rem;

      h2 {
        font-size: 1.375rem;
      }

      p {
        margin-top: 0.25rem;
        color: var(--text-muted);
        font-size: 0.875rem;
      }

      a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 2.5rem;
        padding: 0.5625rem 0.9375rem;
        border-radius: 999px;
        background: var(--admin-primary);
        color: white;
        font-size: 0.875rem;
        font-weight: 500;
        text-decoration: none;
        white-space: nowrap;
      }
    }

    .feed-list {
      display: grid;
      gap: 0.5rem;
    }

    .feed-item {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: var(--radius-sm);
      background: var(--surface-raised);
      color: inherit;
      text-decoration: none;

      &:hover {
        background: var(--admin-tint);
      }

      .time {
        color: var(--text-muted);
        font: 400 0.75rem/1.4 var(--font-mono);
      }

      b,
      span {
        display: block;
      }

      b {
        font-size: 0.875rem;
        font-weight: 500;
        text-transform: capitalize;
      }

      div span {
        color: var(--text-muted);
        font-size: 0.8125rem;
      }
    }

    .pill {
      min-height: 1.75rem;
      padding: 0.3125rem 0.625rem;
      border-radius: 999px;
      background: var(--admin-tint);
      color: var(--admin-primary);
      font-size: 0.75rem;
      font-weight: 500;
      white-space: nowrap;

      &.high,
      &.critical {
        background: #ffe6eb;
        color: var(--risk-high);
      }

      &.medium {
        background: #fff3dd;
        color: var(--risk-med);
      }

      &.low {
        background: var(--employee-tint);
        color: var(--employee-primary);
      }
    }

    .empty {
      padding: 1rem;
      border-radius: var(--radius-sm);
      background: var(--surface-raised);
      color: var(--text-muted);
      font-size: 0.875rem;
    }

    .metrics {
      display: grid;
      gap: 0.875rem;
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
      gap: 0.75rem;
    }

    @media (max-width: 1000px) {
      > .simulation-console,
      > .layout {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 760px) {
      .section-head,
      .feed-item {
        grid-template-columns: 1fr;
      }

      .section-head {
        flex-direction: column;
      }
    }
  }
</style>
