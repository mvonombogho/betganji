import { useState, useEffect } from 'react';
import { Match } from '@/types/match';
import { matchService } from '@/lib/data/services/match-service';

export const useMatches = (date?: string) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setIsLoading(true);
        const data = await matchService.getMatches(date);
        setMatches(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch matches'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, [date]);

  return { matches, isLoading, error };
};
