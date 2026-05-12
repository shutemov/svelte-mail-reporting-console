import type { Meta, StoryObj } from '@storybook/svelte';

import OLearningAssignmentsList from './OLearningAssignmentsList.svelte';
import { storyLearningAssignments } from '$lib/ui/storybook/fixtures';

const meta = {
  title: 'Organisms/OLearningAssignmentsList',
  component: OLearningAssignmentsList,
  args: {
    assignments: storyLearningAssignments
  },
  argTypes: {
    assignments: {
      control: 'object'
    }
  }
} satisfies Meta<typeof OLearningAssignmentsList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithAssignments: Story = {};

export const Empty: Story = {
  args: {
    assignments: []
  }
};
