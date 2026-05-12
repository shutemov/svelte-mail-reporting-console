import type { Meta, StoryObj } from '@storybook/svelte';

import ACheckbox from './ACheckbox.svelte';

const meta = {
  title: 'Atoms/ACheckbox',
  component: ACheckbox,
  args: {
    name: 'risky-action',
    value: 'clicked-link',
    checked: false,
    label: 'Clicked a link in the suspicious email'
  },
  argTypes: {
    name: {
      control: 'text'
    },
    value: {
      control: 'text'
    },
    checked: {
      control: 'boolean'
    },
    label: {
      control: 'text'
    }
  }
} satisfies Meta<typeof ACheckbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    checked: true
  }
};
