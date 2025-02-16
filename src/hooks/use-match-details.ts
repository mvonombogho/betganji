import { useState, useEffect } from 'react';
import { MatchData } from '@/types/match';
import { OddsData } from '@/types/odds';
import { H2HStats } from '@/types/h2h';
import { LoadingStates, ErrorStates, initialLoadingState, initialErrorState } from '@/types/loading';

export function useMatchDetails(matchId: string) {
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [odds, setOdds] = useState<OddsData | null>(null);
  const [h2hStats, setH2HStats] = useState<H2HStats | null>(null);
  const [loading, setLoading] = useState<LoadingStates>(initialLoadingState);
  const [errors, setErrors] = useState<ErrorStates>(initialErrorState);

  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        setLoading(prev => ({ ...prev, match: true }));
        const response = await fetch(`/api/matches/${matchId}`);
        if (!response.ok) throw new Error('Failed to fetch match data');
        const data = await response.json();
        setMatchData(data);
        setErrors(prev => ({ ...prev, match: null }));
      } catch (err) {
        setErrors(prev => ({
          ...prev,
          match: err instanceof Error ? err.message : 'Failed to load match data'
        }));
      } finally {
        setLoading(prev => ({ ...prev, match: false }));
      }
    };

    const fetchOdds = async () => {
      try {
        setLoading(prev => ({ ...prev, odds: true }));
        const response = await fetch(`/api/odds?matchId=${matchId}`);
        if (!response.ok) throw new Error('Failed to fetch odds data');
        const data = await response.json();
        setOdds(data);
        setErrors(prev => ({ ...prev, odds: null }));
      } catch (err) {
        setErrors(prev => ({
          ...prev,
          odds: err instanceof Error ? err.message : 'Failed to load odds data'
        }));
      } finally {
        setLoading(prev => ({ ...prev, odds: false }));
      }
    };

    fetchMatchData();
    fetchOdds();
  }, [matchId]);

  return {
    matchData,
    odds,
    h2hStats,
    loading,
    errors,
    hasError: Object.values(errors).some(error => error !== null),
    isLoading: Object.values(loading).some(status => status)
  };
}
