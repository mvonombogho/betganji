import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';

// Create a custom renderer that includes providers
function render(ui: React.ReactElement, options = {}) {
  return rtlRender(ui, {
    wrapper: ({ children }) => (
      <SessionProvider>{children}</SessionProvider>
    ),
    ...options,
  });
}

// Mock session data
export const mockSession = {
  user: {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
  },
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
};

// Mock unauthenticated session
export const mockUnauthenticatedSession = {
  data: null,
  status: 'unauthenticated',
};

// Mock authenticated session
export const mockAuthenticatedSession = {
  data: mockSession,
  status: 'authenticated',
};

// Helper to mock API responses
export const mockApiResponse = (status: number, data: any) => {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
  });
};

// Helper to create mock match data
export const createMockMatchData = () => ({
  id: 'match_123',
  homeTeam: {
    name: 'Manchester United',
    recentForm: [
      { result: 'W', opponent: 'Arsenal' },
      { result: 'D', opponent: 'Liverpool' },
      { result: 'W', opponent: 'Newcastle' },
      { result: 'L', opponent: 'Manchester City' },
      { result: 'W', opponent: 'Tottenham' },
    ],
    stats: {
      goalsScored: 2.1,
      goalsConceded: 1.2,
      cleanSheets: 8,
      formRating: 7.5,
    },
  },
  awayTeam: {
    name: 'Chelsea',
    recentForm: [
      { result: 'L', opponent: 'Arsenal' },
      { result: 'W', opponent: 'Brighton' },
      { result: 'W', opponent: 'Brentford' },
      { result: 'D', opponent: 'Newcastle' },
      { result: 'L', opponent: 'Manchester City' },
    ],
    stats: {
      goalsScored: 1.8,
      goalsConceded: 1.4,
      cleanSheets: 6,
      formRating: 6.8,
    },
  },
  competition: {
    name: 'Premier League',
  },
  datetime: new Date().toISOString(),
  h2h: [
    {
      homeTeam: 'Manchester United',
      awayTeam: 'Chelsea',
      homeScore: 2,
      awayScore: 1,
      date: '2024-12-01',
    },
    {
      homeTeam: 'Chelsea',
      awayTeam: 'Manchester United',
      homeScore: 0,
      awayScore: 2,
      date: '2024-05-15',
    },
  ],
});

// Helper to create mock prediction data
export const createMockPredictionData = () => ({
  id: 'pred_123',
  matchId: 'match_123',
  result: 'home_win',
  confidence: 75,
  insights: {
    keyFactors: [
      'Strong home form',
      'Better head-to-head record',
      'Superior attacking stats',
    ],
    riskAnalysis: 'Medium risk due to recent injury concerns',
    confidenceExplanation: 'Based on historical performance and current form',
    additionalNotes: 'Weather conditions might affect play style',
  },
  createdAt: new Date().toISOString(),
});

// Re-export everything from RTL
export * from '@testing-library/react';
export { render };
