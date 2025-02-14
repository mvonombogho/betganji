import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { League } from '@/types/league';

interface LeagueListProps {
  leagues: League[];
}

export default function LeagueList({ leagues }: LeagueListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {leagues.map((league) => (
        <Link href={`/leagues/${league.id}`} key={league.id}>
          <Card className="hover:bg-gray-50 transition-colors">
            <CardHeader className="flex flex-row items-center space-x-4">
              <Trophy className="w-6 h-6" />
              <CardTitle>{league.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="text-gray-500">Teams</div>
                  <div>{league.teamCount}</div>
                </div>
                <div>
                  <div className="text-gray-500">Prediction Rate</div>
                  <div>{league.predictionSuccessRate}%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}