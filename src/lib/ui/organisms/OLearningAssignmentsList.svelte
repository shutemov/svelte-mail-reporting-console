<script lang="ts">
  import type { LearningAssignmentView } from '$lib/domains/types';

  export let assignments: LearningAssignmentView[] = [];
</script>

<section class="o-learning-assignments-list">
  <header class="page-header">
    <div>
      <p>Follow-up learning</p>
      <h1>Complete assigned guidance.</h1>
      <span>Short modules appear only after a confirmed risky action needs reinforcement.</span>
    </div>
    <div class="meta">
      <span>Assigned after risky action</span>
      <span>Updates metrics</span>
    </div>
  </header>

  {#if assignments.length === 0}
    <p class="empty">No learning assignments yet.</p>
  {:else}
    <ul class="list">
      {#each assignments as item (item.assignment.id)}
        <li>
          <a href={`/employee/learning/${item.assignment.id}`}>{item.module.title}</a>
          <small>{item.assignment.status}</small>
        </li>
      {/each}
    </ul>
  {/if}
</section>

<style lang="scss">
  .o-learning-assignments-list {
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
      padding: 0.75rem;
      border-radius: var(--radius);
      background: var(--surface);

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
        text-transform: capitalize;
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
