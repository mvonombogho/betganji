import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { H2HSummary } from '@/types/h2h';

interface H2HResultsProps {
  summary: H2HSummary;
  team1Name: string;
  team2Name: string;
}

export function H2HResults({ summary, team1Name, team2Name }: H2HResultsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Head-to-Head Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">{team1Name}</p>
            <p className="text-xl font-bold text-blue-600">
              {summary.team1Wins}
            </p>
            <p className="text-xs text-gray-500">
              {((summary.team1Wins / summary.totalMatches) * 100).toFixed(0)}%
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Draws</p>
            <p className="text-xl font-bold text-gray-600">
              {summary.draws}
            </p>
            <p className="text-xs text-gray-500">
              {((summary.draws / summary.totalMatches) * 100).toFixed(0)}%
            </p>
          </div>

          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">{team2Name}</p>
            <p className="text-xl font-bold text-red-600">
              {summary.team2Wins}
            </p>
            <p className="text-xs text-gray-500">
              {((summary.team2Wins / summary.totalMatches) * 100).toFixed(0)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
