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
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-reasoner', // DeepSeek R1 model
          messages: [
            { role: 'user', content: prompt }
          ],
          max_tokens: 1000,
          temperature: 0.5,
          response_format: { type: 'json_object' } // Ensure JSON output
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
    try {
      // Extract the content from the API response
      const content = data.choices[0].message.content;
      
      // Parse the JSON content
      const parsedContent = JSON.parse(content);
      
      // Extract and structure the relevant information
      return {
        result: parsedContent.prediction || '',
        confidence: parsedContent.confidence || 0,
        insights: {
          keyFactors: parsedContent.analysis?.key_factors || [],
          riskAnalysis: parsedContent.analysis?.risk_assessment || '',
          confidenceExplanation: parsedContent.analysis?.confidence_explanation || '',
          additionalNotes: parsedContent.analysis?.additional_notes || '',
        },
      };
    } catch (error) {
      console.error('Error parsing DeepSeek response:', error);
      throw new Error('Failed to parse DeepSeek API response');
    }
  }
}