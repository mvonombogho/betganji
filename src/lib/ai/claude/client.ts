import { Match } from '@/types/match';
import { OddsData } from '@/types/odds';
import { PredictionInsights } from '@/types/prediction';

export class ClaudeClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.CLAUDE_API_KEY || '';
    this.baseUrl = process.env.CLAUDE_API_URL || 'https://api.anthropic.com/v1';
  }

  async generatePrediction(data: {
    match: Match;
    odds: OddsData;
    historicalData?: any;
  }): Promise<PredictionInsights> {
    try {
      const prompt = this.constructPrompt(data);
      
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-opus-20240229',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: prompt
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.statusText}`);
      }

      const result = await response.json();
      return this.parseResponse(result.content[0].text);
    } catch (error) {
      console.error('Claude API request failed:', error);
      throw error;
    }
  }

  private constructPrompt(data: { match: Match; odds: OddsData; historicalData?: any }): string {
    return `Analyze this soccer match and provide prediction insights:

Match Details:
${data.match.homeTeam.name} vs ${data.match.awayTeam.name}
Competition: ${data.match.competition.name}
Date: ${data.match.datetime}

Current Odds:
Home Win: ${data.odds.homeWin}
Draw: ${data.odds.draw}
Away Win: ${data.odds.awayWin}

${data.historicalData ? `Historical Data: ${JSON.stringify(data.historicalData, null, 2)}` : ''}

Please provide a detailed analysis including:
1. Key factors affecting the match outcome
2. Risk assessment
3. Confidence score
4. Recommended bets (if any)
5. Additional insights

Format the response as a JSON object matching the PredictionInsights type.`;
  }

  private parseResponse(response: string): PredictionInsights {
    try {
      // Extract JSON from Claude's response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // Validate and transform the response to match PredictionInsights type
      return {
        factors: Array.isArray(parsed.factors) ? parsed.factors : [],
        recommendedBets: Array.isArray(parsed.recommendedBets) ? parsed.recommendedBets : [],
        riskLevel: this.validateRiskLevel(parsed.riskLevel),
        confidenceScore: this.validateConfidenceScore(parsed.confidenceScore),
        additionalNotes: parsed.additionalNotes || ''
      };
    } catch (error) {
      console.error('Failed to parse Claude response:', error);
      throw error;
    }
  }

  private validateRiskLevel(level: string): 'LOW' | 'MEDIUM' | 'HIGH' {
    const validLevels = ['LOW', 'MEDIUM', 'HIGH'];
    return validLevels.includes(level) ? level as 'LOW' | 'MEDIUM' | 'HIGH' : 'MEDIUM';
  }

  private validateConfidenceScore(score: number): number {
    return Math.min(Math.max(0, score), 100);
  }
}
