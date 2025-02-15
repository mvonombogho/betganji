interface DeepseekResponse {
  result: string;
  confidence: number;
  insights: {
    keyFactors: string[];
    riskAnalysis: string;
    confidenceExplanation: string;
    additionalNotes: string;
  };
}

export class DeepseekClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY || '';
    this.baseUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1';

    if (!this.apiKey) {
      throw new Error('DEEPSEEK_API_KEY is required');
    }
  }

  async generatePrediction(prompt: string): Promise<DeepseekResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/predictions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          prompt,
          max_tokens: 1000,
          temperature: 0.7,
          model: 'deepseek-sports',
        }),
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return this.formatResponse(data);
    } catch (error) {
      console.error('Error calling DeepSeek API:', error);
      throw error;
    }
  }

  private formatResponse(data: any): DeepseekResponse {
    // Extract and structure the relevant information from the API response
    return {
      result: data.choices[0].prediction,
      confidence: data.choices[0].confidence,
      insights: {
        keyFactors: data.choices[0].analysis.key_factors,
        riskAnalysis: data.choices[0].analysis.risk_assessment,
        confidenceExplanation: data.choices[0].analysis.confidence_explanation,
        additionalNotes: data.choices[0].analysis.additional_notes,
      },
    };
  }
}
