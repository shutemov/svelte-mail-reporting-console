<script lang="ts">
  import type { SimulationSession } from '$lib/domains/types';
  import AButton from '$lib/ui/atoms/AButton.svelte';
  import AErrorMessage from '$lib/ui/atoms/AErrorMessage.svelte';

  export let session: SimulationSession;
  export let formError = '';
</script>

<section class="o-simulation-control-panel">
  <div>
    <h2>Simulation controls</h2>
    <p>
      Mode: <strong>{session.mode}</strong> · Generated:
      <strong>{session.generatedCount}</strong>
      {#if session.lastGeneratedAt}
        · Last generated: <strong>{new Date(session.lastGeneratedAt).toLocaleString()}</strong>
      {/if}
    </p>
  </div>

  <AErrorMessage message={formError} />

  <div class="actions">
    <form method="POST" action="?/start">
      <AButton type="submit" disabled={session.mode === 'running'}>Start</AButton>
    </form>
    <form method="POST" action="?/pause">
      <AButton type="submit" variant="secondary" disabled={session.mode === 'paused'}>Pause</AButton>
    </form>
    <form method="POST" action="?/inject">
      <AButton type="submit" variant="secondary">Inject once</AButton>
    </form>
    <form method="POST" action="?/reset">
      <AButton type="submit" variant="danger">Reset</AButton>
    </form>
  </div>
</section>

<style lang="scss">
  .o-simulation-control-panel {
    background: #f8fbff;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: var(--space-4);
    box-shadow: var(--shadow);

    h2,
    p {
      margin: 0;
    }

    p {
      margin-top: 0.3rem;
      color: var(--text-muted);
    }

    > .actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
      margin-top: var(--space-4);
    }
  }
</style>
