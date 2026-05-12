import type { Meta, StoryObj } from '@storybook/svelte';

import MSimulationMetricCard from './MSimulationMetricCard.svelte';

const meta = {
  title: 'Molecules/MSimulationMetricCard',
  component: MSimulationMetricCard,
  args: {
    label: 'Incoming reports',
    value: 18,
    hint: 'Generated in the last 15 minutes'
  },
  argTypes: {
    label: {
      control: 'text'
    },
    value: {
      control: 'text'
    },
    hint: {
      control: 'text'
    }
  }
} satisfies Meta<typeof MSimulationMetricCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutHint: Story = {
  args: {
    hint: ''
  }
};
