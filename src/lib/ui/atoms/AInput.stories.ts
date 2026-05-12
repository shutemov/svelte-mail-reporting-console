import type { Meta, StoryObj } from '@storybook/svelte';

import AInput from './AInput.svelte';

const meta = {
  title: 'Atoms/AInput',
  component: AInput,
  args: {
    name: 'sender',
    value: '',
    type: 'text',
    placeholder: 'sender@example.com',
    required: false
  },
  argTypes: {
    name: {
      control: 'text'
    },
    value: {
      control: 'text'
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'date', 'datetime-local']
    },
    placeholder: {
      control: 'text'
    },
    required: {
      control: 'boolean'
    }
  }
} satisfies Meta<typeof AInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Text: Story = {};

export const Email: Story = {
  args: {
    name: 'email',
    type: 'email',
    value: 'security@example.com',
    placeholder: 'security@example.com',
    required: true
  }
};

export const DateTime: Story = {
  args: {
    name: 'receivedAt',
    type: 'datetime-local',
    value: '2026-05-12T09:30'
  }
};
