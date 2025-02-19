import React from 'react';
import { OddsList } from '@/components/odds/odds-list';

async function getOdds() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/odds?sportKey=soccer_epl`, {
    cache: 'no-store'
  });
  const data = await response.json();
  return data.data;
}

export default async function OddsPage() {
  const odds = await getOdds();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Latest Odds</h1>
      <OddsList odds={odds} />
    </div>
  );
}