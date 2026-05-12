import type { Meta, StoryObj } from '@storybook/svelte';

import OEmployeeProfileDetails from './OEmployeeProfileDetails.svelte';
import { storyEmployeeProfileDetails, storyEmployeeSummaries, storyUsers } from '$lib/ui/storybook/fixtures';

const meta = {
  title: 'Organisms/OEmployeeProfileDetails',
  component: OEmployeeProfileDetails,
  args: {
    details: storyEmployeeProfileDetails
  },
  argTypes: {
    details: {
      control: 'object'
    }
  }
} satisfies Meta<typeof OEmployeeProfileDetails>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ElevatedRisk: Story = {};

export const HealthyEmptyHistory: Story = {
  args: {
    details: {
      ...storyEmployeeProfileDetails,
      user: storyUsers[4],
      summary: storyEmployeeSummaries[2],
      reports: [],
      alerts: [],
      learningAssignments: [],
      recentRiskSignals: []
    }
  }
};
