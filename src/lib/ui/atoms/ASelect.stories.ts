import type { Meta, StoryObj } from '@storybook/svelte';

import ASelect from './ASelect.svelte';

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'investigating', label: 'Investigating' },
  { value: 'resolved_safe', label: 'Resolved safe' },
  { value: 'resolved_malicious', label: 'Resolved malicious' },
  { value: 'closed', label: 'Closed' }
];

const meta = {
  title: 'Atoms/ASelect',
  component: ASelect,
  args: {
    name: 'status',
    options: statusOptions,
    value: ''
  },
  argTypes: {
    name: {
      control: 'text'
    },
    options: {
      control: 'object'
    },
    value: {
      control: 'select',
      options: ['', ...statusOptions.map((option) => option.value)]
    }
  }
} satisfies Meta<typeof ASelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: {
    value: 'investigating'
  }
};
