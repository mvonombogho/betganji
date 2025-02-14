import React from 'react';
import { render, screen } from '@testing-library/react';
import ROIAnalysis from '@/components/analytics/roi-analysis';

const mockData = {
  investment: 1000,
  returns: 1250,
  bets: 50,
  winRate: 60,
  profitHistory: [
    { date: '2024-02-01', profit: 100, cumulativeROI: 10 },
    { date: '2024-02-02', profit: 150, cumulativeROI: 15 }
  ]
};

describe('ROIAnalysis', () => {
  it('renders ROI analysis card with correct data', () => {
    render(<ROIAnalysis data={mockData} />);
    
    // Check if net profit is displayed correctly
    expect(screen.getByText('$250.00')).toBeInTheDocument();
    
    // Check if ROI percentage is calculated and displayed
    expect(screen.getByText('25.00%')).toBeInTheDocument();
    
    // Check if total bets are displayed
    expect(screen.getByText('50')).toBeInTheDocument();
    
    // Check if win rate is displayed
    expect(screen.getByText('60.0%')).toBeInTheDocument();
  });

  it('handles loading state correctly', () => {
    render(<ROIAnalysis data={mockData} loading />);
    expect(screen.getByTestId('roi-loading-skeleton')).toBeInTheDocument();
  });

  it('handles error state correctly', () => {
    const error = new Error('Failed to load data');
    render(<ROIAnalysis data={mockData} error={error} />);
    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
  });
});