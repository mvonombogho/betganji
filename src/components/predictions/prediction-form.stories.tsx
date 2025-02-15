import type { Meta, StoryObj } from '@storybook/react';
import PredictionForm from './prediction-form';

const meta: Meta<typeof PredictionForm> = {
  title: 'Components/Predictions/PredictionForm',
  component: PredictionForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    match: {
      control: 'object'
    },
    onSubmit: { action: 'submitted' }
  }
};

export default meta;
type Story = StoryObj<typeof PredictionForm>;

export const Default: Story = {
  args: {
    match: {
      id: '1',
      homeTeam: { id: '1', name: 'Arsenal' },
      awayTeam: { id: '2', name: 'Chelsea' },
      datetime: new Date('2024-02-15T15:00:00Z').toISOString(),
      status: 'SCHEDULED'
    }
  }
};

export const WithOdds: Story = {
  args: {
    ...Default.args,
    odds: {
      homeWin: 2.1,
      draw: 3.4,
      awayWin: 3.8
    }
  }
};

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true
  }
};

export const Error: Story = {
  args: {
    ...Default.args,
    error: 'Failed to submit prediction'
  }
};