import { Suspense } from 'react';
import { prisma } from '@/lib/db';
import { MatchList } from '@/components/matches/match-list';
import { MatchFilters } from '@/components/matches/match-filters';
import { MatchSearch } from '@/components/matches/match-search';

interface MatchesPageProps {
  searchParams: {
    status?: string;
    q?: string;
  };
}

async function getMatches(status?: string, search?: string) {
  const where: any = {};

  // Add status filter
  if (status) {
    where.status = status;
  }

  // Add search filter
  if (search) {
    where.OR = [
      {
        homeTeam: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      },
      {
        awayTeam: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      },
      {
        competition: {
          contains: search,
          mode: 'insensitive',
        },
      },
    ];
  }

  const matches = await prisma.match.findMany({
    where,
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
    orderBy: [
      {
        datetime: 'asc',
      },
    ],
  });

  return matches;
}

export default async function MatchesPage({ searchParams }: MatchesPageProps) {
  const matches = await getMatches(searchParams.status, searchParams.q);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Matches</h1>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <MatchSearch />
          </div>
          <MatchFilters />
        </div>

        <Suspense fallback={<div>Loading matches...</div>}>
          <MatchList matches={matches} />
        </Suspense>
      </div>
    </div>
  );
}
