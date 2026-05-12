import type { Meta, StoryObj } from '@storybook/svelte';

import MAnimatedMetricValue from './MAnimatedMetricValue.svelte';

const meta = {
  title: 'Molecules/MAnimatedMetricValue',
  component: MAnimatedMetricValue,
  args: {
    value: 42,
    ariaLabel: 'Open alerts: 42'
  },
  argTypes: {
    value: {
      control: 'text'
    },
    ariaLabel: {
      control: 'text'
    }
  }
} satisfies Meta<typeof MAnimatedMetricValue>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NumberValue: Story = {};

export const TextValue: Story = {
  args: {
    value: '94%',
    ariaLabel: 'Decision accuracy: 94%'
  }
};
