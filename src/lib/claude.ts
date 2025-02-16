import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY!,
});

interface PredictionInput {
  homeTeam: string;
  awayTeam: string;
  odds: {
    homeWin: number;
    draw: number;
    awayWin: number;
  };
}

export async function getPrediction(input: PredictionInput) {
  const prompt = `Analyze this soccer match and provide a prediction:

${input.homeTeam} vs ${input.awayTeam}

Current Odds:
Home Win: ${input.odds.homeWin}
Draw: ${input.odds.draw}
Away Win: ${input.odds.awayWin}

Based on the team names and current odds, predict the most likely outcome.
Provide your response in this format:
1. Prediction (WIN_HOME, DRAW, or WIN_AWAY)
2. Confidence (0.0 to 1.0)
3. Brief reasoning for the prediction`;

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 150,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0].text;
    const lines = content.split('\n').map(line => line.trim());

    // Parse prediction
    let outcome = 'WIN_HOME';
    let confidence = 0.5;
    let reasoning = '';

    for (const line of lines) {
      if (line.includes('WIN_HOME') || line.includes('DRAW') || line.includes('WIN_AWAY')) {
        outcome = line.includes('WIN_HOME') ? 'WIN_HOME' :
                 line.includes('DRAW') ? 'DRAW' : 'WIN_AWAY';
      } else if (line.match(/0\.[0-9]+|1\.0/)) {
        confidence = parseFloat(line.match(/0\.[0-9]+|1\.0/)![0]);
      } else if (line.length > 20) {
        reasoning = line;
      }
    }

    return {
      outcome,
      confidence,
      reasoning,
    };
  } catch (error) {
    console.error('Claude API error:', error);
    throw new Error('Failed to generate prediction');
  }
}
