import Anthropic from '@anthropic-ai/sdk';
import { prisma } from '@/lib/db';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY!,
});

interface MatchData {
  homeTeam: {
    name: string;
    stats: {
      wins: number;
      draws: number;
      losses: number;
      goalsScored: number;
      goalsConceded: number;
    };
    recentForm: Array<'W' | 'D' | 'L'>;
  };
  awayTeam: {
    name: string;
    stats: {
      wins: number;
      draws: number;
      losses: number;
      goalsScored: number;
      goalsConceded: number;
    };
    recentForm: Array<'W' | 'D' | 'L'>;
  };
  odds: {
    homeWin: number;
    draw: number;
    awayWin: number;
  };
  h2h: Array<{
    homeScore: number;
    awayScore: number;
    datetime: Date;
  }>;
}

export async function generatePrediction(matchId: string, userId: string) {
  // Get match data
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      homeTeam: true,
      awayTeam: true,
      odds: {
        orderBy: { timestamp: 'desc' },
        take: 1,
      },
    },
  });

  if (!match || !match.odds[0]) {
    throw new Error('Match or odds data not found');
  }

  // Get team stats and H2H
  const [homeStats, awayStats, h2hMatches] = await Promise.all([
    getTeamStats(match.homeTeamId),
    getTeamStats(match.awayTeamId),
    getHeadToHead(match.homeTeamId, match.awayTeamId),
  ]);

  // Prepare match data for analysis
  const matchData: MatchData = {
    homeTeam: {
      name: match.homeTeam.name,
      stats: homeStats.stats,
      recentForm: homeStats.recentForm,
    },
    awayTeam: {
      name: match.awayTeam.name,
      stats: awayStats.stats,
      recentForm: awayStats.recentForm,
    },
    odds: {
      homeWin: match.odds[0].homeWin,
      draw: match.odds[0].draw,
      awayWin: match.odds[0].awayWin,
    },
    h2h: h2hMatches,
  };

  // Generate prediction using Claude
  const prompt = generateAnalysisPrompt(matchData);
  const response = await anthropic.messages.create({
    model: 'claude-3-opus-20240229',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }],
  });

  // Parse prediction from response
  const prediction = parsePrediction(response.content[0].text);

  // Save prediction to database
  const savedPrediction = await prisma.prediction.create({
    data: {
      matchId,
      userId,
      prediction: prediction.outcome,
      confidence: prediction.confidence,
      reasoning: prediction.reasoning,
    },
  });

  return savedPrediction;
}

function generateAnalysisPrompt(data: MatchData): string {
  return `Analyze this soccer match and provide a prediction:

${data.homeTeam.name} vs ${data.awayTeam.name}

Home Team Stats:
- Recent form: ${data.homeTeam.recentForm.join(', ')}
- Last 5 matches: ${data.homeTeam.stats.wins}W ${data.homeTeam.stats.draws}D ${data.homeTeam.stats.losses}L
- Goals scored: ${data.homeTeam.stats.goalsScored}
- Goals conceded: ${data.homeTeam.stats.goalsConceded}

Away Team Stats:
- Recent form: ${data.awayTeam.recentForm.join(', ')}
- Last 5 matches: ${data.awayTeam.stats.wins}W ${data.awayTeam.stats.draws}D ${data.awayTeam.stats.losses}L
- Goals scored: ${data.awayTeam.stats.goalsScored}
- Goals conceded: ${data.awayTeam.stats.goalsConceded}

Current Odds:
- Home Win: ${data.odds.homeWin}
- Draw: ${data.odds.draw}
- Away Win: ${data.odds.awayWin}

Based on this data, provide:
1. Predicted outcome (WIN_HOME, DRAW, or WIN_AWAY)
2. Confidence level (0.0 to 1.0)
3. Brief reasoning for the prediction

Format your response as:
Outcome: [prediction]
Confidence: [number]
Reasoning: [explanation]`;
}

function parsePrediction(response: string) {
  const lines = response.split('\n');
  let outcome = '';
  let confidence = 0;
  let reasoning = '';

  for (const line of lines) {
    if (line.startsWith('Outcome:')) {
      outcome = line.split(':')[1].trim();
    } else if (line.startsWith('Confidence:')) {
      confidence = parseFloat(line.split(':')[1].trim());
    } else if (line.startsWith('Reasoning:')) {
      reasoning = line.split(':')[1].trim();
    }
  }

  return { outcome, confidence, reasoning };
}
