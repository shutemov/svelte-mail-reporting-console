<script lang="ts">
  import AButton from '$lib/ui/atoms/AButton.svelte';
  import ASelect from '$lib/ui/atoms/ASelect.svelte';
  import type { DemoUser } from '$lib/domains/types';

  export let users: DemoUser[] = [];
  export let currentUserId = '';
  export let returnTo = '/';
</script>

<form method="POST" action="/api/switch-role" class="m-demo-role-switcher">
  <input type="hidden" name="returnTo" value={returnTo} />
  <ASelect name="userId" value={currentUserId}>
    {#each users as user (user.id)}
      <option value={user.id}>{user.name} ({user.role})</option>
    {/each}
  </ASelect>
  <AButton type="submit" variant="secondary">Switch</AButton>
</form>

<style lang="scss">
  .m-demo-role-switcher {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: min(100%, 20rem);

    :global(.a-select) {
      min-height: 2.5rem;
      border-color: transparent;
      border-radius: 999px;
      background-color: var(--surface);
      font-size: 0.875rem;
    }

    :global(.a-button) {
      flex: 0 0 auto;
    }

    @media (max-width: 760px) {
      width: 100%;
      align-items: stretch;

      :global(.a-select) {
        min-width: 0;
      }
    }
  }
</style>
