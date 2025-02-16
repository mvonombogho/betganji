import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { H2HStats } from '@/types/h2h';
import { H2HResults } from './h2h-results';
import { TeamForm } from './team-form';
import { MatchHistory } from './match-history';
import { H2HSummarySkeleton } from './h2h-summary-skeleton';
import { MatchHistorySkeleton } from './match-history-skeleton';

interface H2HStatsContainerProps {
  stats?: H2HStats;
  team1Name: string;
  team2Name: string;
  isLoading?: boolean;
}

export function H2HStatsContainer({ 
  stats, 
  team1Name, 
  team2Name,
  isLoading = false 
}: H2HStatsContainerProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid gap-6">
        <H2HSummarySkeleton />
        
        {/* Form Loading State */}
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                  <div className="flex gap-2">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <MatchHistorySkeleton />
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {/* Results Summary */}
      <H2HResults 
        summary={stats.summary}
        team1Name={team1Name}
        team2Name={team2Name}
      />

      {/* Team Forms */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Form</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <TeamForm 
              form={stats.team1Form}
              teamName={team1Name}
            />
            <TeamForm 
              form={stats.team2Form}
              teamName={team2Name}
            />
          </div>
        </CardContent>
      </Card>

      {/* Match History */}
      <MatchHistory matches={stats.matches} />

      {/* Venue Stats */}
      {stats.venue && (
        <Card>
          <CardHeader>
            <CardTitle>Home Advantage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">{team1Name} Home Wins</p>
                <p className="text-xl font-bold">{stats.venue.team1HomeWins}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">{team2Name} Home Wins</p>
                <p className="text-xl font-bold">{stats.venue.team2HomeWins}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
