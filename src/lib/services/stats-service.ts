import { prisma } from '@/lib/db';

export async function getTeamStats(teamId: string) {
  const recentMatches = await prisma.match.findMany({
    where: {
      OR: [
        { homeTeamId: teamId },
        { awayTeamId: teamId }
      ],
      status: 'FINISHED'
    },
    orderBy: {
      datetime: 'desc'
    },
    take: 5
  });

  // Calculate stats
  let wins = 0;
  let draws = 0;
  let losses = 0;
  let goalsScored = 0;
  let goalsConceded = 0;
  const recentForm: Array<'W' | 'D' | 'L'> = [];

  recentMatches.forEach(match => {
    const isHome = match.homeTeamId === teamId;
    const teamScore = isHome ? match.homeScore! : match.awayScore!;
    const opponentScore = isHome ? match.awayScore! : match.homeScore!;

    // Update goals
    goalsScored += teamScore;
    goalsConceded += opponentScore;

    // Update results
    if (teamScore > opponentScore) {
      wins++;
      recentForm.push('W');
    } else if (teamScore < opponentScore) {
      losses++;
      recentForm.push('L');
    } else {
      draws++;
      recentForm.push('D');
    }
  });

  return {
    stats: {
      wins,
      draws,
      losses,
      goalsScored,
      goalsConceded
    },
    recentForm
  };
}

export async function getHeadToHead(team1Id: string, team2Id: string) {
  const h2hMatches = await prisma.match.findMany({
    where: {
      AND: [
        {
          OR: [
            {
              AND: [
                { homeTeamId: team1Id },
                { awayTeamId: team2Id }
              ]
            },
            {
              AND: [
                { homeTeamId: team2Id },
                { awayTeamId: team1Id }
              ]
            }
          ]
        },
        { status: 'FINISHED' }
      ]
    },
    orderBy: {
      datetime: 'desc'
    },
    take: 5,
    include: {
      homeTeam: true,
      awayTeam: true
    }
  });

  return h2hMatches;
}
