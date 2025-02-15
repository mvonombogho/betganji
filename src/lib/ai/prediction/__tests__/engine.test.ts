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
  });
});
