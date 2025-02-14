import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { League } from '@/types/league';

interface LeagueOverviewProps {
  league: League;
}

export default function LeagueOverview({ league }: LeagueOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="font-medium">Country</div>
            <div>{league.country}</div>
          </div>
          <div>
            <div className="font-medium">Season</div>
            <div>{league.currentSeason}</div>
          </div>
          <div>
            <div className="font-medium">Teams</div>
            <div>{league.teamCount}</div>
          </div>
          <div>
            <div className="font-medium">Description</div>
            <div className="text-sm text-gray-600">{league.description}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}