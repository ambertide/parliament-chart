import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { representativeData } from './mocks';
import { ParliamentMap } from '@/components/ParliamentMap';

const meta = {
  title: 'Components/ParliamentMap',
  component: ParliamentMap,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  args: {
    representatives: [],
  },
} satisfies Meta<typeof ParliamentMap>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultStory: Story = {
  args: {
    representatives: representativeData.representatives
  }
};
