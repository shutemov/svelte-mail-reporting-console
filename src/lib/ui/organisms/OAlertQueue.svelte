<script lang="ts">
  import type { AlertDetailsView, AlertListQuery } from '$lib/domains/types';
  import AInput from '$lib/ui/atoms/AInput.svelte';
  import ASelect from '$lib/ui/atoms/ASelect.svelte';
  import AButton from '$lib/ui/atoms/AButton.svelte';
  import MAlertSummary from '$lib/ui/molecules/MAlertSummary.svelte';

  export let items: AlertDetailsView[] = [];
  export let filters: AlertListQuery = {};
</script>

<section class="o-alert-queue">
  <form method="GET" class="filters">
    <ASelect name="status" value={filters.status ?? ''}>
      <option value="">All statuses</option>
      <option value="new">New</option>
      <option value="investigating">Investigating</option>
      <option value="resolved_safe">Resolved safe</option>
      <option value="resolved_malicious">Resolved malicious</option>
      <option value="closed">Closed</option>
    </ASelect>

    <ASelect name="severity" value={filters.severity ?? ''}>
      <option value="">All severities</option>
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
      <option value="critical">Critical</option>
    </ASelect>

    <ASelect name="riskyAction" value={filters.riskyAction ?? ''}>
      <option value="">All actions</option>
      <option value="opened_email">Opened email</option>
      <option value="clicked_link">Clicked link</option>
      <option value="downloaded_attachment">Downloaded attachment</option>
      <option value="entered_credentials">Entered credentials</option>
      <option value="reported_without_interaction">Reported without interaction</option>
    </ASelect>

    <AInput name="reporterId" value={filters.reporterId ?? ''} placeholder="Reporter ID" />
    <AButton type="submit" variant="secondary">Apply filters</AButton>
  </form>

  {#if items.length === 0}
    <p>No alerts found for current filter.</p>
  {:else}
    <div class="list">
      {#each items as item (item.alert.id)}
        <MAlertSummary {item} />
      {/each}
    </div>
  {/if}
</section>

<style lang="scss">
  .o-alert-queue {
    > .filters {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 0.6rem;
      margin-bottom: 1rem;
    }

    > .list {
      display: grid;
      gap: 0.75rem;
    }
  }
</style>
