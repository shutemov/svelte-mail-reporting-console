import type { Meta, StoryObj } from '@storybook/svelte';

import OLearningModule from './OLearningModule.svelte';
import { storyLearningAssignmentView } from '$lib/ui/storybook/fixtures';

const meta = {
  title: 'Organisms/OLearningModule',
  component: OLearningModule,
  args: {
    item: storyLearningAssignmentView,
    formError: ''
  },
  argTypes: {
    item: {
      control: 'object'
    },
    formError: {
      control: 'text'
    }
  }
} satisfies Meta<typeof OLearningModule>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Assigned: Story = {};

export const Completed: Story = {
  args: {
    item: {
      ...storyLearningAssignmentView,
      assignment: {
        ...storyLearningAssignmentView.assignment,
        status: 'completed',
        completedAt: '2026-05-12T09:02:00.000Z'
      }
    }
  }
};

export const WithError: Story = {
  args: {
    formError: 'Completion could not be saved. Try again.'
  }
};
