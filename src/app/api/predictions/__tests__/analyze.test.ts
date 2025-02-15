import { NextResponse } from 'next/server';
import { POST } from '../analyze/route';
import { predictionEngine } from '@/lib/ai/prediction/engine';
import { createMockMatchData } from '@/utils/test-utils';

// Mock the prediction engine
jest.mock('@/lib/ai/prediction/engine', () => ({
  predictionEngine: {
    analyzePrediction: jest.fn(),
    generateInsights: jest.fn(),
  },
}));

describe('Predictions API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully generates prediction and insights', async () => {
    const matchData = createMockMatchData();
    const oddsData = {
      homeWin: 2.1,
      draw: 3.4,
      awayWin: 3.8,
    };

    const mockPrediction = {
      id: 'pred_123',
      matchId: matchData.id,
      result: 'home_win',
      confidence: 75,
      insights: {
        keyFactors: ['Strong home form'],
        riskAnalysis: 'Medium risk',
        confidenceExplanation: 'Based on data',
        additionalNotes: 'Weather impact',
      },
      createdAt: new Date(),
    };

    const mockInsights = {
      specificFactors: ['Player form', 'Tactical matchup'],
      variables: ['Weather', 'Injuries'],
      recommendedApproach: 'Monitor pre-match updates',
      alternativeScenarios: 'Consider draw if key player injured',
    };

    (predictionEngine.analyzePrediction as jest.Mock).mockResolvedValueOnce(mockPrediction);
    (predictionEngine.generateInsights as jest.Mock).mockResolvedValueOnce(mockInsights);

    const request = new Request('http://localhost:3000/api/predictions/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ matchData, oddsData }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      prediction: mockPrediction,
      insights: mockInsights,
    });

    expect(predictionEngine.analyzePrediction).toHaveBeenCalledWith(matchData, oddsData);
    expect(predictionEngine.generateInsights).toHaveBeenCalledWith(mockPrediction);
  });

  it('handles missing required data', async () => {
    const request = new Request('http://localhost:3000/api/predictions/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    
    const data = await response.text();
    expect(data).toBe('Missing required data');
  });

  it('handles prediction engine errors', async () => {
    const matchData = createMockMatchData();
    const oddsData = {
      homeWin: 2.1,
      draw: 3.4,
      awayWin: 3.8,
    };

    (predictionEngine.analyzePrediction as jest.Mock).mockRejectedValueOnce(
      new Error('Prediction failed')
    );

    const request = new Request('http://localhost:3000/api/predictions/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ matchData, oddsData }),
    });

    const response = await POST(request);
    expect(response.status).toBe(500);
    
    const data = await response.text();
    expect(data).toBe('Error generating prediction');
  });

  it('handles invalid JSON in request body', async () => {
    const request = new Request('http://localhost:3000/api/predictions/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'invalid json',
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('validates odds data format', async () => {
    const matchData = createMockMatchData();
    const invalidOddsData = {
      homeWin: 'invalid', // Should be a number
      draw: 3.4,
      awayWin: 3.8,
    };

    const request = new Request('http://localhost:3000/api/predictions/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ matchData, oddsData: invalidOddsData }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    
    const data = await response.text();
    expect(data).toBe('Invalid odds data format');
  });

  it('handles insights generation errors', async () => {
    const matchData = createMockMatchData();
    const oddsData = {
      homeWin: 2.1,
      draw: 3.4,
      awayWin: 3.8,
    };

    const mockPrediction = {
      id: 'pred_123',
      matchId: matchData.id,
      result: 'home_win',
      confidence: 75,
      insights: {
        keyFactors: ['Strong home form'],
        riskAnalysis: 'Medium risk',
        confidenceExplanation: 'Based on data',
        additionalNotes: 'Weather impact',
      },
      createdAt: new Date(),
    };

    (predictionEngine.analyzePrediction as jest.Mock).mockResolvedValueOnce(mockPrediction);
    (predictionEngine.generateInsights as jest.Mock).mockRejectedValueOnce(
      new Error('Insights generation failed')
    );

    const request = new Request('http://localhost:3000/api/predictions/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ matchData, oddsData }),
    });

    const response = await POST(request);
    expect(response.status).toBe(500);
    
    const data = await response.text();
    expect(data).toBe('Error generating prediction insights');
  });

  it('validates match data structure', async () => {
    const invalidMatchData = {
      // Missing required fields
      id: 'match_123',
      homeTeam: {},
    };
    const oddsData = {
      homeWin: 2.1,
      draw: 3.4,
      awayWin: 3.8,
    };

    const request = new Request('http://localhost:3000/api/predictions/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ matchData: invalidMatchData, oddsData }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    
    const data = await response.text();
    expect(data).toBe('Invalid match data format');
  });
});
