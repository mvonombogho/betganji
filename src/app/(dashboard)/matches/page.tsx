import { Suspense } from 'react';
import { prisma } from '@/lib/db';
import { MatchList } from '@/components/matches/match-list';
import { MatchFilters } from '@/components/matches/match-filters';
import { MatchSearch } from '@/components/matches/match-search';
import { MatchSort } from '@/components/matches/match-sort';
import { Pagination } from '@/components/ui/pagination';

const ITEMS_PER_PAGE = 10;

interface MatchesPageProps {
  searchParams: {
    status?: string;
    q?: string;
    page?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  };
}

function getOrderBy(sort: string = 'datetime', order: 'asc' | 'desc' = 'asc') {
  switch (sort) {
    case 'homeOdds':
      return [
        {
          odds: {
            homeWin: order,
          },
        },
        { datetime: 'asc' },
      ];
    case 'awayOdds':
      return [
        {
          odds: {
            awayWin: order,
          },
        },
        { datetime: 'asc' },
      ];
    case 'datetime':
    default:
      return [{ datetime: order }];
  }
}

async function getMatches(
  status?: string,
  search?: string,
  page: number = 1,
  sort?: string,
  order: 'asc' | 'desc' = 'asc'
) {
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

  // Get total count for pagination
  const totalCount = await prisma.match.count({ where });
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Get paginated and sorted matches
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
    orderBy: getOrderBy(sort, order),
    skip: (page - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
  });

  return {
    matches,
    totalPages,
    currentPage: page,
  };
}

export default async function MatchesPage({ searchParams }: MatchesPageProps) {
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  const { matches, totalPages, currentPage: page } = await getMatches(
    searchParams.status,
    searchParams.q,
    currentPage,
    searchParams.sort,
    searchParams.order as 'asc' | 'desc'
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Matches</h1>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <MatchSearch />
          </div>
          <MatchSort />
        </div>

        <MatchFilters />

        <Suspense fallback={<div>Loading matches...</div>}>
          <MatchList matches={matches} />
        </Suspense>

        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => {
                const params = new URLSearchParams(searchParams);
                params.set('page', newPage.toString());
                window.location.search = params.toString();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
