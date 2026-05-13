import type { Meta, StoryObj } from '@storybook/svelte';

import MTimelineEvent from './MTimelineEvent.svelte';
import type { TimelineEvent } from '$lib/domains';

const event: TimelineEvent = {
  id: 'event-1',
  alertId: 'alert-1042',
  actorId: 'admin-1',
  type: 'investigation_started',
  message: 'Alex Morgan started triage and reviewed the reported sender domain.',
  createdAt: '2026-05-12T08:24:00.000Z'
};

const meta = {
  title: 'Molecules/MTimelineEvent',
  component: MTimelineEvent,
  args: {
    event
  },
  argTypes: {
    event: {
      control: 'object'
    }
  }
} satisfies Meta<typeof MTimelineEvent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const InvestigationStarted: Story = {};

export const LearningAssigned: Story = {
  args: {
    event: {
      ...event,
      id: 'event-2',
      type: 'learning_assigned',
      message: 'Assigned phishing basics learning after a credential-entry signal.'
    }
  }
};
