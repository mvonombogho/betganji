import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';

interface StreakData {
  currentStreak: {
    type: 'win' | 'loss';
    count: number;
  };
  longestWinStreak: number;
  longestLossStreak: number;
  recentResults: {
    date: string;
    result: 'WON' | 'LOST';
    profit: number;
    odds: number;
  }[];
}

interface StreakAnalysisProps {
  data: StreakData;
}

export default function StreakAnalysis({ data }: StreakAnalysisProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Streak Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Current Streak</div>
                <div className="text-2xl font-bold flex items-center gap-2">
                  {data.currentStreak.type === 'win' ? (
                    <TrendingUp className="text-green-500" />
                  ) : (
                    <TrendingDown className="text-red-500" />
                  )}
                  {data.currentStreak.count}
                </div>
              </div>
              <Clock className="text-gray-400" />
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Longest Win Streak</div>
                <div className="text-2xl font-bold text-green-600">
                  {data.longestWinStreak}
                </div>
              </div>
              <TrendingUp className="text-green-500" />
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Longest Loss Streak</div>
                <div className="text-2xl font-bold text-red-600">
                  {data.longestLossStreak}
                </div>
              </div>
              <TrendingDown className="text-red-500" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Recent Results</h3>
          <div className="space-y-2">
            {data.recentResults.map((result, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {result.result === 'WON' ? (
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                  )}
                  <span className="text-sm">{result.date}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {result.odds.toFixed(2)}
                  </span>
                  <span className={`font-medium ${result.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {result.profit > 0 ? '+' : ''}{result.profit.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}