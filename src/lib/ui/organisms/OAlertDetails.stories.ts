import type { Meta, StoryObj } from '@storybook/svelte';

import OAlertDetails from './OAlertDetails.svelte';
import { storyAlertDetails, storyResolvedAlertDetails } from '$lib/ui/storybook/fixtures';

const meta = {
  title: 'Organisms/OAlertDetails',
  component: OAlertDetails,
  args: {
    details: storyAlertDetails,
    formError: ''
  },
  argTypes: {
    details: {
      control: 'object'
    },
    formError: {
      control: 'text'
    }
  }
} satisfies Meta<typeof OAlertDetails>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Investigating: Story = {};

export const ResolvedMaliciousWithLearning: Story = {
  args: {
    details: storyResolvedAlertDetails
  }
};

export const WithFormError: Story = {
  args: {
    formError: 'The alert was updated by another analyst. Refresh before resolving.'
  }
};
