import { Match, Prediction, TeamStats } from '@/types';

export async function analyzePatterns(match: Match, teamStats: TeamStats[]) {
  const patterns = [];

  // Head-to-head analysis
  const h2hPatterns = analyzeH2HPatterns(match, teamStats);
  patterns.push(...h2hPatterns);

  // Form analysis
  const formPatterns = analyzeFormPatterns(match, teamStats);
  patterns.push(...formPatterns);

  // League position impact
  const leaguePatterns = analyzeLeaguePositionPatterns(match, teamStats);
  patterns.push(...leaguePatterns);

  return patterns;
}

function analyzeH2HPatterns(match: Match, teamStats: TeamStats[]) {
  const patterns = [];
  const h2hStats = teamStats.find(stats => 
    stats.type === 'h2h' && 
    stats.teams.includes(match.homeTeamId) && 
    stats.teams.includes(match.awayTeamId)
  );

  if (h2hStats) {
    if (h2hStats.homeWins > h2hStats.awayWins * 2) {
      patterns.push({
        type: 'positive',
        description: 'Strong historical home team advantage in head-to-head matches'
      });
    }

    if (h2hStats.awayWins > h2hStats.homeWins * 2) {
      patterns.push({
        type: 'positive',
        description: 'Away team historically performs well in this fixture'
      });
    }
  }

  return patterns;
}

function analyzeFormPatterns(match: Match, teamStats: TeamStats[]) {
  const patterns = [];
  const homeForm = teamStats.find(stats => 
    stats.type === 'form' && 
    stats.teamId === match.homeTeamId
  );
  const awayForm = teamStats.find(stats => 
    stats.type === 'form' && 
    stats.teamId === match.awayTeamId
  );

  if (homeForm && homeForm.winStreak >= 3) {
    patterns.push({
      type: 'positive',
      description: `Home team on a ${homeForm.winStreak}-game winning streak`
    });
  }

  if (awayForm && awayForm.winStreak >= 3) {
    patterns.push({
      type: 'positive',
      description: `Away team on a ${awayForm.winStreak}-game winning streak`
    });
  }

  return patterns;
}

function analyzeLeaguePositionPatterns(match: Match, teamStats: TeamStats[]) {
  const patterns = [];
  const homeLeague = teamStats.find(stats => 
    stats.type === 'league' && 
    stats.teamId === match.homeTeamId
  );
  const awayLeague = teamStats.find(stats => 
    stats.type === 'league' && 
    stats.teamId === match.awayTeamId
  );

  if (homeLeague && awayLeague) {
    const positionDiff = Math.abs(homeLeague.position - awayLeague.position);
    
    if (positionDiff >= 10) {
      patterns.push({
        type: homeLeague.position < awayLeague.position ? 'positive' : 'negative',
        description: 'Significant league position difference between teams'
      });
    }
  }

  return patterns;
}