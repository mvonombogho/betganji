import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    >
      {match.result}
    </div>
  ));

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Form Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center space-x-2 mb-6">
          {formStrip}
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Last 5 Games</div>
              <div className="text-xl font-bold mt-1">
                {matches.slice(0, 5).reduce((acc, match) => {
                  if (match.result === 'W') return acc + 1;
                  return acc;
                }, 0)} Wins
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Goals</div>
              <div className="text-xl font-bold mt-1">
                {matches.slice(0, 5).reduce((acc, match) => acc + match.goalsScored, 0)} Scored
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
