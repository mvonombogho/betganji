import React from 'react';
import { Match } from '@/types/match';
import MatchCard from './match-card';
import { useOdds } from '@/hooks/useOdds';
import { useTeamStats } from '@/hooks/useTeamStats';

interface MatchListProps {
  matches: Match[];
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  totalPages?: number;
}

const MatchList: React.FC<MatchListProps> = ({
  matches,
  isLoading,
  onPageChange,
  currentPage = 1,
  totalPages = 1
}) => {
  const { getOdds } = useOdds();
  const { getTeamStats } = useTeamStats();

  return (
    <div className="space-y-4">
      {isLoading ? (
        Array.from({ length: 5 }).map((_, index) => (
          <MatchCard
            key={index}
            match={{} as Match}
            isLoading={true}
          />
        ))
      ) : (
        matches.map((match) => {
          const odds = getOdds(match.id);
          const homeStats = getTeamStats(match.homeTeam.id);
          const awayStats = getTeamStats(match.awayTeam.id);

          return (
            <MatchCard
              key={match.id}
              match={match}
              odds={odds}
              teamStats={{
                home: homeStats,
                away: awayStats
              }}
            />
          );
        })
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => onPageChange?.(index + 1)}
              className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchList;