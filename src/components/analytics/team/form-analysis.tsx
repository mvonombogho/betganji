import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormTrendChart } from './form-trend-chart';

interface FormMatch {
  id: string;
  result: 'W' | 'D' | 'L';
  date: string;
  score: string;
  goalsScored: number;
  goalsConceded: number;
}

interface FormAnalysisProps {
  matches: FormMatch[];
  className?: string;
}

export function FormAnalysis({ matches, className = '' }: FormAnalysisProps) {
  const getFormColor = (result: 'W' | 'D' | 'L') => {
    switch (result) {
      case 'W': return 'bg-green-100 text-green-800 border-green-200';
      case 'D': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'L': return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const formStrip = matches.slice(0, 5).map(match => (
    <div 
      key={match.id}
      className={`w-12 h-12 flex items-center justify-center rounded-full border-2 font-bold ${getFormColor(match.result)}`}
      title={`${match.score} (${new Date(match.date).toLocaleDateString()})`}
    >
      {match.result}
    </div>
  ));

  const last5Stats = matches.slice(0, 5).reduce((acc, match) => {
    if (match.result === 'W') acc.wins++;
    acc.goalsScored += match.goalsScored;
    acc.goalsConceded += match.goalsConceded;
    return acc;
  }, { wins: 0, goalsScored: 0, goalsConceded: 0 });

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Form Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center space-x-2 mb-6">
          {formStrip}
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Last 5 Games</div>
              <div className="text-xl font-bold mt-1">
                {last5Stats.wins} Wins
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Goals Scored</div>
              <div className="text-xl font-bold mt-1">
                {last5Stats.goalsScored}
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Goals Conceded</div>
              <div className="text-xl font-bold mt-1">
                {last5Stats.goalsConceded}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Performance Trend</h3>
            <FormTrendChart matches={matches} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
