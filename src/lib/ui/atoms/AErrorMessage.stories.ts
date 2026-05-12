import type { Meta, StoryObj } from '@storybook/svelte';

import AErrorMessage from './AErrorMessage.svelte';

const meta = {
  title: 'Atoms/AErrorMessage',
  component: AErrorMessage,
  args: {
    message: 'Please describe why this email looks suspicious.'
  },
  argTypes: {
    message: {
      control: 'text'
    }
  }
} satisfies Meta<typeof AErrorMessage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    message: ''
  }
};
