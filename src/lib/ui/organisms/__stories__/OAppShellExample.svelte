<script lang="ts">
  import OAppShell from '$lib/ui/organisms/OAppShell.svelte';
  import ODashboardSummary from '$lib/ui/organisms/ODashboardSummary.svelte';
  import MPageHeading from '$lib/ui/molecules/MPageHeading.svelte';
  import { storyDashboardSummary, storyNavItems, storyUsers } from '$lib/ui/storybook/fixtures';
  import type { DemoUser, UserRole } from '$lib/domains/types';

  export let userName = 'Alex Morgan';
  export let userRole: UserRole = 'admin';
  export let users: DemoUser[] = storyUsers;
  export let currentUserId = 'admin-1';
  export let navItems = storyNavItems;
  export let activeHref: string | null = '/admin';
</script>

<OAppShell {userName} {userRole} {users} {currentUserId} {navItems} {activeHref}>
  <MPageHeading
    title="Security operations console"
    subtitle="Review suspicious mail reports, triage alerts, and monitor simulation pressure."
  />
  <ODashboardSummary summary={storyDashboardSummary} />
</OAppShell>
