<script lang="ts">
  import MDemoRoleSwitcher from '$lib/ui/molecules/MDemoRoleSwitcher.svelte';
  import type { DemoUser } from '$lib/domains/types';

  type ShellNavItem = {
    href: string;
    label: string;
  };

  export let userName = '';
  export let userRole = '';
  export let users: DemoUser[] = [];
  export let currentUserId = '';
  export let currentPath = '/';
  export let navItems: ShellNavItem[] = [];
  export let activeHref: string | null = null;
</script>

<main class="o-app-shell">
  <aside class="sidebar">
    <h1 class="brand">Mail Guard</h1>
    <p class="tagline">Suspicious mail reporting console</p>

    <nav class="nav">
      {#each navItems as item (item.href)}
        <a
          href={item.href}
          class:active={activeHref === item.href}
          aria-current={activeHref === item.href ? 'page' : undefined}
        >
          {item.label}
        </a>
      {/each}
    </nav>
  </aside>

  <section class="workspace">
    <header class="topbar">
      <div class="identity">
        <strong>{userName}</strong>
        <small>({userRole})</small>
      </div>
      <MDemoRoleSwitcher {users} {currentUserId} returnTo={currentPath} />
    </header>

    <div class="page-content">
      <slot />
    </div>
  </section>
</main>

<style lang="scss">
  .o-app-shell {
    display: grid;
    grid-template-columns: var(--sidebar-width) minmax(0, 1fr);
    min-height: 100vh;

    > .sidebar {
      background: linear-gradient(160deg, #173d6f, #0f2f57);
      color: #edf4ff;
      padding: var(--space-5);

      > .brand {
        font-size: 2rem;
        line-height: 1.05;
      }

      > .tagline {
        color: #bfd0ec;
        margin-top: var(--space-2);
        max-width: 11.5rem;
        font-size: 1rem;
      }

      > .nav {
        margin-top: var(--space-6);
        display: grid;
        gap: var(--space-2);

        a {
          text-decoration: none;
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid transparent;
          transition:
            background 120ms ease,
            border-color 120ms ease,
            transform 120ms ease;

          &:hover {
            background: rgba(255, 255, 255, 0.14);
          }

          &.active {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.35);
            font-weight: 700;
            transform: translateX(2px);
          }
        }
      }
    }

    > .workspace {
      padding: var(--space-5) var(--space-6);
      display: grid;
      align-content: start;
      gap: var(--space-5);

      > .topbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--space-4);
        flex-wrap: wrap;

        > .identity {
          display: inline-flex;
          align-items: baseline;
          gap: var(--space-2);
        }
      }

      > .page-content {
        display: grid;
        align-content: start;
        gap: var(--space-5);
        width: min(100%, var(--content-max-width));
      }
    }

    @media (max-width: 900px) {
      grid-template-columns: 1fr;

      > .workspace {
        padding: var(--space-4);
      }
    }
  }
</style>
