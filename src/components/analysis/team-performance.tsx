interface TeamPerformanceProps {
  name: string;
  recentForm: Array<'W' | 'D' | 'L'>;
  stats: {
    wins: number;
    draws: number;
    losses: number;
    goalsScored: number;
    goalsConceded: number;
  };
}

export function TeamPerformance({ name, recentForm, stats }: TeamPerformanceProps) {
  const formColors = {
    'W': 'bg-green-500',
    'D': 'bg-yellow-500',
    'L': 'bg-red-500'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">{name}</h3>
      
      <div className="space-y-4">
        {/* Recent Form */}
        <div>
          <div className="text-sm text-gray-500 mb-2">Recent Form</div>
          <div className="flex gap-2">
            {recentForm.map((result, index) => (
              <div 
                key={index}
                className={`w-8 h-8 rounded-full ${formColors[result]} text-white
                  flex items-center justify-center font-medium`}
              >
                {result}
              </div>
            ))}
          </div>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-500">Wins</div>
            <div className="text-lg font-semibold">{stats.wins}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Draws</div>
            <div className="text-lg font-semibold">{stats.draws}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Losses</div>
            <div className="text-lg font-semibold">{stats.losses}</div>
          </div>
        </div>

        {/* Goal Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Goals Scored</div>
            <div className="text-lg font-semibold">{stats.goalsScored}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Goals Conceded</div>
            <div className="text-lg font-semibold">{stats.goalsConceded}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
