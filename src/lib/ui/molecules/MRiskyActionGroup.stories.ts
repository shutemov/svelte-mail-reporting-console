import type { Meta, StoryObj } from '@storybook/svelte';

import MRiskyActionGroup from './MRiskyActionGroup.svelte';

const meta = {
  title: 'Molecules/MRiskyActionGroup',
  component: MRiskyActionGroup,
  args: {
    selected: ['opened_email', 'clicked_link']
  },
  argTypes: {
    selected: {
      control: 'check',
      options: [
        'opened_email',
        'clicked_link',
        'downloaded_attachment',
        'entered_credentials',
        'reported_without_interaction'
      ]
    }
  }
} satisfies Meta<typeof MRiskyActionGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const PartiallySelected: Story = {};

export const NoneSelected: Story = {
  args: {
    selected: []
  }
};

export const HighRiskSelected: Story = {
  args: {
    selected: ['downloaded_attachment', 'entered_credentials']
  }
};
