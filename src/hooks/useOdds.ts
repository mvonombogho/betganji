import { useState, useEffect } from 'react';
import { OddsData, OddsHistory } from '@/types/odds';
import { oddsService } from '@/lib/data/services/odds-service';

export const useOdds = (matchId?: string) => {
  const [odds, setOdds] = useState<OddsData | null>(null);
  const [history, setHistory] = useState<OddsHistory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchOdds = async () => {
      if (!matchId) return;
      
      try {
        setIsLoading(true);
        const [currentOdds, oddsHistory] = await Promise.all([
          oddsService.getLiveOdds(matchId),
          oddsService.getHistoricalOdds(matchId)
        ]);
        
        setOdds(currentOdds);
        setHistory(oddsHistory);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch odds'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchOdds();

    // Set up real-time updates if available
    const cleanup = oddsService.subscribeToOddsUpdates(matchId, (updatedOdds) => {
      setOdds(updatedOdds);
    });

    return cleanup;
  }, [matchId]);

  return { odds, history, isLoading, error };
};
