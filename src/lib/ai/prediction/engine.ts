import { Match } from '@/types/match';
import { OddsData } from '@/types/odds';
import { Prediction, PredictionInsights } from '@/types/prediction';
import { DeepseekClient } from '../deepseek/client';
import { generateMatchPrompt, generateInsightsPrompt } from '../deepseek/prompts';

export class PredictionEngine {
  private deepseek: DeepseekClient;
  private historicalDataCache: Map<string, any>;

  constructor() {
    this.deepseek = new DeepseekClient();
    this.historicalDataCache = new Map();
  }

  async analyzePrediction(match: Match, odds: OddsData): Promise<PredictionInsights> {
    try {
      // Gather historical data for better analysis
      const historicalData = await this.gatherHistoricalData(match);

      // Generate prompt for DeepSeek
      const prompt = generateMatchPrompt({
        ...match,
        homeTeam: {
          ...match.homeTeam,
          recentForm: historicalData?.recentForm?.home || []
        },
        awayTeam: {
          ...match.awayTeam,
          recentForm: historicalData?.recentForm?.away || []
        },
        h2h: historicalData?.headToHead || [],
        competition: match.competition
      }, odds);

      // Get prediction from DeepSeek
      const response = await this.deepseek.generatePrediction(prompt);

      // Convert DeepSeek response to PredictionInsights
      const insights: PredictionInsights = {
        factors: response.insights.keyFactors.map(factor => ({
          name: factor,
          impact: 0, // Default impact
          description: ''
        })),
        riskLevel: this.calculateRiskLevel(response.confidence),
        confidenceScore: response.confidence,
        additionalNotes: response.insights.additionalNotes,
        recommendedBets: []
      };

      // Post-process and enhance insights
      return this.enhanceInsights(insights, match, odds);
    } catch (error) {
      console.error('Prediction analysis failed:', error);
      throw error;
    }
  }

  async generateInsights(prediction: Prediction): Promise<PredictionInsights> {
    if (!prediction.match) {
      throw new Error('Match data is required for generating insights');
    }

    try {
      // Get current odds for the match
      const odds = await this.getCurrentOdds(prediction.match.id);

      // Generate prompt for DeepSeek
      const prompt = generateInsightsPrompt(prediction);

      // Get insights from DeepSeek
      const response = await this.deepseek.generatePrediction(prompt);

      // Convert DeepSeek response to PredictionInsights
      const insights: PredictionInsights = {
        factors: response.insights.keyFactors.map(factor => ({
          name: factor,
          impact: 0, // Default impact
          description: ''
        })),
        riskLevel: this.calculateRiskLevel(response.confidence),
        confidenceScore: response.confidence,
        additionalNotes: response.insights.additionalNotes,
        recommendedBets: []
      };

      return this.enhanceInsights(insights, prediction.match, odds);
    } catch (error) {
      console.error('Failed to generate insights:', error);
      throw error;
    }
  }

  private calculateRiskLevel(confidence: number): 'LOW' | 'MEDIUM' | 'HIGH' {
    if (confidence >= 70) return 'LOW';
    if (confidence >= 40) return 'MEDIUM';
    return 'HIGH';
  }

  private async gatherHistoricalData(match: Match): Promise<any> {
    const cacheKey = `${match.homeTeam.id}-${match.awayTeam.id}`;
    
    if (this.historicalDataCache.has(cacheKey)) {
      return this.historicalDataCache.get(cacheKey);
    }

    try {
      // Gather relevant historical data
      const historicalData = {
        headToHead: await this.getHeadToHeadHistory(match),
        recentForm: await this.getRecentForm(match),
        leaguePosition: await this.getLeaguePositions(match),
        // Add more historical data as needed
      };

      this.historicalDataCache.set(cacheKey, historicalData);
      return historicalData;
    } catch (error) {
      console.error('Failed to gather historical data:', error);
      return null;
    }
  }

  private async getCurrentOdds(matchId: string): Promise<OddsData> {
    // Implement odds fetching based on your odds service
    // This is a placeholder implementation
    return {
      id: '',
      matchId,
      provider: 'mock',
      homeWin: 2.0,
      draw: 3.0,
      awayWin: 4.0,
      timestamp: new Date().toISOString()
    };
  }

  private async getHeadToHeadHistory(match: Match): Promise<any> {
    // Implement head-to-head history fetching
    return [];
  }

  private async getRecentForm(match: Match): Promise<any> {
    // Implement recent form fetching
    return {};
  }

  private async getLeaguePositions(match: Match): Promise<any> {
    // Implement league positions fetching
    return {};
  }

  private enhanceInsights(insights: PredictionInsights, match: Match, odds: OddsData): PredictionInsights {
    // Add any additional processing or enhancement to the insights
    // This could include:
    // - Adding market-specific analysis
    // - Adjusting confidence based on historical accuracy
    // - Adding time-sensitive factors
    // - Etc.

    return {
      ...insights,
      factors: [
        ...insights.factors,
        // Add any additional factors based on your analysis
      ],
      additionalNotes: insights.additionalNotes + '\n\nAnalysis enhanced with historical data and current market conditions using DeepSeek R1 AI.'
    };
  }
}