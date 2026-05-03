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
    gap: 0.5rem;
    align-items: center;
    min-width: 280px;
  }
</style>
