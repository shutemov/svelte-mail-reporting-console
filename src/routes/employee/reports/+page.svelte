<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<h1>My reports</h1>

{#if data.reports.length === 0}
  <p>No reports yet.</p>
{:else}
  <ul class="list">
    {#each data.reports as report (report.id)}
      <li>
        <a href={`/employee/reports/${report.id}`}>{report.subject}</a>
        <small>{new Date(report.createdAt).toLocaleString()}</small>
      </li>
    {/each}
  </ul>
{/if}

<style lang="scss">
  .list {
    display: grid;
    gap: 0.6rem;
    padding: 0;
  }
  li {
    list-style: none;
    display: flex;
    justify-content: space-between;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0.75rem;
  }
  small {
    color: var(--text-muted);
  }
</style>
