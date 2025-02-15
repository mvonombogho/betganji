import { MatchData, OddsData, Prediction } from '@/types';

export function generateMatchPrompt(matchData: MatchData, oddsData: OddsData): string {
  return `
Analyze the following soccer match and provide a prediction:

Match Details:
- Home Team: ${matchData.homeTeam.name}
- Away Team: ${matchData.awayTeam.name}
- Competition: ${matchData.competition.name}
- Date: ${matchData.datetime}

Recent Form (Last 5 matches):
Home Team:
${matchData.homeTeam.recentForm.map(match => `- ${match.result} vs ${match.opponent}`).join('\n')}

Away Team:
${matchData.awayTeam.recentForm.map(match => `- ${match.result} vs ${match.opponent}`).join('\n')}

Head-to-Head (Last 3 matches):
${matchData.h2h.map(match => {
  return `- ${match.homeTeam} ${match.homeScore} - ${match.awayScore} ${match.awayTeam} (${match.date})`;
}).join('\n')}

Current Odds:
- Home Win: ${oddsData.homeWin}
- Draw: ${oddsData.draw}
- Away Win: ${oddsData.awayWin}

Team Statistics:
Home Team:
- Goals Scored (avg): ${matchData.homeTeam.stats.goalsScored}
- Goals Conceded (avg): ${matchData.homeTeam.stats.goalsConceded}
- Clean Sheets: ${matchData.homeTeam.stats.cleanSheets}
- Form Rating: ${matchData.homeTeam.stats.formRating}

Away Team:
- Goals Scored (avg): ${matchData.awayTeam.stats.goalsScored}
- Goals Conceded (avg): ${matchData.awayTeam.stats.goalsConceded}
- Clean Sheets: ${matchData.awayTeam.stats.cleanSheets}
- Form Rating: ${matchData.awayTeam.stats.formRating}

Based on this data, provide:
1. Most likely match result
2. Confidence level (0-100)
3. Key factors influencing the prediction
4. Risk analysis
5. Additional insights

Format the response as a JSON object with the following structure:
{
  "prediction": "home_win|draw|away_win",
  "confidence": number,
  "analysis": {
    "key_factors": string[],
    "risk_assessment": string,
    "confidence_explanation": string,
    "additional_notes": string
  }
}`;
}

export function generateInsightsPrompt(prediction: Prediction): string {
  return `
Analyze the following match prediction and provide detailed insights:

Prediction: ${prediction.result}
Confidence: ${prediction.confidence}%

Previous Analysis:
${JSON.stringify(prediction.insights, null, 2)}

Provide additional insights and recommendations including:
1. Specific factors to watch for during the match
2. Potential variables that could change the outcome
3. Recommended approach for following this prediction
4. Alternative scenarios to consider

Format the response as JSON with detailed explanations for each point.`;
}
