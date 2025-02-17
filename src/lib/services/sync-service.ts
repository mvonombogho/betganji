import { prisma } from '@/lib/db';
import * as footballApi from './football-api';
import * as oddsApi from './odds-api';
import { webSocketServer } from '@/lib/websocket/server';

export async function syncMatchAndBroadcast(matchId: string) {
  try {
    const [matchData, oddsData] = await Promise.all([
      footballApi.getMatchDetails(matchId),
      oddsApi.getMatchOdds(matchId),
    ]);

    if (matchData.error) throw new Error(matchData.error);

    // Update match in database
    const match = await prisma.match.update({
      where: { id: matchId },
      data: {
        status: matchData.data.status,
        homeScore: matchData.data.score?.fullTime?.home,
        awayScore: matchData.data.score?.fullTime?.away,
      },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
    });

    // Broadcast match update
    webSocketServer.broadcastMatchUpdate(matchId, match);

    // Update odds if available
    if (!oddsData.error) {
      const transformedOdds = oddsApi.transformOdds(oddsData.data);
      if (transformedOdds) {
        const odds = await prisma.odds.create({
          data: {
            matchId,
            ...transformedOdds,
          },
        });

        // Broadcast odds update
        webSocketServer.broadcastOddsUpdate(matchId, odds);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Match sync error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function startLiveUpdates() {
  // Get all live matches
  const liveMatches = await prisma.match.findMany({
    where: { status: 'LIVE' },
  });

  // Set up periodic updates for each live match
  liveMatches.forEach(match => {
    setInterval(() => {
      syncMatchAndBroadcast(match.id);
    }, 30000); // Update every 30 seconds
  });

  // Set up periodic check for new live matches
  setInterval(async () => {
    const { data: apiMatches, error } = await footballApi.getLiveMatches();
    if (!error && apiMatches.matches) {
      apiMatches.matches.forEach(match => {
        syncMatchAndBroadcast(match.id);
      });
    }
  }, 60000); // Check every minute
}
