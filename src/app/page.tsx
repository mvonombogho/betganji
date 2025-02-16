import { prisma } from '@/lib/db';
import { MatchCard } from '@/components/matches/match-card';

async function getUpcomingMatches() {
  const matches = await prisma.match.findMany({
    where: {
      datetime: {
        gte: new Date(), // Only future matches
      },
    },
    include: {
      homeTeam: true,
      awayTeam: true,
      odds: {
        orderBy: {
          timestamp: 'desc',
        },
        take: 1,
      },
    },
    orderBy: {
      datetime: 'asc',
    },
    take: 6, // Limit to 6 matches
  });

  return matches;
}

export default async function HomePage() {
  const matches = await getUpcomingMatches();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Upcoming Matches</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {matches.map((match) => (
          <MatchCard
            key={match.id}
            id={match.id}
            homeTeam={match.homeTeam.name}
            awayTeam={match.awayTeam.name}
            datetime={match.datetime}
            odds={match.odds[0]}
          />
        ))}
      </div>

      {matches.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No upcoming matches found
        </p>
      )}
    </main>
  );
}
