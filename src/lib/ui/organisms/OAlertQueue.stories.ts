import type { Meta, StoryObj } from '@storybook/svelte';

import OAlertQueue from './OAlertQueue.svelte';
import { storyAlertQueue } from '$lib/ui/storybook/fixtures';

const meta = {
  title: 'Organisms/OAlertQueue',
  component: OAlertQueue,
  args: {
    items: storyAlertQueue.slice(0, 6),
    filters: {},
    totalItems: storyAlertQueue.length
  },
  argTypes: {
    items: {
      control: 'object'
    },
    filters: {
      control: 'object'
    },
    totalItems: {
      control: 'number'
    }
  }
} satisfies Meta<typeof OAlertQueue>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filtered: Story = {
  args: {
    items: storyAlertQueue.filter((item) => item.alert.severity === 'high'),
    filters: {
      severity: 'high'
    },
    totalItems: storyAlertQueue.length
  }
};

export const LongQueue: Story = {
  args: {
    items: storyAlertQueue,
    totalItems: storyAlertQueue.length
  }
};

export const Empty: Story = {
  args: {
    items: [],
    filters: {
      status: 'closed'
    },
    totalItems: storyAlertQueue.length
  }
};
