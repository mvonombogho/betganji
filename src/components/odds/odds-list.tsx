import React from 'react';
import { type OddsData } from '@/types/odds';
import { OddsCard } from './odds-card';

interface OddsListProps {
  odds: OddsData[];
}

export const OddsList: React.FC<OddsListProps> = ({ odds }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {odds.map(oddItem => (
        <OddsCard key={oddItem.id} odds={oddItem} />
      ))}
    </div>
  );
};