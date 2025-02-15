import type { Meta, StoryObj } from '@storybook/react';
import MatchCard from './match-card';

const meta: Meta<typeof MatchCard> = {
  title: 'Components/Matches/MatchCard',
  component: MatchCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    match: {
      control: 'object'
    },
    odds: {
      control: 'object'
    },
    prediction: {
      control: 'object'
    }
  }
};

export default meta;
type Story = StoryObj<typeof MatchCard>;

export const Default: Story = {
  args: {
    match: {
      id: '1',
      homeTeam: { id: '1', name: 'Arsenal' },
      awayTeam: { id: '2', name: 'Chelsea' },
      datetime: new Date('2024-02-15T15:00:00Z').toISOString(),
      status: 'SCHEDULED'
    },
    odds: {
      homeWin: 2.1,
      draw: 3.4,
      awayWin: 3.8
    }
  }
};

export const WithPrediction: Story = {
  args: {
    ...Default.args,
    prediction: {
      id: '1',
      result: 'HOME_WIN',
      confidence: 0.85,
      insights: {
        key_factors: ['Recent form', 'Head-to-head record'],
        analysis: 'Strong home team performance expected'
      },
      createdAt: new Date().toISOString()
    }
  }
};

export const LiveMatch: Story = {
  args: {
    ...Default.args,
    match: {
      ...Default.args?.match,
      status: 'LIVE'
    }
  }
};