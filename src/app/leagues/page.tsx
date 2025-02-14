import React from 'react';
import { Metadata } from 'next';
import LeagueList from '@/components/leagues/league-list';
import { getLeagues } from '@/lib/data/services/league-service';

export const metadata: Metadata = {
  title: 'Leagues | BetGanji',
  description: 'Browse and analyze soccer leagues'
};

export default async function LeaguesPage() {
  const leagues = await getLeagues();

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Leagues</h1>
      </div>
      <LeagueList leagues={leagues} />
    </div>
  );
}