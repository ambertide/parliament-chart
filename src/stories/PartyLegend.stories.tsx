import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { PartyLegend } from '../components';
import { groups, parties, representativeData } from './mocks';

const meta = {
  title: 'Components/PartyLegend',
  component: PartyLegend,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  argTypes: {
    groupBy: {
      options: ["alliance", "deputies"],
      control: { type: "select" }
    }
  },
  args: {
    "onPartyOrGroupSelect": () => {},
    "partiesOrGroups": [],
    "selectedAlliance": "",
    "selectedParty": ""
  },
} satisfies Meta<typeof PartyLegend>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GroupedByDeputies: Story = {
  args: {
    groupBy: 'deputies',
    partiesOrGroups: parties
  } as any
};

export const GroupedByAlliance: Story = {
  args: {
    groupBy: 'alliance',
    partiesOrGroups: groups as any
  }
};
