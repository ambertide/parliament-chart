import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { fn } from 'storybook/test';

import { ModeSwitch } from '../components';
import { useArgs } from 'storybook/internal/preview-api';

const meta = {
  title: 'Example/ModeSwitch',
  component: ModeSwitch,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  args: {
    setMode: fn(),
    selectedMode: 'chart'
  },
} satisfies Meta<typeof ModeSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ButtonSwitch: Story = {
  render: args => {
    const [{ selectedMode }, updateArgs] = useArgs();

    const setMode = (mode: string) => {
      console.log(mode);
      updateArgs({ selectedMode: mode });
    };

    return <ModeSwitch
      {...args}
      selectedMode={selectedMode}
      setMode={setMode}
    />;
  }
};
