import { formatDate } from '@/lib/utils';

interface H2HMatch {
  datetime: Date;
  homeTeam: { name: string };
  awayTeam: { name: string };
  homeScore: number;
  awayScore: number;
}

interface HeadToHeadProps {
  matches: H2HMatch[];
  team1Name: string;
  team2Name: string;
}

export function HeadToHead({ matches, team1Name, team2Name }: HeadToHeadProps) {
  // Calculate H2H stats
  const stats = matches.reduce(
    (acc, match) => {
      const isTeam1Home = match.homeTeam.name === team1Name;
      const team1Score = isTeam1Home ? match.homeScore : match.awayScore;
      const team2Score = isTeam1Home ? match.awayScore : match.homeScore;

      if (team1Score > team2Score) acc.team1Wins++;
      else if (team2Score > team1Score) acc.team2Wins++;
      else acc.draws++;

      return acc;
    },
    { team1Wins: 0, team2Wins: 0, draws: 0 }
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Head-to-Head History</h3>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6 text-center">
        <div>
          <div className="text-xl font-bold text-blue-600">{stats.team1Wins}</div>
          <div className="text-sm text-gray-500">{team1Name} Wins</div>
        </div>
        <div>
          <div className="text-xl font-bold text-gray-600">{stats.draws}</div>
          <div className="text-sm text-gray-500">Draws</div>
        </div>
        <div>
          <div className="text-xl font-bold text-red-600">{stats.team2Wins}</div>
          <div className="text-sm text-gray-500">{team2Name} Wins</div>
        </div>
      </div>

      {/* Recent Matches */}
      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-500">Recent Meetings</div>
        {matches.map((match, index) => {
          const isTeam1Home = match.homeTeam.name === team1Name;
          const team1Score = isTeam1Home ? match.homeScore : match.awayScore;
          const team2Score = isTeam1Home ? match.awayScore : match.homeScore;

          return (
            <div 
              key={index}
              className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
            >
              <div className="text-sm">
                <span className="font-medium">
                  {team1Score} - {team2Score}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {formatDate(match.datetime)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
