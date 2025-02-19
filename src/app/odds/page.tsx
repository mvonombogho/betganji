'use client';

import { useState } from 'react';
import { OddsList } from '@/components/odds/odds-list';
import { SportsSelector } from '@/components/odds/sports-selector';
import { OddsFilter, type OddsFilters } from '@/components/odds/odds-filter';
import { useSearchParams } from 'next/navigation';
import { type OddsData } from '@/types/odds';

export default function OddsPage() {
  const [odds, setOdds] = useState<OddsData[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const sportKey = searchParams.get('sportKey') || 'soccer_epl';

  const fetchOdds = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/odds?sportKey=${sportKey}`);
      const data = await response.json();
      if (data.success) {
        setOdds(data.data);
      }
    } catch (error) {
      console.error('Error fetching odds:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOdds = (odds: OddsData[], filters: OddsFilters) => {
    return odds.filter(odd => {
      const searchMatch = !filters.search || 
        odd.homeTeam.toLowerCase().includes(filters.search.toLowerCase()) ||
        odd.awayTeam.toLowerCase().includes(filters.search.toLowerCase());

      const bestOdds = odd.bookmakers.reduce((best, bookmaker) => {
        const h2hMarket = bookmaker.markets.find(m => m.key === 'h2h');
        if (!h2hMarket) return best;

        h2hMarket.outcomes.forEach(outcome => {
          if (outcome.price > (best[outcome.name] || 0)) {
            best[outcome.name] = outcome.price;
          }
        });

        return best;
      }, {} as Record<string, number>);

      const maxBestOdds = Math.max(...Object.values(bestOdds));
      const minBestOdds = Math.min(...Object.values(bestOdds));

      const oddsMatch = 
        (!filters.minOdds || maxBestOdds >= filters.minOdds) &&
        (!filters.maxOdds || minBestOdds <= filters.maxOdds);

      return searchMatch && oddsMatch;
    });
  };

  const [filters, setFilters] = useState<OddsFilters>({});

  const handleFilterChange = (newFilters: OddsFilters) => {
    setFilters(newFilters);
  };

  const filteredOdds = filterOdds(odds, filters);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Latest Odds</h1>
      
      <SportsSelector />
      
      <OddsFilter onFilterChange={handleFilterChange} />
      
      {loading ? (
        <div className="text-center py-8">Loading odds...</div>
      ) : (
        <OddsList odds={filteredOdds} />
      )}
    </div>
  );
}