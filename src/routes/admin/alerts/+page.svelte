<script lang="ts">
  import OAlertQueue from '$lib/ui/organisms/OAlertQueue.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<section class="alert-queue-page">
  <header class="page-header">
    <div>
      <p>Admin queue</p>
      <h1>Prioritize suspicious mail alerts.</h1>
      <span>Manual employee reports and synthetic simulation cases share one triage queue.</span>
    </div>
  </header>
  <OAlertQueue items={data.alerts} filters={data.filters} />
</section>

<style lang="scss">
  .alert-queue-page {
    display: grid;
    gap: 0.875rem;
  }

  .page-header {
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
      line-height: 1.12;
    }

    span {
      display: block;
      margin-top: 0.375rem;
      color: var(--text-muted);
      font-size: 0.875rem;
    }
  }
</style>
