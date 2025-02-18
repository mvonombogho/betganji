interface ClaudeResponse {
  completion: string;
  stop_reason: string;
  model: string;
}

export class ClaudeClient {
  private static instance: ClaudeClient;
  private readonly apiKey: string;
  private readonly baseUrl: string = 'https://api.anthropic.com/v1';

  private constructor() {
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      throw new Error('CLAUDE_API_KEY environment variable is not set');
    }
    this.apiKey = apiKey;
  }

  public static getInstance(): ClaudeClient {
    if (!ClaudeClient.instance) {
      ClaudeClient.instance = new ClaudeClient();
    }
    return ClaudeClient.instance;
  }

  /**
   * Send completion request to Claude API
   */
  async complete(prompt: string, options: {
    maxTokens?: number;
    temperature?: number;
    model?: string;
  } = {}): Promise<string> {
    const {
      maxTokens = 1000,
      temperature = 0.7,
      model = 'claude-3-opus-20240229'
    } = options;

    try {
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model,
          messages: [{
            role: 'user',
            content: prompt
          }],
          max_tokens: maxTokens,
          temperature
        })
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.statusText}`);
      }

      const data: ClaudeResponse = await response.json();
      return data.completion;
    } catch (error) {
      console.error('Error calling Claude API:', error);
      throw error;
    }
  }

  /**
   * Send structured analysis request
   */
  async getStructuredAnalysis(prompt: string, schema: object): Promise<any> {
    const structuredPrompt = `${prompt}\n\nProvide your response in the following JSON schema:\n${JSON.stringify(schema, null, 2)}`;

    try {
      const completion = await this.complete(structuredPrompt, {
        temperature: 0.3 // Lower temperature for more structured output
      });

      return JSON.parse(completion);
    } catch (error) {
      console.error('Error getting structured analysis:', error);
      throw error;
    }
  }
}
