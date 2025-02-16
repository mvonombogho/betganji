import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamStats } from '@/types/team-stats';
import { TeamStatsSkeleton } from './team-stats-skeleton';

interface TeamStatsCardProps {
  stats?: TeamStats;
  teamName: string;
  isLoading?: boolean;
}

export function TeamStatsCard({ 
  stats, 
  teamName, 
  isLoading = false 
}: TeamStatsCardProps) {
  if (isLoading || !stats) {
    return <TeamStatsSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{teamName} Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Form */}
          <div className="space-y-2">
            <span className="text-sm text-gray-500">Recent Form</span>
            <div className="flex gap-1">
              {stats.form.map((result, index) => (
                <div
                  key={index}
                  className={`
                    w-8 h-8 rounded-full 
                    flex items-center justify-center 
                    text-sm font-medium
                    ${getFormBadgeStyle(result)}
                  `}
                >
                  {result}
                </div>
              ))}
            </div>
          </div>

          {/* Match Stats */}
          <div className="grid grid-cols-3 gap-4">
            <StatBox
              label="Wins"
              value={stats.lastMatches.wins}
              total={stats.lastMatches.total}
            />
            <StatBox
              label="Draws"
              value={stats.lastMatches.draws}
              total={stats.lastMatches.total}
            />
            <StatBox
              label="Losses"
              value={stats.lastMatches.losses}
              total={stats.lastMatches.total}
            />
          </div>

          {/* Goal Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-sm text-gray-500">Goals Scored</span>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Total:</span>
                  <span className="ml-1 font-medium">{stats.goalsScored.total}</span>
                </div>
                <div>
                  <span className="text-gray-500">Avg:</span>
                  <span className="ml-1 font-medium">
                    {stats.goalsScored.average.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-sm text-gray-500">Goals Conceded</span>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Total:</span>
                  <span className="ml-1 font-medium">{stats.goalsConceded.total}</span>
                </div>
                <div>
                  <span className="text-gray-500">Avg:</span>
                  <span className="ml-1 font-medium">
                    {stats.goalsConceded.average.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatBox({ 
  label, 
  value, 
  total 
}: { 
  label: string; 
  value: number; 
  total: number; 
}) {
  const percentage = total > 0 ? ((value / total) * 100).toFixed(0) : '0';
  
  return (
    <div className="text-center p-4 bg-gray-50 rounded-lg">
      <span className="text-sm text-gray-500">{label}</span>
      <p className="text-lg font-medium">{value}</p>
      <span className="text-xs text-gray-500">{percentage}%</span>
    </div>
  );
}

function getFormBadgeStyle(result: string): string {
  switch (result) {
    case 'W':
      return 'bg-green-100 text-green-700';
    case 'D':
      return 'bg-yellow-100 text-yellow-700';
    case 'L':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}
