import { calculateBetStats, calculateBookmakerStats, calculateMonthlyPerformance } from './betAnalytics';
import type { PlacedBet } from '@/types/bet';

interface ExportOptions {
  includeOverview?: boolean;
  includeBookmakers?: boolean;
  includeMonthly?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export function generateCSVReport(bets: PlacedBet[], options: ExportOptions = {}): string {
  const rows: string[] = [];
  
  // Add Overview Stats
  if (options.includeOverview) {
    const stats = calculateBetStats(bets);
    rows.push('Overall Performance');
    rows.push('Total Bets,Win Rate,Total Profit,ROI');
    rows.push(`${stats.totalBets},${stats.winRate.toFixed(2)}%,${stats.totalProfit.toFixed(2)},${stats.roi.toFixed(2)}%`);
    rows.push('');
  }

  // Add Bookmaker Stats
  if (options.includeBookmakers) {
    const bookmakerStats = calculateBookmakerStats(bets);
    rows.push('Bookmaker Performance');
    rows.push('Bookmaker,Total Bets,Won Bets,Profit/Loss,ROI');
    bookmakerStats.forEach(stat => {
      rows.push(`${stat.name},${stat.bets},${stat.wonBets},${stat.profit.toFixed(2)},${stat.roi.toFixed(2)}%`);
    });
    rows.push('');
  }

  // Add Monthly Performance
  if (options.includeMonthly) {
    const monthlyStats = calculateMonthlyPerformance(bets);
    rows.push('Monthly Performance');
    rows.push('Month,Total Bets,Won Bets,Profit/Loss,Win Rate');
    monthlyStats.forEach(stat => {
      rows.push(`${stat.month},${stat.bets},${stat.wonBets},${stat.profit.toFixed(2)},${stat.winRate.toFixed(2)}%`);
    });
    rows.push('');
  }

  // Add Individual Bets
  rows.push('Bet History');
  rows.push('Date,Selection,Bookmaker,Odds,Stake,Result,Profit/Loss,Notes');
  bets.forEach(bet => {
    const profitLoss = bet.status === 'won' ? 
      bet.potentialWin - bet.stake : 
      bet.status === 'lost' ? -bet.stake : 0;

    rows.push(
      [
        new Date(bet.createdAt).toLocaleDateString(),
        bet.selection,
        bet.bettingSite,
        bet.odds,
        bet.stake,
        bet.status.toUpperCase(),
        profitLoss.toFixed(2),
        `"${bet.reasoning || ''}"`
      ].join(',')
    );
  });

  return rows.join('\n');
}

export function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}