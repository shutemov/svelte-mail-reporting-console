<script lang="ts">
  import OAppShell from '$lib/ui/organisms/OAppShell.svelte';
  import type { UserRole } from '$lib/domains/types';
  import type { LayoutData } from './$types';

  export let data: LayoutData;

  type NavItem = {
    href: string;
    label: string;
    shortLabel?: string;
    hint?: string;
    roles: UserRole[];
  };

  const navItems: NavItem[] = [
    {
      href: '/employee/report',
      label: 'Manual report',
      shortLabel: 'Report',
      hint: 'Source',
      roles: ['employee']
    },
    {
      href: '/employee/reports',
      label: 'Report status',
      shortLabel: 'History',
      hint: 'Calm',
      roles: ['employee']
    },
    {
      href: '/employee/learning',
      label: 'Learning module',
      shortLabel: 'Learning',
      hint: 'Due',
      roles: ['employee']
    },
    {
      href: '/admin',
      label: 'Cockpit',
      shortLabel: 'Dashboard',
      hint: 'Live',
      roles: ['admin', 'viewer']
    },
    {
      href: '/admin/alerts',
      label: 'Prioritize queue',
      shortLabel: 'Queue',
      hint: 'Queue',
      roles: ['admin', 'viewer']
    },
    {
      href: '/admin/simulation',
      label: 'Start simulation',
      shortLabel: 'Simulation',
      hint: 'Load',
      roles: ['admin', 'viewer']
    }
  ];

  $: visibleNavItems = navItems.filter((item) => item.roles.includes(data.user.role));

  $: activeHref = (() => {
    if (!data.currentRouteId) {
      return null;
    }
    const currentRouteId = data.currentRouteId;

    const matched = visibleNavItems
      .filter(
        (item) =>
          currentRouteId === item.href || currentRouteId.startsWith(`${item.href}/`)
      )
      .sort((a, b) => b.href.length - a.href.length);

    return matched[0]?.href ?? null;
  })();
</script>

<OAppShell
  userName={data.user.name}
  userRole={data.user.role}
  users={data.users}
  currentUserId={data.user.id}
  navItems={visibleNavItems}
  {activeHref}
>
  <slot />
</OAppShell>
