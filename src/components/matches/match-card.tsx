import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Match } from '@/types/match';
import { formatDate } from '@/lib/utils/date';
import Link from 'next/link';

interface MatchCardProps {
  match: Match;
  odds?: {
    homeWin: number;
    draw: number;
    awayWin: number;
  };
  prediction?: {
    result: string;
    confidence: number;
  };
}

export function MatchCard({ match, odds, prediction }: MatchCardProps) {
  return (
    <Card className="w-full max-w-md hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {formatDate(match.datetime)}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {match.competition.name}
            </span>
          </div>
          <span className="text-sm font-medium text-gray-500">
            {match.status}
          </span>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            {match.homeTeam.logo && (
              <img 
                src={match.homeTeam.logo} 
                alt={match.homeTeam.name}
                className="w-8 h-8 object-contain"
              />
            )}
            <span className="font-medium">{match.homeTeam.name}</span>
          </div>
          <span className="text-lg font-bold">vs</span>
          <div className="flex items-center space-x-3">
            <span className="font-medium">{match.awayTeam.name}</span>
            {match.awayTeam.logo && (
              <img 
                src={match.awayTeam.logo} 
                alt={match.awayTeam.name}
                className="w-8 h-8 object-contain"
              />
            )}
          </div>
        </div>

        {odds && (
          <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-center">
              <span className="text-sm text-gray-500">Home</span>
              <p className="font-medium">{odds.homeWin.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <span className="text-sm text-gray-500">Draw</span>
              <p className="font-medium">{odds.draw.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <span className="text-sm text-gray-500">Away</span>
              <p className="font-medium">{odds.awayWin.toFixed(2)}</p>
            </div>
          </div>
        )}

        {prediction && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Predicted: {prediction.result}
              </span>
              <span className="text-sm text-gray-500">
                {(prediction.confidence * 100).toFixed(1)}% confidence
              </span>
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <Link href={`/matches/${match.id}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
