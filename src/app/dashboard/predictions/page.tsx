import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUserPredictions } from '@/lib/data/services/prediction-service';
import { MatchList } from '@/components/matches/match-list';
import PredictionHistory from '@/components/predictions/prediction-history';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CalendarIcon, ListFilter, LineChart, Brain } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Predictions Dashboard | BetGanji',
  description: 'View your prediction history and performance analytics',
};

export default async function PredictionsDashboardPage() {
  const session = await auth();
  
  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect('/login');
  }
  
  // Fetch user's predictions
  const predictions = await getCurrentUserPredictions();
  
  // Get matches that have predictions
  const matchesWithPredictions = predictions.map(prediction => prediction.match);
  
  // Calculate prediction stats
  const totalPredictions = predictions.length;
  const pendingPredictions = predictions.filter(p => p.match.status !== 'FINISHED').length;
  const finishedPredictions = totalPredictions - pendingPredictions;
  
  // Calculate correct predictions (simplified logic)
  const correctPredictions = predictions.filter(p => {
    if (!p.match.score) return false;
    
    const predictedWinner = p.result.home > p.result.away ? 'HOME' :
                          p.result.home < p.result.away ? 'AWAY' : 'DRAW';
                          
    const actualWinner = p.match.score.home > p.match.score.away ? 'HOME' :
                       p.match.score.home < p.match.score.away ? 'AWAY' : 'DRAW';
                       
    return predictedWinner === actualWinner;
  }).length;
  
  // Calculate accuracy rate
  const accuracyRate = finishedPredictions > 0 
    ? Math.round((correctPredictions / finishedPredictions) * 100)
    : 0;

  return (
    <div className="container py-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Your Predictions</h1>
          <p className="text-gray-500">Analyze your prediction history and performance</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Link href="/matches">
            <Button className="flex items-center gap-2">
              <Brain size={16} />
              <span>Make New Prediction</span>
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Brain size={18} className="text-purple-500" />
              <span>Total Predictions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalPredictions}</div>
            <p className="text-sm text-gray-500">{pendingPredictions} pending • {finishedPredictions} settled</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <LineChart size={18} className="text-green-500" />
              <span>Accuracy Rate</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{accuracyRate}%</div>
            <p className="text-sm text-gray-500">{correctPredictions} correct out of {finishedPredictions} finished</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarIcon size={18} className="text-blue-500" />
              <span>Upcoming Predictions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingPredictions}</div>
            <p className="text-sm text-gray-500">Match predictions awaiting results</p>
          </CardContent>
        </Card>
      </div>
