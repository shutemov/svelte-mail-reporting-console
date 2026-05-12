import type { Meta, StoryObj } from '@storybook/svelte';

import OEmployeeRiskCards from './OEmployeeRiskCards.svelte';
import { storyEmployeeSummaries } from '$lib/ui/storybook/fixtures';

const meta = {
  title: 'Organisms/OEmployeeRiskCards',
  component: OEmployeeRiskCards,
  args: {
    summaries: storyEmployeeSummaries
  },
  argTypes: {
    summaries: {
      control: 'object'
    }
  }
} satisfies Meta<typeof OEmployeeRiskCards>;

export default meta;

type Story = StoryObj<typeof meta>;

export const MixedRisk: Story = {};

export const Empty: Story = {
  args: {
    summaries: []
  }
};
