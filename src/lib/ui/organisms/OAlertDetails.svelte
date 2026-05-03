<script lang="ts">
  import type { AlertDetailsView } from '$lib/domains/types';
  import AButton from '$lib/ui/atoms/AButton.svelte';
  import AStatusPill from '$lib/ui/atoms/AStatusPill.svelte';
  import MTimelineEvent from '$lib/ui/molecules/MTimelineEvent.svelte';

  export let details: AlertDetailsView;
  export let formError = '';
</script>

<section class="o-alert-details">
  <header class="header">
    <h1 class="title">{details.report.subject}</h1>
    <div class="meta">
      <AStatusPill status={details.alert.status} />
      <AStatusPill severity={details.alert.severity} />
    </div>
  </header>

  <article class="report">
    <h2>Report details</h2>
    <p><strong>Sender:</strong> {details.report.sender}</p>
    <p><strong>Reason:</strong> {details.report.reason}</p>
    {#if details.report.messagePreview}
      <pre>{details.report.messagePreview}</pre>
    {/if}
  </article>

  <article>
    <h2>Actions</h2>
    {#if formError}
      <p class="error">{formError}</p>
    {/if}

    <div class="actions">
      <form method="POST" action="?/command">
        <input type="hidden" name="command" value="startInvestigation" />
        <AButton type="submit" variant="secondary">Start investigation</AButton>
      </form>
      <form method="POST" action="?/command">
        <input type="hidden" name="command" value="resolveAsSafe" />
        <AButton type="submit" variant="secondary">Resolve as safe</AButton>
      </form>
      <form method="POST" action="?/command">
        <input type="hidden" name="command" value="resolveAsMalicious" />
        <AButton type="submit" variant="danger">Resolve as malicious</AButton>
      </form>
      <form method="POST" action="?/command">
        <input type="hidden" name="command" value="closeAlert" />
        <AButton type="submit" variant="secondary">Close alert</AButton>
      </form>
    </div>

    <form method="POST" action="?/note" class="note">
      <textarea name="body" rows="3" placeholder="Investigation note"></textarea>
      <AButton type="submit" variant="secondary">Add note</AButton>
    </form>

    <form method="POST" action="?/assignLearning" class="assign">
      <input type="hidden" name="moduleId" value="phishing-basics" />
      <AButton type="submit">Assign phishing basics</AButton>
    </form>
  </article>

  <article>
    <h2>Timeline</h2>
    <ul>
      {#each details.timeline as event (event.id)}
        <MTimelineEvent {event} />
      {/each}
    </ul>
  </article>
</section>

<style lang="scss">
  .o-alert-details {
    display: grid;
    gap: 1rem;

    > .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
    }

    .meta {
      display: flex;
      gap: 0.4rem;
    }

    .report,
    article {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1rem;
    }

    pre {
      white-space: pre-wrap;
      background: var(--surface-muted);
      border-radius: var(--radius-sm);
      padding: 0.8rem;
      border: 1px solid var(--border);
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 0.8rem;
    }

    .note,
    .assign {
      display: grid;
      gap: 0.5rem;
      max-width: 520px;
      margin-bottom: 0.8rem;
    }

    .error {
      color: var(--danger);
    }

    ul {
      padding: 0;
      margin: 0;
      display: grid;
      gap: 0.3rem;
    }
  }
</style>
