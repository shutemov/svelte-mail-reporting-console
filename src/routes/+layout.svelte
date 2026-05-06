<script lang="ts">
  import OAppShell from '$lib/ui/organisms/OAppShell.svelte';
  import type { UserRole } from '$lib/domains/types';
  import type { LayoutData } from './$types';

  export let data: LayoutData;

  type NavItem = {
    href: string;
    label: string;
    roles: UserRole[];
  };

  const navItems: NavItem[] = [
    {
      href: '/employee/report',
      label: 'Report mail',
      roles: ['employee']
    },
    {
      href: '/employee/reports',
      label: 'My reports',
      roles: ['employee']
    },
    {
      href: '/employee/learning',
      label: 'My learning',
      roles: ['employee']
    },
    {
      href: '/admin',
      label: 'Admin dashboard',
      roles: ['admin', 'viewer']
    },
    {
      href: '/admin/alerts',
      label: 'Alert queue',
      roles: ['admin', 'viewer']
    },
    {
      href: '/admin/simulation',
      label: 'Simulation',
      roles: ['admin', 'viewer']
    }
  ];

  const visibleNavItems = navItems.filter((item) => item.roles.includes(data.user.role));

  const getActiveHref = (): string | null => {
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
  };
</script>

<OAppShell
  userName={data.user.name}
  userRole={data.user.role}
  users={data.users}
  currentUserId={data.user.id}
  currentPath={data.currentPath}
  navItems={visibleNavItems}
  activeHref={getActiveHref()}
>
  <slot />
</OAppShell>
