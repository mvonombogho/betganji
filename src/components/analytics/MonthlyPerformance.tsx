import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateMonthlyPerformance } from '@/lib/services/betAnalytics';
import type { PlacedBet } from '@/types/bet';

interface MonthlyPerformanceProps {
  bets: PlacedBet[];
}

export default function MonthlyPerformance({ bets }: MonthlyPerformanceProps) {
  const monthlyData = useMemo(() => {
    const data = calculateMonthlyPerformance(bets);
    return data.map(item => ({
      ...item,
      month: new Date(item.month + '-01').toLocaleDateString('default', { month: 'short', year: '2-digit' })
    }));
  }, [bets]);

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Monthly Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" orientation="left" stroke="#82ca9d" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar 
                yAxisId="left"
                dataKey="profit" 
                fill="#82ca9d"
                name="Profit/Loss"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="right"
                dataKey="winRate"
                fill="#8884d8"
                name="Win Rate %"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}