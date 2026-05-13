import type { Meta, StoryObj } from '@storybook/svelte';

import MEmployeeRiskCard from './MEmployeeRiskCard.svelte';
import type { EmployeeProfileSummary } from '$lib/domains';

const summary: EmployeeProfileSummary = {
  user: {
    id: 'employee-2',
    role: 'employee',
    name: 'Maya Chen',
    persona: 'finance_target'
  },
  riskStatus: 'yellow',
  riskStatusLabel: 'Elevated',
  totalReports: 18,
  reportsLast15m: 2,
  openAlerts: 3,
  highRiskReports: 5,
  clickedLinkCount: 4,
  downloadedAttachmentCount: 1,
  enteredCredentialsCount: 0,
  confirmedMalicious: 3,
  resolvedSafe: 10,
  pendingTriage: 3,
  learningAssigned: 4,
  learningCompleted: 3,
  learningCompletionRate: 75,
  lastReportAt: '2026-05-12T08:12:00.000Z'
};

const meta = {
  title: 'Molecules/MEmployeeRiskCard',
  component: MEmployeeRiskCard,
  args: {
    summary
  },
  argTypes: {
    summary: {
      control: 'object'
    }
  }
} satisfies Meta<typeof MEmployeeRiskCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Elevated: Story = {};

export const HighRisk: Story = {
  args: {
    summary: {
      ...summary,
      riskStatus: 'red',
      riskStatusLabel: 'High risk',
      highRiskReports: 9,
      openAlerts: 6,
      enteredCredentialsCount: 2,
      learningCompletionRate: 25
    }
  }
};

export const Healthy: Story = {
  args: {
    summary: {
      ...summary,
      riskStatus: 'green',
      riskStatusLabel: 'Healthy',
      totalReports: 9,
      openAlerts: 0,
      highRiskReports: 0,
      clickedLinkCount: 0,
      downloadedAttachmentCount: 0,
      enteredCredentialsCount: 0,
      learningCompletionRate: 100
    }
  }
};
