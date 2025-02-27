import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMatchById } from '@/lib/data/services/match-service';
import { getOddsForMatch } from '@/lib/data/services/odds-service';
import { getPredictionForMatch } from '@/lib/data/services/prediction-service';
import { MatchPredictionView } from '@/components/predictions/match-prediction-view';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MatchHeader } from '@/components/matches/match-header';
import { MatchOverview } from '@/components/matches/match-overview';
import { MatchOdds } from '@/components/matches/match-odds';
import { MatchLineups } from '@/components/matches/match-lineups';
import { auth } from '@/lib/auth';

interface MatchPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata(
  { params }: MatchPageProps
): Promise<Metadata> {
  const match = await getMatchById(params.id);
  
  if (!match) {
    return {
      title: 'Match Not Found',
    };
  }

  return {
    title: `${match.homeTeam.name} vs ${match.awayTeam.name} | BetGanji`,
    description: `View match details and predictions for ${match.homeTeam.name} vs ${match.awayTeam.name} in ${match.competition.name}.`,
  };
}

export default async function MatchPage({ params }: MatchPageProps) {
  const session = await auth();
  const matchId = params.id;
  
  // Fetch the match data
  const match = await getMatchById(matchId);
  
  if (!match) {
    notFound();
  }
  
  // Fetch associated data
  const oddsData = await getOddsForMatch(matchId);
  const prediction = session?.user ? await getPredictionForMatch(matchId, session.user.id) : null;

  return (
    <div className="container py-6 max-w-7xl">
      {/* Match Header */}
      <MatchHeader match={match} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="col-span-1 lg:col-span-2 space-y-6">
          {/* Main Match Content */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
              <TabsTrigger value="odds" className="flex-1">Odds</TabsTrigger>
              <TabsTrigger value="lineups" className="flex-1">Lineups</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4">
              <MatchOverview match={match} />
            </TabsContent>
            
            <TabsContent value="odds" className="mt-4">
              <MatchOdds matchId={matchId} initialOdds={oddsData} />
            </TabsContent>
            
            <TabsContent value="lineups" className="mt-4">
              <MatchLineups matchId={matchId} />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="col-span-1 space-y-6">
          {/* Prediction Section */}
          {session?.user ? (
            <MatchPredictionView 
              match={match} 
              currentOdds={oddsData} 
              prediction={prediction}
            />
          ) : (
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <p className="text-gray-500 mb-4">Sign in to view and create predictions</p>
              <a href="/login" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Sign In
              </a>
            </div>
          )}
          
          {/* Additional widgets can go here */}
        </div>
      </div>
    </div>
  );
}
