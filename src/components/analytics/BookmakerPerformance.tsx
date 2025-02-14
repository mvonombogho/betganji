import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { calculateBookmakerStats } from '@/lib/services/betAnalytics';
import type { PlacedBet } from '@/types/bet';

interface BookmakerPerformanceProps {
  bets: PlacedBet[];
}

export default function BookmakerPerformance({ bets }: BookmakerPerformanceProps) {
  const bookmakerStats = calculateBookmakerStats(bets);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookmaker Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bookmaker</TableHead>
              <TableHead className="text-right">Total Bets</TableHead>
              <TableHead className="text-right">Won</TableHead>
              <TableHead className="text-right">Profit/Loss</TableHead>
              <TableHead className="text-right">ROI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookmakerStats.map((stat) => (
              <TableRow key={stat.name}>
                <TableCell className="font-medium">{stat.name}</TableCell>
                <TableCell className="text-right">{stat.bets}</TableCell>
                <TableCell className="text-right">{stat.wonBets}</TableCell>
                <TableCell className="text-right">
                  <span className={stat.profit >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {stat.profit.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className={stat.roi >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {stat.roi.toFixed(2)}%
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}