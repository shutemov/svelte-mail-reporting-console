import type { Meta, StoryObj } from '@storybook/svelte';

import MMetricCard from './MMetricCard.svelte';

const meta = {
  title: 'Molecules/MMetricCard',
  component: MMetricCard,
  args: {
    label: 'Open alerts',
    value: 42
  },
  argTypes: {
    label: {
      control: 'text'
    },
    value: {
      control: 'text'
    }
  }
} satisfies Meta<typeof MMetricCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Percentage: Story = {
  args: {
    label: 'Learning completion',
    value: '86%'
  }
};
