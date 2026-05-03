<script lang="ts">
  import type { LearningAssignmentView } from '$lib/domains/types';
  import AButton from '$lib/ui/atoms/AButton.svelte';

  export let item: LearningAssignmentView;
  export let formError = '';
</script>

<article class="o-learning-module">
  <h1>{item.module.title}</h1>
  <p>{item.module.body}</p>
  <p><strong>Status:</strong> {item.assignment.status}</p>
  <p><strong>Alert:</strong> {item.report.subject}</p>

  {#if formError}
    <p class="error">{formError}</p>
  {/if}

  {#if item.assignment.status !== 'completed'}
    <form method="POST">
      <input type="hidden" name="assignmentId" value={item.assignment.id} />
      <AButton type="submit">Mark as completed</AButton>
    </form>
  {/if}
</article>

<style lang="scss">
  .o-learning-module {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1rem;
    max-width: 720px;

    .error {
      color: var(--danger);
    }
  }
</style>
