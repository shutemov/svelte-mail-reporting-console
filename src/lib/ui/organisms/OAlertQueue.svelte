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
  <div class="queue-viewbar" aria-label="Queue view presets">
    <div>
      <span>Queue view</span>
      <b>{items.length} alerts in current view</b>
    </div>
    <p>Prioritize by severity, risky action, age, and evidence.</p>
  </div>

  <form method="GET" action="/admin/alerts" class="filters">
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
    <div class="filter-action">
      <AButton type="submit" variant="secondary">Apply filters</AButton>
    </div>
  </form>

  {#if items.length === 0}
    <p class="empty">No alerts found for current filter.</p>
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
    display: grid;
    gap: 0.875rem;

    > .queue-viewbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 1rem;
      border-radius: var(--radius);
      background: var(--surface);

      span {
        color: var(--text-muted);
        font: 400 0.6875rem/1.4 var(--font-mono);
        text-transform: uppercase;
      }

      b {
        display: block;
        margin-top: 0.25rem;
        font-size: 1.125rem;
        font-weight: 500;
      }

      p {
        max-width: 34rem;
        color: var(--text-muted);
        font-size: 0.875rem;
        text-align: end;
      }
    }

    > .filters {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr)) minmax(8.75rem, auto);
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      border-radius: var(--radius);
      background: var(--surface);

      > .filter-action {
        display: flex;
        align-self: stretch;

        :global(.a-button) {
          width: 100%;
          min-height: 2.75rem;
          border: 1px solid var(--border);
        }
      }
    }

    > .list {
      display: grid;
      gap: 0.5rem;
      padding: 0.75rem;
      border-radius: var(--radius);
      background: var(--surface);
    }

    > .empty {
      padding: 1rem;
      border-radius: var(--radius);
      background: var(--surface);
      color: var(--text-muted);
    }

    @media (max-width: 760px) {
      > .filters {
        grid-template-columns: 1fr;
      }

      > .queue-viewbar {
        align-items: flex-start;
        flex-direction: column;

        p {
          text-align: start;
        }
      }
    }
  }
</style>
