import type { Meta, StoryObj } from '@storybook/svelte';

import MDemoRoleSwitcher from './MDemoRoleSwitcher.svelte';
import type { DemoUser } from '$lib/domains/types';

const users: DemoUser[] = [
  {
    id: 'admin-1',
    role: 'admin',
    name: 'Alex Morgan'
  },
  {
    id: 'employee-1',
    role: 'employee',
    name: 'Maya Chen',
    persona: 'finance_target'
  }
];

const meta = {
  title: 'Molecules/MDemoRoleSwitcher',
  component: MDemoRoleSwitcher,
  args: {
    users,
    currentUserId: 'admin-1'
  },
  argTypes: {
    users: {
      control: 'object'
    },
    currentUserId: {
      control: 'select',
      options: users.map((user) => user.id)
    }
  }
} satisfies Meta<typeof MDemoRoleSwitcher>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AdminActive: Story = {};

export const EmployeeActive: Story = {
  args: {
    currentUserId: 'employee-1'
  }
};
