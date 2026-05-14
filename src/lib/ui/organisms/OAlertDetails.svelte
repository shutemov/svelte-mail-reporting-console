<script lang="ts">
  import { enhance } from '$app/forms';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { formatDateTime } from '$lib/common/date-time';
  import { formatAlertStatus, formatRiskyActions } from '$lib/domains/labels';
  import type { AlertDetailsView } from '$lib/domains';
  import AButton from '$lib/ui/atoms/AButton.svelte';
  import AStatusPill from '$lib/ui/atoms/AStatusPill.svelte';
  import MTimelineEvent from '$lib/ui/molecules/MTimelineEvent.svelte';

  export let details: AlertDetailsView;
  export let formError = '';

  $: riskyActions = formatRiskyActions(details.report.riskyActions);
  $: canAssignLearning = details.alert.finalOutcome === 'malicious' && !details.learningAssignment;

  let pendingAction = '';

  const enhanceAlertAction = (action: string): SubmitFunction => {
    return () => {
      pendingAction = action;

      return async ({ update }) => {
        try {
          await update();
        } finally {
          pendingAction = '';
        }
      };
    };
  };

  const enhanceStartInvestigation = enhanceAlertAction('startInvestigation');
  const enhanceResolveAsSafe = enhanceAlertAction('resolveAsSafe');
  const enhanceResolveAsMalicious = enhanceAlertAction('resolveAsMalicious');
  const enhanceCloseAlert = enhanceAlertAction('closeAlert');
  const enhanceAssignLearning = enhanceAlertAction('assignLearning');
  const enhanceNote = enhanceAlertAction('note');
</script>

<section class="o-alert-details">
  <header class="investigation-header">
    <div class="page-title">
      <p class="eyebrow">Alert investigation</p>
      <h1>{details.report.subject}</h1>
      <p>{details.report.sender}</p>
    </div>

    <div class="state-grid" aria-label="Alert state">
      <div class="state-mini">
        <span>Status</span>
        <b>{formatAlertStatus(details.alert.status)}</b>
      </div>
      <div class="state-mini">
        <span>Severity</span>
        <b>{details.alert.severity}</b>
      </div>
      <div class="state-mini">
        <span>Reporter</span>
        <b>{details.reporter.name}</b>
      </div>
      <div class="state-mini">
        <span>Evaluation</span>
        <b>{details.alert.finalOutcome ?? 'Hidden'}</b>
      </div>
    </div>
  </header>

  <div class="detail-layout">
    <div class="main-column">
      <section class="investigation-section">
        <div class="section-head">
          <h2>Evidence summary</h2>
          <div class="meta">
            <AStatusPill status={details.alert.status} />
            <AStatusPill severity={details.alert.severity} />
          </div>
        </div>

        <div class="evidence-grid" aria-label="Evidence summary">
          <article>
            <span>Reason</span>
            <b>{details.report.reason}</b>
          </article>
          <article>
            <span>Risky action</span>
            <b>{riskyActions || 'No action recorded'}</b>
          </article>
          <article>
            <span>Received</span>
            <b>{formatDateTime(details.report.receivedAt)}</b>
          </article>
        </div>

        {#if details.report.messagePreview}
          <div class="mail-frame">
            <div class="mail-head"><b>Message preview</b></div>
            <pre>{details.report.messagePreview}</pre>
          </div>
        {/if}
      </section>

      <section class="timeline-panel">
        <div class="section-head">
          <h2>Investigation timeline</h2>
        </div>
        <ul>
          {#each details.timeline as event (event.id)}
            <MTimelineEvent {event} />
          {/each}
        </ul>
      </section>
    </div>

    <aside class="decision-stack">
      <section class="decision-box" aria-label="Investigation control panel">
        <p class="eyebrow">Resolve alert</p>
        <h2>Make the triage call from visible evidence only.</h2>

        {#if formError}
          <p class="error">{formError}</p>
        {/if}

        <div class="decision-actions" aria-label="Resolve alert">
          <form method="POST" action="?/command" use:enhance={enhanceStartInvestigation}>
            <input type="hidden" name="command" value="startInvestigation" />
            <AButton
              type="submit"
              variant="secondary"
              disabled={pendingAction !== ''}
              loading={pendingAction === 'startInvestigation'}
            >
              Start investigation
            </AButton>
          </form>
          <form method="POST" action="?/command" use:enhance={enhanceResolveAsSafe}>
            <input type="hidden" name="command" value="resolveAsSafe" />
            <AButton
              type="submit"
              variant="secondary"
              disabled={pendingAction !== ''}
              loading={pendingAction === 'resolveAsSafe'}
            >
              Resolve safe
            </AButton>
          </form>
          <form method="POST" action="?/command" use:enhance={enhanceResolveAsMalicious}>
            <input type="hidden" name="command" value="resolveAsMalicious" />
            <AButton
              type="submit"
              variant="danger"
              disabled={pendingAction !== ''}
              loading={pendingAction === 'resolveAsMalicious'}
            >
              Resolve malicious
            </AButton>
          </form>
          <form method="POST" action="?/command" use:enhance={enhanceCloseAlert}>
            <input type="hidden" name="command" value="closeAlert" />
            <AButton
              type="submit"
              variant="secondary"
              disabled={pendingAction !== ''}
              loading={pendingAction === 'closeAlert'}
            >
              Close alert
            </AButton>
          </form>
        </div>

        <div class="evaluation-line" aria-live="polite">
          <span>Simulation evaluation</span>
          <b>{details.alert.finalOutcome ? `${details.alert.finalOutcome} label revealed` : 'Hidden during triage'}</b>
        </div>

        <form method="POST" action="?/assignLearning" class="assign" use:enhance={enhanceAssignLearning}>
          <input type="hidden" name="moduleId" value="phishing-basics" />
          <AButton
            type="submit"
            disabled={pendingAction !== '' || !canAssignLearning}
            loading={pendingAction === 'assignLearning'}
          >
            Assign follow-up learning
          </AButton>
        </form>
      </section>

      <section class="decision-box">
        <p class="eyebrow">Investigation note</p>
        <form method="POST" action="?/note" class="note" use:enhance={enhanceNote}>
          <textarea name="body" rows="4" placeholder="Add evidence, rationale, or handoff note"></textarea>
          <AButton type="submit" variant="secondary" disabled={pendingAction !== ''} loading={pendingAction === 'note'}>
            Add note
          </AButton>
        </form>
      </section>
    </aside>
  </div>
</section>

<style lang="scss">
  .o-alert-details {
    display: grid;
    gap: 0.875rem;

    > .investigation-header {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 1rem;
      align-items: center;
      padding: 0.875rem 1rem;
      border-radius: var(--radius-md);
      background: var(--surface);
    }

    .page-title {
      display: grid;
      gap: 0.375rem;
      min-width: 0;

      > .eyebrow {
        color: var(--text-muted);
        font: 400 0.75rem/1.4 var(--font-mono);
        text-transform: uppercase;
      }

      > h1 {
        font-size: 1.625rem;
        line-height: 1.12;
      }

      > p {
        color: var(--text-muted);
        font-size: 0.875rem;
      }
    }

    .state-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(7.5rem, 1fr));
      gap: 0.5rem;
    }

    .state-mini {
      padding: 0.75rem;
      border-radius: var(--radius-sm);
      background: var(--surface-raised);

      span,
      b {
        display: block;
      }

      span {
        color: var(--text-muted);
        font: 400 0.6875rem/1.4 var(--font-mono);
        text-transform: uppercase;
      }

      b {
        margin-top: 0.25rem;
        font-size: 0.875rem;
        font-weight: 500;
        text-transform: capitalize;
      }
    }

    .detail-layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(320px, 0.42fr);
      gap: 0.875rem;
      align-items: start;
    }

    .main-column,
    .decision-stack {
      display: grid;
      gap: 0.875rem;
    }

    .decision-stack {
      position: sticky;
      top: 5rem;
    }

    .investigation-section,
    .timeline-panel,
    .decision-box {
      padding: 1rem;
      border-radius: var(--radius);
      background: var(--surface);
    }

    .section-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 0.875rem;

      h2 {
        font-size: 1.375rem;
      }
    }

    .meta,
    .decision-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .evidence-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0.5rem;

      article {
        min-height: 5.75rem;
        padding: 0.875rem;
        border-radius: var(--radius-sm);
        background: var(--surface-raised);
      }

      span,
      b {
        display: block;
      }

      span {
        color: var(--text-muted);
        font: 400 0.6875rem/1.4 var(--font-mono);
        text-transform: uppercase;
      }

      b {
        margin-top: 0.375rem;
        font-size: 0.875rem;
        font-weight: 500;
        text-transform: capitalize;
      }
    }

    .mail-frame {
      overflow: hidden;
      margin-top: 0.875rem;
      border-radius: var(--radius-sm);
      background: var(--surface-raised);

      .mail-head {
        padding: 0.75rem;
        border-bottom: 1px solid var(--border-soft);
      }

      pre {
        margin: 0;
        white-space: pre-wrap;
        padding: 0.875rem;
        color: var(--text-soft);
        font-family: var(--font-body);
      }
    }

    ul {
      display: grid;
      gap: 0.5rem;
      padding: 0;
      margin: 0;
    }

    .decision-box {
      display: grid;
      gap: 0.875rem;

      > .eyebrow {
        color: var(--text-muted);
        font: 400 0.75rem/1.4 var(--font-mono);
        text-transform: uppercase;
      }

      > h2 {
        font-size: 1.25rem;
      }
    }

    .decision-actions {
      align-items: stretch;

      form {
        display: flex;
      }
    }

    .evaluation-line {
      padding: 0.875rem;
      border-radius: var(--radius-sm);
      background: var(--surface-raised);

      span,
      b {
        display: block;
      }

      span {
        color: var(--text-muted);
        font: 400 0.6875rem/1.4 var(--font-mono);
        text-transform: uppercase;
      }

      b {
        margin-top: 0.25rem;
        font-size: 0.875rem;
        font-weight: 500;
      }
    }

    .note,
    .assign {
      display: grid;
      gap: 0.5rem;
    }

    textarea {
      width: 100%;
      resize: vertical;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 0.75rem;
      background: white;
    }

    .error {
      color: var(--danger);
      font-size: 0.875rem;
    }

    @media (max-width: 1180px) {
      > .investigation-header,
      .detail-layout {
        grid-template-columns: 1fr;
      }

      .state-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .decision-stack {
        position: static;
      }
    }

    @media (max-width: 760px) {
      .state-grid,
      .evidence-grid {
        grid-template-columns: 1fr;
      }
    }
  }
</style>
