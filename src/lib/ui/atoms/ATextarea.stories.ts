import type { Meta, StoryObj } from '@storybook/svelte';

import ATextarea from './ATextarea.svelte';

const meta = {
  title: 'Atoms/ATextarea',
  component: ATextarea,
  args: {
    name: 'reason',
    value: '',
    rows: 4,
    placeholder: 'Describe what looked suspicious'
  },
  argTypes: {
    name: {
      control: 'text'
    },
    value: {
      control: 'text'
    },
    rows: {
      control: {
        type: 'number',
        min: 2,
        max: 12
      }
    },
    placeholder: {
      control: 'text'
    }
  }
} satisfies Meta<typeof ATextarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithValue: Story = {
  args: {
    value: 'The sender address does not match our vendor domain and the link points to an unknown host.'
  }
};
