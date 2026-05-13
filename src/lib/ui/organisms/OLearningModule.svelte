<script lang="ts">
  import { formatLearningStatus } from '$lib/domains/labels';
  import type { LearningAssignmentView } from '$lib/domains';
  import AButton from '$lib/ui/atoms/AButton.svelte';

  export let item: LearningAssignmentView;
  export let formError = '';
</script>

<article class="o-learning-module">
  <section class="learning-card">
    <p class="eyebrow">Follow-up learning</p>
    <h1>{item.module.title}</h1>
    <p class="lede">{item.module.body}</p>
    <div class="progress-track">
      <div class="progress-fill" style={`width:${item.assignment.status === 'completed' ? 100 : 62}%`}></div>
    </div>
    <div class="status-line">
      <span>Status</span>
      <b>{formatLearningStatus(item.assignment.status)}</b>
    </div>
    <div class="status-line">
      <span>Alert</span>
      <b>{item.report.subject}</b>
    </div>

    {#if formError}
      <p class="error">{formError}</p>
    {/if}

    {#if item.assignment.status !== 'completed'}
      <form method="POST">
        <input type="hidden" name="assignmentId" value={item.assignment.id} />
        <AButton type="submit">Mark as completed</AButton>
      </form>
    {/if}
  </section>

  <section class="learning-card next-steps-card">
    <p class="eyebrow">Practical guidance</p>
    <h2>Three checks before acting</h2>
    <ol class="next-steps-list">
      <li><span>01</span><div><b>Check sender identity</b><p>Display name, domain age, reply-to.</p></div></li>
      <li><span>02</span><div><b>Inspect payment urgency</b><p>Pressure language, off-process approval.</p></div></li>
      <li><span>03</span><div><b>Report, do not forward</b><p>Keep suspicious content in workflow.</p></div></li>
    </ol>
  </section>
</article>

<style lang="scss">
  .o-learning-module {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(320px, 0.75fr);
    gap: 0.875rem;

    .learning-card {
      display: grid;
      align-content: start;
      gap: 0.875rem;
      background: var(--surface);
      border-radius: var(--radius);
      padding: 1rem;
    }

    .eyebrow {
      color: var(--text-muted);
      font: 400 0.75rem/1.4 var(--font-mono);
      text-transform: uppercase;
    }

    h1 {
      font-size: 1.625rem;
    }

    .lede {
      color: var(--text-muted);
    }

    .progress-track {
      overflow: hidden;
      height: 0.625rem;
      border-radius: 999px;
      background: var(--surface-soft);
    }

    .progress-fill {
      height: 100%;
      border-radius: inherit;
      background: var(--employee-primary);
    }

    .status-line {
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
        text-transform: capitalize;
      }
    }

    .next-steps-list {
      display: grid;
      gap: 0.5rem;
      padding: 0;
      margin: 0;
      list-style: none;

      li {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr);
        gap: 0.625rem;
        padding: 0.75rem;
        border-radius: var(--radius-sm);
        background: var(--surface-raised);
      }

      li > span {
        display: grid;
        place-items: center;
        min-width: 2rem;
        height: 1.75rem;
        border-radius: 999px;
        background: var(--employee-tint);
        color: var(--employee-primary);
        font-size: 0.75rem;
        font-weight: 500;
      }

      b {
        font-size: 0.875rem;
        font-weight: 500;
      }

      p {
        margin-top: 0.125rem;
        color: var(--text-muted);
        font-size: 0.8125rem;
      }
    }

    .error {
      color: var(--danger);
    }

    @media (max-width: 1000px) {
      grid-template-columns: 1fr;
    }
  }
</style>
