<script lang="ts">
  import { formatShortTime } from '$lib/common/date-time';
  import type { SimulationSession } from '$lib/domains';
  import AButton from '$lib/ui/atoms/AButton.svelte';
  import AErrorMessage from '$lib/ui/atoms/AErrorMessage.svelte';

  export let session: SimulationSession;
  export let formError = '';
</script>

<section class="o-simulation-control-panel">
  <div class="heading">
    <div>
      <p>Simulation session</p>
      <h2>Operator controls</h2>
    </div>
    <span class:running={session.mode === 'running'}>{session.mode}</span>
  </div>

  <div class="state-grid">
    <div class="state-chip">
      <b>{session.generatedCount}</b>
      <span>Generated</span>
    </div>
    <div class="state-chip">
      <b>
        {formatShortTime(session.lastGeneratedAt)}
      </b>
      <span>Last case</span>
    </div>
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
    background: var(--surface);
    border: 0;
    border-radius: var(--radius);
    padding: 1rem;
    box-shadow: var(--shadow);

    > .heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;

      p {
        color: var(--text-muted);
        font: 400 0.75rem/1.4 var(--font-mono);
        text-transform: uppercase;
      }

      h2 {
        margin-top: 0.25rem;
        font-size: 1.375rem;
      }

      > span {
        min-height: 1.75rem;
        padding: 0.3125rem 0.625rem;
        border-radius: 999px;
        background: var(--surface-raised);
        color: var(--text-muted);
        font-size: 0.75rem;
        font-weight: 500;

        &.running {
          background: var(--admin-tint);
          color: var(--admin-primary);
        }
      }
    }

    .state-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .state-chip {
      min-height: 4rem;
      padding: 0.75rem;
      border-radius: var(--radius-sm);
      background: var(--surface-raised);

      b,
      span {
        display: block;
      }

      b {
        font-family: var(--font-display);
        font-size: 1.375rem;
        font-weight: 400;
        line-height: 1;
      }

      span {
        margin-top: 0.25rem;
        color: var(--text-muted);
        font-size: 0.75rem;
      }
    }

    > .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 1rem;
    }
  }
</style>
