<script lang="ts">
  import MDemoRoleSwitcher from '$lib/ui/molecules/MDemoRoleSwitcher.svelte';
  import type { DemoUser, UserRole } from '$lib/domains/types';

  type ShellNavItem = {
    href: string;
    label: string;
    shortLabel?: string;
    hint?: string;
  };

  export let userName = '';
  export let userRole: UserRole = 'employee';
  export let users: DemoUser[] = [];
  export let currentUserId = '';
  export let currentPath = '/';
  export let navItems: ShellNavItem[] = [];
  export let activeHref: string | null = null;

  $: mode = userRole === 'employee' ? 'employee' : 'admin';
  $: workspaceLabel = mode === 'employee' ? 'Employee workspace' : 'Admin workspace';
  $: organizationLabel = mode === 'employee' ? 'Secure reporting' : 'Acme Financial SOC';
  $: navLabel = mode === 'employee' ? 'Employee loop' : 'Admin demo flow';
  $: shellClass = `o-app-shell is-${mode}`;

  const getNavHint = (item: ShellNavItem) => {
    if (item.hint) {
      return item.hint;
    }

    if (item.href.includes('/simulation')) {
      return 'Load';
    }
    if (item.href.includes('/alerts')) {
      return 'Queue';
    }
    if (item.href.includes('/learning')) {
      return 'Due';
    }
    if (item.href.includes('/reports')) {
      return 'Calm';
    }
    if (item.href.includes('/report')) {
      return 'Source';
    }
    return 'Live';
  };
</script>

<main class={shellClass}>
  <aside class="rail" aria-label="Primary navigation">
    <a class="brand" href={mode === 'employee' ? '/employee/report' : '/admin'}>
      <span class="mark" aria-hidden="true">SM</span>
      <span>
        <strong>Suspicious Mail</strong>
        <small>Reporting Console</small>
      </span>
    </a>

    <div class="role-card">
      <span>{workspaceLabel}</span>
      <b>{userName}</b>
      <small>{userRole}</small>
    </div>

    <nav class="nav-group" aria-label={navLabel}>
      <div class="nav-label">{navLabel}</div>
      {#each navItems as item (item.href)}
        <a
          class="nav-btn"
          href={item.href}
          class:active={activeHref === item.href}
          aria-current={activeHref === item.href ? 'page' : undefined}
        >
          <span>{item.label}</span>
          <small>{getNavHint(item)}</small>
        </a>
      {/each}
    </nav>

    <div class="rail-footer">
      <b>Simulation evaluation</b>
      <span>Ground truth stays hidden during triage and appears only after resolution.</span>
    </div>
  </aside>

  <section class="workspace">
    <header class="topbar">
      <div class="context-line">
        <span class="mode-pill">{workspaceLabel}</span>
        <b>{organizationLabel}</b>
        <span>/ inbound-mail-demo</span>
      </div>

      <MDemoRoleSwitcher {users} {currentUserId} returnTo={currentPath} />
    </header>

    <nav class="mobile-tabs" aria-label="Mobile navigation">
      {#each navItems as item (item.href)}
        <a
          class="nav-btn"
          href={item.href}
          class:active={activeHref === item.href}
          aria-current={activeHref === item.href ? 'page' : undefined}
        >
          {item.shortLabel ?? item.label}
        </a>
      {/each}
    </nav>

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

    > .rail {
      position: sticky;
      top: 0;
      height: 100vh;
      padding: 1.375rem;
      border-inline-end: 1px solid var(--border-soft);
      background: var(--surface);
      display: flex;
      flex-direction: column;
      gap: 1.5rem;

      > .brand {
        min-height: 2.75rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: var(--admin-primary-strong);
        text-decoration: none;

        > .mark {
          width: 2.25rem;
          height: 2.25rem;
          display: grid;
          place-items: center;
          border-radius: 0.75rem;
          background: var(--admin-primary);
          color: white;
          font: 500 0.8125rem/1 var(--font-mono);
        }

        strong,
        small {
          display: block;
        }

        strong {
          color: currentColor;
          font-size: 0.9375rem;
          font-weight: 500;
          line-height: 1.2;
        }

        small {
          color: color-mix(in oklab, currentColor 64%, var(--text-muted));
          font-size: 0.75rem;
          line-height: 1.3;
        }
      }

      > .role-card,
      > .rail-footer {
        padding: 1rem;
        border-radius: var(--radius);
        background: var(--surface-raised);
      }

      > .role-card {
        display: grid;
        gap: 0.25rem;

        span {
          color: var(--text-muted);
          font: 400 0.6875rem/1.4 var(--font-mono);
          text-transform: uppercase;
        }

        b {
          font-size: 0.875rem;
          font-weight: 500;
        }

        small {
          color: var(--text-muted);
          font-size: 0.75rem;
        }
      }

      > .rail-footer {
        margin-top: auto;

        b {
          display: block;
          font-size: 0.8125rem;
          font-weight: 500;
        }

        span {
          display: block;
          margin-top: 0.25rem;
          color: var(--text-muted);
          font-size: 0.75rem;
          line-height: 1.45;
        }
      }
    }

    > .workspace {
      min-width: 0;
      display: grid;
      align-content: start;
      background:
        linear-gradient(180deg, rgba(225, 239, 255, 1), rgba(255, 255, 255, 0) 360px),
        var(--bg);

      > .topbar {
        position: sticky;
        top: 0;
        z-index: 5;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1.25rem;
        flex-wrap: wrap;
        min-height: 4rem;
        padding: 0.875rem clamp(1.25rem, 3vw, 2.25rem);
        border-bottom: 1px solid var(--border-soft);
        background: rgba(225, 239, 255, 0.96);
        backdrop-filter: blur(18px);

        > .context-line {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          min-width: 0;
          color: var(--text-muted);
          font-size: 0.875rem;

          > b {
            color: var(--text);
            font-weight: 500;
          }
        }
      }

      > .mobile-tabs {
        display: none;
      }

      > .page-content {
        display: grid;
        align-content: start;
        gap: 1rem;
        width: min(100%, var(--content-max-width));
        padding: clamp(1.125rem, 3vw, 2.25rem);
      }
    }

    &.is-employee {
      > .rail > .brand {
        color: var(--employee-primary-strong);

        > .mark {
          background: var(--employee-primary);
        }
      }

      > .workspace {
        background:
          linear-gradient(180deg, rgba(237, 248, 242, 0.98), rgba(255, 255, 255, 0) 360px),
          var(--bg);

        > .topbar {
          background: rgba(237, 248, 242, 0.94);
        }
      }
    }

    @media (max-width: 1180px) {
      grid-template-columns: 1fr;

      > .rail {
        display: none;
      }

      > .workspace {
        > .topbar {
          position: static;
        }

        > .mobile-tabs {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding: 0.75rem 1.125rem 0;
          scrollbar-width: none;
        }
      }
    }
  }

  .nav-group {
    display: grid;
    gap: 0.375rem;
  }

  .nav-label {
    margin: 0.5rem 0.625rem 0.25rem;
    color: var(--text-muted);
    font: 400 0.6875rem/1.4 var(--font-mono);
    letter-spacing: 0;
    text-transform: uppercase;
  }

  .nav-btn {
    min-height: 2.625rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.625rem;
    padding: 0.625rem 0.75rem;
    color: var(--text-soft);
    background: transparent;
    border-radius: var(--radius-sm);
    text-align: start;
    text-decoration: none;

    &:hover,
    &.active {
      color: var(--accent);
      background: var(--admin-tint);
    }

    small {
      color: var(--text-muted);
      font-size: 0.75rem;
      white-space: nowrap;
    }
  }

  .is-employee .nav-btn {
    &:hover,
    &.active {
      color: var(--employee-primary);
      background: var(--employee-tint);
    }
  }

  .mode-pill {
    display: inline-flex;
    align-items: center;
    min-height: 1.75rem;
    padding: 0.3125rem 0.625rem;
    border-radius: 999px;
    background: var(--admin-tint);
    color: var(--admin-primary);
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
  }

  .is-employee .mode-pill {
    background: var(--employee-tint);
    color: var(--employee-primary);
  }
</style>
