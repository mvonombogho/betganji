import { prisma } from '@/lib/db';
import { MatchList } from '@/components/matches/match-list';

async function getMatches() {
  try {
    const matches = await prisma.match.findMany({
      where: {
        datetime: {
          gte: new Date(),
        },
      },
      include: {
        homeTeam: {
          select: {
            name: true,
          },
        },
        awayTeam: {
          select: {
            name: true,
          },
        },
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
      take: 10,
    });

    return matches;
  } catch (error) {
    console.error('Error fetching matches:', error);
    return [];
  }
}

export default async function HomePage() {
  const matches = await getMatches();

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Upcoming Matches</h1>
      <MatchList matches={matches} />
    </main>
  );
}
