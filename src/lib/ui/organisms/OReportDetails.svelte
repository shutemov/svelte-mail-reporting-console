<script lang="ts">
  import type { Report } from '$lib/domains/types';
  import MPageHeading from '$lib/ui/molecules/MPageHeading.svelte';

  export let report: Report;
</script>

<section class="o-report-details">
  <MPageHeading title="Report details" />

  <article class="card">
    <p><strong>Sender:</strong> {report.sender}</p>
    <p><strong>Subject:</strong> {report.subject}</p>
    <p><strong>Reason:</strong> {report.reason}</p>
    <p><strong>Risky actions:</strong> {report.riskyActions.join(', ')}</p>
    {#if report.messagePreview}
      <pre>{report.messagePreview}</pre>
    {/if}
  </article>
</section>

<style lang="scss">
  .o-report-details {
    display: grid;
    gap: var(--space-4);

    > .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: var(--space-4);
      max-width: 47.5rem;
      display: grid;
      gap: var(--space-2);
    }

    pre {
      white-space: pre-wrap;
      margin: 0;
      padding: var(--space-3);
      border-radius: var(--radius-sm);
      background: var(--surface-muted);
    }
  }
</style>
