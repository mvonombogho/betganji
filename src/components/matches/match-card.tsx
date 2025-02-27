import Link from 'next/link';
import Image from 'next/image';
import { MatchStatus } from '@/types/match';
import { Badge } from '@/components/ui/badge';

interface MatchCardProps {
  id: string;
  homeTeam: {
    name: string;
    logo?: string;
  };
  awayTeam: {
    name: string;
    logo?: string;
  };
  competition?: {
    name: string;
    logo?: string;
  };
  datetime: Date | string;
  status?: MatchStatus;
  score?: {
    home: number;
    away: number;
  };
  odds?: {
    homeWin: number;
    draw: number;
    awayWin: number;
  };
  hasPrediction?: boolean;
}

export function MatchCard({ 
  id, 
  homeTeam, 
  awayTeam, 
  datetime, 
  competition,
  status = 'SCHEDULED',
  score,
  odds,
  hasPrediction
}: MatchCardProps) {
  const date = new Date(datetime);
  const isLive = status === 'LIVE';
  const isFinished = status === 'FINISHED';
  
  const getStatusColor = () => {
    switch(status) {
      case 'LIVE': return 'bg-green-100 text-green-800 border-green-300';
      case 'FINISHED': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'POSTPONED': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  return (
    <Link href={`/matches/${id}`}>
      <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow border border-gray-100 relative">
        {/* Competition and Time */}
        <div className="flex justify-between items-center mb-3">
          {competition && (
            <div className="flex items-center gap-1 text-xs text-gray-600">
              {competition.logo && (
                <div className="w-4 h-4 relative">
                  <Image 
                    src={competition.logo} 
                    alt={competition.name}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <span>{competition.name}</span>
            </div>
          )}
          
          <div className="text-xs text-gray-500">
            {isLive ? (
              <span className="text-green-600 font-medium animate-pulse">LIVE</span>
            ) : (
              date.toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            )}
          </div>
        </div>
        
        {/* Status Badge */}
        {(status !== 'SCHEDULED' || hasPrediction) && (
          <div className="absolute top-1 right-1">
            {hasPrediction && (
              <Badge variant="outline" className="text-xs bg-purple-100 text-purple-800 border-purple-300 mr-1">
                AI
              </Badge>
            )}
            {status !== 'SCHEDULED' && (
              <Badge variant="outline" className={`text-xs ${getStatusColor()}`}>
                {status}
              </Badge>
            )}
          </div>
        )}

        {/* Home Team */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            {homeTeam.logo && (
              <div className="w-6 h-6 relative">
                <Image 
                  src={homeTeam.logo} 
                  alt={homeTeam.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <span className="font-medium">{homeTeam.name}</span>
          </div>
          
          <div className="flex items-center">
            {isFinished && score ? (
              <span className={`text-lg font-semibold ${score.home > score.away ? 'text-green-600' : ''}`}>
                {score.home}
              </span>
            ) : (
              odds && <span className="text-lg">{odds.homeWin.toFixed(2)}</span>
            )}
          </div>
        </div>

        {/* Draw */}
        <div className="flex justify-between items-center mb-2 text-gray-500">
          <span>Draw</span>
          <div>
            {isFinished && score ? (
              <span className={`text-lg font-semibold ${score.home === score.away ? 'text-green-600' : ''}`}>
                -
              </span>
            ) : (
              odds && <span className="text-lg">{odds.draw.toFixed(2)}</span>
            )}
          </div>
        </div>

        {/* Away Team */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {awayTeam.logo && (
              <div className="w-6 h-6 relative">
                <Image 
                  src={awayTeam.logo} 
                  alt={awayTeam.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <span className="font-medium">{awayTeam.name}</span>
          </div>
          
          <div>
            {isFinished && score ? (
              <span className={`text-lg font-semibold ${score.away > score.home ? 'text-green-600' : ''}`}>
                {score.away}
              </span>
            ) : (
              odds && <span className="text-lg">{odds.awayWin.toFixed(2)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
