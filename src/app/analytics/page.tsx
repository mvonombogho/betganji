import { useBets } from '@/context/BetContext';
import PerformanceOverview from '@/components/analytics/PerformanceOverview';
import MonthlyPerformance from '@/components/analytics/MonthlyPerformance';
import BookmakerPerformance from '@/components/analytics/BookmakerPerformance';

export default function AnalyticsPage() {
  const { bets } = useBets();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Betting Analytics</h1>
      
      <PerformanceOverview bets={bets} />
      
      <div className="grid gap-8 md:grid-cols-2">
        <div className="md:col-span-2">
          <MonthlyPerformance bets={bets} />
        </div>
        
        <div className="md:col-span-2">
          <BookmakerPerformance bets={bets} />
        </div>
      </div>
    </div>
  );
}