<script lang="ts">
  type ReportListItem = {
    id: string;
    subject: string;
    createdAt: string;
  };

  export let reports: ReportListItem[] = [];
</script>

<section class="o-reports-list">
  <header class="page-header">
    <div>
      <p>Employee reports history</p>
      <h1>Track submitted reports.</h1>
      <span>Non-blaming status updates keep reporters informed without adding anxiety.</span>
    </div>
    <div class="meta">
      <span>Calm status</span>
      <span>Non-blaming outcomes</span>
    </div>
  </header>

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
    gap: 0.875rem;

    > .page-header {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 1rem;
      align-items: center;
      padding: 0.875rem 1rem;
      border-radius: var(--radius-md);
      background: var(--surface);

      p {
        color: var(--text-muted);
        font: 400 0.75rem/1.4 var(--font-mono);
        text-transform: uppercase;
      }

      h1 {
        margin-top: 0.375rem;
        font-size: 1.625rem;
      }

      span {
        display: block;
        margin-top: 0.375rem;
        color: var(--text-muted);
        font-size: 0.875rem;
      }
    }

    .meta {
      display: flex;
      flex-wrap: wrap;
      justify-content: end;
      gap: 0.375rem;

      span {
        min-height: 1.75rem;
        margin: 0;
        padding: 0.3125rem 0.625rem;
        border-radius: 999px;
        background: var(--employee-tint);
        color: var(--employee-primary);
        font-size: 0.75rem;
        font-weight: 500;
      }
    }

    > .empty {
      padding: 1rem;
      border-radius: var(--radius);
      background: var(--surface);
      color: var(--text-muted);
    }

    > .list {
      display: grid;
      gap: 0.5rem;
      padding: 0;
      margin: 0;
      border-radius: var(--radius);
      background: var(--surface);
      padding: 0.75rem;

      li {
        list-style: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.75rem;
        background: var(--surface-raised);
        border: 0;
        border-radius: var(--radius-sm);
        padding: 0.875rem;
      }

      a {
        font-weight: 500;
        text-decoration: none;
      }

      small {
        color: var(--text-muted);
      }
    }

    @media (max-width: 760px) {
      > .page-header {
        grid-template-columns: 1fr;
      }

      .meta {
        justify-content: flex-start;
      }

      > .list li {
        align-items: flex-start;
        flex-direction: column;
      }
    }
  }
</style>
