import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

interface MatchData {
  homeTeam: string;
  awayTeam: string;
  homeForm: string[];
  awayForm: string[];
  odds: {
    homeWin: number;
    draw: number;
    awayWin: number;
  };
}

export async function getPrediction(matchData: MatchData) {
  const prompt = `Based on the following match data, predict the outcome and provide reasoning:

Match: ${matchData.homeTeam} vs ${matchData.awayTeam}

Home Team Form: ${matchData.homeForm.join(', ')}
Away Team Form: ${matchData.awayForm.join(', ')}

Current Odds:
Home Win: ${matchData.odds.homeWin}
Draw: ${matchData.odds.draw}
Away Win: ${matchData.odds.awayWin}

Provide your prediction in a structured format with:
1. Predicted outcome (WIN_HOME, DRAW, or WIN_AWAY)
2. Confidence level (0-1)
3. Brief reasoning`;

  const message = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 300,
    messages: [{ role: 'user', content: prompt }],
  });

  // Parse the response
  const content = message.content[0].text;
  const lines = content.split('\n');
  
  let prediction = {
    outcome: '',
    confidence: 0,
    reasoning: ''
  };

  for (const line of lines) {
    if (line.includes('WIN_HOME') || line.includes('DRAW') || line.includes('WIN_AWAY')) {
      prediction.outcome = line.trim();
    } else if (line.includes('0.') || line.includes('1.0')) {
      prediction.confidence = parseFloat(line);
    } else if (line.length > 20) { // Assuming this is the reasoning
      prediction.reasoning = line.trim();
    }
  }

  return prediction;
}
