import Link from 'next/link';

interface MatchCardProps {
  id: string;
  homeTeam: string;
  awayTeam: string;
  datetime: Date;
  odds?: {
    homeWin: number;
    draw: number;
    awayWin: number;
  };
}

export function MatchCard({ id, homeTeam, awayTeam, datetime, odds }: MatchCardProps) {
  return (
    <Link href={`/matches/${id}`}>
      <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
        <div className="text-sm text-gray-500 mb-2">
          {new Date(datetime).toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
        
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">{homeTeam}</span>
          {odds && <span className="text-lg">{odds.homeWin.toFixed(2)}</span>}
        </div>

        <div className="flex justify-between items-center mb-2 text-gray-500">
          <span>Draw</span>
          {odds && <span className="text-lg">{odds.draw.toFixed(2)}</span>}
        </div>

        <div className="flex justify-between items-center">
          <span className="font-medium">{awayTeam}</span>
          {odds && <span className="text-lg">{odds.awayWin.toFixed(2)}</span>}
        </div>
      </div>
    </Link>
  );
}
