import type { Meta, StoryObj } from '@storybook/svelte';

import AStatusPill from './AStatusPill.svelte';

const meta = {
  title: 'Atoms/AStatusPill',
  component: AStatusPill,
  args: {
    status: 'new',
    severity: null
  },
  argTypes: {
    status: {
      control: 'select',
      options: [null, 'new', 'investigating', 'resolved_safe', 'resolved_malicious', 'closed']
    },
    severity: {
      control: 'select',
      options: [null, 'low', 'medium', 'high', 'critical']
    }
  }
} satisfies Meta<typeof AStatusPill>;

export default meta;

type Story = StoryObj<typeof meta>;

export const New: Story = {};

export const Investigating: Story = {
  args: {
    status: 'investigating'
  }
};

export const ResolvedSafe: Story = {
  args: {
    status: 'resolved_safe'
  }
};

export const HighSeverity: Story = {
  args: {
    status: null,
    severity: 'high'
  }
};

export const CriticalSeverity: Story = {
  args: {
    status: null,
    severity: 'critical'
  }
};
