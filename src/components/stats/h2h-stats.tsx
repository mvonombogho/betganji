import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { H2HStats } from '@/types/h2h';
import { H2HResults } from './h2h-results';
import { TeamForm } from './team-form';
import { MatchHistory } from './match-history';

interface H2HStatsContainerProps {
  stats: H2HStats;
  team1Name: string;
  team2Name: string;
}

export function H2HStatsContainer({ 
  stats, 
  team1Name, 
  team2Name 
}: H2HStatsContainerProps) {
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
