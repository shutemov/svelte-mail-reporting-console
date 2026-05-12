import type { Meta, StoryObj } from '@storybook/svelte';

import OReportDetails from './OReportDetails.svelte';
import { storyReport } from '$lib/ui/storybook/fixtures';

const meta = {
  title: 'Organisms/OReportDetails',
  component: OReportDetails,
  args: {
    report: storyReport
  },
  argTypes: {
    report: {
      control: 'object'
    }
  }
} satisfies Meta<typeof OReportDetails>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithPreview: Story = {};

export const WithoutPreview: Story = {
  args: {
    report: {
      ...storyReport,
      messagePreview: undefined
    }
  }
};
