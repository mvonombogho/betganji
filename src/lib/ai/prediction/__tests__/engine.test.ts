import { PredictionEngine } from '../engine';
import { DeepseekClient } from '../../deepseek/client';
import { createMockMatchData } from '@/utils/test-utils';

// Mock the DeepseekClient
jest.mock('../../deepseek/client', () => {
  return {
    DeepseekClient: jest.fn().mockImplementation(() => ({
      generatePrediction: jest.fn(),
    })),
  };
});

describe('PredictionEngine', () => {
  let predictionEngine: PredictionEngine;
  let mockDeepseekClient: jest.Mocked<DeepseekClient>;

  beforeEach(() => {
    // Clear mocks
    jest.clearAllMocks();
    
    // Create a new instance for each test
    predictionEngine = new PredictionEngine();
    mockDeepseekClient = (DeepseekClient as jest.Mock).mock.results[0].value;
  });

  describe('analyzePrediction', () => {
    it('successfully generates a prediction with valid input', async () => {
      // Mock data
      const matchData = createMockMatchData();
      const oddsData = {
        homeWin: 2.1,
        draw: 3.4,
        awayWin: 3.8
      };

      // Mock DeepSeek response
      const mockPredictionResponse = {
        choices: [{
          prediction: 'home_win',
          confidence: 75,
          analysis: {
            key_factors: ['Strong home form', 'Better head-to-head record'],
            risk_assessment: 'Medium risk due to recent injury concerns',
            confidence_explanation: 'Based on historical performance',
            additional_notes: 'Weather conditions might affect play style'
          }
        }]
      };

      mockDeepseekClient.generatePrediction.mockResolvedValueOnce(mockPredictionResponse);

      // Execute prediction
      const result = await predictionEngine.analyzePrediction(matchData, oddsData);

      // Verify results
      expect(result).toMatchObject({
        matchId: matchData.id,
        result: 'home_win',
        confidence: 75,
        insights: {
          keyFactors: ['Strong home form', 'Better head-to-head record'],
          riskAnalysis: 'Medium risk due to recent injury concerns',
          confidenceExplanation: 'Based on historical performance',
          additionalNotes: 'Weather conditions might affect play style'
        }
      });

      // Verify DeepSeek client was called correctly
      expect(mockDeepseekClient.generatePrediction).toHaveBeenCalledTimes(1);
    });

    it('handles API errors gracefully', async () => {
      const matchData = createMockMatchData();
      const oddsData = {
        homeWin: 2.1,
        draw: 3.4,
        awayWin: 3.8
      };

      // Mock API error
      mockDeepseekClient.generatePrediction.mockRejectedValueOnce(
        new Error('API error')
      );

      // Verify error handling
      await expect(
        predictionEngine.analyzePrediction(matchData, oddsData)
      ).rejects.toThrow('Failed to generate prediction');
    });

    it('handles invalid API responses', async () => {
      const matchData = createMockMatchData();
      const oddsData = {
        homeWin: 2.1,
        draw: 3.4,
        awayWin: 3.8
      };

      // Mock invalid response format
      const invalidResponse = {
        choices: [{
          // Missing required fields
          prediction: 'home_win'
        }]
      };

      mockDeepseekClient.generatePrediction.mockResolvedValueOnce(invalidResponse);

      // Verify error handling
      await expect(
        predictionEngine.analyzePrediction(matchData, oddsData)
      ).rejects.toThrow('Failed to generate prediction');
    });

    it('validates input data', async () => {
      const invalidMatchData = {
        ...createMockMatchData(),
        homeTeam: undefined // Invalid data
      };

      const oddsData = {
        homeWin: 2.1,
        draw: 3.4,
        awayWin: 3.8
      };

      // Verify validation
      await expect(
        predictionEngine.analyzePrediction(invalidMatchData as any, oddsData)
      ).rejects.toThrow('Invalid match data');
    });
  });

  describe('generateInsights', () => {
    it('generates additional insights for a prediction', async () => {
      const prediction = {
        id: 'pred_123',
        matchId: 'match_123',
        result: 'home_win',
        confidence: 75,
        insights: {
          keyFactors: ['Strong home form'],
          riskAnalysis: 'Medium risk',
          confidenceExplanation: 'Based on data',
          additionalNotes: 'Weather impact'
        },
        createdAt: new Date()
      };

      const mockInsightsResponse = {
        choices: [{
          prediction: {
            specific_factors: ['Player form', 'Tactical matchup'],
            variables: ['Weather', 'Injuries'],
            recommended_approach: 'Monitor pre-match updates',
            alternative_scenarios: 'Consider draw if key player injured'
          }
        }]
      };

      mockDeepseekClient.generatePrediction.mockResolvedValueOnce(mockInsightsResponse);

      const result = await predictionEngine.generateInsights(prediction);

      expect(result).toMatchObject({
        specificFactors: ['Player form', 'Tactical matchup'],
        variables: ['Weather', 'Injuries'],
        recommendedApproach: 'Monitor pre-match updates',
        alternativeScenarios: 'Consider draw if key player injured'
      });
    });

    it('handles insights generation errors', async () => {
      const prediction = {
        id: 'pred_123',
        matchId: 'match_123',
        result: 'home_win',
        confidence: 75,
        insights: {
          keyFactors: ['Strong home form'],
          riskAnalysis: 'Medium risk',
          confidenceExplanation: 'Based on data',
          additionalNotes: 'Weather impact'
        },
        createdAt: new Date()
      };

      mockDeepseekClient.generatePrediction.mockRejectedValueOnce(
        new Error('Failed to generate insights')
      );

      await expect(
        predictionEngine.generateInsights(prediction)
      ).rejects.toThrow('Failed to generate insights');
    });
  });
});
