import type { Meta, StoryObj } from '@storybook/svelte';

import OSimulationControlPanel from './OSimulationControlPanel.svelte';
import { storySimulationSession } from '$lib/ui/storybook/fixtures';

const meta = {
  title: 'Organisms/OSimulationControlPanel',
  component: OSimulationControlPanel,
  args: {
    session: storySimulationSession,
    formError: ''
  },
  argTypes: {
    session: {
      control: 'object'
    },
    formError: {
      control: 'text'
    }
  }
} satisfies Meta<typeof OSimulationControlPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Running: Story = {};

export const Paused: Story = {
  args: {
    session: {
      ...storySimulationSession,
      mode: 'paused',
      lastGeneratedAt: undefined
    }
  }
};

export const WithError: Story = {
  args: {
    formError: 'Simulation could not be started while reset is in progress.'
  }
};
