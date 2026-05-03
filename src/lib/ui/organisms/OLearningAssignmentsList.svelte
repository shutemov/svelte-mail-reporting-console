<script lang="ts">
  import type { LearningAssignmentView } from '$lib/domains/types';
  import MPageHeading from '$lib/ui/molecules/MPageHeading.svelte';

  export let assignments: LearningAssignmentView[] = [];
</script>

<section class="o-learning-assignments-list">
  <MPageHeading title="My learning" />

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
    gap: var(--space-4);

    > .empty {
      color: var(--text-muted);
    }

    > .list {
      display: grid;
      gap: var(--space-2);
      padding: 0;
      margin: 0;

      li {
        list-style: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--space-3);
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        padding: var(--space-3);
      }
    }
  }
</style>
