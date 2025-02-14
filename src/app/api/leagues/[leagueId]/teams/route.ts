import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { leagueId: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    // Get all teams in the league
    const teams = await prisma.team.findMany({
      where: {
        leagues: {
          some: {
            id: params.leagueId
          }
        }
      },
      select: {
        id: true,
        name: true,
        country: true,
        logo: true,
      }
    });

    // For each team, calculate their stats within the date range
    const teamsWithStats = await Promise.all(teams.map(async (team) => {
      const matches = await prisma.match.findMany({
        where: {
          leagueId: params.leagueId,
          datetime: {
            gte: from ? new Date(from) : undefined,
            lte: to ? new Date(to) : undefined,
          },
          OR: [
            { homeTeamId: team.id },
            { awayTeamId: team.id }
          ]
        },
        include: {
          predictions: {
            where: {
              userId: session.user.id
            }
          }
        }
      });

      let wins = 0;
      let draws = 0;
      let losses = 0;
      let goalsFor = 0;
      let goalsAgainst = 0;
      let cleanSheets = 0;
      let failedToScore = 0;
      const form: string[] = [];

      matches.forEach(match => {
        const isHome = match.homeTeamId === team.id;
        const homeGoals = match.homeScore || 0;
        const awayGoals = match.awayScore || 0;
        
        if (isHome) {
          goalsFor += homeGoals;
          goalsAgainst += awayGoals;
          if (awayGoals === 0) cleanSheets++;
          if (homeGoals === 0) failedToScore++;
          
          if (homeGoals > awayGoals) {
            wins++;
            form.push('W');
          } else if (homeGoals === awayGoals) {
            draws++;
            form.push('D');
          } else {
            losses++;
            form.push('L');
          }
        } else {
          goalsFor += awayGoals;
          goalsAgainst += homeGoals;
          if (homeGoals === 0) cleanSheets++;
          if (awayGoals === 0) failedToScore++;
          
          if (awayGoals > homeGoals) {
            wins++;
            form.push('W');
          } else if (homeGoals === awayGoals) {
            draws++;
            form.push('D');
          } else {
            losses++;
            form.push('L');
          }
        }
      });

      // Calculate prediction accuracy
      const predictedMatches = matches.filter(m => m.predictions.length > 0);
      const correctPredictions = predictedMatches.filter(match => {
        const prediction = match.predictions[0];
        if (!prediction) return false;
        
        if (match.homeScore === null || match.awayScore === null) return false;
        
        const actualResult = match.homeScore > match.awayScore ? 'HOME_WIN' :
                           match.homeScore < match.awayScore ? 'AWAY_WIN' : 'DRAW';
        
        return prediction.result === actualResult;
      });

      return {
        ...team,
        stats: {
          totalMatches: matches.length,
          wins,
          draws,
          losses,
          goalsFor,
          goalsAgainst,
          cleanSheets,
          failedToScore,
          form: form.slice(-5).reverse(), // Last 5 matches, most recent first
          predictedMatches: predictedMatches.length,
          predictionAccuracy: predictedMatches.length > 0
            ? (correctPredictions.length / predictedMatches.length) * 100
            : 0
        }
      };
    }));

    return NextResponse.json(teamsWithStats);
  } catch (error) {
    console.error('Failed to fetch league teams:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}