<script lang="ts">
  import type { DemoUser } from '$lib/domains';

  export let users: DemoUser[] = [];
  export let currentUserId = '';

  $: currentUser = users.find((user) => user.id === currentUserId);
  $: activeRole = currentUser?.role === 'employee' ? 'employee' : 'admin';
  $: employeeUser = users.find((user) => user.role === 'employee');
  $: adminUser = users.find((user) => user.role === 'admin') ?? users.find((user) => user.role === 'viewer');
</script>

<div class="m-demo-role-switcher" aria-label="Role switch">
  {#if adminUser}
    <form method="POST" action="/api/switch-role">
      <input type="hidden" name="userId" value={adminUser.id} />
      <input type="hidden" name="returnTo" value="/admin" />
      <button class:active={activeRole === 'admin'} type="submit">Admin</button>
    </form>
  {/if}

  {#if employeeUser}
    <form method="POST" action="/api/switch-role">
      <input type="hidden" name="userId" value={employeeUser.id} />
      <input type="hidden" name="returnTo" value="/employee/report" />
      <button class:active={activeRole === 'employee'} type="submit">Employee</button>
    </form>
  {/if}
</div>

<style lang="scss">
  .m-demo-role-switcher {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 0.375rem;
    width: min(17.5rem, 100%);
    padding: 0.375rem;
    border-radius: 999px;
    background: var(--surface-soft);

    form {
      display: contents;
    }

    button {
      min-height: 2.125rem;
      border: 0;
      border-radius: 999px;
      background: transparent;
      color: var(--text-muted);
      font-size: 0.8125rem;
      font-weight: 500;
      letter-spacing: 0;

      &.active {
        color: white;
        background: var(--admin-primary);
      }

      &:hover:not(.active) {
        color: var(--admin-primary);
        background: color-mix(in srgb, var(--admin-tint) 72%, white);
      }
    }

    @media (max-width: 760px) {
      width: 100%;
    }
  }

  :global(.is-employee) .m-demo-role-switcher button.active {
    background: var(--employee-primary);
  }

  :global(.is-employee) .m-demo-role-switcher button:hover:not(.active) {
    color: var(--employee-primary);
    background: var(--employee-tint);
  }
</style>
