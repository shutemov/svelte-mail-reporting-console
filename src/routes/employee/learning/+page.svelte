<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<h1>My learning</h1>

{#if data.assignments.length === 0}
  <p>No learning assignments yet.</p>
{:else}
  <ul class="list">
    {#each data.assignments as item (item.assignment.id)}
      <li>
        <a href={`/employee/learning/${item.assignment.id}`}>{item.module.title}</a>
        <small>{item.assignment.status}</small>
      </li>
    {/each}
  </ul>
{/if}

<style lang="scss">
  .list {
    display: grid;
    gap: 0.5rem;
    padding: 0;
  }
  li {
    list-style: none;
    display: flex;
    justify-content: space-between;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 0.75rem;
  }
</style>
