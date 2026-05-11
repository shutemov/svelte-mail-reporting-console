<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { onMount } from 'svelte';
  import { tickSimulation } from '$lib/client/tick-simulation';
  import MPageHeading from '$lib/ui/molecules/MPageHeading.svelte';
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
  <MPageHeading title="Simulation" />

  <OSimulationControlPanel session={summary.session} formError={form?.formError ?? ''} />

  <div class="layout">
    <OSimulationFlowSettings config={summary.session.config} {form} />

    <section class="metrics">
      <h2>Operational metrics</h2>

      <div class="cards">
        <MSimulationMetricCard
          label="Open alerts"
          value={queue.openAlerts}
          hint="Synthetic new + investigating alerts."
        />
        <MSimulationMetricCard
          label="New alerts last 15m"
          value={queue.newAlertsLast15m}
          hint="Incoming load trend."
        />
        <MSimulationMetricCard
          label="Backlog growth / min"
          value={queue.backlogGrowthRate}
          hint="Positive means queue grows faster than it is resolved."
        />
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
        <MSimulationMetricCard
          label="False negatives"
          value={`${triage.falseNegativeRate}%`}
          hint="Critical miss rate for malicious cases resolved as safe."
        />
        <MSimulationMetricCard
          label="Precision / recall"
          value={`${triage.precisionPercent}% / ${triage.recallPercent}%`}
          hint="Malicious decision quality."
        />
        <MSimulationMetricCard
          label="Median resolution"
          value={
            triage.medianTimeToResolutionMinutes === null
              ? 'n/a'
              : `${triage.medianTimeToResolutionMinutes}m`
          }
          hint={`${triage.alertsResolvedLastHour} synthetic alerts resolved in the last hour.`}
        />
        <MSimulationMetricCard
          label="High-risk actions"
          value={`${learning.highRiskActionRate}%`}
          hint="Generated reports with risky employee actions."
        />
        <MSimulationMetricCard
          label="Learning assignment"
          value={`${learning.learningAssignmentRateForEligibleCases}%`}
          hint="Eligible resolved malicious high/critical cases assigned learning."
        />
      </div>
    </section>
  </div>
</section>

<style lang="scss">
  .simulation-page {
    display: grid;
    gap: var(--space-4);

    > .layout {
      display: grid;
      grid-template-columns: minmax(280px, 0.9fr) minmax(320px, 1.1fr);
      gap: var(--space-4);
      align-items: start;
    }

    .metrics {
      display: grid;
      gap: var(--space-3);

      h2 {
        margin: 0;
      }
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
      gap: var(--space-3);
    }

    @media (max-width: 1000px) {
      > .layout {
        grid-template-columns: 1fr;
      }
    }
  }
</style>
