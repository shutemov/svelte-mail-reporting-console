import type { Meta, StoryObj } from '@storybook/svelte';

import OSimulationFlowSettings from './OSimulationFlowSettings.svelte';
import { storySimulationConfig } from '$lib/ui/storybook/fixtures';

const meta = {
  title: 'Organisms/OSimulationFlowSettings',
  component: OSimulationFlowSettings,
  args: {
    config: storySimulationConfig,
    form: null
  },
  argTypes: {
    config: {
      control: 'object'
    },
    form: {
      control: 'object'
    }
  }
} satisfies Meta<typeof OSimulationFlowSettings>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SavedConfig: Story = {};

export const WithValidationErrors: Story = {
  args: {
    form: {
      values: {
        ratePerMinute: 30,
        maliciousRatio: 1.4,
        severityMix: {
          low: 40,
          medium: 40,
          high: 30,
          critical: 10
        }
      },
      fieldErrors: {
        ratePerMinute: 'Use a value from 1 to 20.',
        maliciousRatio: 'Use a value from 0 to 1.',
        severityMix: 'Severity mix must add up to 100%.'
      },
      formError: 'Settings were not saved.'
    }
  }
};

export const SavedFeedback: Story = {
  args: {
    form: {
      success: true
    }
  }
};
