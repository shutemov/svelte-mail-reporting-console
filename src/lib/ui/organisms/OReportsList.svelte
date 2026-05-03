<script lang="ts">
  import MPageHeading from '$lib/ui/molecules/MPageHeading.svelte';

  type ReportListItem = {
    id: string;
    subject: string;
    createdAt: string;
  };

  export let reports: ReportListItem[] = [];
</script>

<section class="o-reports-list">
  <MPageHeading title="My reports" />

  {#if reports.length === 0}
    <p class="empty">No reports yet.</p>
  {:else}
    <ul class="list">
      {#each reports as report (report.id)}
        <li>
          <a href={`/employee/reports/${report.id}`}>{report.subject}</a>
          <small>{new Date(report.createdAt).toLocaleString()}</small>
        </li>
      {/each}
    </ul>
  {/if}
</section>

<style lang="scss">
  .o-reports-list {
    display: grid;
    gap: var(--space-4);

    > .empty {
      color: var(--text-muted);
    }

    > .list {
      display: grid;
      gap: var(--space-2);
      padding: 0;
      margin: 0;

      li {
        list-style: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--space-3);
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: var(--space-3);
      }

      small {
        color: var(--text-muted);
      }
    }
  }
</style>
