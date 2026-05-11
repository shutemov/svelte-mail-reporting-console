<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { onMount } from 'svelte';
  import { tickSimulation } from '$lib/client/tick-simulation';
  import MPageHeading from '$lib/ui/molecules/MPageHeading.svelte';
  import ODashboardSummary from '$lib/ui/organisms/ODashboardSummary.svelte';
  import OEmployeeRiskCards from '$lib/ui/organisms/OEmployeeRiskCards.svelte';
  import OSimulationControlPanel from '$lib/ui/organisms/OSimulationControlPanel.svelte';
  import OSimulationFlowSettings from '$lib/ui/organisms/OSimulationFlowSettings.svelte';
  import type { ActionData, PageData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  let ticking = false;

  $: simulationSummary = data.simulationSummary;

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
  <MPageHeading
    title="Admin dashboard"
    subtitle="Monitor incoming suspicious mail reports, employee risk context, and simulation flow from one cockpit."
  />

  <div class="layout">
    <main class="main-column">
      <ODashboardSummary summary={data.summary} />
      <OEmployeeRiskCards summaries={data.employeeSummaries} />
    </main>

    <aside class="simulation-sidebar" aria-label="Simulation controls">
      <OSimulationControlPanel
        session={simulationSummary.session}
        formError={form?.formError ?? ''}
      />
      <OSimulationFlowSettings config={simulationSummary.session.config} {form} />
    </aside>
  </div>
</section>

<style lang="scss">
  .admin-cockpit {
    display: grid;
    gap: var(--space-4);

    > .layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(300px, 360px);
      gap: var(--space-4);
      align-items: start;
    }

    .main-column,
    .simulation-sidebar {
      display: grid;
      gap: var(--space-4);
    }

    .simulation-sidebar {
      position: sticky;
      top: var(--space-4);
    }

    @media (max-width: 1100px) {
      > .layout {
        grid-template-columns: 1fr;
      }

      .simulation-sidebar {
        position: static;
      }
    }
  }
</style>
