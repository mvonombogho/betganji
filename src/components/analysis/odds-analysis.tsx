interface OddsAnalysisProps {
  currentOdds: {
    homeWin: number;
    draw: number;
    awayWin: number;
    timestamp: Date;
  };
  historicalOdds?: Array<{
    homeWin: number;
    draw: number;
    awayWin: number;
    timestamp: Date;
  }>;
  homeTeam: string;
  awayTeam: string;
}

export function OddsAnalysis({
  currentOdds,
  historicalOdds,
  homeTeam,
  awayTeam
}: OddsAnalysisProps) {
  // Calculate implied probabilities
  const totalOdds = currentOdds.homeWin + currentOdds.draw + currentOdds.awayWin;
  const homeProb = ((1 / currentOdds.homeWin) * 100).toFixed(1);
  const drawProb = ((1 / currentOdds.draw) * 100).toFixed(1);
  const awayProb = ((1 / currentOdds.awayWin) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Odds Analysis</h3>

      <div className="space-y-6">
        {/* Current Odds */}
        <div>
          <div className="text-sm text-gray-500 mb-2">Current Odds</div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold">{currentOdds.homeWin.toFixed(2)}</div>
              <div className="text-sm text-gray-500">{homeTeam}</div>
            </div>
            <div>
              <div className="text-lg font-bold">{currentOdds.draw.toFixed(2)}</div>
              <div className="text-sm text-gray-500">Draw</div>
            </div>
            <div>
              <div className="text-lg font-bold">{currentOdds.awayWin.toFixed(2)}</div>
              <div className="text-sm text-gray-500">{awayTeam}</div>
            </div>
          </div>
        </div>

        {/* Implied Probabilities */}
        <div>
          <div className="text-sm text-gray-500 mb-2">Implied Probabilities</div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold">{homeProb}%</div>
              <div className="text-sm text-gray-500">Home Win</div>
            </div>
            <div>
              <div className="text-lg font-bold">{drawProb}%</div>
              <div className="text-sm text-gray-500">Draw</div>
            </div>
            <div>
              <div className="text-lg font-bold">{awayProb}%</div>
              <div className="text-sm text-gray-500">Away Win</div>
            </div>
          </div>
        </div>

        {/* Market Sentiment */}
        <div>
          <div className="text-sm text-gray-500 mb-2">Market Sentiment</div>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{ width: `${parseFloat(homeProb)}%` }}
            />
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-500">{homeTeam}</span>
            <span className="text-gray-500">{awayTeam}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
