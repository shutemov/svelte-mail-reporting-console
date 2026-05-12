import type { Meta, StoryObj } from '@storybook/svelte';

import AButton from './AButton.svelte';

const meta = {
  title: 'Atoms/AButton',
  component: AButton,
  args: {
    label: 'Review alert',
    variant: 'primary',
    type: 'button',
    disabled: false,
    loading: false
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger']
    },
    type: {
      control: 'select',
      options: ['button', 'submit']
    },
    disabled: {
      control: 'boolean'
    },
    loading: {
      control: 'boolean'
    },
    label: {
      control: 'text'
    }
  }
} satisfies Meta<typeof AButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    label: 'Open details',
    variant: 'secondary'
  }
};

export const Danger: Story = {
  args: {
    label: 'Escalate',
    variant: 'danger'
  }
};
