import type { Meta, StoryObj } from '@storybook/svelte';

import MFieldExample from './__stories__/MFieldExample.svelte';

const meta = {
  title: 'Molecules/MField',
  component: MFieldExample,
  args: {
    label: 'Sender address',
    error: '',
    value: 'billing@example-payments.net',
    placeholder: 'sender@example.com'
  },
  argTypes: {
    label: {
      control: 'text'
    },
    error: {
      control: 'text'
    },
    value: {
      control: 'text'
    },
    placeholder: {
      control: 'text'
    }
  }
} satisfies Meta<typeof MFieldExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: {
    value: '',
    error: 'Sender address is required.'
  }
};
