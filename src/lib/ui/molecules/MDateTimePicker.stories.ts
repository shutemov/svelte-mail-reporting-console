import type { Meta, StoryObj } from '@storybook/svelte';

import MDateTimePicker from './MDateTimePicker.svelte';

const meta = {
  title: 'Molecules/MDateTimePicker',
  component: MDateTimePicker,
  args: {
    name: 'receivedAt',
    value: '2026-05-12T14:30'
  },
  argTypes: {
    name: {
      control: 'text'
    },
    value: {
      control: 'text'
    }
  }
} satisfies Meta<typeof MDateTimePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithValue: Story = {};

export const Empty: Story = {
  args: {
    value: ''
  }
};
