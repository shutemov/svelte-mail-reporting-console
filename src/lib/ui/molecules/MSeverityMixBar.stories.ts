import type { Meta, StoryObj } from '@storybook/svelte';

import MSeverityMixBar from './MSeverityMixBar.svelte';

const meta = {
  title: 'Molecules/MSeverityMixBar',
  component: MSeverityMixBar,
  args: {
    mix: {
      low: 35,
      medium: 35,
      high: 20,
      critical: 10
    }
  },
  argTypes: {
    mix: {
      control: 'object'
    }
  }
} satisfies Meta<typeof MSeverityMixBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Balanced: Story = {};

export const UnderLimit: Story = {
  args: {
    mix: {
      low: 20,
      medium: 30,
      high: 15,
      critical: 5
    }
  }
};

export const OverLimit: Story = {
  args: {
    mix: {
      low: 30,
      medium: 45,
      high: 30,
      critical: 10
    }
  }
};
