import type { Meta, StoryObj } from '@storybook/svelte';

import OReportForm from './OReportForm.svelte';
import { storyReport } from '$lib/ui/storybook/fixtures';

const meta = {
  title: 'Organisms/OReportForm',
  component: OReportForm,
  args: {
    values: {},
    fieldErrors: {},
    formError: ''
  },
  argTypes: {
    values: {
      control: 'object'
    },
    fieldErrors: {
      control: 'object'
    },
    formError: {
      control: 'text'
    }
  }
} satisfies Meta<typeof OReportForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const Filled: Story = {
  args: {
    values: {
      sender: storyReport.sender,
      subject: storyReport.subject,
      receivedAt: '2026-05-12T14:30',
      reason: storyReport.reason,
      riskyActions: storyReport.riskyActions,
      messagePreview: storyReport.messagePreview
    }
  }
};

export const WithErrors: Story = {
  args: {
    values: {
      sender: 'billing@example-payments.net',
      riskyActions: ['opened_email']
    },
    fieldErrors: {
      subject: 'Subject is required.',
      receivedAt: 'Received date is required.',
      reason: 'Describe what looked suspicious.'
    },
    formError: 'The report could not be submitted. Review highlighted fields.'
  }
};
