import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { ParliamentFigure } from '../components';
import { representativeData } from './mocks';

const meta = {
  title: 'Example/ParliamentFigure',
  component: ParliamentFigure,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  args: {
    representatives: [],
    partiesOrGroups: [],
    groupBy: 'deputies' 
  },
} satisfies Meta<typeof ParliamentFigure>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GroupedByDeputies: Story = {
  args: {
    groupBy: 'deputies',
    ...representativeData
  }
};
