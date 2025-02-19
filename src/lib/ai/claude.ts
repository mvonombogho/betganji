import Anthropic from '@anthropic-ai/sdk';

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY is not set in environment variables');
}

export const claude = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function analyzeBettingOpportunity(matchInfo: string): Promise<string> {
  const message = await claude.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 1000,
    messages: [{
      role: 'user',
      content: `You are an expert soccer betting analyst. Analyze this match information and provide a detailed prediction with reasoning:

${matchInfo}

Provide your analysis in the following format:
1. Teams Analysis
2. Recent Form
3. Head-to-Head History
4. Prediction
5. Confidence Level (1-10)
6. Key Factors
7. Betting Recommendation`
    }]
  });

  return message.content[0].text;
}
