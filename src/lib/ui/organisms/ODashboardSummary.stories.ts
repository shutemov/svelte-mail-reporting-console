import type { Meta, StoryObj } from '@storybook/svelte';

import ODashboardSummary from './ODashboardSummary.svelte';
import { storyDashboardSummary } from '$lib/ui/storybook/fixtures';

const meta = {
  title: 'Organisms/ODashboardSummary',
  component: ODashboardSummary,
  args: {
    summary: storyDashboardSummary
  },
  argTypes: {
    summary: {
      control: 'object'
    }
  }
} satisfies Meta<typeof ODashboardSummary>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Normal: Story = {};

export const EmptyMetrics: Story = {
  args: {
    summary: {
      openAlerts: 0,
      incomingReportsLast15m: 0,
      confirmedMalicious: 0,
      highRiskReports: 0,
      riskyActionReports: 0,
      backlogGrowthRate: 0,
      averageTriageMinutes: null,
      learningCompletionRate: 0
    }
  }
};
