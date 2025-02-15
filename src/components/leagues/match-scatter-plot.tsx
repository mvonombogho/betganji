import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Match } from './match-drill-down';

interface MatchScatterPlotProps {
  matches: Match[];
  onMatchSelect: (match: Match) => void;
}

export default function MatchScatterPlot({
  matches,
  onMatchSelect,
}: MatchScatterPlotProps) {
  const scatterData = matches.map(match => ({
    x: match.odds.homeWin,
    y: match.predictionAccuracy,
    match,
    name: `${match.homeTeam} vs ${match.awayTeam}`,
    result: `${match.homeScore}-${match.awayScore}`,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prediction Accuracy vs Odds</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                type="number"
                dataKey="x"
                name="Home Win Odds"
                unit="x"
                domain={['auto', 'auto']}
                label={{
                  value: 'Home Win Odds',
                  position: 'bottom',
                  offset: -10,
                }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Prediction Accuracy"
                unit="%"
                domain={[0, 100]}
                label={{
                  value: 'Prediction Accuracy (%)',
                  angle: -90,
                  position: 'left',
                  offset: -10,
                }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background border rounded-lg shadow-lg p-3">
                        <p className="text-sm font-medium mb-1">{data.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Result: {data.result}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Odds: {data.x.toFixed(2)}x
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Accuracy: {data.y.toFixed(1)}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter
                name="Matches"
                data={scatterData}
                fill="#3b82f6"
                shape="circle"
                onClick={(data) => onMatchSelect(data.match)}
                cursor="pointer"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-muted-foreground text-center">
          Click on any point to view detailed match information
        </div>
      </CardContent>
    </Card>
  );
}