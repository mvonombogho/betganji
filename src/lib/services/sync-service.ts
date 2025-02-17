import { prisma } from '@/lib/db';
import * as footballApi from './football-api';

export async function syncMatches() {
  try {
    // Get upcoming matches from API
    const { data: apiMatches, error } = await footballApi.getUpcomingMatches();
    
    if (error) {
      throw new Error(`Failed to fetch matches: ${error}`);
    }

    // Process each match
    for (const apiMatch of apiMatches.matches) {
      // Update or create teams
      const homeTeam = await prisma.team.upsert({
        where: { id: apiMatch.homeTeam.id.toString() },
        update: { name: apiMatch.homeTeam.name },
        create: {
          id: apiMatch.homeTeam.id.toString(),
          name: apiMatch.homeTeam.name,
        },
      });

      const awayTeam = await prisma.team.upsert({
        where: { id: apiMatch.awayTeam.id.toString() },
        update: { name: apiMatch.awayTeam.name },
        create: {
          id: apiMatch.awayTeam.id.toString(),
          name: apiMatch.awayTeam.name,
        },
      });

      // Update or create match
      await prisma.match.upsert({
        where: { id: apiMatch.id.toString() },
        update: {
          status: apiMatch.status,
          datetime: new Date(apiMatch.utcDate),
          homeScore: apiMatch.score?.fullTime?.home,
          awayScore: apiMatch.score?.fullTime?.away,
        },
        create: {
          id: apiMatch.id.toString(),
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          status: apiMatch.status,
          datetime: new Date(apiMatch.utcDate),
          competition: apiMatch.competition.name,
        },
      });
    }

    console.log(`Synced ${apiMatches.matches.length} matches`);
    return { success: true };

  } catch (error) {
    console.error('Match sync error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function syncLiveScores() {
  try {
    const { data: liveMatches, error } = await footballApi.getLiveMatches();
    
    if (error) {
      throw new Error(`Failed to fetch live matches: ${error}`);
    }

    // Update scores for live matches
    for (const match of liveMatches.matches) {
      await prisma.match.update({
        where: { id: match.id.toString() },
        data: {
          status: match.status,
          homeScore: match.score.fullTime.home,
          awayScore: match.score.fullTime.away,
        },
      });
    }

    return { success: true };

  } catch (error) {
    console.error('Live score sync error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
