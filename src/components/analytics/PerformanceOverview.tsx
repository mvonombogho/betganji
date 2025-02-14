import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { calculateBetStats } from '@/lib/services/betAnalytics';
import type { PlacedBet } from '@/types/bet';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
}

function StatCard({ title, value, description, trend }: StatCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {getTrendIcon()}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {typeof value === 'number' && value % 1 !== 0 ? value.toFixed(2) : value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface PerformanceOverviewProps {
  bets: PlacedBet[];
}

export default function PerformanceOverview({ bets }: PerformanceOverviewProps) {
  const stats = calculateBetStats(bets);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Profit/Loss"
          value={stats.totalProfit}
          description={`From ${stats.totalBets} total bets`}
          trend={stats.totalProfit > 0 ? 'up' : 'down'}
        />

        <StatCard
          title="ROI"
          value={`${stats.roi.toFixed(2)}%`}
          description={`${stats.totalStake.toFixed(2)} total stake`}
          trend={stats.roi > 0 ? 'up' : 'down'}
        />

        <StatCard
          title="Win Rate"
          value={`${stats.winRate.toFixed(1)}%`}
          description={`${stats.wonBets} won / ${stats.lostBets} lost`}
          trend={stats.winRate > 50 ? 'up' : 'down'}
        />

        <StatCard
          title="Active Bets"
          value={stats.pendingBets}
          description={`${stats.voidBets} void bets`}
          trend="neutral"
        />
      </div>
    </div>
  );
}