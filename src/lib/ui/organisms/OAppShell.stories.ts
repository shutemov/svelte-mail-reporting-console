import type { Meta, StoryObj } from '@storybook/svelte';

import OAppShellExample from './__stories__/OAppShellExample.svelte';
import { storyNavItems, storyUsers } from '$lib/ui/storybook/fixtures';

const meta = {
  title: 'Organisms/OAppShell',
  component: OAppShellExample,
  args: {
    userName: 'Alex Morgan',
    userRole: 'admin',
    users: storyUsers,
    currentUserId: 'admin-1',
    navItems: storyNavItems,
    activeHref: '/admin'
  },
  argTypes: {
    userName: {
      control: 'text'
    },
    userRole: {
      control: 'select',
      options: ['employee', 'admin', 'viewer']
    },
    users: {
      control: 'object'
    },
    currentUserId: {
      control: 'select',
      options: storyUsers.map((user) => user.id)
    },
    navItems: {
      control: 'object'
    },
    activeHref: {
      control: 'select',
      options: storyNavItems.map((item) => item.href)
    }
  },
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof OAppShellExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AdminWorkspace: Story = {};

export const EmployeeWorkspace: Story = {
  args: {
    userName: 'Maya Chen',
    userRole: 'employee',
    currentUserId: 'employee-1',
    activeHref: '/employee/report',
    navItems: [
      { href: '/employee/report', label: 'Report suspicious mail', shortLabel: 'Report', hint: 'Source' },
      { href: '/employee/reports', label: 'Reports history', shortLabel: 'Reports', hint: 'Calm' },
      { href: '/employee/learning', label: 'Learning', shortLabel: 'Learn', hint: 'Due' }
    ]
  }
};
