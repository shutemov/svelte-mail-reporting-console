<script lang="ts">
  import type { DashboardSummary } from '$lib/domains/types';
  import MMetricCard from '$lib/ui/molecules/MMetricCard.svelte';

  export let summary: DashboardSummary;
</script>

<section class="o-dashboard-summary">
  <MMetricCard label="Open alerts" value={summary.openAlerts} />
  <MMetricCard label="Incoming reports 15m" value={summary.incomingReportsLast15m} />
  <MMetricCard label="Confirmed malicious" value={summary.confirmedMalicious} />
  <MMetricCard label="High-risk reports" value={summary.highRiskReports} />
  <MMetricCard label="Backlog growth / min" value={summary.backlogGrowthRate} />
  <MMetricCard
    label="Avg triage (min)"
    value={summary.averageTriageMinutes === null ? '-' : summary.averageTriageMinutes}
  />
  <MMetricCard label="Learning completion (%)" value={summary.learningCompletionRate} />
</section>

<style lang="scss">
  .o-dashboard-summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 0.8rem;
  }
</style>
