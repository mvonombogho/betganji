import { prisma } from '@/lib/db';
import * as footballApi from './football-api';
import * as oddsApi from './odds-api';

export async function syncMatches() {
  try {
    // Get upcoming matches from API
    const { data: apiMatches, error } = await footballApi.getUpcomingMatches();
    
    if (error) {
      throw new Error(`Failed to fetch matches: ${error}`);
    }

    // Get latest odds
    const { data: apiOdds, error: oddsError } = await oddsApi.getLatestOdds();
    if (oddsError) {
      console.error('Failed to fetch odds:', oddsError);
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

      // Find odds for this match
      const matchOdds = apiOdds?.find((o: any) => o.event_id === apiMatch.id);
      const transformedOdds = matchOdds ? oddsApi.transformOdds(matchOdds) : null;

      // Update or create match
      const match = await prisma.match.upsert({
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

      // Update odds if available
      if (transformedOdds) {
        await prisma.odds.create({
          data: {
            matchId: match.id,
            homeWin: transformedOdds.homeWin,
            draw: transformedOdds.draw,
            awayWin: transformedOdds.awayWin,
            timestamp: transformedOdds.timestamp,
          },
        });
      }
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

    // Update scores and odds for live matches
    for (const match of liveMatches.matches) {
      // Get latest odds for this match
      const { data: matchOdds } = await oddsApi.getMatchOdds(match.id);
      const transformedOdds = oddsApi.transformOdds(matchOdds);

      await prisma.$transaction([
        // Update match scores
        prisma.match.update({
          where: { id: match.id.toString() },
          data: {
            status: match.status,
            homeScore: match.score.fullTime.home,
            awayScore: match.score.fullTime.away,
          },
        }),

        // Add new odds if available
        transformedOdds
          ? prisma.odds.create({
              data: {
                matchId: match.id.toString(),
                homeWin: transformedOdds.homeWin,
                draw: transformedOdds.draw,
                awayWin: transformedOdds.awayWin,
                timestamp: transformedOdds.timestamp,
              },
            })
          : undefined,
      ]);
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
