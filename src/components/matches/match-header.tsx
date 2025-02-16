import React from 'react';
import { MatchStatus } from '@prisma/client';

interface MatchHeaderProps {
  homeTeam: {
    name: string;
    logo?: string | null;
  };
  awayTeam: {
    name: string;
    logo?: string | null;
  };
  kickoff: Date;
  status: MatchStatus;
  competition?: string;
}

export function MatchHeader({
  homeTeam,
  awayTeam,
  kickoff,
  status,
  competition
}: MatchHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex flex-col items-center space-y-4">
        {competition && (
          <div className="text-sm text-gray-500">
            {competition}
          </div>
        )}
        
        <div className="flex items-center justify-between w-full max-w-2xl">
          <div className="flex flex-col items-center space-y-2">
            {homeTeam.logo && (
              <img 
                src={homeTeam.logo} 
                alt={homeTeam.name}
                className="w-16 h-16 object-contain"
              />
            )}
            <span className="font-semibold text-lg">{homeTeam.name}</span>
          </div>
          
          <div className="flex flex-col items-center space-y-2">
            <div className="text-sm font-medium text-gray-500">
              {status}
            </div>
            <div className="text-sm text-gray-400">
              {new Date(kickoff).toLocaleString()}
            </div>
          </div>
          
          <div className="flex flex-col items-center space-y-2">
            {awayTeam.logo && (
              <img 
                src={awayTeam.logo} 
                alt={awayTeam.name}
                className="w-16 h-16 object-contain"
              />
            )}
            <span className="font-semibold text-lg">{awayTeam.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
