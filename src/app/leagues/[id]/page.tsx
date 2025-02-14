import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import LeagueOverview from '@/components/leagues/league-overview';
import LeagueStats from '@/components/leagues/league-stats';
import LeaguePredictions from '@/components/leagues/league-predictions';
import { getLeague } from '@/lib/data/services/league-service';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const league = await getLeague(params.id);
  if (!league) return { title: 'League Not Found' };

  return {
    title: `${league.name} | BetGanji`,
    description: `Analysis and predictions for ${league.name}`
  };
}

export default async function LeaguePage({ params }: { params: { id: string } }) {
  const league = await getLeague(params.id);
  if (!league) notFound();

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{league.name}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <LeagueOverview league={league} />
        <LeagueStats league={league} />
      </div>

      <LeaguePredictions leagueId={league.id} />
    </div>
  );
}