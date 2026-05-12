import type { Meta, StoryObj } from '@storybook/svelte';

import OReportsList from './OReportsList.svelte';
import { storyReportsList } from '$lib/ui/storybook/fixtures';

const meta = {
  title: 'Organisms/OReportsList',
  component: OReportsList,
  args: {
    reports: storyReportsList
  },
  argTypes: {
    reports: {
      control: 'object'
    }
  }
} satisfies Meta<typeof OReportsList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithReports: Story = {};

export const Empty: Story = {
  args: {
    reports: []
  }
};
