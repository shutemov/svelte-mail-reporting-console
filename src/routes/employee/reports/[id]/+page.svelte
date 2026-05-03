<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<h1>Report details</h1>
<article class="card">
  <p><strong>Sender:</strong> {data.report.sender}</p>
  <p><strong>Subject:</strong> {data.report.subject}</p>
  <p><strong>Reason:</strong> {data.report.reason}</p>
  <p><strong>Risky actions:</strong> {data.report.riskyActions.join(', ')}</p>
  {#if data.report.messagePreview}
    <pre>{data.report.messagePreview}</pre>
  {/if}
</article>

<style lang="scss">
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1rem;
    max-width: 760px;
  }
  pre {
    white-space: pre-wrap;
  }
</style>