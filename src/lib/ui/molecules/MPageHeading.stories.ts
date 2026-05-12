import type { Meta, StoryObj } from '@storybook/svelte';

import MPageHeading from './MPageHeading.svelte';

const meta = {
  title: 'Molecules/MPageHeading',
  component: MPageHeading,
  args: {
    title: 'Security operations console',
    subtitle: 'Review suspicious mail reports, triage alerts, and assign learning when users need support.'
  },
  argTypes: {
    title: {
      control: 'text'
    },
    subtitle: {
      control: 'text'
    }
  }
} satisfies Meta<typeof MPageHeading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithSubtitle: Story = {};

export const TitleOnly: Story = {
  args: {
    subtitle: ''
  }
};
