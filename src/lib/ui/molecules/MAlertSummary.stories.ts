import type { Meta, StoryObj } from '@storybook/svelte';

import MAlertSummary from './MAlertSummary.svelte';
import type { AlertDetailsView } from '$lib/domains';

const alertSummary: AlertDetailsView = {
  alert: {
    id: 'alert-1042',
    reportId: 'report-1042',
    reporterId: 'employee-2',
    status: 'investigating',
    severity: 'high',
    createdAt: '2026-05-12T08:12:00.000Z',
    updatedAt: '2026-05-12T08:24:00.000Z'
  },
  report: {
    id: 'report-1042',
    reporterId: 'employee-2',
    sender: 'billing@example-payments.net',
    subject: 'Urgent invoice approval required',
    receivedAt: '2026-05-12T07:48:00.000Z',
    reason: 'The sender domain is unfamiliar and the invoice link opens outside the vendor portal.',
    riskyActions: ['opened_email', 'clicked_link'],
    messagePreview: 'Please approve the overdue invoice before the end of the business day.',
    createdAt: '2026-05-12T08:12:00.000Z',
    alertId: 'alert-1042'
  },
  reporter: {
    id: 'employee-2',
    role: 'employee',
    name: 'Maya Chen',
    persona: 'finance_target'
  },
  timeline: []
};

const meta = {
  title: 'Molecules/MAlertSummary',
  component: MAlertSummary,
  args: {
    item: alertSummary
  },
  argTypes: {
    item: {
      control: 'object'
    }
  }
} satisfies Meta<typeof MAlertSummary>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Investigating: Story = {};

export const ResolvedSafe: Story = {
  args: {
    item: {
      ...alertSummary,
      alert: {
        ...alertSummary.alert,
        status: 'resolved_safe',
        severity: 'medium'
      }
    }
  }
};
