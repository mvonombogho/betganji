import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X, Minus } from 'lucide-react';

interface PredictionResultProps {
  result: string;
  homeTeam: string;
  awayTeam: string;
  confidence: number;
  className?: string;
}

export function PredictionResult({ 
  result,
  homeTeam,
  awayTeam,
  confidence,
  className = ''
}: PredictionResultProps) {
  const getResultDisplay = () => {
    switch (result) {
      case 'HOME_WIN':
        return {
          icon: <Check className="h-6 w-6 text-green-500" />,
          text: `${homeTeam} to Win`,
          color: 'bg-green-50'
        };
      case 'AWAY_WIN':
        return {
          icon: <Check className="h-6 w-6 text-blue-500" />,
          text: `${awayTeam} to Win`,
          color: 'bg-blue-50'
        };
      case 'DRAW':
        return {
          icon: <Minus className="h-6 w-6 text-gray-500" />,
          text: 'Draw',
          color: 'bg-gray-50'
        };
      default:
        return {
          icon: <X className="h-6 w-6 text-red-500" />,
          text: 'Unknown',
          color: 'bg-red-50'
        };
    }
  };

  const { icon, text, color } = getResultDisplay();

  return (
    <Card className={`${className} ${color}`}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {icon}
            <div>
              <div className="font-medium text-lg">{text}</div>
              <div className="text-sm text-gray-500">
                {homeTeam} vs {awayTeam}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {confidence.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500">
              Confidence
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
